import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class SignupAuthDto {
  @IsEmail()
  readonly email: string;

  @IsStrongPassword()
  readonly password: string;

  @IsString()
  @MinLength(3)
  readonly fullName: string;
}
