import { Injectable, NotFoundException } from '@nestjs/common';
import { ERROR_MESSAGE } from 'src/const';
import validateId from 'src/utils/validate-id';
import { CreateAlbumDto } from './dto/create-album.dto';
import { Album } from './interfaces/album.interface';
import { UpdateAlbumDto } from './dto/update-album.dto';
import prisma from 'src/prisma-client';
import * as crypto from 'node:crypto';

@Injectable()
export class AlbumService {
  async getAlbums() {
    return prisma.albums.findMany();
  }

  async getAlbum(id: string) {
    validateId(id);

    const album = await this.getAlbumFromDb(id);

    return album;
  }

  async createAlbum(createAlbumDto: CreateAlbumDto) {
    const { name, year, artistId } = createAlbumDto;
    const album: Album = {
      id: crypto.randomUUID(),
      name,
      year,
      artistId: artistId ?? null,
    };
    await prisma.albums.create({ data: album });

    return album;
  }

  async updateAlbum(id: string, updateAlbumDto: UpdateAlbumDto) {
    validateId(id);

    const album = await this.getAlbumFromDb(id);

    const { name, year, artistId } = updateAlbumDto;
    album.name = name;
    album.year = year;
    if (artistId !== undefined) album.artistId = artistId;

    await prisma.albums.update({ where: { id }, data: album });

    return album;
  }

  async deleteAlbum(id: string) {
    validateId(id);

    const album = await this.getAlbumFromDb(id);
    if (album) await prisma.albums.delete({ where: { id } });
  }

  private async getAlbumFromDb(id: string) {
    const album = await prisma.albums.findUnique({ where: { id } });
    if (!album)
      throw new NotFoundException(ERROR_MESSAGE.notFound('Album', id));

    return album;
  }
}
