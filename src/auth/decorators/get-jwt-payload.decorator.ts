import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const GetJWTPayload = createParamDecorator(
  (data, ctx: ExecutionContext): string | Record<string, any> => {
    const req = ctx.switchToHttp().getRequest();
    const jwtService = new JwtService({});
    let jwt;
    if (req.headers.authorization) {
      jwt = req.headers.authorization.replace('Bearer ', '');
    } else {
      jwt = req.cookies['refresh-jwt'];
    }

    if (!jwt) {
      throw new UnauthorizedException();
    }
    return jwtService.decode(jwt);
  },
);
