const API_URL = 'http://localhost:3005';

async function seed() {
  console.log('Seeding categories...');
  const categoriesToSeed = [
    'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy',
    'Academic', 'Mystery & Thriller', 'Biography', 'Children',
  ];

  let fetch;
  try {
    fetch = require('node-fetch');
  } catch(e) {
    fetch = global.fetch;
  }

  for (const name of categoriesToSeed) {
    try {
      await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
    } catch(err) {}
  }

  console.log('Categories seeded successfully!');

  const catRes = await fetch(`${API_URL}/categories`);
  const allCategories = await catRes.json();
  
  if (!allCategories || !Array.isArray(allCategories) || allCategories.length === 0) return;

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

  console.log('Seeding books...');

  const booksRes = await fetch(`${API_URL}/books`);
  const existBooks = await booksRes.json();

  for (const book of dummyBooks) {
    const category = allCategories.find((c) => c.name === book.categoryName);
    if (!category) continue;

    const existingBook = (Array.isArray(existBooks) ? existBooks : []).find(b => b.title === book.title);
    if (!existingBook) {
      await fetch(`${API_URL}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: book.title,
          author: book.author,
          printedPrice: book.printedPrice,
          discountedPrice: book.discountedPrice,
          publishedYear: book.publishedYear,
          isUsed: book.isUsed,
          stock: book.stock,
          categoryId: category.id,
        })
      });
    }
  }

  console.log('Books seeded successfully!');
}

seed().catch(console.error);
