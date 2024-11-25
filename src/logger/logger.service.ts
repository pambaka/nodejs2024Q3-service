import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';
import * as fs from 'node:fs';
import { pipeline } from 'node:stream/promises';
import * as os from 'node:os';
import * as dotenv from 'dotenv';

dotenv.config();

const levels = process.env.LOG_LEVEL.split(',');

@Injectable()
export class CustomLogger extends ConsoleLogger {
  async log(message: string, context?: string) {
    if (levels.includes('log')) {
      super.log(message);
      this.writeToFile({ level: 'log', message, context });
    }
  }

  async error(message: string, stack?: string, context?: string) {
    if (levels.includes('error')) {
      super.error(message, stack, context);
      this.writeToFile({
        level: 'error',
        message,
        stack,
        context,
        isError: true,
      });
    }
  }

  async warn(message: string) {
    if (levels.includes('warn')) {
      super.warn(message);
      await this.writeToFile({ level: 'warn', message });
    }
  }

  async debug(message: string) {
    if (levels.includes('debug')) {
      super.debug(message);
    }
  }

  async verbose(message: string) {
    if (levels.includes('verbose')) {
      super.verbose(message);
    }
  }

  private async writeToFile({
    level,
    message,
    stack,
    context,
    isError = false,
  }: {
    level: LogLevel;
    message: string;
    stack?: string;
    context?: string;
    isError?: boolean;
  }) {
    const fileName = isError ? './log/app-error.log' : './log/app.log';
    const ws = fs.createWriteStream(fileName, {
      encoding: 'utf8',
      flags: 'a+',
    });
    const date = new Date().toDateString();
    const time = new Date().toLocaleTimeString();

    await pipeline(
      `${date}, ${time}    ${level} [${context ?? ''}] ${message} ${os.EOL}`,
      ws,
    );
    if (stack) await pipeline(`${stack} ${os.EOL}`, ws);
  }
}
