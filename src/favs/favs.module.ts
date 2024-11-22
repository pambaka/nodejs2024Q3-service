import { Module } from '@nestjs/common';
import { FavsService } from './favs.service';
import { FavsController } from './favs.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtModuleOptions } from 'src/auth/const';

@Module({
  imports: [JwtModule.register(jwtModuleOptions)],
  controllers: [FavsController],
  providers: [FavsService],
})
export class FavsModule {}
