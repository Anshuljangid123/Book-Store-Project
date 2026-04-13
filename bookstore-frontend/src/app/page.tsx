'use client';

import { Box, Button, Container, Heading, Text, SimpleGrid, Flex, Image, Stack, HStack } from '@chakra-ui/react';
import Link from 'next/link';

export default function Home() {
  return (
    <Box bg="#0a0a0a" minH="100vh" color="white">
      {/* Hero Section */}
      <Box position="relative" py={{ base: 20, md: 32 }} overflow="hidden" borderBottom="1px solid" borderColor="whiteAlpha.100">
        <Container maxW="container.xl" position="relative" zIndex={1} px={{ base: 6, md: 12 }}>
          <Flex direction={{ base: 'column', lg: 'row' }} align="center" justify="space-between" gap={20}>
            
            <Stack flex={1} spacing={10} maxW="2xl">
              <Text color="yellow.500" fontSize="sm" fontWeight="bold" textTransform="uppercase" letterSpacing="widest">
                Curated Collection
              </Text>
              
              <Heading as="h1" size={{ base: "3xl", md: "5xl" }} fontWeight="500" lineHeight="1.2" letterSpacing="tight">
                The Standard In <br />
                <Text as="span" fontWeight="bold" color="white">Classic Literature.</Text>
              </Heading>
              
              <Text fontSize={{ base: "lg", md: "xl" }} color="gray.200" maxW="lg" lineHeight="1.8" fontWeight="400">
                Explore an exquisitely curated catalog of antique folios, new releases, and timeless masterpieces.
              </Text>
              
              <HStack spacing={6} pt={6}>
                <Link href="/books">
                  <Button 
                    size="lg" 
                    height="4rem" 
                    px={12} 
                    bg="white" 
                    color="black" 
                    borderRadius="none" 
                    fontWeight="bold" 
                    letterSpacing="widest"
                    textTransform="uppercase"
                    fontSize="sm"
                    transition="all 0.3s"
                    _hover={{ bg: 'yellow.500', color: 'black' }}
                  >
                    View Catalog
                  </Button>
                </Link>
                <Link href="/cart">
                  <Button 
                    size="lg" 
                    height="4rem" 
                    px={12} 
                    bg="transparent" 
                    color="white" 
                    border="1px solid"
                    borderColor="whiteAlpha.400"
                    borderRadius="none" 
                    fontWeight="medium" 
                    letterSpacing="widest"
                    textTransform="uppercase"
                    fontSize="sm"
                    transition="all 0.3s"
                    _hover={{ borderColor: 'white', bg: 'whiteAlpha.100' }}
                  >
                    Your Cart
                  </Button>
                </Link>
              </HStack>
            </Stack>
            
            {/* Hero Image / Display */}
            <Box flex={1} display={{ base: 'none', lg: 'block' }} position="relative" w="100%">
              <Box position="relative">
                <Box 
                  position="absolute"
                  top="-20px"
                  left="-20px"
                  w="100%"
                  h="100%"
                  border="1px solid"
                  borderColor="yellow.500"
                />
                <Image 
                  src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop" 
                  alt="Classic Books" 
                  w="100%" h="600px" objectFit="cover" 
                  filter="grayscale(80%) contrast(120%)"
                  transition="all 0.5s"
                  _hover={{ filter: "grayscale(0%) contrast(100%)", transform: "translate(-5px, -5px)" }}
                />
              </Box>
            </Box>

          </Flex>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={{ base: 20, md: 32 }} bg="#050505">
        <Container maxW="container.xl" px={{ base: 6, md: 12 }}>
          <Box mb={20}>
            <Heading size="3xl" color="white" fontWeight="500" letterSpacing="tight">
              Uncompromising Quality.
            </Heading>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 3 }} gap={0} borderTop="1px solid" borderLeft="1px solid" borderColor="whiteAlpha.200">
             {[
               { title: 'The Store', desc: 'Over 1 million verified titles spanning across five centuries of literature.', num: '01' },
               { title: 'Appraisal', desc: 'Used inventory meticulously checked for spine integrity and page condition.', num: '02' },
               { title: 'Fulfillment', desc: 'Expedited global shipping, packaged securely to protect your investment.', num: '03' },
             ].map((feature, i) => (
               <Box 
                 key={i} p={12} 
                 borderRight="1px solid" borderBottom="1px solid" borderColor="whiteAlpha.200"
                 bg="transparent"
                 transition="background 0.3s"
                 _hover={{ bg: 'whiteAlpha.50' }}
                 group
               >
                 <Text color="yellow.500" fontFamily="mono" fontSize="md" fontWeight="bold" mb={8}>{feature.num}</Text>
                 <Heading size="lg" mb={4} color="white" fontWeight="500">{feature.title}</Heading>
                 <Text color="gray.200" fontSize="md" lineHeight="tall" fontWeight="400">{feature.desc}</Text>
               </Box>
             ))}
          </SimpleGrid>
        </Container>
      </Box>
      
    </Box>
  );
}
