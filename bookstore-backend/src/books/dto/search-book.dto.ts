import {
  IsOptional,
  IsString,
  IsBooleanString,
  IsNumberString,
  IsUUID,
} from 'class-validator';

export class SearchBookDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsBooleanString()
  isUsed?: string;

  @IsOptional()
  @IsNumberString()
  minPrice?: string;

  @IsOptional()
  @IsNumberString()
  maxPrice?: string;
}
