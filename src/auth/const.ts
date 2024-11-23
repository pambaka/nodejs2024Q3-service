import { SetMetadata } from '@nestjs/common';
import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET_KEY;

export const jwtAccessSignOptions: JwtSignOptions = {
  expiresIn: process.env.TOKEN_EXPIRE_TIME,
};

export const jwtRefreshSignOptions: JwtSignOptions = {
  expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
};

export const jwtModuleOptions: JwtModuleOptions = {
  secret,
  signOptions: jwtAccessSignOptions,
};

export const IS_PUBLIK_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIK_KEY, true);
