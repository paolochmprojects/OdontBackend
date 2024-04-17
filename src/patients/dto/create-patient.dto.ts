import { IsEmail, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @MinLength(3)
  fullName: string;

  @IsEmail()
  email?: string;

  @IsPhoneNumber()
  phone?: string;

  @IsString()
  address?: string;

  @IsString()
  numId?: string;
}
