import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() AuthDto: AuthDto) {
    return this.authService.signUpUser(AuthDto);
  }

  @Post('login')
  async login(@Body() AuthDto: AuthDto) {
    return this.authService.logInUser(AuthDto);
  }

  @Post('refresh')
  async refresh() {
    return this.authService.refreshToken();
  }
}
