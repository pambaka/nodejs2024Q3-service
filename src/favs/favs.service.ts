import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { db, favs, getEntryIndexById, getFavEntryIndexById } from 'src/db';
import validateId from 'src/utils/validate-id';
import { ERROR_MESSAGE } from 'src/const';
import { favKey } from './interfaces/favs.interface';
import { Artist } from 'src/artist/interfaces/artist.interface';
import { Track } from 'src/track/entities/track.entity';
import { Album } from 'src/album/interfaces/album.interface';

@Injectable()
export class FavsService {
  findAll() {
    return favs;
  }

  add<T extends Artist | Album | Track>(key: favKey, id: string) {
    validateId(id);

    const index = getEntryIndexById(key, id);
    if (index === -1)
      throw new UnprocessableEntityException(
        ERROR_MESSAGE.notFound('Entry', id),
      );

    const entry = db[key][index] as T;
    const array = favs[key] as T[];
    array.push(entry);
  }

  remove(key: favKey, id: string) {
    validateId(id);

    const index = getFavEntryIndexById(key, id);
    if (index === -1)
      throw new NotFoundException(ERROR_MESSAGE.notFound('Favorite entry', id));

    favs[key].splice(index, 1);
  }
}
