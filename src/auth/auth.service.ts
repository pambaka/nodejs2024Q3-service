import { ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import prisma from 'src/prisma-client';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUpUser(authDto: AuthDto) {
    const { login, password } = authDto;

    const newUser = await this.userService.createUser({ login, password });
    const payload = { id: newUser.id, login: newUser.login };

    return {
      ...newUser,
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async logInUser(authDto: AuthDto) {
    const { login, password } = authDto;

    const users = (await prisma.users.findMany({ where: { login } })).filter(
      async (user) => await bcrypt.compare(password, user.password),
    );

    if (users.length === 0) throw new ForbiddenException();

    const user = users[0];
    const payload = { userId: user.id, login: user.login };

    return { accessToken: await this.jwtService.signAsync(payload) };
  }

  async refreshToken() {
    return `This action refreshes access token`;
  }
}
