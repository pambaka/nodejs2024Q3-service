import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { SwaggerModule } from '@nestjs/swagger';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { CustomLogger } from './logger/logger.service';
import { LoggingInterceptor } from './logger/logging.interceptor';
import { CustomFilter } from './logger/logging.filter';

dotenv.config();

const port = parseInt(process.env.PORT);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggingInterceptor(new CustomLogger()));
  app.useGlobalFilters(new CustomFilter(app.get(HttpAdapterHost)));

  const file = await fs.readFile(path.resolve('doc', 'api.json'), {
    encoding: 'utf-8',
  });

  SwaggerModule.setup('doc', app, JSON.parse(file));

  await app.listen(port, () => {
    console.log(`The app is listening on port ${port}`);
  });
}
bootstrap();

process.on('uncaughtException', (error: Error) => {
  const logger = new CustomLogger();
  logger.error(error.message, error.stack, 'UncaughtException');

  if (error instanceof RangeError)
    console.log('Please check port value in .env file.');
});

process.on('unhandledRejection', (message: string) => {
  const logger = new CustomLogger();
  logger.error(message, '', 'UnhandledRejection');
});
