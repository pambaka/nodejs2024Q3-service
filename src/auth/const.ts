import { JwtModuleOptions } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET_KEY;

export const jwtModuleOptions: JwtModuleOptions = { secret };
