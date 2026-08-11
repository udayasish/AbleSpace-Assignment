import { Inject, Injectable } from '@nestjs/common';
import { and, asc, eq, ilike, max } from 'drizzle-orm';
import { NotFoundError } from '../../common/errors';
import { DRIZZLE } from '../../database/database.module';
import type { Database } from '../../database/database.module';
import { comments, subtasks, tasks, users } from '../../database/schema';
import {
  demoComment,
  demoDueDate,
  demoSubtasks,
  demoTasks,
} from './demo-tasks';
import type {
  CreateCommentDto,
  CreateSubtaskDto,
  CreateTaskDto,
  ListTasksQuery,
  UpdateSubtaskDto,
  UpdateTaskDto,
} from './schemas';

const POSITION_GAP = 1000;

@Injectable()
export class TasksService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  async list(ownerId: string, query: ListTasksQuery) {
    const filters = [eq(tasks.ownerId, ownerId)];
    if (query.status) filters.push(eq(tasks.status, query.status));
    if (query.q) filters.push(ilike(tasks.title, `%${query.q}%`));

    return this.db
      .select()
      .from(tasks)
      .where(and(...filters))
      .orderBy(asc(tasks.position));
  }

  /** Task plus its subtasks and comments — powers the detail screen. */
  async findById(ownerId: string, id: string) {
    const task = await this.db.query.tasks.findFirst({
      where: and(eq(tasks.id, id), eq(tasks.ownerId, ownerId)),
    });
    if (!task) throw new NotFoundError('Task not found');

    const [taskSubtasks, taskComments] = await Promise.all([
      this.db
        .select()
        .from(subtasks)
        .where(eq(subtasks.taskId, id))
        .orderBy(asc(subtasks.position)),
      this.db
        .select({
          id: comments.id,
          createdAt: comments.createdAt,
          body: comments.body,
          authorId: comments.authorId,
          authorName: users.name,
        })
        .from(comments)
        .leftJoin(users, eq(users.id, comments.authorId))
        .where(eq(comments.taskId, id))
        .orderBy(asc(comments.createdAt)),
    ]);

    return { ...task, subtasks: taskSubtasks, comments: taskComments };
  }

  async addSubtask(ownerId: string, taskId: string, dto: CreateSubtaskDto) {
    await this.findOwnedTask(ownerId, taskId);

    const [row] = await this.db
      .select({ highest: max(subtasks.position) })
      .from(subtasks)
      .where(eq(subtasks.taskId, taskId));

    const [subtask] = await this.db
      .insert(subtasks)
      .values({
        taskId,
        title: dto.title,
        priority: dto.priority,
        assigneeLabel: dto.assigneeLabel,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        position: (row?.highest ?? 0) + POSITION_GAP,
      })
      .returning();
    return subtask;
  }

  async updateSubtask(
    ownerId: string,
    taskId: string,
    subtaskId: string,
    dto: UpdateSubtaskDto,
  ) {
    await this.findOwnedTask(ownerId, taskId);

    const [subtask] = await this.db
      .update(subtasks)
      .set({
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      })
      .where(and(eq(subtasks.id, subtaskId), eq(subtasks.taskId, taskId)))
      .returning();

    if (!subtask) throw new NotFoundError('Subtask not found');
    return subtask;
  }

  async removeSubtask(ownerId: string, taskId: string, subtaskId: string) {
    await this.findOwnedTask(ownerId, taskId);

    const deleted = await this.db
      .delete(subtasks)
      .where(and(eq(subtasks.id, subtaskId), eq(subtasks.taskId, taskId)))
      .returning();

    if (deleted.length === 0) throw new NotFoundError('Subtask not found');
    return { removed: true };
  }

  async addComment(
    ownerId: string,
    taskId: string,
    dto: CreateCommentDto,
    authorName: string,
  ) {
    await this.findOwnedTask(ownerId, taskId);

    const [comment] = await this.db
      .insert(comments)
      .values({ taskId, authorId: ownerId, body: dto.body })
      .returning();

    return { ...comment, authorName };
  }

  /** Guards nested routes: 404 unless the task belongs to the caller. */
  private async findOwnedTask(ownerId: string, taskId: string) {
    const task = await this.db.query.tasks.findFirst({
      where: and(eq(tasks.id, taskId), eq(tasks.ownerId, ownerId)),
    });
    if (!task) throw new NotFoundError('Task not found');
    return task;
  }

  async create(ownerId: string, dto: CreateTaskDto) {
    const [task] = await this.db
      .insert(tasks)
      .values({
        ownerId,
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        assigneeLabel: dto.assigneeLabel,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        labels: dto.labels,
        position: await this.nextPosition(ownerId, dto.status),
      })
      .returning();
    return task;
  }

  async update(ownerId: string, id: string, dto: UpdateTaskDto) {
    const [task] = await this.db
      .update(tasks)
      .set({
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      })
      .where(and(eq(tasks.id, id), eq(tasks.ownerId, ownerId)))
      .returning();

    // Also covers "exists but belongs to someone else" — we never confirm that.
    if (!task) throw new NotFoundError('Task not found');
    return task;
  }

  async remove(ownerId: string, id: string) {
    const deleted = await this.db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.ownerId, ownerId)))
      .returning();

    if (deleted.length === 0) throw new NotFoundError('Task not found');
    return { removed: true };
  }

  async seedDemoTasks(ownerId: string) {
    const rows = demoTasks.map((task, index) => ({
      ownerId,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assigneeLabel: task.assigneeLabel,
      dueDate: demoDueDate(index),
      labels: task.labels,
      position: (index + 1) * POSITION_GAP,
    }));

    const inserted = await this.db
      .insert(tasks)
      .values(rows)
      .returning({ id: tasks.id });

    // Only the first task gets detail content — it is the one the design shows.
    const firstTaskId = inserted[0]?.id;
    if (!firstTaskId) return;

    await Promise.all([
      this.db.insert(subtasks).values(
        demoSubtasks.map((subtask, index) => ({
          taskId: firstTaskId,
          title: subtask.title,
          priority: subtask.priority,
          assigneeLabel: subtask.assigneeLabel,
          dueDate: demoDueDate(index + 1),
          position: (index + 1) * POSITION_GAP,
        })),
      ),
      this.db
        .insert(comments)
        .values({ taskId: firstTaskId, authorId: ownerId, body: demoComment }),
    ]);
  }

  /** Appends to the end of the target column. */
  private async nextPosition(ownerId: string, status: CreateTaskDto['status']) {
    const [row] = await this.db
      .select({ highest: max(tasks.position) })
      .from(tasks)
      .where(and(eq(tasks.ownerId, ownerId), eq(tasks.status, status)));

    return (row?.highest ?? 0) + POSITION_GAP;
  }
}
