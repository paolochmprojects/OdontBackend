import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class SignupAuthDto {
  @IsEmail()
  readonly email: string;

  @IsStrongPassword()
  readonly password: string;

  @IsString()
  readonly fullName: string;
}
