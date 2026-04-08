'use client';

import { Flex, Box, Input, Container, IconButton } from '@chakra-ui/react';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiShoppingCart, FiSearch } from 'react-icons/fi';
import { useState } from 'react';

export default function Navbar() {
  const [search, setSearch] = useState('');
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/books?title=${encodeURIComponent(search.trim())}`);
    } else {
      router.push('/books');
    }
  };

  return (
    <Box as="nav" bg="white" boxShadow="sm" position="sticky" top="0" zIndex="sticky" w="100%">
      <Container maxW="container.xl" py={4}>
        <Flex justify="space-between" align="center" gap={4}>
          {/* Logo / Brand */}
          <Box fontWeight="bold" fontSize="xl" flexShrink={0} color="blue.600">
            <Link href="/">📚 BookStore</Link>
          </Box>

          {/* Search Bar */}
          <Flex as="form" onSubmit={handleSearch} flex={1} maxW="600px">
            <Flex w="100%" gap={2}>
              <Input
                placeholder="Search by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                bg="gray.50"
                borderRadius="md"
              />
              <IconButton
                aria-label="Search"
                type="submit"
              >
                <FiSearch />
              </IconButton>
            </Flex>
          </Flex>

          {/* Actions: Cart and Authentication */}
          <Flex gap={4} align="center" flexShrink={0}>
            <Link href="/cart">
              <IconButton aria-label="Cart" variant="ghost">
                <FiShoppingCart size={20} />
              </IconButton>
            </Link>

            {isSignedIn ? (
              <UserButton />
            ) : (
              <SignInButton mode="modal">
                <Box as="button" bg="blue.600" color="white" px={4} py={2} borderRadius="md" fontWeight="medium" _hover={{ bg: 'blue.700' }}>
                  Sign In
                </Box>
              </SignInButton>
            )}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
