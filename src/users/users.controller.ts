import { Controller, Get, UseGuards } from '@nestjs/common';
import { Users } from '@prisma/client';
import { GetUser } from '../auth/decorators';
import { JwtAuthGuard } from '../auth/guards';

@Controller('users')
export class UsersController {
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getUserData(@GetUser() user: Users) {
    return user;
  }
}
