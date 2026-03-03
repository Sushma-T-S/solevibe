import React, { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import uploadImage from "../utils/UploadImage";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { SET_ALL_BRAND } from "../store/productSlice";


const defaultSizes = ["5", "6", "7", "8", "9", "10", "11", "12"];

const createEmptyVariant = () => ({
  color: "",
  images: [],
  sizes: defaultSizes.map((s) => ({ size: s, stock: 0 })),
});

const sumVariantStock = (variants) =>
  (variants || []).reduce((total, v) => {
    const vSum = (v?.sizes || []).reduce((t, s) => t + (Number(s.stock) || 0), 0);
    return total + vSum;
  }, 0);

const getId = (v) => (typeof v === "string" ? v : v?._id);

const getSubCategoryCategoryIds = (sub) => {
  const raw = sub?.category;
  if (!raw) return [];
  const arr = Array.isArray(raw) ? raw : [raw];
  return arr.map(getId).filter(Boolean);
};

const getStockTone = (stock) => {
  const n = Number(stock) || 0;
  if (n <= 0) return "border-slate-200 bg-slate-50";
  if (n < 5) return "border-amber-200 bg-amber-50";
  return "border-emerald-200 bg-emerald-50";
};

const UploadProduct = () => {
  useEffect(() => {
  const fetchBrand = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getBrand
      });

      if (response.data.success) {
        dispatch(SET_ALL_BRAND(response.data.data));
      }

    } catch (error) {
      console.log("Brand fetch error:", error);
    }
  };

  fetchBrand();
}, []);
  const allBrand = useSelector((state) => state.product.allBrand);
  const dispatch = useDispatch();
  console.log("Brand List:", allBrand);
  const allCategory = useSelector((state) => state.product.allCategory);
  const allSubCategory = useSelector((state) => state.product.allSubCategory);

  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    unit: "pair",
    category: [],
    subCategory: [],
    image: [],
    more_details: {
      brand: "",
      gender: "",
    },
  });

  const [variants, setVariants] = useState([createEmptyVariant()]);
  const computedStock = useMemo(() => sumVariantStock(variants), [variants]);

  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");

  const selectedCategoryIds = useMemo(
    () => (data.category || []).map(getId).filter(Boolean),
    [data.category]
  );

  const filteredSubCategoryOptions = useMemo(() => {
    if (!selectedCategoryIds.length) return [];
    return (allSubCategory || []).filter((sub) => {
      const subCatIds = getSubCategoryCategoryIds(sub);
      return subCatIds.some((id) => selectedCategoryIds.includes(id));
    });
  }, [allSubCategory, selectedCategoryIds]);

  const addVariant = () => setVariants((prev) => [...prev, createEmptyVariant()]);
  const removeVariant = (idx) => setVariants((prev) => prev.filter((_, i) => i !== idx));

  const updateVariant = (idx, patch) => {
    setVariants((prev) => prev.map((v, i) => (i === idx ? { ...v, ...patch } : v)));
  };

  const updateVariantSizeStock = (variantIdx, sizeIdx, value) => {
    setVariants((prev) =>
      prev.map((v, i) => {
        if (i !== variantIdx) return v;
        const sizes = (v.sizes || []).map((s, si) =>
          si === sizeIdx ? { ...s, stock: Math.max(0, Number(value || 0)) } : s
        );
        return { ...v, sizes };
      })
    );
  };

  const handleUploadMainImages = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setImageUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const res = await uploadImage(file, "products");
        if (res?.success && res?.data) uploaded.push(res.data);
        else throw new Error(res?.message || "Image upload failed");
      }
      setData((p) => ({ ...p, image: [...p.image, ...uploaded] }));
      toast.success("Images uploaded");
    } catch (err) {
      toast.error(err.message || "Image upload failed");
    } finally {
      setImageUploading(false);
      e.target.value = "";
    }
  };

  const removeMainImage = (idx) => {
    setData((p) => ({ ...p, image: p.image.filter((_, i) => i !== idx) }));
  };

  const validate = () => {
    const next = {};
    if (!data.name.trim()) next.name = "Product name is required";
    if (!data.description.trim()) next.description = "Description is required";
    if (!data.price || Number(data.price) <= 0) next.price = "Enter a valid price";
    if (!data.unit.trim()) next.unit = "Unit is required";
    if (!Array.isArray(data.category) || data.category.length === 0) next.category = "Select a category first";
    if (Array.isArray(data.category) && data.category.length > 0 && (!Array.isArray(data.subCategory) || data.subCategory.length === 0)) {
      next.subCategory = "Select a sub category";
    }
    if (!Array.isArray(data.image) || data.image.length === 0) next.image = "Upload at least 1 product image";
    if (!variants.length) next.variants = "Add at least 1 color variant";

    const missingColorIndex = variants.findIndex((v) => !v?.color?.trim());
    if (missingColorIndex >= 0) next.variants = `Variant ${missingColorIndex + 1}: color is required`;

    if (computedStock <= 0) next.stock = "Add stock for at least one size";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = validate();
    if (!ok) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...data,
        price: Number(data.price),
        discount: data.discount === "" ? 0 : Number(data.discount),
        stock: computedStock,
        variants,
      };

      const res = await Axios({
        ...SummaryApi.createProduct,
        data: payload,
      });

      if (res.data?.success) {
        toast.success(res.data.message || "Product created");
        setData({
          name: "",
          description: "",
          price: "",
          discount: "",
          unit: "pair",
          category: [],
          subCategory: [],
          image: [],
          more_details: { brand: "", gender: "" },
        });
        setVariants([createEmptyVariant()]);
        setSelectCategory("");
        setSelectSubCategory("");
      }
    } catch (err) {
      AxiosToastError(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-6rem)]">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 md:p-6 border-b border-slate-200">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">Upload Footwear</h2>
          <p className="text-sm text-slate-600 mt-1">
            Production-ready product entry with variants (color → sizes → stock) and Cloudinary images.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 md:p-6 grid gap-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: core details */}
            <div className="lg:col-span-2 grid gap-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-1">
                  <label className="text-sm font-semibold text-slate-700">Product name</label>
                  <input
                    value={data.name}
                    onChange={(e) => setData((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Nike Air Max 90"
                    className={`h-11 px-4 rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 ${errors.name ? "border-red-400" : "border-slate-300"}`}
                  />
                  {errors.name ? <p className="text-sm text-red-600">{errors.name}</p> : null}
                </div>
                <div className="grid gap-1">
                  <label className="text-sm font-semibold text-slate-700">Brand</label>
                  <select
                    value={data.more_details.brand || ""}
                    onChange={(e) =>
                      setData((p) => ({
                        ...p,
                        more_details: { ...p.more_details, brand: e.target.value },
                      }))
                    }
                    className="h-11 px-4 rounded-xl border border-slate-300 bg-white text-slate-900 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600"
                  >
                    <option value="">Select Brand</option>
                    {allBrand.map((brand) => (
                      <option key={brand._id} value={brand.name}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-1">
                <label className="text-sm font-semibold text-slate-700">Description</label>
                <textarea
                  value={data.description}
                  onChange={(e) => setData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Materials, comfort, use-case, care instructions…"
                  rows={4}
                  className={`px-4 py-3 rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 resize-none ${errors.description ? "border-red-400" : "border-slate-300"}`}
                />
                {errors.description ? <p className="text-sm text-red-600">{errors.description}</p> : null}
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div className="grid gap-1 md:col-span-1">
                  <label className="text-sm font-semibold text-slate-700">Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={data.price}
                    onChange={(e) => setData((p) => ({ ...p, price: e.target.value }))}
                    placeholder="2999"
                    className={`h-11 px-4 rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 ${errors.price ? "border-red-400" : "border-slate-300"}`}
                  />
                  {errors.price ? <p className="text-sm text-red-600">{errors.price}</p> : null}
                </div>
                <div className="grid gap-1 md:col-span-1">
                  <label className="text-sm font-semibold text-slate-700">Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={data.discount}
                    onChange={(e) => setData((p) => ({ ...p, discount: e.target.value }))}
                    placeholder="10"
                    className="h-11 px-4 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600"
                  />
                </div>
                <div className="grid gap-1 md:col-span-1">
                  <label className="text-sm font-semibold text-slate-700">Unit</label>
                  <select
                    value={data.unit}
                    onChange={(e) => setData((p) => ({ ...p, unit: e.target.value }))}
                    className={`h-11 px-4 rounded-xl border bg-white text-slate-900 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 ${errors.unit ? "border-red-400" : "border-slate-300"}`}
                  >
                    <option value="pair">Pair</option>
                    <option value="single">Single</option>
                    <option value="pack">Pack</option>
                    <option value="dozen">Dozen</option>
                  </select>
                  {errors.unit ? <p className="text-sm text-red-600">{errors.unit}</p> : null}
                </div>
                <div className="grid gap-1 md:col-span-1">
                  <label className="text-sm font-semibold text-slate-700">Total stock</label>
                  <input
                    value={computedStock}
                    disabled
                    className="h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
                  />
                </div>
              </div>

              {/* Category / Subcategory */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-1">
                  <label className="text-sm font-semibold text-slate-700">Category</label>
                  <select
                    value={selectCategory}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (!value) return;
                      const category = allCategory.find((el) => el._id === value);
                      if (!category) return;
                      setData((p) => {
                        const nextCategory = p.category.some((c) => getId(c) === category._id) ? p.category : [...p.category, category];
                        // Keep only subcategories that still match selected categories
                        const nextCategoryIds = nextCategory.map(getId).filter(Boolean);
                        const nextSub = (p.subCategory || []).filter((sub) => {
                          const subCatIds = getSubCategoryCategoryIds(sub);
                          return subCatIds.some((id) => nextCategoryIds.includes(id));
                        });
                        return { ...p, category: nextCategory, subCategory: nextSub };
                      });
                      setErrors((p) => ({ ...p, category: "", subCategory: "" }));
                      setSelectCategory("");
                    }}
                    className={`h-11 px-4 rounded-xl border bg-white text-slate-900 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 ${errors.category ? "border-red-400" : "border-slate-300"}`}
                  >
                    <option value="">Select category</option>
                    {allCategory.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {data.category.map((c, idx) => (
                      <button
                        type="button"
                        key={c._id || idx}
                        onClick={() =>
                          setData((p) => {
                            const nextCategory = p.category.filter((_, i) => i !== idx);
                            const nextCategoryIds = nextCategory.map(getId).filter(Boolean);
                            const nextSub = (p.subCategory || []).filter((sub) => {
                              const subCatIds = getSubCategoryCategoryIds(sub);
                              return subCatIds.some((id) => nextCategoryIds.includes(id));
                            });
                            return { ...p, category: nextCategory, subCategory: nextSub };
                          })
                        }
                        className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium hover:bg-indigo-100"
                      >
                        {c.name} ×
                      </button>
                    ))}
                  </div>
                  {errors.category ? <p className="text-sm text-red-600">{errors.category}</p> : null}
                </div>

                <div className="grid gap-1">
                  <label className="text-sm font-semibold text-slate-700">Sub category</label>
                  <select
                    value={selectSubCategory}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (!value) return;
                      const sub = filteredSubCategoryOptions.find((el) => el._id === value);
                      if (!sub) return;
                      setData((p) => ({
                        ...p,
                        subCategory: p.subCategory.some((s) => s?._id === sub._id) ? p.subCategory : [...p.subCategory, sub],
                      }));
                      setErrors((p) => ({ ...p, subCategory: "" }));
                      setSelectSubCategory("");
                    }}
                    disabled={!selectedCategoryIds.length}
                    className={`h-11 px-4 rounded-xl border bg-white text-slate-900 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 disabled:bg-slate-50 disabled:text-slate-500 ${errors.subCategory ? "border-red-400" : "border-slate-300"}`}
                  >
                    <option value="">{selectedCategoryIds.length ? "Select sub category" : "Select category first"}</option>
                    {filteredSubCategoryOptions.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedCategoryIds.length ? "Sub categories are filtered by selected category." : "Choose a category to see its sub categories."}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {data.subCategory.map((c, idx) => (
                      <button
                        type="button"
                        key={c._id || idx}
                        onClick={() =>
                          setData((p) => ({ ...p, subCategory: p.subCategory.filter((_, i) => i !== idx) }))
                        }
                        className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200"
                      >
                        {c.name} ×
                      </button>
                    ))}
                  </div>
                  {errors.subCategory ? <p className="text-sm text-red-600">{errors.subCategory}</p> : null}
                </div>
              </div>

              {/* Variants */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900">Variants (color → sizes → stock)</h3>
                    <p className="text-sm text-slate-600">This is how footwear inventory works in production.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
                  >
                    + Add color
                  </button>
                </div>

                <div className="grid gap-4 mt-4">
                  {variants.map((v, idx) => (
                    <div key={`variant-${idx}`} className="bg-white border border-slate-200 rounded-2xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 grid gap-1">
                          <label className="text-sm font-semibold text-slate-700">Color</label>
                          <input
                            value={v.color}
                            onChange={(e) => updateVariant(idx, { color: e.target.value })}
                            placeholder="e.g. Black"
                            className={`h-11 px-4 rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 ${errors.variants ? "border-red-300" : "border-slate-300"}`}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => (variants.length > 1 ? removeVariant(idx) : null)}
                          disabled={variants.length === 1}
                          className="mt-6 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-700">Size stock</p>
                          <p className="text-xs text-slate-500">
                            <span className="font-semibold text-slate-700">Tip:</span> 0 = out of stock, &lt; 5 = low stock
                          </p>
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 mt-3">
                          {v.sizes.map((s, sIdx) => (
                            <div
                              key={`v-${idx}-s-${s.size}`}
                              className={`rounded-2xl border p-2.5 ${getStockTone(s.stock)}`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-white/70 border border-slate-200 text-xs font-bold text-slate-700">
                                  {s.size}
                                </span>
                                <span className="text-[11px] font-semibold text-slate-500">qty</span>
                              </div>

                              <input
                                type="number"
                                inputMode="numeric"
                                min="0"
                                value={s.stock}
                                onChange={(e) => updateVariantSizeStock(idx, sIdx, e.target.value)}
                                className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-center text-slate-900 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600"
                                aria-label={`Stock for size ${s.size}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.variants ? <p className="text-sm text-red-600 mt-3">{errors.variants}</p> : null}
                {errors.stock ? <p className="text-sm text-red-600 mt-1">{errors.stock}</p> : null}
              </div>
            </div>

            {/* Right: images */}
            <div className="grid gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="font-bold text-slate-900">Product images</h3>
                <p className="text-sm text-slate-600 mt-1">Uploaded to Cloudinary and stored in MongoDB.</p>

                <label className="mt-3 h-24 border border-dashed border-slate-300 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-slate-50">
                  <div className="text-center">
                    <FaCloudUploadAlt className="mx-auto text-slate-600" size={28} />
                    <p className="text-sm font-semibold text-slate-700 mt-1">
                      {imageUploading ? "Uploading..." : "Upload images"}
                    </p>
                    <p className="text-xs text-slate-500">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleUploadMainImages}
                    disabled={imageUploading}
                  />
                </label>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  {data.image.map((img, idx) => (
                    <div key={`${img}-${idx}`} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                      <img src={img} alt="" className="w-full h-24 object-cover" />
                      <button
                        type="button"
                        onClick={() => removeMainImage(idx)}
                        className="absolute bottom-2 right-2 p-2 rounded-lg bg-red-600 text-white opacity-0 group-hover:opacity-100 transition"
                        title="Remove"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  ))}
                </div>
                {errors.image ? <p className="text-sm text-red-600 mt-3">{errors.image}</p> : null}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="font-bold text-slate-900">Publish</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Stock is computed from variants: <span className="font-semibold text-slate-900">{computedStock}</span>
                </p>
                <button
                  disabled={saving || imageUploading}
                  className="mt-3 w-full h-11 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-slate-600"
                >
                  {saving ? "Publishing..." : "Publish product"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default UploadProduct;
