import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtModuleOptions } from 'src/auth/const';

@Module({
  imports: [JwtModule.register(jwtModuleOptions)],
  controllers: [ArtistController],
  providers: [ArtistService],
})
export class ArtistModule {}
