export class CreateUserDto {
  login: string;
  password: string;
}

type CreateUserDtoKeys = keyof CreateUserDto;
export const createUserDtoKeys: CreateUserDtoKeys[] = ['login', 'password'];
