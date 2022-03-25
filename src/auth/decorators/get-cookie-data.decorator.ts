import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCookieData = createParamDecorator(
  (
    data: string | undefined,
    ctx: ExecutionContext,
  ): string | Record<string, string> => {
    const request = ctx.switchToHttp().getRequest();

    if (!data) {
      return request.cookies;
    }

    return request.cookies[data];
  },
);
