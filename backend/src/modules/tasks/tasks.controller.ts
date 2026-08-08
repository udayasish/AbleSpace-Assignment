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
  createTaskSchema,
  listTasksQuerySchema,
  taskIdSchema,
  updateTaskSchema,
} from './schemas';
import type { CreateTaskDto, ListTasksQuery, UpdateTaskDto } from './schemas';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

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
