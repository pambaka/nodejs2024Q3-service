import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { users } from '../db';
import { User, UserWoPassword } from './interfaces/user.interface';
import isValidUuid from 'src/utils/is-valid-uuid';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ERROR_MESSAGE } from 'src/const';

@Injectable()
export class UserService {
  async getUsers(): Promise<User[]> {
    return users;
  }

  async getUser(id: string): Promise<User> {
    if (!isValidUuid(id))
      throw new BadRequestException(ERROR_MESSAGE.invalidUuid);

    const user = users.find((user) => user.id === id);
    if (!user) throw new NotFoundException(ERROR_MESSAGE.notFound('User', id));

    return users.find((user) => user.id === id);
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserWoPassword> {
    const { login, password } = createUserDto;
    const timestamp = Date.now();
    const newUser: User = {
      id: crypto.randomUUID(),
      login,
      password,
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    users.push(newUser);

    const userWithoutPassword = Object.assign({}, newUser);
    delete userWithoutPassword.password;

    return userWithoutPassword;
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserWoPassword> {
    if (!isValidUuid(id))
      throw new BadRequestException(ERROR_MESSAGE.invalidUuid);

    const index = users.map((user) => user.id).indexOf(id);
    if (index === -1)
      throw new NotFoundException(ERROR_MESSAGE.notFound('User', id));

    const { oldPassword, newPassword } = updatePasswordDto;

    if (users[index].password !== oldPassword)
      throw new ForbiddenException(ERROR_MESSAGE.permissionDenied);

    users[index].password = newPassword;
    users[index].version += 1;
    users[index].updatedAt = Date.now();

    const userWithoutPassword = Object.assign({}, users[index]);
    delete userWithoutPassword.password;

    return userWithoutPassword;
  }

  async deleteUser(id: string) {
    if (!isValidUuid(id))
      throw new BadRequestException(ERROR_MESSAGE.invalidUuid);

    const index = users.map((user) => user.id).indexOf(id);
    if (index === -1)
      throw new NotFoundException(ERROR_MESSAGE.notFound('User', id));

    users.splice(index, 1);
  }
}
