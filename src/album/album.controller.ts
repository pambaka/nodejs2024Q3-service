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
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly appService: AlbumService) {}

  @Get()
  async getAlbums() {
    return await this.appService.getAlbums();
  }

  @Get(':id')
  async getAlbum(@Param('id') id: string) {
    return await this.appService.getAlbum(id);
  }

  @Post()
  async createAlbum(@Body() createAlbumDto: CreateAlbumDto) {
    return await this.appService.createAlbum(createAlbumDto);
  }

  @Put(':id')
  async updateAlbum(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    return await this.appService.updateAlbum(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteAlbum(@Param('id') id: string) {
    await this.appService.deleteAlbum(id);
  }
}
