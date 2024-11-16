import { Injectable, NotFoundException } from '@nestjs/common';
import { ERROR_MESSAGE } from 'src/const';
import { resetFavDependency } from 'src/db';
import validateId from 'src/utils/validate-id';
import { CreateArtistDto } from './dto/create-artist.dto';
import { Artist } from './interfaces/artist.interface';
import { UpdateArtistDto } from './dto/update-artist.dto';
import prisma from 'src/prisma-client';

@Injectable()
export class ArtistService {
  async getArtists() {
    return await prisma.artists.findMany();
  }

  async getArtist(id: string) {
    validateId(id);

    const artist = await this.getArtistFromDb(id);

    return artist;
  }

  async createArtist(createArtistDto: CreateArtistDto) {
    const { name, grammy } = createArtistDto;
    const artist: Artist = { id: crypto.randomUUID(), name, grammy };
    await prisma.artists.create({ data: artist });

    return artist;
  }

  async updateArtist(id: string, updateArtistDto: UpdateArtistDto) {
    validateId(id);

    const artist = await this.getArtistFromDb(id);

    const { name, grammy } = updateArtistDto;
    artist.name = name;
    artist.grammy = grammy;

    await prisma.artists.update({ where: { id }, data: artist });

    return artist;
  }

  async removeArtist(id: string) {
    validateId(id);

    const artist = await this.getArtistFromDb(id);

    if (artist) await prisma.artists.delete({ where: { id } });

    resetFavDependency('artists', id);
  }

  private async getArtistFromDb(id: string) {
    const artist = await prisma.artists.findUnique({ where: { id } });
    if (!artist)
      throw new NotFoundException(ERROR_MESSAGE.notFound('Artist', id));

    return artist;
  }
}
