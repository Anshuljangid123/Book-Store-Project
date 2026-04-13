'use client';

import { Box, Button, Container, Heading, Text, Flex, VStack, IconButton, Spinner } from '@chakra-ui/react';
import { FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
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

  const handleDelete = async (bookId: string) => {
    try {
      await api.delete(`/cart/items/${bookId}`);
      // Optimistic update
      setCart((prev) => {
        if (!prev) return prev;
        return { ...prev, items: prev.items.filter(item => item.bookId !== bookId) };
      });
    } catch (error) {
      console.error('Failed to remove item', error);
      alert('Failed to remove item');
    }
  };

  const handleCheckout = async () => {
    try {
      await api.post('/cart/checkout');
      alert('Order placed successfully! Your books are on the way.');
      setCart(prev => prev ? { ...prev, items: [] } : prev);
      router.push('/books');
    } catch (error: any) {
      alert('Checkout failed: ' + (error.response?.data?.message || 'Unknown error'));
      console.error(error);
    }
  };

  if (!isLoaded || loading) {
    return (
      <Flex justify="center" align="center" h="50vh">
        <Spinner size="xl" color="yellow.500" thickness="2px" />
      </Flex>
    );
  }

  if (!isSignedIn) {
    return (
      <Container maxW="container.md" py={20} px={{ base: 6, md: 12 }} textAlign="center">
        <Box p={16} bg="#141414" border="1px solid" borderColor="whiteAlpha.200" borderRadius="none">
          <Heading mb={6} fontWeight="300" letterSpacing="tight">Access Denied</Heading>
          <Text color="gray.200" mb={8} fontSize="lg" fontWeight="400">Please submit your credentials to view your requisition cart.</Text>
          <Link href="/">
             <Button bg="white" color="black" borderRadius="none" px={8} textTransform="uppercase" letterSpacing="widest" _hover={{ bg: 'yellow.500' }}>
               Return
             </Button>
          </Link>
        </Box>
      </Container>
    );
  }

  const items = cart?.items || [];
  const total = items.reduce((sum, item) => sum + (item.book.discountedPrice * item.quantity), 0);

  return (
    <Container maxW="container.xl" py={12} px={{ base: 6, md: 12 }}>
      <Heading mb={12} display="flex" alignItems="center" gap={4} fontWeight="300" letterSpacing="tight" fontSize="4xl">
        <FiShoppingBag color="#d69e2e" /> Your Cart
      </Heading>

      <Flex direction={{ base: 'column', lg: 'row' }} gap={10}>
        
        {/* Cart Items List */}
        <Box flex={1}>
          {items.length === 0 ? (
            <Box p={16} bg="#141414" border="1px solid" borderColor="whiteAlpha.200" borderRadius="none" textAlign="center">
              <Text fontSize="lg" color="gray.200" mb={8} fontWeight="400">Your cart is currently empty.</Text>
              <Link href="/books">
                <Button bg="white" color="black" borderRadius="none" px={10} textTransform="uppercase" letterSpacing="widest" _hover={{ bg: 'yellow.500' }} rightIcon={<FiArrowRight />}>
                  Browse Books
                </Button>
              </Link>
            </Box>
          ) : (
            <VStack gap={6} align="stretch">
              {items.map((item) => (
                <Flex key={item.id} bg="#141414" border="1px solid" borderColor="whiteAlpha.200" p={6} gap={8} align="center" direction={{ base: 'column', sm: 'row' }} _hover={{ borderColor: 'yellow.500' }} transition="all 0.3s">
                  <Box w={{ base: '100%', sm: '100px' }} h="140px" bg="transparent" border="1px solid" borderColor="whiteAlpha.100" borderRadius="none" flexShrink={0} display="flex" alignItems="center" justifyContent="center">
                    <Text color="whiteAlpha.400" fontFamily="mono" fontSize="xs" letterSpacing="widest">[ FOLIO ]</Text>
                  </Box>
                  <Box flex={1}>
                    <Heading size="lg" mb={2} fontWeight="400" letterSpacing="tight">{item.book.title}</Heading>
                    <Text color="gray.400" fontSize="md" mb={4} fontWeight="300">By {item.book.author}</Text>
                    <Text fontWeight="bold" color="white" fontFamily="mono" fontSize="2xl">${item.book.discountedPrice}</Text>
                  </Box>
                  <Flex align="center" gap={8} direction={{ base: 'row', sm: 'column' }}>
                    <Text color="white" fontFamily="mono" fontSize="sm" fontWeight="bold">QTY / {item.quantity}</Text>
                    <IconButton aria-label="Remove item" variant="ghost" color="whiteAlpha.600" borderRadius="none" border="1px solid transparent" _hover={{ color: 'red.500', borderColor: 'red.500', bg: 'whiteAlpha.50' }} onClick={() => handleDelete(item.bookId)}>
                      <FiTrash2 size={20} />
                    </IconButton>
                  </Flex>
                </Flex>
              ))}
            </VStack>
          )}
        </Box>

        {/* Order Summary */}
        {items.length > 0 && (
          <Box w={{ base: '100%', lg: '400px' }} flexShrink={0} bg="#141414" border="1px solid" borderColor="whiteAlpha.200" p={8} borderRadius="none" h="fit-content" position="sticky" top="100px">
            <Heading size="md" mb={10} fontWeight="500" letterSpacing="widest" textTransform="uppercase">Summary</Heading>
            
            <VStack align="stretch" gap={6}>
              <Flex justify="space-between" fontSize="lg">
                <Text color="gray.300" fontWeight="400">Subtotal ({items.length})</Text>
                <Text color="white" fontFamily="mono">${total.toFixed(2)}</Text>
              </Flex>
              <Flex justify="space-between" fontSize="lg">
                <Text color="gray.300" fontWeight="400">Shipping</Text>
                <Text fontFamily="mono" fontWeight="bold" color={total >= 25 ? "yellow.500" : "white"}>
                  {total >= 25 ? 'FREE' : '$5.00'}
                </Text>
              </Flex>
              <Box h="1px" bg="whiteAlpha.300" my={4} />
              <Flex justify="space-between" align="center">
                <Heading size="md" fontWeight="500" letterSpacing="widest" textTransform="uppercase">Total</Heading>
                <Heading size="xl" color="white" fontFamily="mono">
                  ${(total + (total >= 25 ? 0 : 5)).toFixed(2)}
                </Heading>
              </Flex>
            </VStack>

            <Button bg="white" color="black" borderRadius="none" size="xl" h="4rem" w="100%" mt={12} textTransform="uppercase" letterSpacing="widest" fontWeight="bold" fontSize="sm" _hover={{ bg: 'yellow.500' }} onClick={handleCheckout}>
              Checkout
            </Button>
          </Box>
        )}

      </Flex>
    </Container>
  );
}
