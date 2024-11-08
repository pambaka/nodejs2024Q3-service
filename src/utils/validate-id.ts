import { BadRequestException } from '@nestjs/common';
import isValidUuid from './is-valid-uuid';
import { ERROR_MESSAGE } from 'src/const';

const validateId = (id: string) => {
  if (!isValidUuid(id))
    throw new BadRequestException(ERROR_MESSAGE.invalidUuid);
};

export default validateId;
