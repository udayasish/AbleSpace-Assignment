import { Inject, Injectable } from '@nestjs/common';
import { and, asc, eq, ilike, max } from 'drizzle-orm';
import { NotFoundError } from '../../common/errors';
import { DRIZZLE } from '../../database/database.module';
import type { Database } from '../../database/database.module';
import { tasks } from '../../database/schema';
import { demoDueDate, demoTasks } from './demo-tasks';
import type { CreateTaskDto, ListTasksQuery, UpdateTaskDto } from './schemas';

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

    await this.db.insert(tasks).values(rows);
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
