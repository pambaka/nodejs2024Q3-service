export class UpdatePasswordDto {
  oldPassword: string;
  newPassword: string;
}

type UpdatePasswordDtoKeys = keyof UpdatePasswordDto;
export const updatePasswordDtoKeys: UpdatePasswordDtoKeys[] = [
  'oldPassword',
  'newPassword',
];
