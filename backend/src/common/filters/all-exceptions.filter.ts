import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors';

/** Normalizes every error to the `{ error }` response shape. */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    if (exception instanceof ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        issues: exception.issues.map((i) => ({
          path: i.path.map(String).join('.'),
          message: i.message,
        })),
      });
    }

    // Postgres unique-constraint violation racing past a pre-check
    if (
      typeof exception === 'object' &&
      exception !== null &&
      (exception as { code?: string }).code === '23505'
    ) {
      return res
        .status(409)
        .json({ error: 'Duplicate value violates a uniqueness rule' });
    }

    if (exception instanceof AppError) {
      return res.status(exception.statusCode).json({
        error: exception.expose ? exception.message : 'Internal server error',
      });
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      const message =
        typeof body === 'string'
          ? body
          : ((body as { message?: string | string[] }).message ??
            exception.message);
      return res.status(status).json({
        error: Array.isArray(message) ? message.join(', ') : message,
      });
    }

    this.logger.error(exception);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
