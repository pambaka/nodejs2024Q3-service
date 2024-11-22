import { SetMetadata } from '@nestjs/common';
import { JwtModuleOptions } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET_KEY;

export const jwtModuleOptions: JwtModuleOptions = { secret };

export const IS_PUBLIK_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIK_KEY, true);
