import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { AuthService } from '../auth.service';

@Injectable()
export class OAuth2Strategy extends PassportStrategy(Strategy, 'oauth2') {
  constructor(private authService: AuthService) {
    super({
      authorizationURL: 'http://localhost:3000/auth/authorize',
      tokenURL: 'http://localhost:3000/auth/token',
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/callback',
    });
  }

  async validate(accessToken: string): Promise<any> {
    return this.authService.validateToken(accessToken);
  }
}