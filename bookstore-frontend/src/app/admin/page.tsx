'use client';

import { Box, Heading, Text, Button, Container, Flex, SimpleGrid } from '@chakra-ui/react';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <Container maxW="container.xl" py={12} px={{ base: 6, md: 12 }}>
      <Box borderBottom="1px solid" borderColor="whiteAlpha.200" pb={8} mb={10}>
        <Heading size="2xl" mb={4} fontWeight="300" letterSpacing="tight">Admin Portal</Heading>
        <Text color="gray.400" fontSize="lg" fontWeight="300" maxW="3xl">
          Secure central command for inventory management, pricing audits, and global catalog ingestion.
        </Text>
      </Box>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={10} maxW="4xl">
        <Box p={8} bg="transparent" border="1px solid" borderColor="whiteAlpha.200" borderRadius="none">
          <Heading size="md" mb={8} fontWeight="500" letterSpacing="widest" textTransform="uppercase" color="yellow.500">
            Catalog Input
          </Heading>
          <Text color="gray.400" mb={8} fontWeight="300">
            Ingest new literature into the global database. Assign categories, prices, and configure metadata fields.
          </Text>
          <Link href="/admin/books/new">
            <Button bg="white" color="black" w="100%" borderRadius="none" textTransform="uppercase" letterSpacing="widest" fontSize="sm" _hover={{ bg: 'yellow.500' }}>
              Add Record
            </Button>
          </Link>
        </Box>

        <Box p={8} bg="transparent" border="1px solid" borderColor="whiteAlpha.200" borderRadius="none">
          <Heading size="md" mb={8} fontWeight="500" letterSpacing="widest" textTransform="uppercase" color="yellow.500">
            Inventory Audit
          </Heading>
          <Text color="gray.400" mb={8} fontWeight="300">
            View the entirety of the database. Hard delete objects, update prices, or adjust stock levels securely.
          </Text>
          <Link href="/admin/books">
            <Button bg="transparent" border="1px solid white" color="white" w="100%" borderRadius="none" textTransform="uppercase" letterSpacing="widest" fontSize="sm" _hover={{ bg: 'white', color: 'black' }}>
              View Database
            </Button>
          </Link>
        </Box>
      </SimpleGrid>
    </Container>
  );
}
