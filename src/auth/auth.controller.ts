import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup() {
    return this.authService.signUpUser();
  }

  @Post('login')
  async login() {
    return this.authService.logInUser();
  }

  @Post('refresh')
  async refresh() {
    return this.authService.refreshToken();
  }
}
