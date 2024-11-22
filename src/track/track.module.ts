import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtModuleOptions } from 'src/auth/const';

@Module({
  imports: [JwtModule.register(jwtModuleOptions)],
  controllers: [TrackController],
  providers: [TrackService],
})
export class TrackModule {}
