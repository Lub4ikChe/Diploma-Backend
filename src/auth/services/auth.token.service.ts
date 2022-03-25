import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { JwtPayload } from 'src/auth/jwt/jwt-payload.interface';
import { Tokens } from 'src/auth/jwt/tokens.interface';

import { RefreshToken } from 'src/entities/refresh-token/refresh-token.entity';
import { User } from 'src/entities/user/user.entity';

import { UserRepository } from 'src/user/repositories/user.repository';
import { RefreshTokenRepository } from 'src/auth/repositories/refresh-token.repository';

@Injectable()
export class AuthTokenService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(RefreshTokenRepository)
    private refreshTokenRepository: RefreshTokenRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async generateTokens(payload: JwtPayload): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.sign(payload, {
        secret: process.env.AT_JWT_SECRET,
        expiresIn: process.env.AT_JWT_EXPIRES_IN,
      }),
      this.jwtService.sign(payload, {
        secret: process.env.RT_JWT_SECRET,
        expiresIn: process.env.RT_JWT_EXPIRES_IN,
      }),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  async addRefreshTokenToUser(user: User, token: string): Promise<User> {
    const refreshToken = await this.refreshTokenRepository.createRefreshToken(
      token,
    );
    user.refreshToken = refreshToken;
    return this.userRepository.save(user);
  }

  async updateRefreshTokenForUser(
    refreshToken: RefreshToken,
    token: string | null,
  ): Promise<RefreshToken> {
    return this.refreshTokenRepository.updateRefreshToken(refreshToken, token);
  }

  async compareRefreshTokens(
    refreshToken: string,
    userRefreshToken: RefreshToken,
  ): Promise<boolean> {
    return this.refreshTokenRepository.compareRefreshTokens(
      refreshToken,
      userRefreshToken.hash,
    );
  }
}
