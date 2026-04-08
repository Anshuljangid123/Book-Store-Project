'use client';

import { Box, Button, Container, Heading, Text, Flex, Image, Badge, Spinner } from '@chakra-ui/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiArrowLeft, FiShoppingCart } from 'react-icons/fi';
import Link from 'next/link';
import api from '@/lib/api';

interface Book {
  id: string;
  title: string;
  author: string;
  printedPrice: number;
  discountedPrice: number;
  publishedYear: number;
  isUsed: boolean;
  stock: number;
  category?: { name: string };
}

export default function BookDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchBook = async () => {
      try {
        const res = await api.get(`/books/${id}`);
        setBook(res.data);
      } catch (error) {
        console.error(error);
        alert('Error loading book details');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await api.post('/cart/items', { bookId: book.id, quantity: 1 });
      alert('Successfully added to Cart!');
    } catch (error) {
      console.error(error);
      alert('Failed to add to cart. Are you signed in?');
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" h="50vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  if (!book) {
    return (
      <Container py={20} textAlign="center">
        <Heading mb={4}>Book Not Found</Heading>
        <Link href="/books"><Button>Back to Books</Button></Link>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={10}>
      <Button variant="ghost" onClick={() => router.back()} mb={6}>
        <FiArrowLeft /> Back to Books
      </Button>

      <Flex direction={{ base: 'column', md: 'row' }} gap={10} bg="white" p={{ base: 6, md: 10 }} borderRadius="xl" boxShadow="sm">
        {/* Book Cover Placeholder */}
        <Box flex={{ base: '1', md: '0 0 350px' }} bg="gray.100" borderRadius="xl" h={{ base: '400px', md: 'auto' }} minH="500px" position="relative">
          <Flex h="100%" align="center" justify="center" color="gray.400" fontSize="xl">
            [Book Cover Image]
          </Flex>
          {book.isUsed && (
             <Badge colorScheme="orange" position="absolute" top={4} right={4} fontSize="md" px={3} py={1} borderRadius="md">
               USED CONDITION
             </Badge>
          )}
        </Box>

        <Box flex={1}>
          <Text color="blue.600" fontWeight="bold" textTransform="uppercase" letterSpacing="wide">
            {book.category?.name || 'Category'}
          </Text>
          <Heading as="h1" size="2xl" mt={2} mb={2}>{book.title}</Heading>
          <Text fontSize="xl" color="gray.700" mb={6}>By {book.author}</Text>

          <Flex align="baseline" gap={4} mb={6}>
            <Text fontSize="4xl" fontWeight="black" color="green.600">
              ${book.discountedPrice}
            </Text>
            {book.printedPrice > book.discountedPrice && (
              <Text fontSize="xl" color="gray.400" textDecoration="line-through">
                ${book.printedPrice}
              </Text>
            )}
          </Flex>

          <Box h="1px" bg="gray.200" mb={6} />

          <Box mb={8}>
            <Heading size="md" mb={4}>Details</Heading>
            <Flex direction="column" gap={2} color="gray.800">
              <Text><strong>Published Year:</strong> {book.publishedYear}</Text>
              <Text><strong>Stock Availability:</strong> {book.stock} left in stock</Text>
              <Text><strong>Condition:</strong> {book.isUsed ? 'Gently Used' : 'Brand New'}</Text>
            </Flex>
          </Box>

          <Button 
            size="lg" 
            colorScheme="blue" 
            w={{ base: '100%', md: 'auto' }}
            px={10}
            onClick={handleAddToCart}
            disabled={book.stock <= 0}
          >
            <FiShoppingCart /> {book.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Button>

          {/* Just a warning banner if Clerk isn't configured */}
          <Box mt={6} p={4} bg="yellow.50" borderRadius="md" border="1px" borderColor="yellow.200">
            <Text fontSize="sm" color="orange.800">
              Note: Authentication is currently bypassed for testing UI. Adding to cart requires backend auth to function completely.
            </Text>
          </Box>
        </Box>
      </Flex>
    </Container>
  );
}
