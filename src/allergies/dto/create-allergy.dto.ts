import { IsOptional, IsString } from 'class-validator';

export class CreateAllergyDto {
  @IsString()
  display_name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
