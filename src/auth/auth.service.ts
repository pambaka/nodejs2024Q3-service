import { ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import prisma from 'src/prisma-client';
import { AuthDto } from './dto/auth.dto';
import { RefreshDto } from './dto/refresh.dto';
import {
  jwtModuleOptions,
  jwtAccessSignOptions,
  jwtRefreshSignOptions,
} from './const';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUpUser(authDto: AuthDto) {
    const { login, password } = authDto;

    const newUser = await this.userService.createUser({ login, password });

    const payload: TokenPayload = { userId: newUser.id, login: newUser.login };
    const accessToken = this.jwtService.signAsync(
      payload,
      jwtAccessSignOptions,
    );
    const refreshToken = await this.jwtService.signAsync(
      payload,
      jwtRefreshSignOptions,
    );

    return { ...newUser, accessToken, refreshToken };
  }

  async logInUser(authDto: AuthDto) {
    const { login, password } = authDto;

    const users = (await prisma.users.findMany({ where: { login } })).filter(
      async (user) => await bcrypt.compare(password, user.password),
    );

    if (users.length === 0) throw new ForbiddenException();

    const user = users[0];
    const payload: TokenPayload = { userId: user.id, login: user.login };

    const accessToken = await this.jwtService.signAsync(
      payload,
      jwtAccessSignOptions,
    );
    const refreshToken = await this.jwtService.signAsync(
      payload,
      jwtRefreshSignOptions,
    );

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshDto: RefreshDto) {
    const { refreshToken } = refreshDto;

    const tokenPayload: TokenPayload = await this.jwtService.verifyAsync(
      refreshToken,
      jwtModuleOptions,
    );
    const { exp, ...payload } = tokenPayload;

    const accessToken = await this.jwtService.signAsync(
      payload,
      jwtAccessSignOptions,
    );

    const accessTokenPayload = this.jwtService.decode(accessToken, {
      json: true,
    }) as TokenPayload;

    const refreshTokenPayload = this.jwtService.decode(refreshToken, {
      json: true,
    }) as TokenPayload;

    const newRefreshToken =
      accessTokenPayload.exp < refreshTokenPayload.exp
        ? refreshToken
        : await this.jwtService.signAsync(payload, jwtRefreshSignOptions);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
