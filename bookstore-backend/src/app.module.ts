import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BooksModule } from './books/books.module';
import { CategoriesModule } from './categories/categories.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [PrismaModule, BooksModule, CategoriesModule, CartModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
