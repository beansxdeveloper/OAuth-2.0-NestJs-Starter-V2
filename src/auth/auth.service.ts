import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { OAuthClient } from './entities/oauth-client.entity';
import { OAuthToken } from './entities/oauth-token.entity';
import { OAuthAuthorizationCode } from './entities/oauth-authorization-code.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(OAuthClient)
    private oauthClientRepo: Repository<OAuthClient>,
    @InjectRepository(OAuthToken)
    private oauthTokenRepo: Repository<OAuthToken>,
    @InjectRepository(OAuthAuthorizationCode)
    private authCodeRepo: Repository<OAuthAuthorizationCode>,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateClient(clientId: string, clientSecret: string): Promise<OAuthClient> {
    const client = await this.oauthClientRepo.findOne({
      where: { clientId, isActive: true },
      relations: ['system'],
    });

    if (!client || !(await bcrypt.compare(clientSecret, client.clientSecret))) {
      throw new UnauthorizedException('Invalid client credentials');
    }

    return client;
  }

  async createAuthorizationCode(params: {
    clientId: string;
    redirectUri: string;
    responseType: string;
    scope?: string[];
    userId: string;
    codeChallenge?: string;
    codeChallengeMethod?: string;
  }): Promise<OAuthAuthorizationCode> {
    const client = await this.oauthClientRepo.findOne({
      where: { clientId: params.clientId, isActive: true },
      relations: ['system'],
    });

    if (!client) {
      throw new UnauthorizedException('Invalid client');
    }

    if (!client.redirectUris.includes(params.redirectUri)) {
      throw new BadRequestException('Invalid redirect URI');
    }

    const user = await this.usersService.findById(params.userId);
    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    // Check if user belongs to the same system as the client
    if (user.system && client.system && user.system.id !== client.system.id) {
      throw new UnauthorizedException('User not authorized for this system');
    }

    const authCode = new OAuthAuthorizationCode();
    authCode.code = crypto.randomBytes(32).toString('hex');
    authCode.expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    authCode.scope = params.scope;
    authCode.redirectUri = params.redirectUri;
    authCode.user = user;
    authCode.client = client;

    if (params.codeChallenge) {
      authCode.codeChallenge = {
        challenge: params.codeChallenge,
        method: params.codeChallengeMethod || 'plain',
      };
    }

    return this.authCodeRepo.save(authCode);
  }

  async generateToken(
    userId: string,
    clientId: string,
    scope?: string[],
  ): Promise<OAuthToken> {
    const user = await this.usersService.findById(userId);
    const client = await this.oauthClientRepo.findOne({
      where: { id: clientId, isActive: true },
      relations: ['system'],
    });

    if (!user || !client) {
      throw new UnauthorizedException();
    }

    // Check system authorization
    if (user.system && client.system && user.system.id !== client.system.id) {
      throw new UnauthorizedException('User not authorized for this system');
    }

    const token = new OAuthToken();
    token.accessToken = this.jwtService.sign({ 
      userId,
      clientId,
      systemId: user.system?.id,
      systemUserId: user.systemUserId,
      scope,
      type: 'access_token'
    });
    token.refreshToken = crypto.randomBytes(32).toString('hex');
    token.expiresIn = client.system.tokenExpirationTime || 3600;
    token.expiresAt = new Date(Date.now() + token.expiresIn * 1000);
    token.scope = scope;
    token.user = user;
    token.client = client;

    return this.oauthTokenRepo.save(token);
  }

  async getUserInfo(userId: string): Promise<any> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      sub: user.id,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      system_id: user.system?.id,
      system_user_id: user.systemUserId,
    };
  }

  // ... rest of the service methods remain the same
}