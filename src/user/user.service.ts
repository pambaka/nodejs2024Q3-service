import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserWoPassword } from './interfaces/user.interface';
import isValidUuid from 'src/utils/is-valid-uuid';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ERROR_MESSAGE } from 'src/const';
import prisma from 'src/prisma-client';

@Injectable()
export class UserService {
  async getUsers(): Promise<User[]> {
    const users: User[] = (await prisma.users.findMany()).map((user) => {
      const createdAt = new Date(user.createdAt).getTime();
      const updatedAt = new Date(user.updatedAt).getTime();
      return { ...user, createdAt, updatedAt };
    });
    return users;
  }

  async getUser(id: string): Promise<User> {
    if (!isValidUuid(id))
      throw new BadRequestException(ERROR_MESSAGE.invalidUuid);

    const user = await prisma.users.findUnique({ where: { id: id } });
    if (!user) throw new NotFoundException(ERROR_MESSAGE.notFound('User', id));

    const createdAt = new Date(user.createdAt).getTime();
    const updatedAt = new Date(user.updatedAt).getTime();
    return { ...user, createdAt, updatedAt };
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserWoPassword> {
    const { login, password } = createUserDto;
    const timestamp = Date.now();
    const newUser = {
      id: crypto.randomUUID(),
      login,
      password,
      version: 1,
      createdAt: timestamp.toString(),
      updatedAt: timestamp.toString(),
    };
    await prisma.users.create({ data: { ...newUser } });

    const userWithoutPassword = Object.assign({}, newUser);
    delete userWithoutPassword.password;

    return {
      ...userWithoutPassword,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserWoPassword> {
    if (!isValidUuid(id))
      throw new BadRequestException(ERROR_MESSAGE.invalidUuid);

    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(ERROR_MESSAGE.notFound('User', id));

    const { oldPassword, newPassword } = updatePasswordDto;

    if (user.password !== oldPassword)
      throw new ForbiddenException(ERROR_MESSAGE.permissionDenied);

    user.password = newPassword;
    user.version += 1;
    const timestamp = Date.now();
    user.updatedAt = timestamp.toString();
    await prisma.users.update({ where: { id }, data: { ...user } });

    const userWithoutPassword = Object.assign({}, user);
    delete userWithoutPassword.password;

    return {
      ...userWithoutPassword,
      updatedAt: timestamp,
      createdAt: +user.createdAt,
    };
  }

  async deleteUser(id: string) {
    if (!isValidUuid(id))
      throw new BadRequestException(ERROR_MESSAGE.invalidUuid);

    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(ERROR_MESSAGE.notFound('User', id));

    await prisma.users.delete({ where: { id } });
  }
}
