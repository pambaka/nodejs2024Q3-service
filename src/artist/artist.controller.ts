import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly appService: ArtistService) {}

  @Get()
  async getArtists() {
    return await this.appService.getArtists();
  }

  @Get(':id')
  async getArtist(@Param('id') id: string) {
    return await this.appService.getArtist(id);
  }

  @Post()
  async createArtist(@Body() createArtistDto: CreateArtistDto) {
    return await this.appService.createArtist(createArtistDto);
  }

  @Put(':id')
  async updateArtist(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    return await this.appService.updateArtist(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async removeArtist(@Param('id') id: string) {
    await this.appService.removeArtist(id);
  }
}
