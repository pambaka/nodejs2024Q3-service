import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtModuleOptions } from 'src/auth/const';

@Module({
  imports: [JwtModule.register(jwtModuleOptions)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
