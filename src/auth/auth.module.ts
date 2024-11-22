import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtModuleOptions } from './const';

@Module({
  imports: [forwardRef(() => UserModule), JwtModule.register(jwtModuleOptions)],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
