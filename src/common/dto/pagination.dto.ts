import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Min(1)
  @Type(() => Number) // enableImplicitConversions: true
  take?: number = 10;

  @IsOptional()
  @Min(1)
  @Type(() => Number) // enableImplicitConversions: true
  page?: number = 1;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  search?: string;
}
