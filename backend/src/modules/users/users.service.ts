import { Inject, Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from '../../database/database.module';
import type { Database } from '../../database/database.module';
import { users } from '../../database/schema';

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
}
