import { Controller, Get, Post, Param, Delete, HttpCode } from '@nestjs/common';
import { FavsService } from './favs.service';
import { Album } from 'src/album/interfaces/album.interface';
import { Artist } from 'src/artist/interfaces/artist.interface';
import { Track } from 'src/track/interfaces/track.interface';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  findAll() {
    return this.favsService.findAll();
  }

  @Post('artist/:id')
  addArtist(@Param('id') id: string) {
    return this.favsService.add<Artist>('artists', id);
  }

  @Post('album/:id')
  addAlbum(@Param('id') id: string) {
    return this.favsService.add<Album>('albums', id);
  }

  @Post('track/:id')
  addTrack(@Param('id') id: string) {
    return this.favsService.add<Track>('tracks', id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  deleteArtist(@Param('id') id: string) {
    return this.favsService.remove('artists', id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  deleteAlbum(@Param('id') id: string) {
    return this.favsService.remove('albums', id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  deleteTrack(@Param('id') id: string) {
    return this.favsService.remove('tracks', id);
  }
}
