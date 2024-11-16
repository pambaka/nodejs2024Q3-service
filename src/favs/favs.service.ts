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
import { Album } from 'src/album/interfaces/album.interface';
import { Track } from 'src/track/interfaces/track.interface';
import prisma from 'src/prisma-client';

@Injectable()
export class FavsService {
  findAll() {
    return favs;
  }

  async add<T extends Artist | Album | Track>(key: favKey, id: string) {
    validateId(id);

    let entry: unknown;
    if (key === 'tracks') {
      entry = await prisma.tracks.findUnique({ where: { id } });
    } else if (key === 'artists') {
      entry = await prisma.artists.findUnique({ where: { id } });
    } else {
      const index = getEntryIndexById(key, id);
      if (index === -1)
        throw new UnprocessableEntityException(
          ERROR_MESSAGE.notFound('Entry', id),
        );

      entry = db[key][index] as T;
    }
    if (!entry)
      throw new UnprocessableEntityException(
        ERROR_MESSAGE.notFound('Entry', id),
      );

    const array = favs[key] as T[];
    array.push(entry as T);
  }

  remove(key: favKey, id: string) {
    validateId(id);

    const index = getFavEntryIndexById(key, id);
    if (index === -1)
      throw new NotFoundException(ERROR_MESSAGE.notFound('Favorite entry', id));

    favs[key].splice(index, 1);
  }
}
