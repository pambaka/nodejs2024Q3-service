import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { resetFavDependency } from 'src/db';
import { ERROR_MESSAGE } from 'src/const';
import { Track } from './interfaces/track.interface';
import validateId from 'src/utils/validate-id';
import prisma from 'src/prisma-client';

@Injectable()
export class TrackService {
  async findAll() {
    return await prisma.tracks.findMany();
  }

  async findOne(id: string) {
    validateId(id);

    return await this.getTrack(id);
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

    await prisma.tracks.create({ data: track });

    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    validateId(id);

    const track = await this.getTrack(id);

    const { name, artistId, albumId, duration } = updateTrackDto;
    if (name !== undefined) track.name = name;
    if (artistId !== undefined) track.artistId = artistId;
    if (albumId !== undefined) track.albumId = albumId;
    if (duration !== undefined) track.duration = duration;

    await prisma.tracks.update({ where: { id }, data: track });

    return track;
  }

  async remove(id: string) {
    validateId(id);

    const track = await this.getTrack(id);
    if (track) await prisma.tracks.delete({ where: { id } });

    resetFavDependency('tracks', id);
  }

  private async getTrack(id: string) {
    const track = await prisma.tracks.findUnique({ where: { id } });

    if (!track)
      throw new NotFoundException(ERROR_MESSAGE.notFound('Track', id));

    return track;
  }
}
