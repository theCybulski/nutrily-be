import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (userFieldName: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (userFieldName) {
      return request.user[userFieldName];
    }

    return request.user;
  },
);
