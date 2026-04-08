'use client';

import { Box, Button, Container, Heading, Text, Flex, Image, VStack, HStack, Divider, IconButton, Spinner } from '@chakra-ui/react';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

interface CartItem {
  id: string;
  bookId: string;
  quantity: number;
  book: {
    title: string;
    author: string;
    discountedPrice: number;
    categoryId: string;
  };
}

interface Cart {
  id: string;
  items: CartItem[];
}

export default function CartPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      setCart(res.data);
    } catch (error) {
      console.error('Failed to fetch cart', error);
      setCart({ id: 'dummy', items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchCart();
    } else if (isLoaded && !isSignedIn) {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  const handleDelete = async (itemId: string) => {
    try {
      await api.delete(`/cart/items/${itemId}`);
      // Optimistic update
      setCart((prev) => {
        if (!prev) return prev;
        return { ...prev, items: prev.items.filter(item => item.id !== itemId) };
      });
    } catch (error) {
      console.error('Failed to remove item', error);
      alert('Failed to remove item');
    }
  };

  if (!isLoaded || loading) {
    return (
      <Flex justify="center" align="center" h="50vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  if (!isSignedIn) {
    return (
      <Container maxW="container.md" py={20} textAlign="center">
        <Box p={10} bg="white" borderRadius="xl" boxShadow="sm">
          <Heading mb={4}>You are not signed in</Heading>
          <Text color="gray.700" mb={6}>Please sign in to view your shopping cart.</Text>
        </Box>
      </Container>
    );
  }

  const items = cart?.items || [];
  const total = items.reduce((sum, item) => sum + (item.book.discountedPrice * item.quantity), 0);

  return (
    <Container maxW="container.xl" py={10}>
      <Heading mb={8} display="flex" alignItems="center" gap={3}>
        <FiShoppingBag /> Your Cart
      </Heading>

      <Flex direction={{ base: 'column', lg: 'row' }} gap={10}>
        
        {/* Cart Items List */}
        <Box flex={1}>
          {items.length === 0 ? (
            <Box p={10} bg="white" borderRadius="xl" textAlign="center" boxShadow="sm">
              <Text fontSize="lg" color="gray.700" mb={4}>Your cart is currently empty.</Text>
              <Link href="/books">
                <Button colorScheme="blue">Browse Books</Button>
              </Link>
            </Box>
          ) : (
            <VStack spacing={4} align="stretch">
              {items.map((item) => (
                <Flex key={item.id} bg="white" p={6} borderRadius="xl" boxShadow="sm" gap={6} align="center" direction={{ base: 'column', sm: 'row' }}>
                  <Box w={{ base: '100%', sm: '100px' }} h="120px" bg="gray.100" borderRadius="md" flexShrink={0} display="flex" alignItems="center" justifyContent="center">
                    📖
                  </Box>
                  <Box flex={1}>
                    <Heading size="md" mb={1}>{item.book.title}</Heading>
                    <Text color="gray.700" fontSize="sm" mb={3}>By {item.book.author}</Text>
                    <Text fontWeight="bold" color="green.600">${item.book.discountedPrice}</Text>
                  </Box>
                  <Flex align="center" gap={4}>
                    <Text>Qty: {item.quantity}</Text>
                    <IconButton aria-label="Remove item" variant="ghost" colorScheme="red" onClick={() => handleDelete(item.id)}>
                      <FiTrash2 />
                    </IconButton>
                  </Flex>
                </Flex>
              ))}
            </VStack>
          )}
        </Box>

        {/* Order Summary */}
        {items.length > 0 && (
          <Box w={{ base: '100%', lg: '350px' }} flexShrink={0} bg="white" p={6} borderRadius="xl" boxShadow="sm" h="fit-content" position="sticky" top="100px">
            <Heading size="md" mb={6}>Order Summary</Heading>
            
            <VStack align="stretch" spacing={4}>
              <Flex justify="space-between">
                <Text color="gray.800">Subtotal ({items.length} items)</Text>
                <Text fontWeight="medium">${total.toFixed(2)}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text color="gray.800">Shipping</Text>
                <Text fontWeight="medium" color={total >= 25 ? "green.500" : "black"}>
                  {total >= 25 ? 'FREE' : '$5.00'}
                </Text>
              </Flex>
              <Box h="1px" bg="gray.200" my={2} />
              <Flex justify="space-between" align="center">
                <Heading size="sm">Total</Heading>
                <Heading size="lg" color="green.600">
                  ${(total + (total >= 25 ? 0 : 5)).toFixed(2)}
                </Heading>
              </Flex>
            </VStack>

            <Button colorScheme="blue" size="lg" w="100%" mt={8}>
              Proceed to Checkout
            </Button>
          </Box>
        )}

      </Flex>
    </Container>
  );
}
