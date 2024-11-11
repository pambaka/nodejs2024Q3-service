import { Injectable, NotFoundException } from '@nestjs/common';
import { ERROR_MESSAGE } from 'src/const';
import { albums, resetDependencies, resetFavDependency, tracks } from 'src/db';
import validateId from 'src/utils/validate-id';
import { CreateAlbumDto } from './dto/create-album.dto';
import { Album } from './interfaces/album.interface';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumService {
  async getAlbums() {
    return albums;
  }

  async getAlbum(id: string) {
    validateId(id);

    const index = await this.getAlbumIndex(id);

    return albums[index];
  }

  async createAlbum(createAlbumDto: CreateAlbumDto) {
    const { name, year, artistId } = createAlbumDto;
    const album: Album = {
      id: crypto.randomUUID(),
      name,
      year,
      artistId: artistId ?? null,
    };
    albums.push(album);

    return album;
  }

  async updateAlbum(id: string, updateAlbumDto: UpdateAlbumDto) {
    validateId(id);

    const index = await this.getAlbumIndex(id);
    const album = albums[index];

    const { name, year, artistId } = updateAlbumDto;
    album.name = name;
    album.year = year;
    album.artistId = artistId;

    return album;
  }

  async deleteAlbum(id: string) {
    validateId(id);

    const index = await this.getAlbumIndex(id);
    albums.splice(index, 1);

    resetDependencies(tracks, 'albumId', id);
    resetFavDependency('albums', id);
  }

  private async getAlbumIndex(id: string) {
    const index = albums.map((album) => album.id).indexOf(id);
    if (index === -1)
      throw new NotFoundException(ERROR_MESSAGE.notFound('Album', id));

    return index;
  }
}
