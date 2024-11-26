import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { tap } from 'rxjs';
import { CustomLogger } from './logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: CustomLogger) {
    this.logger.setContext('Response');
  }

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    return next.handle().pipe(
      tap(async () => {
        const response: Response = await context.switchToHttp().getResponse();
        await this.logger.log(`${response.statusCode}`, 'Response');
      }),
    );
  }
}
