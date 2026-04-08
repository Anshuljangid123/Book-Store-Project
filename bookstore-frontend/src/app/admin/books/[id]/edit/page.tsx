'use client';

import { Box, Button, Container, Flex, Heading, Input, Text, Spinner } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';
import api from '@/lib/api';

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    categoryId: '',
    printedPrice: '',
    discountedPrice: '',
    stock: '',
    isUsed: false,
    publishedYear: '',
  });

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const [catsRes, bookRes] = await Promise.all([
          api.get('/categories'),
          api.get(`/books/${id}`)
        ]);
        setCategories(catsRes.data);
        const b = bookRes.data;
        setFormData({
          title: b.title,
          author: b.author,
          categoryId: b.categoryId,
          printedPrice: b.printedPrice.toString(),
          discountedPrice: b.discountedPrice.toString(),
          stock: b.stock.toString(),
          isUsed: b.isUsed,
          publishedYear: b.publishedYear.toString(),
        });
      } catch (e) {
        console.error(e);
        alert('Failed to load book data.');
      } finally {
        setInitLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        printedPrice: parseFloat(formData.printedPrice),
        discountedPrice: parseFloat(formData.discountedPrice),
        stock: parseInt(formData.stock, 10),
        publishedYear: parseInt(formData.publishedYear, 10),
      };
      await api.patch(`/books/${id}`, payload);
      alert('Book updated successfully!');
      router.push('/admin/books');
    } catch (error: any) {
      console.error(error);
      alert('Error updating book: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (initLoading) return <Flex justify="center" p={20}><Spinner size="xl" color="blue.500" /></Flex>;

  return (
    <Container maxW="container.md" py={8}>
      <Button variant="ghost" onClick={() => router.back()} mb={6}>
        <FiArrowLeft /> Back to Inventory
      </Button>

      <Box bg="white" p={8} borderRadius="xl" boxShadow="sm">
        <Heading size="lg" mb={6}>Edit Book details</Heading>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap={5}>
            <Box>
              <Text fontWeight="medium" mb={2}>Book Title</Text>
              <Input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </Box>

            <Box>
              <Text fontWeight="medium" mb={2}>Author</Text>
              <Input required value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} />
            </Box>

            <Flex gap={4} direction={{ base: 'column', sm: 'row' }}>
              <Box flex={1}>
                <Text fontWeight="medium" mb={2}>Printed Price ($)</Text>
                <Input type="number" step="0.01" required value={formData.printedPrice} onChange={(e) => setFormData({ ...formData, printedPrice: e.target.value })} />
              </Box>
              <Box flex={1}>
                <Text fontWeight="medium" mb={2}>Discounted Price ($)</Text>
                <Input type="number" step="0.01" required value={formData.discountedPrice} onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })} />
              </Box>
            </Flex>

            <Flex gap={4} direction={{ base: 'column', sm: 'row' }}>
              <Box flex={1}>
                <Text fontWeight="medium" mb={2}>Stock Available</Text>
                <Input type="number" required value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
              </Box>
              <Box flex={1}>
                <Text fontWeight="medium" mb={2}>Published Year</Text>
                <Input type="number" required value={formData.publishedYear} onChange={(e) => setFormData({ ...formData, publishedYear: e.target.value })} />
              </Box>
            </Flex>

            <Box>
              <Text fontWeight="medium" mb={2}>Category</Text>
              <select 
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: 'white' }}
                value={formData.categoryId} 
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="" disabled>Select a Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </Box>

            <Box display="flex" alignItems="center" gap={3}>
              <input 
                type="checkbox" 
                id="isUsed"
                checked={formData.isUsed} 
                onChange={(e) => setFormData({ ...formData, isUsed: e.target.checked })}
                style={{ width: '18px', height: '18px' }}
              />
              <label htmlFor="isUsed" style={{ fontWeight: '500' }}>This is a Used Book</label>
            </Box>

            <Button type="submit" colorScheme="blue" size="lg" mt={4} disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Save Changes'}
            </Button>
          </Flex>
        </form>
      </Box>
    </Container>
  );
}
