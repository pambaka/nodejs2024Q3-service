import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtModuleOptions } from 'src/auth/const';

@Module({
  imports: [JwtModule.register(jwtModuleOptions)],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
