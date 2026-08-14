import { Inject, Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { and, eq, ne } from 'drizzle-orm';
import { ConflictError, NotFoundError } from '../../common/errors';
import { DRIZZLE } from '../../database/database.module';
import type { Database } from '../../database/database.module';
import { users } from '../../database/schema';
import type { User } from '../../database/schema';
import type { UpdateProfileDto } from './schemas';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  async createGuest() {
    const suffix = randomBytes(2).toString('hex');
    const [user] = await this.db
      .insert(users)
      .values({ name: `Guest-${suffix}`, isGuest: true })
      .returning();
    return user;
  }

  async findById(id: string) {
    return this.db.query.users.findFirst({ where: eq(users.id, id) });
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    if (dto.email) {
      const taken = await this.db.query.users.findFirst({
        where: and(eq(users.email, dto.email), ne(users.id, id)),
      });
      if (taken) throw new ConflictError('That email is already in use');
    }

    const [user] = await this.db
      .update(users)
      .set(dto)
      .where(eq(users.id, id))
      .returning();

    if (!user) throw new NotFoundError('User not found');
    return this.sanitize(user);
  }

  /** "Leave workspace" — cascades to the user's tasks, projects and tokens. */
  async remove(id: string) {
    const deleted = await this.db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id });

    if (deleted.length === 0) throw new NotFoundError('User not found');
    return { removed: true };
  }

  private sanitize(user: User) {
    const { passwordHash: _passwordHash, ...safe } = user;
    return safe;
  }
}
