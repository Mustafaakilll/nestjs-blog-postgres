import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator((_: any, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
