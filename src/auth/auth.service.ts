import { BadRequestException, Injectable } from '@nestjs/common';
import { SigninAuthDto, SignupAuthDto } from './dto';
import { UsersService } from 'src/users/users.service';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';

interface Payload {
  id: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async signIn(signinAuthDto: SigninAuthDto): Promise<string> {
    // find if user exist with this email
    const userFound = await this.usersService.findUserByEmail(
      signinAuthDto.email,
    );
    if (!userFound) {
      throw new BadRequestException('User not found');
    }

    // compare password
    const isPasswordMatched = await this.usersService.comparePassword(
      signinAuthDto.password,
      userFound.password,
    );

    if (!isPasswordMatched) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = await this.generateJwtToken({ id: userFound.id });

    return token;
  }

  async signUp(signupAuthDto: SignupAuthDto) {
    return await this.usersService.create(signupAuthDto);
  }

  async generateJwtToken(payload: Payload): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }
}
