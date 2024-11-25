import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as fs from 'node:fs';
import { pipeline } from 'node:stream/promises';
import * as os from 'node:os';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  async log(message: string) {
    super.log(message);
    this.writeToFile('LOG', message);
  }

  async error(message: string, stack?: string, context?: string) {
    super.error(message, stack, context);
    this.writeToFile('ERROR', message);
  }

  async warn(message: string) {
    super.warn(message);
    await this.writeToFile('WARN', message);
  }

  private async writeToFile(level: 'LOG' | 'ERROR' | 'WARN', message: string) {
    const fileName = './log/app.log';
    const ws = fs.createWriteStream(fileName, {
      encoding: 'utf8',
      flags: 'a+',
    });
    const date = new Date(Date.now());

    await pipeline(`${date} ${level} ${message} ${os.EOL}`, ws);
  }
}
