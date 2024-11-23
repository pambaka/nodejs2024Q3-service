import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIK_KEY } from './const';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIK_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request: Request = context.switchToHttp().getRequest();

    const token = await this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();

    try {
      await this.jwtService.verifyAsync(token);
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        let message = '';
        switch (error.message) {
          case 'jwt expired':
            message = 'Expired refresh token';
            break;
          case 'jwt malformed':
            message = 'Invalid refresh token';
            break;
          default:
            message = error.message;
        }
        throw new ForbiddenException(message);
      }
      throw new UnauthorizedException();
    }

    return true;
  }

  private async extractTokenFromHeader(
    request: Request,
  ): Promise<string | undefined> {
    if (request.url === '/auth/refresh') {
      const refreshToken: string | undefined = request.body.refreshToken;
      return refreshToken;
    }

    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
