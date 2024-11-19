import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async signUpUser() {
    return 'This action sing up user';
  }

  async logInUser() {
    return `This action log in user`;
  }

  async refreshToken() {
    return `This action refreshes access token`;
  }
}
