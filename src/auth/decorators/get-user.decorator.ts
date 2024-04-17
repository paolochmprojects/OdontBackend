import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Users } from '@prisma/client';

export const GetUser = createParamDecorator((_data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const userData: Users = request.user;

  if (!userData)
    throw new InternalServerErrorException('User not found (request)');

  return userData;
});
