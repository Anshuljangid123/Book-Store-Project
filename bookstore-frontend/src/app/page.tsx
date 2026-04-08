'use client';

import { Box, Button, Container, Heading, Text, SimpleGrid, Flex, Image, Stack, VStack, HStack, Badge } from '@chakra-ui/react';
import Link from 'next/link';

export default function Home() {
  return (
    <Box bg="gray.50" minH="100vh">
      {/* Hero Section */}
      <Box position="relative" bg="gray.900" color="white" py={{ base: 20, md: 32 }} overflow="hidden">
        {/* Abstract Background Decoration */}
        <Box 
          position="absolute" top="-20%" left="-10%" w="50%" h="150%" 
          bgGradient="radial(blue.600, transparent)" opacity={0.3} filter="blur(80px)" 
        />
        <Box 
          position="absolute" bottom="-20%" right="-10%" w="50%" h="150%" 
          bgGradient="radial(orange.500, transparent)" opacity={0.2} filter="blur(80px)" 
        />

        <Container maxW="container.xl" position="relative" zIndex={1}>
          <Flex direction={{ base: 'column', lg: 'row' }} align="center" justify="space-between" gap={16}>
            
            <Stack flex={1} spacing={8} maxW="2xl">
              <Badge colorScheme="blue" alignSelf="flex-start" px={4} py={1} borderRadius="full" fontSize="sm" fontWeight="bold" textTransform="uppercase" letterSpacing="wider">
                Welcome to the Bookstore
              </Badge>
              <Heading as="h1" size={{ base: "2xl", md: "4xl" }} fontWeight="black" lineHeight="1.1" letterSpacing="tight">
                Discover Your Next <Text as="span" color="orange.400">Great Adventure</Text>
              </Heading>
              <Text fontSize={{ base: "lg", md: "2xl" }} color="gray.300" maxW="lg" lineHeight="1.6">
                Explore thousands of new and gently used books at unbeatable prices. From fiction to rare collectibles, we have it all.
              </Text>
              <HStack spacing={4} pt={4}>
                <Link href="/books">
                  <Button size="lg" height="4rem" px={10} colorScheme="orange" fontSize="lg" borderRadius="full" fontWeight="bold" _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}>
                    Start Browsing
                  </Button>
                </Link>
                <Link href="/cart">
                  <Button size="lg" height="4rem" px={10} variant="outline" color="white" _hover={{ bg: 'whiteAlpha.200' }} borderColor="whiteAlpha.400" fontSize="lg" borderRadius="full" fontWeight="bold">
                    View Cart
                  </Button>
                </Link>
              </HStack>
            </Stack>
            
            {/* Hero Image / Display */}
            <Box flex={1} display={{ base: 'none', lg: 'block' }} position="relative" w="100%">
              <Box 
                 position="relative" p={4} bg="whiteAlpha.100" borderRadius="3xl" 
                 border="1px solid" borderColor="whiteAlpha.300" boxShadow="2xl" backdropFilter="blur(16px)"
                 transform="rotate(3deg)" transition="transform 0.4s" _hover={{ transform: 'rotate(0deg)' }}
              >
                <Image 
                  src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop" 
                  alt="Beautiful Books" 
                  borderRadius="2xl" 
                  w="100%" h="500px" objectFit="cover" 
                  boxShadow="inner"
                />
              </Box>
            </Box>

          </Flex>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={{ base: 20, md: 32 }} bg="white">
        <Container maxW="container.xl">
          <VStack spacing={4} textAlign="center" mb={16}>
            <Heading size="2xl" color="gray.900" fontWeight="extrabold" letterSpacing="tight">
              Why Shop With Us?
            </Heading>
            <Text color="gray.600" fontSize="xl" maxW="2xl">
              We provide the absolute best reading experience. High quality service, affordable prices, and an endless catalog.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} gap={10}>
             {[
               { title: 'Vast Selection', desc: 'Over 1 million titles across all categories.', icon: '📚', color: 'blue' },
               { title: 'Affordable Rates', desc: 'Used books at a fraction of the cost.', icon: '💰', color: 'green' },
               { title: 'Fast Delivery', desc: 'Free shipping on orders over $25.', icon: '⚡', color: 'orange' },
             ].map((feature, i) => (
               <Box 
                 key={i} p={10} borderRadius="2xl" bg="gray.50" 
                 border="1px solid" borderColor="gray.100"
                 transition="all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)" 
                 _hover={{ transform: 'translateY(-10px)', boxShadow: '2xl', borderColor: `${feature.color}.200`, bg: "white" }}
               >
                 <Flex 
                   w={20} h={20} align="center" justify="center" 
                   bg={`${feature.color}.100`} color={`${feature.color}.600`} 
                   borderRadius="2xl" mb={6} fontSize="4xl" boxShadow="sm"
                 >
                   {feature.icon}
                 </Flex>
                 <Heading size="lg" mb={4} color="gray.900">{feature.title}</Heading>
                 <Text color="gray.600" fontSize="lg" lineHeight="tall">{feature.desc}</Text>
               </Box>
             ))}
          </SimpleGrid>
        </Container>
      </Box>
      
    </Box>
  );
}
