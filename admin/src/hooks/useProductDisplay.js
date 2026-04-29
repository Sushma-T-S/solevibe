import { useMemo } from 'react';

// Pure function version - extracted from hook logic, safe for bulk computation
export const getProductDisplay = (product) => {
  // Helper to safely get nested object name
  const getName = (ref) => {
    if (!ref) return '-';
    if (typeof ref === 'string') return '-';
    if (Array.isArray(ref) && ref.length > 0) {
      const item = ref[0];
      return (typeof item === 'object' && item?.name) ? item.name : 'Assigned';
    }
    return (typeof ref === 'object' && ref?.name) ? ref.name : 'Assigned';
  };

  // Get colors from variants or fallback
  const getColors = (prod) => {
    if (prod.variants?.length > 0) {
      return prod.variants.map(v => v.color).join(', ');
    }
    return prod.more_details?.color || '-';
  };

  // Get sizes from variants or fallback
  const getSizes = (prod) => {
    if (prod.variants?.length > 0) {
      const sizes = prod.variants.flatMap(v => v.sizes?.map(s => s.size) || []);
      return [...new Set(sizes)].join(', ');
    }
    return '-';
  };

  return {
    categoryName: getName(product.category),
    subCategoryName: getName(product.subCategory),
    brandName: getName(product.brand),
    colors: getColors(product),
    sizes: getSizes(product),
  };
};

// Original hook for backward compatibility (single product use, e.g. modals)
export const useProductDisplay = (product) => useMemo(() => getProductDisplay(product), [product]);

export default useProductDisplay;

