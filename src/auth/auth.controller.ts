import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupAuthDto, SigninAuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signinAuthDto: SigninAuthDto) {
    const token = await this.authService.signIn(signinAuthDto);
    return { token };
  }

  @Post('signup')
  findAll(@Body() signupAuthDto: SignupAuthDto) {
    return this.authService.signUp(signupAuthDto);
  }
}
