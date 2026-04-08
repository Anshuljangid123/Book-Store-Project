import { IsUUID, IsInt, Min } from 'class-validator';

export class AddToCartDto {
  @IsUUID()
  bookId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
