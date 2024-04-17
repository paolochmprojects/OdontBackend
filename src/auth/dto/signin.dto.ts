import { IsEmail, IsString } from 'class-validator';

export class SigninAuthDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
