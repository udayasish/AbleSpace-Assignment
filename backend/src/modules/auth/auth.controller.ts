import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { parseDuration } from '../../common/parse-duration';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from './auth.constants';
import { AuthService } from './auth.service';
import { refreshSchema } from './schemas';
import type { RefreshDto } from './schemas';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Public()
  @Post('guest')
  async guest(@Res({ passthrough: true }) res: Response) {
    const { user, accessToken, refreshToken } =
      await this.authService.guestLogin();
    this.setAuthCookies(res, accessToken, refreshToken);
    return { user, accessToken };
  }

  @Public()
  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() req: Request,
    @Body(new ZodValidationPipe(refreshSchema)) body: RefreshDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const raw = body?.refreshToken ?? req.cookies?.[REFRESH_TOKEN_COOKIE];
    const { user, accessToken, refreshToken } =
      await this.authService.refresh(raw);
    this.setAuthCookies(res, accessToken, refreshToken);
    return { user, accessToken };
  }

  @Post('logout')
  @HttpCode(200)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(req.cookies?.[REFRESH_TOKEN_COOKIE]);
    res.clearCookie(ACCESS_TOKEN_COOKIE);
    res.clearCookie(REFRESH_TOKEN_COOKIE);
    return { loggedOut: true };
  }

  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return this.authService.me(user.userId);
  }

  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    const secure = this.config.get('NODE_ENV') === 'production';
    const base = { httpOnly: true, sameSite: 'lax' as const, secure, path: '/' };

    res.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
      ...base,
      maxAge: parseDuration(
        this.config.getOrThrow<string>('JWT_ACCESS_EXPIRES_IN'),
      ),
    });
    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      ...base,
      maxAge: parseDuration(
        this.config.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN'),
      ),
    });
  }
}
