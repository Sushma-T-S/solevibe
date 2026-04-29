import { useQuery } from '@tanstack/react-query';
import API from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { useCallback } from 'react';

export const fetchProductById = async (productId) => {
  if (!productId) throw new Error('Product ID required');
  
  const response = await API({
    ...SummaryApi.getProduct,
    data: {
      filter: { _id: productId }
    }
  });

  if (!response.data?.success || !response.data?.data?.[0]) {
    throw new Error(response.data?.message || 'Product not found');
  }

  return response.data.data[0];
};

export const useProductById = (productId) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 min
    retry: 1
  });
};

