import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUser = createParamDecorator(
  (
    data: string | undefined,
    ctx: ExecutionContext,
  ): string | Record<string, any> => {
    const request = ctx.switchToHttp().getRequest();

    if (!data) {
      return request.user;
    }

    return request.user[data];
  },
);
