'use client';

import { Box, Button, Container, Heading, Text, SimpleGrid, Flex, Badge, Input, VStack, Spinner } from '@chakra-ui/react';
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
    if (minPrice && maxPrice && parseFloat(minPrice) > parseFloat(maxPrice)) {
      alert("Minimum price cannot be greater than maximum price.");
      return;
    }

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container maxW="container.xl" py={10} px={{ base: 6, md: 12 }}>
      <Flex direction={{ base: 'column', md: 'row' }} gap={10}>
        
        {/* Sidebar Filters */}
        <Box w={{ base: '100%', md: '300px' }} flexShrink={0} bg="transparent" border="1px solid" borderColor="whiteAlpha.300" p={8} borderRadius="none" h="fit-content" position="sticky" top="100px">
          <Heading size="md" mb={8} fontWeight="500" letterSpacing="widest" textTransform="uppercase">Parameters</Heading>
          
          <VStack align="stretch" gap={6}>
            <Box>
              <Text fontWeight="bold" fontSize="sm" color="whiteAlpha.700" textTransform="uppercase" letterSpacing="widest" mb={3}>Title</Text>
              <Input 
                placeholder="Search..." 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                bg="transparent"
                border="1px solid"
                borderColor="whiteAlpha.400"
                color="white"
                borderRadius="none"
                px={4}
                py={5}
                _placeholder={{ color: 'whiteAlpha.400' }}
                _focus={{ borderColor: 'white', boxShadow: 'none' }}
              />
            </Box>

            <Box>
              <Text fontWeight="bold" fontSize="sm" color="whiteAlpha.700" textTransform="uppercase" letterSpacing="widest" mb={3}>Category</Text>
              <select style={{ width: '100%', padding: '10px', border: '1px solid #ffffff40', borderRadius: '0', backgroundColor: '#0a0a0a', color: 'white' }} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </Box>

            <Box>
              <Text fontWeight="bold" fontSize="sm" color="whiteAlpha.700" textTransform="uppercase" letterSpacing="widest" mb={3}>Condition</Text>
              <select style={{ width: '100%', padding: '10px', border: '1px solid #ffffff40', borderRadius: '0', backgroundColor: '#0a0a0a', color: 'white' }} value={isUsed} onChange={(e) => setIsUsed(e.target.value)}>
                <option value="">Any Condition</option>
                <option value="false">Brand New</option>
                <option value="true">Gently Used</option>
              </select>
            </Box>

            <Box>
              <Text fontWeight="bold" fontSize="sm" color="whiteAlpha.700" textTransform="uppercase" letterSpacing="widest" mb={3}>Price Range ($)</Text>
              <Flex gap={4}>
                <Input placeholder="Min" type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} bg="transparent" border="1px solid" borderColor="whiteAlpha.400" borderRadius="none" px={4} py={5} _focus={{ borderColor: 'white' }} />
                <Input placeholder="Max" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} bg="transparent" border="1px solid" borderColor="whiteAlpha.400" borderRadius="none" px={4} py={5} _focus={{ borderColor: 'white' }} />
              </Flex>
            </Box>

            <Button mt={4} onClick={fetchBooks} w="100%" bg="white" color="black" borderRadius="none" textTransform="uppercase" letterSpacing="widest" fontSize="sm" _hover={{ bg: 'yellow.500' }}>
              Apply Query
            </Button>
          </VStack>
        </Box>

        {/* Book Grid */}
        <Box flex={1}>
          <Flex justify="space-between" align="baseline" mb={8}>
            <Heading size="xl" fontWeight="300" letterSpacing="tight">
              The Collection
            </Heading>
            <Text color="gray.400" fontFamily="mono">
              {books.length} {books.length === 1 ? 'Volume' : 'Volumes'}
            </Text>
          </Flex>

          {loading ? (
            <Flex justify="center" align="center" py={32}>
              <Spinner size="xl" color="yellow.500" thickness="2px" />
            </Flex>
          ) : (
            <SimpleGrid columns={{ base: 1, xl: 2 }} gap={8}>
              {books.map((book) => (
                <Flex key={book.id} direction="column" bg="#141414" border="1px solid" borderColor="whiteAlpha.200" overflow="hidden" _hover={{ bg: '#1c1c1c', borderColor: 'yellow.500' }} transition="all 0.3s">
                  {/* Image Placeholder */}
                  <Box h="220px" bg="transparent" borderBottom="1px solid" borderColor="whiteAlpha.100" position="relative">
                    <Flex h="100%" align="center" justify="center" color="whiteAlpha.300" fontFamily="mono" fontSize="sm" textTransform="uppercase" letterSpacing="widest">
                       [ Folio Cover ]
                    </Flex>
                    {book.isUsed && (
                      <Badge colorScheme="yellow" position="absolute" top={4} right={4} fontSize="xs" px={2} letterSpacing="widest" borderRadius="none">
                        VINTAGE / USED
                      </Badge>
                    )}
                  </Box>

                  <Box p={8} flex="1" display="flex" flexDirection="column">
                    <Text color="yellow.500" fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="widest" mb={3}>
                      {book.category?.name || 'Unclassified'}
                    </Text>
                    <Heading size="md" mb={2} fontWeight="500" letterSpacing="tight" title={book.title}>
                      {book.title}
                    </Heading>
                    <Text color="gray.400" fontSize="sm" mb={6} fontWeight="300">By {book.author}</Text>
                    
                    <Box mt="auto">
                      <Flex justify="space-between" align="flex-end">
                        <Flex direction="column">
                          <Text fontSize="sm" color="gray.500" textDecoration="line-through" mb={1} fontFamily="mono">
                            ${book.printedPrice}
                          </Text>
                          <Text fontSize="xl" fontWeight="bold" color="white" fontFamily="mono">
                            ${book.discountedPrice}
                          </Text>
                        </Flex>
                        <Link href={`/books/${book.id}`}>
                          <Button size="sm" bg="transparent" color="white" border="1px solid" borderColor="whiteAlpha.400" borderRadius="none" textTransform="uppercase" letterSpacing="widest" fontSize="xs" _hover={{ bg: 'white', color: 'black' }}>
                            Inspect
                          </Button>
                        </Link>
                      </Flex>
                    </Box>
                  </Box>
                </Flex>
              ))}
            </SimpleGrid>
          )}

          {!loading && books.length === 0 && (
            <Box textAlign="center" py={32} border="1px solid" borderColor="whiteAlpha.200">
              <Text fontSize="xl" color="gray.400" mb={6} fontWeight="300" letterSpacing="wide">No volumes fit your query.</Text>
              <Button onClick={() => { setTitle(''); setCategoryId(''); setIsUsed(''); setMinPrice(''); setMaxPrice(''); }} bg="transparent" color="white" border="1px solid white" borderRadius="none" textTransform="uppercase" letterSpacing="widest" _hover={{ bg: 'white', color: 'black' }}>
                Reset Catalog
              </Button>
            </Box>
          )}
        </Box>

      </Flex>
    </Container>
  );
}
