import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as fs from 'node:fs';
import { pipeline } from 'node:stream/promises';
import * as os from 'node:os';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  async log(message: string, context?: string) {
    super.log(message);
    this.writeToFile({ level: 'LOG', message, context });
  }

  async error(message: string, stack?: string, context?: string) {
    super.error(message, stack, context);
    this.writeToFile({ level: 'ERROR', message, stack, context });
  }

  async warn(message: string) {
    super.warn(message);
    await this.writeToFile({ level: 'WARN', message });
  }

  private async writeToFile({
    level,
    message,
    stack,
    context,
  }: {
    level: 'LOG' | 'ERROR' | 'WARN';
    message: string;
    stack?: string;
    context?: string;
  }) {
    const fileName = './log/app.log';
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
