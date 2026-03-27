import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsUUID,
  Min,
  IsOptional,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsNumber()
  @Min(0)
  printedPrice: number;

  @IsNumber()
  @Min(0)
  discountedPrice: number;

  @IsNumber()
  publishedYear: number;

  @IsBoolean()
  isUsed: boolean;

  @IsNumber()
  @Min(1)
  @IsOptional()
  stock?: number;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string; // Required relation
}
