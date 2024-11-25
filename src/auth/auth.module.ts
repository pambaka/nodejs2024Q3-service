import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtModuleOptions } from './const';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register(jwtModuleOptions),
    LoggerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class AuthModule {}
