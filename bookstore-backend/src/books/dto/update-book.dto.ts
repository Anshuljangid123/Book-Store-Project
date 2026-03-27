import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';

// PartialType makes all properties of CreateBookDto optional for updates
export class UpdateBookDto extends PartialType(CreateBookDto) {}
