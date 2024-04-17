import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from '@prisma/client';
import { Request } from 'express';
import config from 'src/config/config';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from '../interface/payload.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token, {
        secret: config.JWT.SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    request['user'] = await this.validateUser(payload.id);
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  // validate user
  private async validateUser(userId: string): Promise<Users> {
    const userfound = await this.usersService.findUserById(userId);
    if (!userfound.isActive) {
      throw new UnauthorizedException('User is not active');
    }
    return userfound;
  }
}
