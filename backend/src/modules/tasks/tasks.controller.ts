import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  createCommentSchema,
  createSubtaskSchema,
  createTaskSchema,
  listTasksQuerySchema,
  taskIdSchema,
  updateSubtaskSchema,
  updateTaskSchema,
} from './schemas';
import type {
  CreateCommentDto,
  CreateSubtaskDto,
  CreateTaskDto,
  ListTasksQuery,
  UpdateSubtaskDto,
  UpdateTaskDto,
} from './schemas';
import { TasksService } from './tasks.service';
import { UsersService } from '../users/users.service';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  list(
    @CurrentUser() user: AuthUser,
    @Query(new ZodValidationPipe(listTasksQuerySchema)) query: ListTasksQuery,
  ) {
    return this.tasksService.list(user.userId, query);
  }

  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(createTaskSchema)) body: CreateTaskDto,
  ) {
    return this.tasksService.create(user.userId, body);
  }

  @Get(':id')
  find(
    @CurrentUser() user: AuthUser,
    @Param('id', new ZodValidationPipe(taskIdSchema)) id: string,
  ) {
    return this.tasksService.findById(user.userId, id);
  }

  @Post(':id/subtasks')
  addSubtask(
    @CurrentUser() user: AuthUser,
    @Param('id', new ZodValidationPipe(taskIdSchema)) id: string,
    @Body(new ZodValidationPipe(createSubtaskSchema)) body: CreateSubtaskDto,
  ) {
    return this.tasksService.addSubtask(user.userId, id, body);
  }

  @Patch(':id/subtasks/:subtaskId')
  updateSubtask(
    @CurrentUser() user: AuthUser,
    @Param('id', new ZodValidationPipe(taskIdSchema)) id: string,
    @Param('subtaskId', new ZodValidationPipe(taskIdSchema)) subtaskId: string,
    @Body(new ZodValidationPipe(updateSubtaskSchema)) body: UpdateSubtaskDto,
  ) {
    return this.tasksService.updateSubtask(user.userId, id, subtaskId, body);
  }

  @Delete(':id/subtasks/:subtaskId')
  removeSubtask(
    @CurrentUser() user: AuthUser,
    @Param('id', new ZodValidationPipe(taskIdSchema)) id: string,
    @Param('subtaskId', new ZodValidationPipe(taskIdSchema)) subtaskId: string,
  ) {
    return this.tasksService.removeSubtask(user.userId, id, subtaskId);
  }

  @Post(':id/comments')
  async addComment(
    @CurrentUser() user: AuthUser,
    @Param('id', new ZodValidationPipe(taskIdSchema)) id: string,
    @Body(new ZodValidationPipe(createCommentSchema)) body: CreateCommentDto,
  ) {
    const author = await this.usersService.findById(user.userId);
    return this.tasksService.addComment(
      user.userId,
      id,
      body,
      author?.name ?? 'Unknown',
    );
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id', new ZodValidationPipe(taskIdSchema)) id: string,
    @Body(new ZodValidationPipe(updateTaskSchema)) body: UpdateTaskDto,
  ) {
    return this.tasksService.update(user.userId, id, body);
  }

  @Delete(':id')
  remove(
    @CurrentUser() user: AuthUser,
    @Param('id', new ZodValidationPipe(taskIdSchema)) id: string,
  ) {
    return this.tasksService.remove(user.userId, id);
  }
}
