'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Box, Flex, Spinner, Heading, Text, Button } from '@chakra-ui/react';
import Link from 'next/link';
import { FiHome, FiBook, FiSettings } from 'react-icons/fi';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <Flex h="100vh" align="center" justify="center">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  if (!isSignedIn) return null;

  if (user?.publicMetadata?.role !== 'ADMIN') {
    return (
      <Flex h="100vh" direction="column" align="center" justify="center" p={8} bg="red.50">
        <Heading color="red.600" mb={4}>Access Denied</Heading>
        <Text color="gray.700" mb={2}>We are not detecting the ADMIN role on your active session.</Text>
        <Box bg="white" p={4} borderRadius="md" border="1px" borderColor="gray.300" w="100%" maxW="lg">
          <Text fontWeight="bold">What Clerk sees your public metadata as RIGHT NOW:</Text>
          <pre style={{ background: '#eee', padding: '10px', marginTop: '10px', borderRadius: '4px' }}>
            {JSON.stringify(user.publicMetadata, null, 2)}
          </pre>
        </Box>
        <Button mt={6} onClick={() => router.push('/')}>Return Home</Button>
      </Flex>
    );
  }

  return (
    <Flex minH="calc(100vh - 72px)">
      {/* Admin Sidebar */}
      <Box w="250px" bg="gray.800" color="white" p={6} flexShrink={0}>
        <Heading size="md" mb={8} color="blue.300">Admin Portal</Heading>
        <Flex direction="column" gap={4}>
          <Link href="/admin">
            <Button w="100%" justifyContent="flex-start" variant="ghost" colorScheme="blue" style={{ color: 'white' }}>
              <Box mr={3}><FiHome /></Box> Dashboard
            </Button>
          </Link>
          <Link href="/admin/books">
            <Button w="100%" justifyContent="flex-start" variant="ghost" colorScheme="blue" style={{ color: 'white' }}>
              <Box mr={3}><FiBook /></Box> Manage Books
            </Button>
          </Link>
        </Flex>
      </Box>

      {/* Main Admin Content Area */}
      <Box flex={1} bg="gray.50" p={8}>
        {children}
      </Box>
    </Flex>
  );
}
