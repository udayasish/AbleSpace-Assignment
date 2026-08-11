import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  createProjectSchema,
  projectIdSchema,
  updateProjectSchema,
} from './schemas';
import type { CreateProjectDto, UpdateProjectDto } from './schemas';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.projectsService.list(user.userId);
  }

  @Get(':id')
  find(
    @CurrentUser() user: AuthUser,
    @Param('id', new ZodValidationPipe(projectIdSchema)) id: string,
  ) {
    return this.projectsService.findById(user.userId, id);
  }

  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(createProjectSchema)) body: CreateProjectDto,
  ) {
    return this.projectsService.create(user.userId, body);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id', new ZodValidationPipe(projectIdSchema)) id: string,
    @Body(new ZodValidationPipe(updateProjectSchema)) body: UpdateProjectDto,
  ) {
    return this.projectsService.update(user.userId, id, body);
  }

  @Delete(':id')
  remove(
    @CurrentUser() user: AuthUser,
    @Param('id', new ZodValidationPipe(projectIdSchema)) id: string,
  ) {
    return this.projectsService.remove(user.userId, id);
  }
}
