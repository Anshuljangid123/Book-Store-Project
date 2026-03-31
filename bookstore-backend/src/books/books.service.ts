import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto) {
    return await this.prisma.book.create({
      data: createBookDto,
    });
  }

  async findAll() {
    return await this.prisma.book.findMany({
      where: { isDeleted: false },
      include: { category: true }, // Join the category data
    });
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findFirst({
      where: { id, isDeleted: false },
      include: { category: true },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    // Verify existence first
    await this.findOne(id);
    return this.prisma.book.update({
      where: { id },
      data: updateBookDto,
    });
  }

  async remove(id: string) {
    // Verify existence first
    await this.findOne(id);

    // Soft Delete: update the isDeleted flag instead of dropping the row
    return this.prisma.book.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
