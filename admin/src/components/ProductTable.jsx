import React, { memo, useMemo } from 'react'
import { FaStar } from 'react-icons/fa'
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi'
import { getProductDisplay } from '../hooks/useProductDisplay';

const placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0zMCAzMEg5OFYzMFoiIGZpbGw9IiM5OTk5OTkiLz4KPHRleHQgeD0iNjQiIHk9IjcwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pgo8L3N2Zz4=';

const ProductRow = ({ product, display, onEdit, onView, onDelete }) => {
  // DEBUG
  console.log('Product image data:', product._id, product.name, product.image);
  const imgSrc = product.image?.[0];
  console.log('Using imgSrc:', imgSrc);

  const displayData = display || getProductDisplay(product);
  const { categoryName, subCategoryName, brandName, colors, sizes } = displayData;

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-4 py-4">
        <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shadow-sm">
          <img 
            src={product.image?.[0] ? product.image[0].replace(/\/upload\/(v\d+)?\//, '/upload/w_100,h_100,c_fill,f_auto/') : placeholder}
            alt={product.name || 'Product image'}
            className="w-full h-full object-cover" 
            loading="lazy"
            onError={(e) => {
              e.target.src = placeholder;
              e.target.alt = 'Image not available';
            }}
          />
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="max-w-[200px]">
          <p className="font-semibold text-slate-900 text-sm leading-tight" title={product.name}>{product.name}</p>
          <p className="text-xs text-slate-500 mt-1">SKU: {product.sku || 'N/A'}</p>
        </div>
      </td>
      <td className="px-4 py-4">
        <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
          {categoryName}
        </span>
      </td>
      <td className="px-4 py-4">
        <span className="text-sm text-slate-700 font-medium">
          {subCategoryName}
        </span>
      </td>
      <td className="px-4 py-4">
        <span className="text-sm text-slate-700 font-medium">
          {brandName}
        </span>
      </td>
      <td className="px-4 py-4">
        <span className="text-sm text-slate-700">
          {product.more_details?.material || 'N/A'}
        </span>
      </td>
      <td className="px-4 py-4 max-w-[120px]">
        <span className="text-xs text-slate-600 truncate block">
          {colors}
        </span>
      </td>
      <td className="px-4 py-4 max-w-[100px]">
        <span className="text-xs text-slate-600 truncate block">
          {sizes}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="space-y-1">
          <p className="font-bold text-lg text-slate-900 leading-tight">₹{product.price}</p>
          {product.mrp && product.mrp > product.price && (
            <p className="text-xs text-slate-500 line-through">₹{product.mrp}</p>
          )}
          {product.discount > 0 && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              {product.discount}% off
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-4">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          product.stock > 0 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {product.stock}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-1">
          {product.avgRating > 0 ? (
            Array.from({ length: 5 }, (_, i) => (
              <FaStar
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.avgRating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : i < product.avgRating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))
          ) : (
            <span className="text-sm text-slate-500 font-medium">No ratings</span>
          )}
          {product.totalReviews > 0 && (
            <span className="text-xs text-slate-600 ml-2">({product.totalReviews})</span>
          )}
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onView(product)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
            title="View"
          >
            <HiOutlineEye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(product)}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            title="Edit"
          >
            <HiOutlinePencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Delete"
          >
            <HiOutlineTrash className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}

// Memoize ProductRow for performance
const MemoProductRow = memo(ProductRow);

const ProductTable = memo(({ products, loading, onEdit, onView, onDelete }) => {
  // Precompute ALL display data once (major perf win for large lists)
  const processedProducts = useMemo(() => 
    products
      .filter(product => product && product._id)
      .map(product => ({
        product,
        display: getProductDisplay(product)
      })), 
  [products]
  );

  if (loading) {
    return (
      <tr>
        <td colSpan={12} className="px-4 py-12 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="text-slate-500">Loading products...</p>
          </div>
        </td>
      </tr>
    )
  }

  if (processedProducts.length === 0) {
    return (
      <tr>
        <td colSpan={12} className="px-4 py-12 text-center">
          <div className="text-slate-500">
            {products.length === 0 ? 'No products found' : 'Invalid products filtered'}
          </div>
        </td>
      </tr>
    )
  }

  return processedProducts.map(({ product, display }, index) => (
    <MemoProductRow 
      key={product._id || index} 
      product={product}
      display={display}
      onEdit={onEdit}
      onView={onView}
      onDelete={onDelete}
    />
  ))
})

ProductTable.displayName = 'ProductTable'

export default ProductTable

