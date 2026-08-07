import { Injectable, PipeTransform } from '@nestjs/common';
import { ZodType } from 'zod';

/** Usage: `@Body(new ZodValidationPipe(schema))`. Throws ZodError for the filter. */
@Injectable()
export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodType<T>) {}

  transform(value: unknown): T {
    return this.schema.parse(value);
  }
}
