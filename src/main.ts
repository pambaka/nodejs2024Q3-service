import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { SwaggerModule } from '@nestjs/swagger';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

dotenv.config();

const port = parseInt(process.env.PORT);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const file = await fs.readFile(path.resolve('doc', 'api.json'), {
    encoding: 'utf-8',
  });
  SwaggerModule.setup('api', app, JSON.parse(file));

  await app.listen(port, () => {
    console.log(`The app is listening on port ${port}`);
  });
}
bootstrap();

process.on('uncaughtException', (error: Error) => {
  console.error(error.message);

  if (error instanceof RangeError)
    console.log('Please check port value in .env file and restart the app.');
});
