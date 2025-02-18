import { useApiQuery } from '@/hooks/useApi'
import { Product } from '../types';
import { endpoints } from '@/services/api';

export function useProducts(categoryFilter?: string | null, priceRange?: [number, number] | null) {
  return useApiQuery<Product[]>(
    ['products', { category: categoryFilter, priceRange }],
    () => endpoints.products.getAll().then(res => res.data)
  );
} 