import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { FavsService } from './favs.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  findAll() {
    return this.favsService.findAll();
  }

  @Post('artist/:id')
  addArtist(@Param('id') id: string) {
    return this.favsService.add('artists', id);
  }

  @Post('album/:id')
  addAlbum(@Param('id') id: string) {
    return this.favsService.add('albums', id);
  }

  @Post('track/:id')
  addTrack(@Param('id') id: string) {
    return this.favsService.add('tracks', id);
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
