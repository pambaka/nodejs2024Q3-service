import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/const';

@Module({
  imports: [JwtModule.register({ secret: jwtConstants.secret })],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
