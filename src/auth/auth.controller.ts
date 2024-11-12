import { Controller, Post, Get, Body, Query, UseGuards, Req, Res, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { OAuth2Guard } from './guards/oauth2.guard';
import { AuthorizeDto } from './dto/authorize.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('authorize')
  @UseGuards(JwtAuthGuard)
  async authorize(@Query() query: AuthorizeDto, @Req() req, @Res() res: Response) {
    const { client_id, redirect_uri, response_type, state, scope } = query;

    try {
      const authCode = await this.authService.createAuthorizationCode({
        clientId: client_id,
        redirectUri: redirect_uri,
        responseType: response_type,
        scope,
        userId: req.user.id,
      });

      const redirectUrl = new URL(redirect_uri);
      redirectUrl.searchParams.set('code', authCode.code);
      if (state) {
        redirectUrl.searchParams.set('state', state);
      }

      return res.redirect(redirectUrl.toString());
    } catch (error) {
      const errorUrl = new URL(redirect_uri);
      errorUrl.searchParams.set('error', 'unauthorized');
      if (state) {
        errorUrl.searchParams.set('state', state);
      }
      return res.redirect(errorUrl.toString());
    }
  }

  @Post('token')
  @UseGuards(OAuth2Guard)
  async getToken(@Body() body: any, @Req() req) {
    const { grant_type, code, redirect_uri, code_verifier } = body;

    switch (grant_type) {
      case 'authorization_code':
        return this.authService.exchangeAuthorizationCode(code, redirect_uri, code_verifier);
      case 'refresh_token':
        return this.authService.refreshToken(body.refresh_token);
      case 'client_credentials':
        return this.authService.generateClientCredentialsToken(req.client);
      default:
        throw new UnauthorizedException('Invalid grant type');
    }
  }

  @Post('revoke')
  @UseGuards(OAuth2Guard)
  async revokeToken(@Body('token') token: string) {
    await this.authService.revokeToken(token);
    return { message: 'Token revoked successfully' };
  }

  @Get('userinfo')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@Req() req) {
    return this.authService.getUserInfo(req.user.id);
  }
}