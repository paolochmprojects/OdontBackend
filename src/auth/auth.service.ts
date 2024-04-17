import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SigninAuthDto, SignupAuthDto } from './dto';

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

    return await this.generateJwtToken({ id: userFound.id });
  }

  async signUp(signupAuthDto: SignupAuthDto) {
    return await this.usersService.create(signupAuthDto);
  }

  async generateJwtToken(payload: Payload): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }
}
