import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

/** Wraps every controller return in `{ data }`; `{ data, meta }` passes through. */
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(_ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((value: unknown) => {
        if (value && typeof value === 'object' && 'data' in value) {
          return value;
        }
        return { data: value };
      }),
    );
  }
}
