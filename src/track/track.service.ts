import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { tracks } from 'src/db';
import { ERROR_MESSAGE } from 'src/const';
import { Track } from './interfaces/track.interface';
import validateId from 'src/utils/validate-id';

@Injectable()
export class TrackService {
  async findAll() {
    return tracks;
  }

  async findOne(id: string) {
    validateId(id);

    const index = await this.getTrackIndex(id);

    return tracks[index];
  }

  async create(createTrackDto: CreateTrackDto) {
    const { name, artistId, albumId, duration } = createTrackDto;
    const track: Track = {
      id: crypto.randomUUID(),
      name,
      artistId: artistId ?? null,
      albumId: albumId ?? null,
      duration,
    };

    tracks.push(track);

    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    validateId(id);

    const index = await this.getTrackIndex(id);
    const track = tracks[index];

    const { name, artistId, albumId, duration } = updateTrackDto;
    if (name !== undefined) track.name = name;
    if (artistId !== undefined) track.artistId = artistId;
    if (albumId !== undefined) track.albumId = albumId;
    if (duration !== undefined) track.duration = duration;

    return track;
  }

  async remove(id: string) {
    validateId(id);

    const index = await this.getTrackIndex(id);

    tracks.splice(index, 1);
  }

  private async getTrackIndex(id: string) {
    const index = tracks.map((track) => track.id).indexOf(id);
    if (index === -1)
      throw new NotFoundException(ERROR_MESSAGE.notFound('Track', id));

    return index;
  }
}
