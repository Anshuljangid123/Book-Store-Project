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
    <Box as="nav" bg="#050505" borderBottom="1px solid" borderColor="whiteAlpha.200" position="sticky" top="0" zIndex="sticky" w="100%">
      <Container maxW="container.xl" py={5} px={{ base: 6, md: 12 }}>
        <Flex justify="space-between" align="center" gap={4}>
          {/* Logo / Brand */}
          <Box fontWeight="500" fontSize="2xl" letterSpacing="widest" textTransform="uppercase" flexShrink={0} color="white">
            <Link href="/">
              BOOK STORE
              <Box as="span" color="yellow.500" fontWeight="bold">.</Box>
            </Link>
          </Box>

          {/* Search Bar */}
          <Flex as="form" onSubmit={handleSearch} flex={1} maxW="500px" mx={8}>
            <Flex w="100%" gap={0} bg="transparent" borderBottom="1px solid" borderColor="whiteAlpha.400" _focusWithin={{ borderColor: 'yelllow.500' }} transition="all 0.2s">
              <Input
                placeholder="Search literature..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                bg="transparent"
                border="none"
                color="white"
                borderRadius="0"
                px={4}
                fontFamily="mono"
                fontSize="sm"
                fontWeight="500"
                _focus={{ boxShadow: 'none' }}
                _placeholder={{ color: 'whiteAlpha.700' }}
              />
              <IconButton
                aria-label="Search"
                type="submit"
                variant="ghost"
                color="whiteAlpha.900"
                _hover={{ color: 'yellow.500', bg: 'transparent' }}
                borderRadius="0"
              >
                <FiSearch />
              </IconButton>
            </Flex>
          </Flex>

          {/* Actions: Cart and Authentication */}
          <Flex gap={6} align="center" flexShrink={0}>
            <Link href="/cart">
              <IconButton aria-label="Cart" variant="ghost" color="white" _hover={{ color: 'yellow.500', bg: 'whiteAlpha.100' }} borderRadius="none">
                <FiShoppingCart size={22} />
              </IconButton>
            </Link>

            {isSignedIn ? (
              <UserButton appearance={{ elements: { avatarBox: "rounded-none" } }} />
            ) : (
              <SignInButton mode="modal">
                <Box 
                  as="button" 
                  bg="transparent" 
                  border="1px solid" 
                  borderColor="yellow.500"
                  color="yellow.500" 
                  px={6} py={2} 
                  borderRadius="none" 
                  fontWeight="medium" 
                  letterSpacing="widest"
                  fontSize="sm"
                  textTransform="uppercase"
                  transition="all 0.3s"
                  _hover={{ bg: 'yellow.500', color: 'black' }}
                >
                  Enter
                </Box>
              </SignInButton>
            )}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
