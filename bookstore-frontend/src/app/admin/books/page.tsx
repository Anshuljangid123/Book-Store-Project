'use client';

import { Box, Button, Flex, Heading, Table, Spinner, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import api from '@/lib/api';

interface Book {
  id: string;
  title: string;
  author: string;
  printedPrice: number;
  discountedPrice: number;
  stock: number;
  isUsed: boolean;
  category?: { name: string };
}

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const res = await api.get('/books');
      setBooks(res.data);
    } catch (error) {
      console.error('Failed to fetch books', error);
      alert('Failed to load books for admin dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.delete(`/books/${id}`);
      alert('Book deleted successfully');
      setBooks(books.filter(b => b.id !== id));
    } catch (error) {
      console.error(error);
      alert('Failed to delete book');
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" h="50vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading size="lg">Manage Inventory</Heading>
        <Link href="/admin/books/new">
          <Button colorScheme="blue">
            <Box mr={2}><FiPlus /></Box> Add New Book
          </Button>
        </Link>
      </Flex>

      <Box bg="white" borderRadius="xl" boxShadow="sm" overflowX="auto" p={4}>
        {books.length === 0 ? (
          <Text color="gray.700" textAlign="center" py={10}>No books found in inventory.</Text>
        ) : (
          <Table.Root variant="line">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Title</Table.ColumnHeader>
                <Table.ColumnHeader>Author</Table.ColumnHeader>
                <Table.ColumnHeader>Category</Table.ColumnHeader>
                <Table.ColumnHeader>Price</Table.ColumnHeader>
                <Table.ColumnHeader>Stock</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {books.map((book) => (
                <Table.Row key={book.id}>
                  <Table.Cell fontWeight="medium">{book.title}</Table.Cell>
                  <Table.Cell>{book.author}</Table.Cell>
                  <Table.Cell>{book.category?.name || '---'}</Table.Cell>
                  <Table.Cell color="green.600" fontWeight="bold">${book.discountedPrice}</Table.Cell>
                  <Table.Cell>{book.stock}</Table.Cell>
                  <Table.Cell textAlign="right">
                    <Flex gap={2} justify="flex-end">
                      <Link href={`/admin/books/${book.id}/edit`}>
                        <Button size="sm" variant="ghost" colorScheme="blue">
                          <FiEdit2 />
                        </Button>
                      </Link>
                      <Button size="sm" variant="ghost" colorScheme="red" onClick={() => handleDelete(book.id, book.title)}>
                        <FiTrash2 />
                      </Button>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </Box>
    </Box>
  );
}
