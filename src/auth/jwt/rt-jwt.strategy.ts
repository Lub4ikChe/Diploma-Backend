import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-jwt';
import { Request } from 'express';

import { AuthService } from 'src/auth/services/auth.service';

import { JwtPayload } from 'src/auth/jwt/jwt-payload.interface';
import { User } from 'src/entities/user/user.entity';

const cookieExtractor = function (req: Request): string | null {
  let token: string | null = null;
  if (req && req.cookies) {
    token = req.cookies['refresh-jwt'];
  }

  return token;
};

@Injectable()
export class RtJwtStrategy extends PassportStrategy(Strategy, 'rt-jwt') {
  constructor(private readonly moduleRef: ModuleRef) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.RT_JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload): Promise<User> {
    const contextId = ContextIdFactory.getByRequest(request);
    const authService = await this.moduleRef.resolve(AuthService, contextId);

    return authService.getJwtUser(payload);
  }
}
