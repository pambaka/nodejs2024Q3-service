import { Injectable, NotFoundException } from '@nestjs/common';
import { ERROR_MESSAGE } from 'src/const';
import { albums, artists } from 'src/db';
import validateId from 'src/utils/validate-id';
import { CreateArtistDto } from './dto/create-artist.dto';
import { Artist } from './interfaces/artist.interface';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistService {
  async getArtists() {
    return artists;
  }

  async getArtist(id: string) {
    validateId(id);

    const index = await this.getArtistIndex(id);

    return artists[index];
  }

  async createArtist(createArtistDto: CreateArtistDto) {
    const { name, grammy } = createArtistDto;
    const artist: Artist = { id: crypto.randomUUID(), name, grammy };
    artists.push(artist);

    return artist;
  }

  async updateArtist(id: string, updateArtistDto: UpdateArtistDto) {
    validateId(id);

    const index = await this.getArtistIndex(id);
    const artist = artists[index];

    const { name, grammy } = updateArtistDto;
    artist.name = name;
    artist.grammy = grammy;

    return artist;
  }

  async removeArtist(id: string) {
    validateId(id);

    const index = await this.getArtistIndex(id);

    artists.splice(index, 1);

    albums.forEach((album) => {
      if (album.artistId === id) album.artistId = null;
    });
  }

  private async getArtistIndex(id: string) {
    const index = artists.map((artist) => artist.id).indexOf(id);
    if (index === -1)
      throw new NotFoundException(ERROR_MESSAGE.notFound('Artist', id));

    return index;
  }
}
