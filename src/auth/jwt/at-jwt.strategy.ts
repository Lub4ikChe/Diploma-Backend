import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { AuthService } from 'src/auth/services/auth.service';

import { JwtPayload } from 'src/auth/jwt/jwt-payload.interface';
import { User } from 'src/entities/user/user.entity';

@Injectable()
export class AtJwtStrategy extends PassportStrategy(Strategy, 'at-jwt') {
  constructor(private readonly moduleRef: ModuleRef) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.AT_JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload): Promise<User> {
    const contextId = ContextIdFactory.getByRequest(request);
    const authService = await this.moduleRef.resolve(AuthService, contextId);

    return authService.getJwtUser(payload);
  }
}
