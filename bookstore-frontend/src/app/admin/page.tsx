'use client';

import { Box, Heading, Text, Button } from '@chakra-ui/react';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <Box>
      <Heading size="xl" mb={4}>Welcome to the Admin Portal</Heading>
      <Text color="gray.800" mb={8}>
        Here you can manage the Book Store's inventory, update pricing, and handle incoming resources.
      </Text>
      
      <Box p={6} bg="white" borderRadius="xl" boxShadow="sm" maxW="400px">
        <Heading size="md" mb={4}>Quick Actions</Heading>
        <Link href="/admin/books/new">
          <Button colorScheme="blue" w="100%" mb={3}>Add a New Book</Button>
        </Link>
        <Link href="/admin/books">
          <Button variant="outline" w="100%">View Inventory</Button>
        </Link>
      </Box>
    </Box>
  );
}
