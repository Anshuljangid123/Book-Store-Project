import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);

  console.log('Seeding categories...');
  const categoriesToSeed = [
    'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy',
    'Academic', 'Mystery & Thriller', 'Biography', 'Children',
  ];

  for (const name of categoriesToSeed) {
    const existing = await prisma.category.findUnique({ where: { name } });
    if (!existing) {
      await prisma.category.create({ data: { name } });
    }
  }

  const allCategories = await prisma.category.findMany();
  
  const dummyBooks = [
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', printedPrice: 15.99, discountedPrice: 10.99, publishedYear: 1925, isUsed: false, stock: 10, categoryName: 'Fiction' },
    { title: 'Dune', author: 'Frank Herbert', printedPrice: 20.00, discountedPrice: 14.50, publishedYear: 1965, isUsed: true, stock: 5, categoryName: 'Science Fiction' },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', printedPrice: 18.00, discountedPrice: 12.00, publishedYear: 1960, isUsed: false, stock: 8, categoryName: 'Fiction' },
    { title: 'A Brief History of Time', author: 'Stephen Hawking', printedPrice: 22.50, discountedPrice: 16.00, publishedYear: 1988, isUsed: false, stock: 15, categoryName: 'Non-Fiction' },
    { title: 'The Hobbit', author: 'J.R.R. Tolkien', printedPrice: 14.00, discountedPrice: 9.99, publishedYear: 1937, isUsed: true, stock: 3, categoryName: 'Fantasy' },
    { title: 'Calculus: Early Transcendentals', author: 'James Stewart', printedPrice: 150.00, discountedPrice: 95.00, publishedYear: 2020, isUsed: true, stock: 2, categoryName: 'Academic' },
    { title: 'Gone Girl', author: 'Gillian Flynn', printedPrice: 16.99, discountedPrice: 11.99, publishedYear: 2012, isUsed: false, stock: 20, categoryName: 'Mystery & Thriller' },
    { title: 'Steve Jobs', author: 'Walter Isaacson', printedPrice: 25.00, discountedPrice: 18.50, publishedYear: 2011, isUsed: false, stock: 7, categoryName: 'Biography' },
    { title: "Harry Potter and the Sorcerer's Stone", author: 'J.K. Rowling', printedPrice: 19.99, discountedPrice: 12.50, publishedYear: 1997, isUsed: false, stock: 100, categoryName: 'Children' },
    { title: 'The Silent Patient', author: 'Alex Michaelides', printedPrice: 17.50, discountedPrice: 13.00, publishedYear: 2019, isUsed: true, stock: 4, categoryName: 'Mystery & Thriller' },
  ];

  for (const book of dummyBooks) {
    const category = allCategories.find((c) => c.name === book.categoryName);
    if (!category) continue;

    const existingBook = await prisma.book.findFirst({ where: { title: book.title } });
    if (!existingBook) {
      await prisma.book.create({
        data: {
          title: book.title,
          author: book.author,
          printedPrice: book.printedPrice,
          discountedPrice: book.discountedPrice,
          publishedYear: book.publishedYear,
          isUsed: book.isUsed,
          stock: book.stock,
          categoryId: category.id,
        },
      });
    }
  }

  console.log('Books seeded successfully!');
  await app.close();
}

bootstrap()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
