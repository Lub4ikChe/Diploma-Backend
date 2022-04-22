import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from 'src/user/user.module';
import { EmailModule } from 'src/email/email.module';

import { AtJwtStrategy } from 'src/auth/jwt/at-jwt.strategy';
import { RtJwtStrategy } from 'src/auth/jwt/rt-jwt.strategy';

import { AuthController } from 'src/auth/auth.controller';

import { AuthTokenService } from 'src/auth/services/auth.token.service';
import { AuthService } from 'src/auth/services/auth.service';

import { RefreshTokenRepository } from 'src/auth/repositories/refresh-token.repository';
import { UserRepository } from 'src/user/repositories/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshTokenRepository, UserRepository]),
    PassportModule,
    JwtModule.register({}),
    UserModule,
    EmailModule,
  ],
  providers: [AtJwtStrategy, RtJwtStrategy, AuthService, AuthTokenService],
  controllers: [AuthController],
})
export class AuthModule {}
