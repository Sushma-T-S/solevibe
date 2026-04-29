import { useState, useEffect, useCallback } from 'react';
import Axios from '../utils/Axios';
import { toast } from 'react-hot-toast';

const useProductImage = (productIds) => {
  const [imageMap, setImageMap] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchBulkImages = useCallback(async (ids) => {
    if (!ids || ids.length === 0) return;

    setLoading(true);
    try {
      const response = await Axios.post('/api/product/get-product-details-bulk', { productIds: ids });
      const newMap = {};
      response.data.data.forEach(product => {
        if (product.image && product.image[0]) {
          newMap[product._id] = product.image[0].replace(/\/upload\/(v\\d+)?\//, '/upload/w_80,h_80,c_fill,f_auto,fl_lossy/');
        }
      });
      setImageMap(prev => ({ ...prev, ...newMap }));
    } catch (error) {
      console.error('Bulk product images fetch failed:', error);
      toast.error('Failed to fetch some product images');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const missingIds = productIds.filter(id => !imageMap[id]);
    if (missingIds.length > 0) {
      fetchBulkImages(missingIds);
    }
  }, [productIds, imageMap, fetchBulkImages]);

  const getImage = useCallback((productId, fallback = null) => {
    return imageMap[productId] || fallback;
  }, [imageMap]);

  return { getImage, imageMap, loading };
};

export default useProductImage;

