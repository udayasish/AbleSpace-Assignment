import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'crypto';
import { eq } from 'drizzle-orm';
import { NotFoundError, UnauthorizedError } from '../../common/errors';
import { parseDuration } from '../../common/parse-duration';
import { DRIZZLE } from '../../database/database.module';
import type { Database } from '../../database/database.module';
import { refreshTokens, User } from '../../database/schema';
import { ProjectsService } from '../projects/projects.service';
import { TasksService } from '../tasks/tasks.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private readonly db: Database,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
    private readonly tasksService: TasksService,
    private readonly projectsService: ProjectsService,
  ) {}

  async guestLogin() {
    const user = await this.usersService.createGuest();
    // Seed so a guest lands on populated screens rather than empty ones.
    await this.tasksService.seedDemoTasks(user.id);
    await this.projectsService.seedDemoProjects(user.id);
    const tokens = await this.issueTokens(user);
    return { user: this.sanitize(user), ...tokens };
  }

  async refresh(raw: string | undefined) {
    if (!raw) throw new UnauthorizedError('Missing refresh token');

    const row = await this.db.query.refreshTokens.findFirst({
      where: eq(refreshTokens.tokenHash, this.hash(raw)),
    });
    if (!row) throw new UnauthorizedError('Invalid refresh token');

    // A revoked token being replayed means it was stolen — kill every session.
    if (row.revokedAt) {
      await this.db
        .update(refreshTokens)
        .set({ revokedAt: new Date() })
        .where(eq(refreshTokens.userId, row.userId));
      throw new UnauthorizedError('Refresh token reuse detected');
    }
    if (row.expiresAt < new Date()) {
      throw new UnauthorizedError('Refresh token expired');
    }

    const user = await this.usersService.findById(row.userId);
    if (!user) throw new UnauthorizedError('User not found');

    await this.db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokens.id, row.id));

    const tokens = await this.issueTokens(user);
    return { user: this.sanitize(user), ...tokens };
  }

  async logout(raw: string | undefined) {
    if (raw) {
      await this.db
        .update(refreshTokens)
        .set({ revokedAt: new Date() })
        .where(eq(refreshTokens.tokenHash, this.hash(raw)));
    }
    return { loggedOut: true };
  }

  async me(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundError('User not found');
    return this.sanitize(user);
  }

  private async issueTokens(user: User) {
    const accessToken = await this.jwt.signAsync({
      sub: user.id,
      isGuest: user.isGuest,
    });

    const refreshToken = randomBytes(64).toString('hex');
    const ttl = parseDuration(
      this.config.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN'),
    );
    await this.db.insert(refreshTokens).values({
      userId: user.id,
      tokenHash: this.hash(refreshToken),
      expiresAt: new Date(Date.now() + ttl),
    });

    return { accessToken, refreshToken };
  }

  private hash(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private sanitize(user: User) {
    const { passwordHash: _passwordHash, ...safe } = user;
    return safe;
  }
}
