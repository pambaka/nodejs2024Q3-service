import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import validateId from 'src/utils/validate-id';
import { ERROR_MESSAGE } from 'src/const';
import { favKey, FavoritesResponse } from './interfaces/favs.interface';
import { Artist } from 'src/artist/interfaces/artist.interface';
import { Album } from 'src/album/interfaces/album.interface';
import { Track } from 'src/track/interfaces/track.interface';
import prisma from 'src/prisma-client';

type PrismaFunction = ({
  where,
  data,
}: {
  where?: { id: string };
  data?: { id: string };
}) => Promise<unknown>;

@Injectable()
export class FavsService {
  async findAll(): Promise<FavoritesResponse> {
    const artists: Artist[] =
      await prisma.$queryRaw`SELECT * FROM "favorite_artists" a JOIN "artists" b ON a.id = b.id`;
    const albums: Album[] =
      await prisma.$queryRaw`SELECT * FROM "favorite_albums" a JOIN "albums" b ON a.id = b.id`;
    const tracks: Track[] =
      await prisma.$queryRaw`SELECT * FROM "favorite_tracks" a JOIN "tracks" b ON a.id = b.id`;

    return { artists, albums, tracks };
  }

  async add(key: favKey, id: string) {
    validateId(id);

    const entry = await (prisma[key].findUnique as PrismaFunction)({
      where: { id },
    });
    if (entry)
      await (prisma[`favorite_${key}`].create as PrismaFunction)({
        data: { id },
      });
    else
      throw new UnprocessableEntityException(
        ERROR_MESSAGE.notFound('Entry', id),
      );
  }

  async remove(key: favKey, id: string) {
    validateId(id);

    await (prisma[`favorite_${key}`].delete as PrismaFunction)({
      where: { id },
    }).catch(() => {
      throw new NotFoundException(ERROR_MESSAGE.notFound('Favorite entry', id));
    });
  }
}
