import { Inject, Injectable } from '@nestjs/common';
import { and, asc, eq, max } from 'drizzle-orm';
import { NotFoundError } from '../../common/errors';
import { DRIZZLE } from '../../database/database.module';
import type { Database } from '../../database/database.module';
import { projects } from '../../database/schema';
import type { CreateProjectDto, UpdateProjectDto } from './schemas';

const POSITION_GAP = 1000;

/** Copy taken from the Figma projects table. */
const demoProjects: CreateProjectDto[] = [
  { name: 'Design Homepage', priority: 'high', leadLabel: 'Admin' },
  { name: 'Develop Login Feature', priority: 'low', leadLabel: 'CN' },
  { name: 'Test Payment Gateway', priority: 'medium', leadLabel: 'Dev Team' },
];

@Injectable()
export class ProjectsService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  async list(ownerId: string) {
    return this.db
      .select()
      .from(projects)
      .where(eq(projects.ownerId, ownerId))
      .orderBy(asc(projects.position));
  }

  async findById(ownerId: string, id: string) {
    const project = await this.db.query.projects.findFirst({
      where: and(eq(projects.id, id), eq(projects.ownerId, ownerId)),
    });
    if (!project) throw new NotFoundError('Project not found');
    return project;
  }

  async create(ownerId: string, dto: CreateProjectDto) {
    const [row] = await this.db
      .select({ highest: max(projects.position) })
      .from(projects)
      .where(eq(projects.ownerId, ownerId));

    const [project] = await this.db
      .insert(projects)
      .values({
        ownerId,
        name: dto.name,
        priority: dto.priority,
        leadLabel: dto.leadLabel,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        position: (row?.highest ?? 0) + POSITION_GAP,
      })
      .returning();
    return project;
  }

  async update(ownerId: string, id: string, dto: UpdateProjectDto) {
    const [project] = await this.db
      .update(projects)
      .set({
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      })
      .where(and(eq(projects.id, id), eq(projects.ownerId, ownerId)))
      .returning();

    if (!project) throw new NotFoundError('Project not found');
    return project;
  }

  async remove(ownerId: string, id: string) {
    const deleted = await this.db
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.ownerId, ownerId)))
      .returning();

    if (deleted.length === 0) throw new NotFoundError('Project not found');
    return { removed: true };
  }

  async seedDemoProjects(ownerId: string) {
    const rows = demoProjects.map((project, index) => {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + (index + 1) * 3);
      return {
        ownerId,
        name: project.name,
        priority: project.priority,
        leadLabel: project.leadLabel,
        dueDate,
        position: (index + 1) * POSITION_GAP,
      };
    });

    await this.db.insert(projects).values(rows);
  }
}
