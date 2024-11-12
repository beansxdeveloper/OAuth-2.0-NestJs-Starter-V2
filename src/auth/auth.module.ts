import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { SystemController } from './controllers/system.controller';
import { AuthService } from './auth.service';
import { SystemService } from './services/system.service';
import { OAuthClient } from './entities/oauth-client.entity';
import { OAuthToken } from './entities/oauth-token.entity';
import { OAuthSystem } from './entities/oauth-system.entity';
import { UsersModule } from '../users/users.module';
import { OAuth2Strategy } from './strategies/oauth2.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([OAuthClient, OAuthToken, OAuthSystem]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'your-secret-key'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AuthController, SystemController],
  providers: [AuthService, SystemService, OAuth2Strategy, JwtStrategy],
})
export class AuthModule {}