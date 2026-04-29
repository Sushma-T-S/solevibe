import React, { useState, useEffect, useRef } from 'react'
import API from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import Loading from '../components/Loading'
import toast from 'react-hot-toast'
import { HiOutlineCloudUpload, HiOutlineX, HiOutlinePlus, HiOutlineTrash, HiOutlineCheck, HiOutlinePhotograph } from 'react-icons/hi'

// Indian size ranges for footwear
const INDIAN_SIZES = {
  Men: ['6', '7', '8', '9', '10', '11', '12'],
  Women: ['5', '6', '7', '8', '9', '10'],
  Boys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  Girls: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  Kids: ['1', '2', '3', '4', '5', '6']
}

// Common colors
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
  { name: 'Green', hex: '#008000' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Maroon', hex: '#800000' },
  { name: 'Olive', hex: '#808000' },
  { name: 'Cream', hex: '#FFFDD0' },
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Purple', hex: '#800080' }
]

const MATERIALS = [
  'Leather', 'Synthetic', 'Canvas', 'Rubber', 'Mesh', 'Suede', 
  'Patent Leather', 'Faux Leather', 'PU', 'Fabric', 'Neoprene'
]

const UploadProduct = () => {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  
  const [productData, setProductData] = useState({
    name: '',
    sku: '',
    category: '',
    subCategory: '',
    brand: '',
    price: '',
    mrp: '',
    discount: 0,
    description: '',
    material: '',
    tags: '',
    stock: 10,
    unit: 'pair'
  })

  // Color variants with images - THIS IS THE MAIN WAY (Myntra style)
  const [colorVariants, setColorVariants] = useState([
    { color: '', images: [], sizes: [] }
  ])

  // Get available sizes based on category
  const getAvailableSizes = () => {
    if (!productData.category) return INDIAN_SIZES.Men
    return INDIAN_SIZES[productData.category] || INDIAN_SIZES.Men
  }

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

  // Calculate discount percentage
  const calculateDiscount = () => {
    if (productData.mrp && productData.price) {
      const discount = Math.round(((productData.mrp - productData.price) / productData.mrp) * 100)
      setProductData(prev => ({ ...prev, discount: Math.max(0, discount) }))
    }
  }

  // Handle image upload for a specific color variant
  const handleVariantImageUpload = async (e, variantIndex) => {
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
      toast.success(`${newImages.length} image(s) uploaded successfully!`)
    } catch (err) {
      toast.error('Failed to upload images')
    } finally {
      setUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Remove image from variant
  const removeVariantImage = (variantIndex, imageIndex) => {
    const updated = [...colorVariants]
    updated[variantIndex].images = updated[variantIndex].images.filter((_, i) => i !== imageIndex)
    setColorVariants(updated)
  }

  // Handle color variant changes
  const updateColorVariant = (index, field, value) => {
    const updated = [...colorVariants]
    updated[index][field] = value
    setColorVariants(updated)
  }

  // Add new color variant (Myntra style - can add unlimited colors)
  const addColorVariant = () => {
    setColorVariants([...colorVariants, { color: '', images: [], sizes: [] }])
  }

  // Remove color variant
  const removeColorVariant = (index) => {
    if (colorVariants.length > 1) {
      const updated = colorVariants.filter((_, i) => i !== index)
      setColorVariants(updated)
    }
  }

  // Toggle size for a variant
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
    
    // Validation
    if (!productData.name.trim()) {
      toast.error('Please enter product name')
      return
    }
    if (!productData.category) {
      toast.error('Please select category')
      return
    }
    if (!productData.brand) {
      toast.error('Please select brand')
      return
    }
    if (!productData.price) {
      toast.error('Please enter selling price')
      return
    }

    // Check if at least one color variant with images exists
    const validVariants = colorVariants.filter(v => v.color && v.images.length > 0)
    if (validVariants.length === 0) {
      toast.error('Please add at least one color with images')
      return
    }

    // Check if all variants have sizes
    const variantsWithoutSizes = validVariants.filter(v => !v.sizes || v.sizes.length === 0)
    if (variantsWithoutSizes.length > 0) {
      toast.error('Please select sizes for all colors')
      return
    }

    setLoading(true)
    try {
      // Collect all images from all variants
      const allImages = validVariants
        .flatMap(v => v.images)

      // First image becomes the main product image
      const mainImage = allImages[0] || ''

      const variants = validVariants.map(v => ({
        color: v.color,
        images: v.images,
        sizes: v.sizes.map(size => ({ size, stock: productData.stock || 10 }))
      }))

      const submitData = {
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
        image: allImages, // All variant images
        stock: productData.stock,
        variants: variants
      }

      const res = await API({
        url: SummaryApi.createProduct.url,
        method: SummaryApi.createProduct.method,
        data: submitData
      })
      
      if (res.data.success) {
        toast.success('Product created successfully!')
        // Reset form
        setProductData({
          name: '', sku: '', category: '', subCategory: '', brand: '',
          price: '', mrp: '', discount: 0, description: '',
          material: '', tags: '', stock: 10, unit: 'pair'
        })
        setColorVariants([{ color: '', images: [], sizes: [] }])
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  // Filter subcategories by selected category
  const filteredSubCategories = subCategories.filter(sub => {
    const subCatIds = sub.category?.map(c => c._id || c) || []
    return subCatIds.includes(productData.category)
  })

  // Calculate final price preview
  const finalPrice = productData.mrp 
    ? Math.round(productData.mrp - (productData.mrp * productData.discount / 100))
    : productData.price

  // Get total images uploaded
  const totalImages = colorVariants.reduce((sum, v) => sum + (v.images?.length || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Upload Product</h1>
            <p className="text-sm text-slate-600">Add colors and upload multiple images for each color</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
              ✓ Cloudinary Connected
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={productData.name}
                onChange={(e) => setProductData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Nike Air Zoom Pegasus 40"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition text-base"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                SKU / Product Code
              </label>
              <input
                type="text"
                value={productData.sku}
                onChange={(e) => setProductData(prev => ({ ...prev, sku: e.target.value }))}
                placeholder="Auto-generated if empty"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline"
              />
            </div>

           -none transition text-base <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Material
              </label>
              <select
                value={productData.material}
                onChange={(e) => setProductData(prev => ({ ...prev, material: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition text-base"
              >
                <option value="">Select material</option>
                {MATERIALS.map(mat => (
                  <option key={mat} value={mat}>{mat}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Description
              </label>
              <textarea
                value={productData.description}
                onChange={(e) => setProductData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe product features, comfort, style..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition text-base resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={productData.tags}
                onChange={(e) => setProductData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="e.g., sports, running, comfortable"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition text-base"
              />
            </div>
          </div>
        </div>

        {/* Category & Brand */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
            Category & Brand <span className="text-red-500">*</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={productData.category}
                onChange={(e) => setProductData(prev => ({ ...prev, category: e.target.value, subCategory: '' }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition text-base"
                required
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Subcategory
              </label>
              <select
                value={productData.subCategory}
                onChange={(e) => setProductData(prev => ({ ...prev, subCategory: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition text-base"
                disabled={!productData.category}
              >
                <option value="">Select subcategory</option>
                {filteredSubCategories.map(sub => (
                  <option key={sub._id} value={sub._id}>{sub.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Brand <span className="text-red-500">*</span>
              </label>
              <select
                value={productData.brand}
                onChange={(e) => setProductData(prev => ({ ...prev, brand: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition text-base"
                required
              >
                <option value="">Select brand</option>
                {brands.map(brand => (
                  <option key={brand._id} value={brand._id}>{brand.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
            Pricing
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                MRP (₹)
              </label>
              <input
                type="number"
                value={productData.mrp}
                onChange={(e) => setProductData(prev => ({ ...prev, mrp: e.target.value }))}
                onBlur={calculateDiscount}
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Selling Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={productData.price}
                onChange={(e) => setProductData(prev => ({ ...prev, price: e.target.value }))}
                onBlur={calculateDiscount}
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition text-base"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Discount (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={productData.discount}
                  onChange={(e) => setProductData(prev => ({ ...prev, discount: Number(e.target.value) }))}
                  placeholder="0"
                  className="w-full px-4 py-3 pr-8 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition text-base"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Final Price (₹)
              </label>
              <div className="w-full px-4 py-3 rounded-xl bg-orange-50 text-orange-700 font-bold text-lg">
                ₹{finalPrice || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Color Variants - Myntra Style - THE MAIN WAY */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
                Colors & Images <span className="text-red-500">*</span>
              </h2>
              <p className="text-sm text-slate-500 mt-1">Add colors and upload multiple images for each color (like Myntra)</p>
            </div>
            <div className="text-sm text-slate-500">
              Total: {totalImages} images
            </div>
          </div>

          <div className="space-y-6">
            {colorVariants.map((variant, vIndex) => (
              <div key={vIndex} className="border-2 border-slate-200 rounded-xl p-5 bg-slate-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Color <span className="text-red-500">*</span></label>
                      <select
                        value={variant.color}
                        onChange={(e) => updateColorVariant(vIndex, 'color', e.target.value)}
                        className="px-4 py-2 rounded-lg border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition text-base min-w-[150px]"
                      >
                        <option value="">Select color</option>
                        {COMMON_COLORS.map(c => (
                          <option key={c.name} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    {variant.color && (
                      <div 
                        className="w-10 h-10 rounded-full border-2 border-slate-300"
                        style={{ backgroundColor: COMMON_COLORS.find(c => c.name === variant.color)?.hex || '#ccc' }}
                      />
                    )}
                  </div>
                  {colorVariants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeColorVariant(vIndex)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <HiOutlineTrash className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Sizes */}
                {productData.category && variant.color && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Select Sizes <span className="text-red-500">*</span>:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {getAvailableSizes().map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSize(vIndex, size)}
                          className={`px-4 py-2 rounded-lg border transition ${
                            variant.sizes?.includes(size)
                              ? 'bg-orange-500 text-white border-orange-500'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-orange-400'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    {variant.sizes?.length > 0 && (
                      <p className="text-xs text-green-600 mt-1">✓ {variant.sizes.length} sizes selected</p>
                    )}
                  </div>
                )}

                {/* Image Upload for Variant - Myntra Style */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Upload Images for {variant.color || 'this color'} <span className="text-red-500">*</span> 
                    <span className="text-slate-400 font-normal">(Select multiple images)</span>
                  </label>
                  
                  {/* Image Preview Grid */}
                  {variant.images?.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-3">
                      {variant.images.map((img, i) => (
                        <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-slate-100 border-2 border-slate-200">
                          <img src={img} alt={`${variant.color} ${i + 1}`} className="w-full h-full object-cover" />
                          {i === 0 && (
                            <div className="absolute top-1 left-1 bg-orange-500 text-white text-xs px-2 py-0.5 rounded font-bold">
                              MAIN
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeVariantImage(vIndex, i)}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <HiOutlineX className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Button */}
                  <label className="flex items-center justify-center border-2 border-dashed border-orange-300 bg-orange-50 rounded-xl p-4 cursor-pointer hover:bg-orange-100 transition">
                    <HiOutlineCloudUpload className="w-6 h-6 text-orange-500 mr-2" />
                    <span className="text-sm text-orange-600 font-medium">
                      Click to upload multiple images for {variant.color || 'this color'}
                    </span>
                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple
                      accept="image/*"
                      onChange={(e) => handleVariantImageUpload(e, vIndex)}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  
                  {uploading && (
                    <div className="mt-2 flex items-center justify-center gap-2 text-orange-600">
                      <div className="w-4 h-4 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin"></div>
                      <span>Uploading...</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Another Color */}
          <button
            type="button"
            onClick={addColorVariant}
            className="mt-4 w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-medium hover:border-orange-400 hover:text-orange-500 transition flex items-center justify-center gap-2"
          >
            <HiOutlinePlus className="w-5 h-5" />
            Add Another Color
          </button>
        </div>

        {/* Stock */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
            Inventory (Per Size)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Stock Quantity (for each size)
              </label>
              <input
                type="number"
                value={productData.stock}
                onChange={(e) => setProductData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                placeholder="10"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Unit
              </label>
              <select
                value={productData.unit}
                onChange={(e) => setProductData(prev => ({ ...prev, unit: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition text-base"
              >
                <option value="pair">Pair</option>
                <option value="piece">Piece</option>
                <option value="set">Set</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-lg"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              <>
                <HiOutlineCheck className="w-6 h-6" />
                Create Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UploadProduct

