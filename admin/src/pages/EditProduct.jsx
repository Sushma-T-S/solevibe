import React, { useState, useEffect } from 'react'
import API from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import Loading from '../components/Loading'
import toast from 'react-hot-toast'
import { HiOutlineCloudUpload, HiOutlineX, HiOutlinePlus, HiOutlineTrash, HiOutlineCheck, HiOutlinePhotograph } from 'react-icons/hi'

const INDIAN_SIZES = {
  Men: ['6', '7', '8', '9', '10', '11', '12'],
  Women: ['5', '6', '7', '8', '9', '10'],
  Boys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  Girls: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  Kids: ['1', '2', '3', '4', '5', '6']
}

const COMMON_COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Navy Blue', hex: '#000080' },
  { name: 'Blue', hex: '#0066CC' },
  { name: 'Red', hex: '#CC0000' },
  { name: 'Grey', hex: '#808080' },
  { name: 'Brown', hex: '#8B4513' },
  { name: 'Tan', hex: '#D2B48C' },
  { name: 'Pink', hex: '#FF69B4' },
  { name: 'Gold', hex: '#FFD700' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Green', hex: '#008000' }
]

const MATERIALS = [
  'Leather', 'Synthetic', 'Canvas', 'Rubber', 'Mesh', 'Suede', 
  'Patent Leather', 'Faux Leather', 'PU', 'Fabric', 'Neoprene'
]

const EditProduct = ({ product, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [uploading, setUploading] = useState(false)
  
  const [productData, setProductData] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    category: product?.category?.[0] || '',
    subCategory: product?.subCategory?.[0] || '',
    brand: product?.brand || product?.more_details?.brand || '',
    price: product?.price || '',
    mrp: product?.mrp || '',
    discount: product?.discount || 0,
    description: product?.description || '',
    material: product?.more_details?.material || '',
    tags: product?.more_details?.tags || '',
    stock: product?.stock || 0,
    unit: product?.unit || 'pair'
  })

  const [colorVariants, setColorVariants] = useState(() => {
    if (product?.variants?.length > 0) {
      return product.variants.map(v => ({
        color: v.color,
        images: v.images || [],
        sizes: v.sizes?.map(s => s.size) || []
      }))
    }
    return [{ color: '', images: product?.image || [], sizes: [] }]
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [catRes, subRes, brandRes] = await Promise.all([
        API(SummaryApi.getCategory),
        API(SummaryApi.getSubCategory),
        API(SummaryApi.getBrand)
      ])
      
      if (catRes.data.success) setCategories(catRes.data.data || [])
      if (subRes.data.success) setSubCategories(subRes.data.data || [])
      if (brandRes.data.success) setBrands(brandRes.data.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const getAvailableSizes = () => {
    if (!productData.category) return INDIAN_SIZES.Men
    return INDIAN_SIZES[productData.category] || INDIAN_SIZES.Men
  }

  const calculateDiscount = () => {
    if (productData.mrp && productData.price) {
      const discount = Math.round(((productData.mrp - productData.price) / productData.mrp) * 100)
      setProductData(prev => ({ ...prev, discount: Math.max(0, discount) }))
    }
  }

  const updateColorVariant = (index, field, value) => {
    const updated = [...colorVariants]
    updated[index][field] = value
    setColorVariants(updated)
  }

  const addColorVariant = () => {
    setColorVariants([...colorVariants, { color: '', images: [], sizes: [] }])
  }

  const removeColorVariant = (index) => {
    if (colorVariants.length > 1) {
      const updated = colorVariants.filter((_, i) => i !== index)
      setColorVariants(updated)
    }
  }

  const handleImageUpload = async (e, variantIndex) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)
    try {
      const newImages = []
      
      for (const file of files) {
        const formData = new FormData()
        formData.append('image', file)
        
        const res = await API({
          url: SummaryApi.uploadImage.url,
          method: SummaryApi.uploadImage.method,
          data: formData
        })
        
        if (res.data.success) {
          newImages.push(res.data.data.url)
        }
      }
      
      const updated = [...colorVariants]
      updated[variantIndex].images = [...updated[variantIndex].images, ...newImages]
      setColorVariants(updated)
      toast.success('Images uploaded successfully')
    } catch (err) {
      toast.error('Failed to upload images')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (variantIndex, imageIndex) => {
    const updated = [...colorVariants]
    updated[variantIndex].images = updated[variantIndex].images.filter((_, i) => i !== imageIndex)
    setColorVariants(updated)
  }

  const toggleSize = (variantIndex, size) => {
    const updated = [...colorVariants]
    const currentSizes = updated[variantIndex].sizes || []
    
    if (currentSizes.includes(size)) {
      updated[variantIndex].sizes = currentSizes.filter(s => s !== size)
    } else {
      updated[variantIndex].sizes = [...currentSizes, size]
    }
    
    setColorVariants(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!productData.name.trim()) {
      toast.error('Please enter product name')
      return
    }
    if (!productData.category) {
      toast.error('Please select category')
      return
    }
    if (!productData.price) {
      toast.error('Please enter selling price')
      return
    }

    setLoading(true)
    try {
      const allImages = colorVariants
        .filter(v => v.images.length > 0)
        .flatMap(v => v.images)

      const variants = colorVariants
        .filter(v => v.color && v.images.length > 0)
        .map(v => ({
          color: v.color,
          images: v.images,
          sizes: v.sizes.map(size => ({ size, stock: productData.stock || 10 }))
        }))

      const submitData = {
        _id: product._id,
        name: productData.name,
        sku: productData.sku || `${productData.brand}-${Date.now()}`,
        category: [productData.category],
        subCategory: productData.subCategory ? [productData.subCategory] : [],
        brand: productData.brand,
        price: Number(productData.price),
        mrp: productData.mrp ? Number(productData.mrp) : Number(productData.price),
        discount: productData.discount || 0,
        description: productData.description,
        more_details: {
          material: productData.material,
          tags: productData.tags,
          unit: productData.unit
        },
        image: allImages,
        stock: productData.stock,
        variants: variants
      }

      const res = await API({
        url: SummaryApi.updateProduct.url,
        method: SummaryApi.updateProduct.method,
        data: submitData
      })
      
      if (res.data.success) {
        toast.success('Product updated successfully!')
        onSuccess()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update product')
    } finally {
      setLoading(false)
    }
  }

  const filteredSubCategories = subCategories.filter(sub => {
    const subCatIds = sub.category?.map(c => c._id || c) || []
    return subCatIds.includes(productData.category)
  })

  const finalPrice = productData.mrp 
    ? Math.round(productData.mrp - (productData.mrp * productData.discount / 100))
    : productData.price

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Edit Product</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Basic Information */}
          <div className="bg-slate-50 rounded-xl p-4">
            <h3 className="font-semibold text-slate-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={productData.name}
                  onChange={(e) => setProductData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                <input
                  type="text"
                  value={productData.sku}
                  onChange={(e) => setProductData(prev => ({ ...prev, sku: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Material</label>
                <select
                  value={productData.material}
                  onChange={(e) => setProductData(prev => ({ ...prev, material: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                >
                  <option value="">Select material</option>
                  {MATERIALS.map(mat => <option key={mat} value={mat}>{mat}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={productData.description}
                  onChange={(e) => setProductData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
                <input
                  type="text"
                  value={productData.tags}
                  onChange={(e) => setProductData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="comma separated"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Category & Brand */}
          <div className="bg-slate-50 rounded-xl p-4">
            <h3 className="font-semibold text-slate-900 mb-4">Category & Brand</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={productData.category}
                  onChange={(e) => setProductData(prev => ({ ...prev, category: e.target.value, subCategory: '' }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subcategory</label>
                <select
                  value={productData.subCategory}
                  onChange={(e) => setProductData(prev => ({ ...prev, subCategory: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
                  disabled={!productData.category}
                >
                  <option value="">Select subcategory</option>
                  {filteredSubCategories.map(sub => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Brand</label>
                <select
                  value={productData.brand}
                  onChange={(e) => setProductData(prev => ({ ...prev, brand: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
                >
                  <option value="">Select brand</option>
                  {brands.map(brand => <option key={brand._id} value={brand._id}>{brand.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-slate-50 rounded-xl p-4">
            <h3 className="font-semibold text-slate-900 mb-4">Pricing</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">MRP (₹)</label>
                <input
                  type="number"
                  value={productData.mrp}
                  onChange={(e) => setProductData(prev => ({ ...prev, mrp: e.target.value }))}
                  onBlur={calculateDiscount}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Selling Price (₹)</label>
                <input
                  type="number"
                  value={productData.price}
                  onChange={(e) => setProductData(prev => ({ ...prev, price: e.target.value }))}
                  onBlur={calculateDiscount}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Discount (%)</label>
                <input
                  type="number"
                  value={productData.discount}
                  onChange={(e) => setProductData(prev => ({ ...prev, discount: Number(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Final Price (₹)</label>
                <div className="w-full px-3 py-2 rounded-lg bg-slate-200 font-semibold">
                  ₹{finalPrice || 0}
                </div>
              </div>
            </div>
          </div>

          {/* Color Variants */}
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Color Variants</h3>
              <button
                type="button"
                onClick={addColorVariant}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700"
              >
                <HiOutlinePlus className="w-4 h-4" /> Add Color
              </button>
            </div>

            <div className="space-y-4">
              {colorVariants.map((variant, vIndex) => (
                <div key={vIndex} className="border border-slate-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <select
                        value={variant.color}
                        onChange={(e) => updateColorVariant(vIndex, 'color', e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm"
                      >
                        <option value="">Select color</option>
                        {COMMON_COLORS.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                      </select>
                      {variant.color && (
                        <div 
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: COMMON_COLORS.find(c => c.name === variant.color)?.hex }}
                        />
                      )}
                    </div>
                    {colorVariants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeColorVariant(vIndex)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Sizes */}
                  <div className="mb-3">
                    <label className="text-xs font-medium text-slate-600 mb-1 block">Sizes:</label>
                    <div className="flex flex-wrap gap-1">
                      {getAvailableSizes().map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSize(vIndex, size)}
                          className={`px-2 py-1 text-xs rounded border ${
                            variant.sizes?.includes(size)
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-slate-600 border-slate-200'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Images */}
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">Images:</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {variant.images.map((img, i) => (
                        <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(vIndex, i)}
                            className="absolute top-0.5 right-0.5 p-0.5 bg-red-600 text-white rounded-full"
                          >
                            <HiOutlineX className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <label className="flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg py-2 cursor-pointer hover:border-indigo-400 text-sm text-slate-500">
                      <HiOutlineCloudUpload className="w-4 h-4 mr-1" />
                      Upload
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, vIndex)}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stock */}
          <div className="bg-slate-50 rounded-xl p-4">
            <h3 className="font-semibold text-slate-900 mb-4">Inventory</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Stock (per size)</label>
                <input
                  type="number"
                  value={productData.stock}
                  onChange={(e) => setProductData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
                <select
                  value={productData.unit}
                  onChange={(e) => setProductData(prev => ({ ...prev, unit: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
                >
                  <option value="pair">Pair</option>
                  <option value="piece">Piece</option>
                  <option value="set">Set</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loading /> : <><HiOutlineCheck className="w-4 h-4" /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProduct

