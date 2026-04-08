'use client';

import { Box, Button, Container, Heading, Text, SimpleGrid, Flex, Image, Badge, Input, VStack, Spinner } from '@chakra-ui/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';

interface Book {
  id: string;
  title: string;
  author: string;
  printedPrice: number;
  discountedPrice: number;
  isUsed: boolean;
  stock: number;
  categoryId: string;
  category?: { name: string };
}

interface Category {
  id: string;
  name: string;
}

export default function BooksPage() {
  const searchParams = useSearchParams();
  const initialTitleQuery = searchParams.get('title') || '';

  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [title, setTitle] = useState(initialTitleQuery);
  const [categoryId, setCategoryId] = useState('');
  const [isUsed, setIsUsed] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchBooks = async () => {
    setLoading(true);
    try {
      // Build Query String
      const params = new URLSearchParams();
      if (title) params.append('title', title);
      if (categoryId) params.append('categoryId', categoryId);
      if (isUsed !== '') params.append('isUsed', isUsed);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);

      const res = await api.get(`/books?${params.toString()}`);
      setBooks(res.data);
    } catch (error) {
      console.error('Error fetching books', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (error) {
      console.error('Error fetching categories', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [title, categoryId, isUsed, minPrice, maxPrice]);

  return (
    <Container maxW="container.xl" py={8}>
      <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
        
        {/* Sidebar Filters */}
        <Box w={{ base: '100%', md: '300px' }} flexShrink={0} bg="white" p={6} borderRadius="lg" boxShadow="sm" h="fit-content" position="sticky" top="100px">
          <Heading size="md" mb={6}>Filters</Heading>
          
          <VStack align="stretch" gap={5}>
            <Box>
              <Text fontWeight="medium" mb={2}>Search Title</Text>
              <Input 
                placeholder="Book title..." 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
              />
            </Box>

            <Box>
              <Text fontWeight="medium" mb={2}>Category</Text>
              <select style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: 'white' }} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </Box>

            <Box>
              <Text fontWeight="medium" mb={2}>Condition</Text>
              <select style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: 'white' }} value={isUsed} onChange={(e) => setIsUsed(e.target.value)}>
                <option value="">Any Condition</option>
                <option value="false">Brand New</option>
                <option value="true">Gently Used</option>
              </select>
            </Box>

            <Box>
              <Text fontWeight="medium" mb={2}>Price Range ($)</Text>
              <Flex gap={2}>
                <Input placeholder="Min" type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                <Input placeholder="Max" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
              </Flex>
            </Box>

            <Button colorScheme="blue" onClick={fetchBooks} w="100%">
              Apply Filters
            </Button>
          </VStack>
        </Box>

        {/* Book Grid */}
        <Box flex={1}>
          <Heading size="lg" mb={6}>
            {books.length} {books.length === 1 ? 'Book' : 'Books'} Found
          </Heading>

          {loading ? (
            <Flex justify="center" py={20}>
              <Spinner size="xl" color="blue.500" />
            </Flex>
          ) : (
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={6}>
              {books.map((book) => (
                <Box key={book.id} bg="white" borderRadius="lg" overflow="hidden" boxShadow="sm" _hover={{ boxShadow: 'lg', transform: 'translateY(-4px)' }} transition="all 0.2s">
                  {/* Image Placeholder */}
                  <Box h="200px" bg="gray.100" position="relative">
                    <Flex h="100%" align="center" justify="center" color="gray.400">
                       [Book Cover]
                    </Flex>
                    {book.isUsed && (
                      <Badge colorScheme="orange" position="absolute" top={2} right={2}>
                        USED
                      </Badge>
                    )}
                  </Box>

                  <Box p={5}>
                    <Text color="blue.600" fontSize="sm" fontWeight="bold" mb={1}>
                      {book.category?.name || 'Uncategorized'}
                    </Text>
                    <Heading size="md" mb={1} lineClamp={1} title={book.title}>
                      {book.title}
                    </Heading>
                    <Text color="gray.700" fontSize="sm" mb={3}>By {book.author}</Text>
                    
                    <Flex justify="space-between" align="center">
                      <Flex direction="column">
                        <Text fontSize="lg" fontWeight="bold" color="green.600">
                          ${book.discountedPrice}
                        </Text>
                        <Text fontSize="sm" color="gray.400" textDecoration="line-through">
                          ${book.printedPrice}
                        </Text>
                      </Flex>
                      <Link href={`/books/${book.id}`}>
                        <Button size="sm" colorScheme="blue" variant="outline">
                          View Details
                        </Button>
                      </Link>
                    </Flex>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          )}

          {!loading && books.length === 0 && (
            <Box textAlign="center" py={20} bg="white" borderRadius="lg">
              <Text fontSize="xl" color="gray.700" mb={4}>No books match your criteria.</Text>
              <Button onClick={() => { setTitle(''); setCategoryId(''); setIsUsed(''); setMinPrice(''); setMaxPrice(''); }}>
                Clear Filters
              </Button>
            </Box>
          )}
        </Box>

      </Flex>
    </Container>
  );
}
