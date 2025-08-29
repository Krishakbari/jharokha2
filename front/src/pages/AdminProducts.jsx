


import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../constant";

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        subcategory: "",
        price: "",
        totalStock: "",
        priceBeforeDiscount: "",
        fabric: "",
        workDetails: "",
        details: "",
        materialAndCare: "",
        shippingAndReturn: "",
        newArrivals: false,
        bestSellers: false,
        weddingCollection: false,
        navaratriCollection: false,
        isReel: false,
        instaLink: "",
        colors: [],
        sizes: [],
    });

    // Improved image handling - cleaner approach
    const [imageInputs, setImageInputs] = useState([{ file: null, preview: null }]);

    // Edit modal states
    const [editModal, setEditModal] = useState({ open: false, product: null });
    const [editFormData, setEditFormData] = useState({});
    const [editImageInputs, setEditImageInputs] = useState([{ file: null, preview: null }]);
    const [editSubcategories, setEditSubcategories] = useState([]);

    // Fetch products
    const getProducts = async () => {
        try {
            const res = await axios.get(`${API}/products`);
            setProducts(res.data);
        } catch (err) {
            console.error("Error fetching products", err);
        }
    };

    // Fetch main categories on load
    const getCategories = async () => {
        try {
            const res = await axios.get(`${API}/categories`);
            setCategories(res.data);
        } catch (err) {
            console.error("Error fetching categories", err);
        }
    };

    // Fetch subcategories for selected category slug
    const getSubcategoriesBySlug = async (slug) => {
        try {
            const res = await axios.get(`${API}/categories/${slug}`);
            setSubcategories(res.data);
        } catch (err) {
            console.error("Error fetching subcategories", err);
            setSubcategories([]);
        }
    };

    // Fetch subcategories for edit modal
    const getEditSubcategoriesBySlug = async (slug) => {
        try {
            const res = await axios.get(`${API}/categories/${slug}`);
            setEditSubcategories(res.data);
        } catch (err) {
            console.error("Error fetching subcategories", err);
            setEditSubcategories([]);
        }
    };

    useEffect(() => {
        getProducts();
        getCategories();
    }, []);

    // On category change
    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        const selectedCat = categories.find(cat => cat._id === categoryId);

        setFormData({
            ...formData,
            category: categoryId,
            subcategory: ""
        });

        if (selectedCat) {
            getSubcategoriesBySlug(selectedCat.slug);
        } else {
            setSubcategories([]);
        }
    };

    // Handle form changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setFormData({ ...formData, [name]: checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // IMPROVED IMAGE HANDLING FUNCTIONS
    const handleImageChange = (index, file) => {
        const newInputs = [...imageInputs];
        newInputs[index].file = file;
        newInputs[index].preview = file ? URL.createObjectURL(file) : null;
        setImageInputs(newInputs);
    };

    const addImageInput = () => {
        setImageInputs([...imageInputs, { file: null, preview: null }]);
    };

    const removeImageInput = (index) => {
        if (imageInputs.length === 1) {
            // Reset the single input instead of removing it
            setImageInputs([{ file: null, preview: null }]);
            return;
        }

        const newInputs = imageInputs.filter((_, i) => i !== index);
        setImageInputs(newInputs);
    };

    // Create product
    const handleCreateProduct = async (e) => {
        e.preventDefault();
        try {
            const form = new FormData();

            // Append form data
            Object.keys(formData).forEach((key) => {
                if (Array.isArray(formData[key])) {
                    form.append(key, JSON.stringify(formData[key]));
                } else {
                    form.append(key, formData[key]);
                }
            });

            // Append image files
            imageInputs.forEach(({ file }) => {
                if (file) {
                    form.append("images", file);
                }
            });

            await axios.post(`${API}/product`, form, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            getProducts();

            // Reset form
            setFormData({
                name: "",
                description: "",
                category: "",
                subcategory: "",
                price: "",
                priceBeforeDiscount: "",
                fabric: "",
                totalStock: "",
                workDetails: "",
                details: "",
                materialAndCare: "",
                shippingAndReturn: "",
                newArrivals: false,
                bestSellers: false,
                weddingCollection: false,
                navaratriCollection: false,
                isReel: false,
                instaLink: "",
                colors: [],
                sizes: [],
            });

            // Reset images
            setImageInputs([{ file: null, preview: null }]);

        } catch (err) {
            console.error("Error creating product", err);
        }
    };

    // EDIT IMAGE HANDLING FUNCTIONS
    const handleEditImageChange = (index, file) => {
        const newInputs = [...editImageInputs];
        newInputs[index].file = file;
        newInputs[index].preview = file ? URL.createObjectURL(file) : null;
        setEditImageInputs(newInputs);
    };

    const addEditImageInput = () => {
        setEditImageInputs([...editImageInputs, { file: null, preview: null }]);
    };

    const removeEditImageInput = (index) => {
        if (editImageInputs.length === 1) {
            setEditImageInputs([{ file: null, preview: null }]);
            return;
        }

        const newInputs = editImageInputs.filter((_, i) => i !== index);
        setEditImageInputs(newInputs);
    };

    // Open edit modal
    const openEditModal = (product) => {
        setEditModal({ open: true, product });
        setEditFormData({
            name: product.name || "",
            description: product.description || "",
            category: product.category?._id || "",
            subcategory: product.subcategory?._id || "",
            price: product.price || "",
            totalStock: product.totalStock || "",
            priceBeforeDiscount: product.priceBeforeDiscount || "",
            fabric: product.fabric || "",
            workDetails: product.workDetails || "",
            details: product.details || "",
            instaLink: product.instaLink || "",
            materialAndCare: product.materialAndCare || "",
            shippingAndReturn: product.shippingAndReturn || "",
            newArrivals: product.newArrivals || false,
            bestSellers: product.bestSellers || false,
            weddingCollection: product.weddingCollection || false,
            navaratriCollection: product.navaratriCollection || false,
            isReel: product.isReel || false,
            colors: product.colors || [],
            sizes: product.sizes || [],
        });

        // Reset edit images
        setEditImageInputs([{ file: null, preview: null }]);

        // Load subcategories for the selected category
        if (product.category?.slug) {
            getEditSubcategoriesBySlug(product.category.slug);
        }
    };

    // Close edit modal
    const closeEditModal = () => {
        setEditModal({ open: false, product: null });
        setEditFormData({});
        setEditImageInputs([{ file: null, preview: null }]);
        setEditSubcategories([]);
    };

    // Handle edit form changes
    const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setEditFormData({ ...editFormData, [name]: checked });
        } else {
            setEditFormData({ ...editFormData, [name]: value });
        }
    };

    // Handle edit category change
    const handleEditCategoryChange = (e) => {
        const categoryId = e.target.value;
        const selectedCat = categories.find(cat => cat._id === categoryId);

        setEditFormData({
            ...editFormData,
            category: categoryId,
            subcategory: ""
        });

        if (selectedCat) {
            getEditSubcategoriesBySlug(selectedCat.slug);
        } else {
            setEditSubcategories([]);
        }
    };

    // Handle edit submission
    const handleEditProduct = async (e) => {
        e.preventDefault();
        try {
            const form = new FormData();

            // Append edit form data
            Object.keys(editFormData).forEach((key) => {
                if (Array.isArray(editFormData[key])) {
                    form.append(key, JSON.stringify(editFormData[key]));
                } else {
                    form.append(key, editFormData[key]);
                }
            });

            // Append new image files
            editImageInputs.forEach(({ file }) => {
                if (file) {
                    form.append("images", file);
                }
            });

            await axios.put(`${API}/product/${editModal.product._id}`, form, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            closeEditModal();
            getProducts();
        } catch (err) {
            console.error("Error updating product", err);
        }
    };

    // Delete product
    const handleDelete = async (id) => {
        if (window.confirm("Delete this product?")) {
            await axios.delete(`${API}/product/${id}`);
            getProducts();
        }
    };

    return (
        <div className="p-4 sm:p-6 space-y-8 sm:space-y-10 bg-gray-50 min-h-screen">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Manage Products</h2>

            {/* Create Product Form */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Add New Product</h3>
                <form onSubmit={handleCreateProduct} className="space-y-4">
                    {/* Basic Information */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Product Name"
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Product Description"
                            rows="3"
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Categories - Side by side on larger screens */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleCategoryChange}
                                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                            <select
                                name="subcategory"
                                value={formData.subcategory}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={subcategories.length === 0}
                            >
                                <option value="">Select Subcategory</option>
                                {subcategories.map(sub => (
                                    <option key={sub._id} value={sub._id}>
                                        {sub.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Pricing - Side by side on larger screens */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Current Price"
                                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price Before Discount</label>
                            <input
                                type="number"
                                name="priceBeforeDiscount"
                                value={formData.priceBeforeDiscount}
                                onChange={handleChange}
                                placeholder="Original Price"
                                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">TotalStock</label>
                            <input
                                type="number"
                                name="totalStock"
                                value={formData.totalStock}
                                onChange={handleChange}
                                placeholder="Current Stock"
                                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>


                    </div>

                    {/* Product Details - Side by side on larger screens */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fabric</label>
                            <input
                                name="fabric"
                                value={formData.fabric}
                                onChange={handleChange}
                                placeholder="Fabric Type"
                                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Work Details</label>
                            <input
                                name="workDetails"
                                value={formData.workDetails}
                                onChange={handleChange}
                                placeholder="Work Details"
                                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Details</label>
                        <textarea
                            name="details"
                            value={formData.details}
                            onChange={handleChange}
                            placeholder="Additional Product Details"
                            rows="2"
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Material & Care</label>
                        <textarea
                            name="materialAndCare"
                            value={formData.materialAndCare}
                            onChange={handleChange}
                            placeholder="Material & Care Instructions"
                            rows="2"
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Shipping & Return</label>
                        <textarea
                            name="shippingAndReturn"
                            value={formData.shippingAndReturn}
                            onChange={handleChange}
                            placeholder="Shipping & Return Policy"
                            rows="2"
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Colors and Sizes - Side by side on larger screens */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Colors</label>
                            <input
                                name="colors"
                                value={formData.colors.join(", ")}
                                onChange={(e) =>
                                    setFormData({ ...formData, colors: e.target.value.split(",").map(c => c.trim()) })
                                }
                                placeholder="e.g., Red, Blue, Green"
                                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sizes</label>
                            <input
                                name="sizes"
                                value={formData.sizes.join(", ")}
                                onChange={(e) =>
                                    setFormData({ ...formData, sizes: e.target.value.split(",").map(s => s.trim()) })
                                }
                                placeholder="e.g., S, M, L, XL"
                                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Collections</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="newArrivals"
                                    checked={formData.newArrivals}
                                    onChange={handleChange}
                                    className="mr-2 flex-shrink-0"
                                />
                                <span className="text-sm">New Arrival</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="bestSellers"
                                    checked={formData.bestSellers}
                                    onChange={handleChange}
                                    className="mr-2 flex-shrink-0"
                                />
                                <span className="text-sm">Best Sellers</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="weddingCollection"
                                    checked={formData.weddingCollection}
                                    onChange={handleChange}
                                    className="mr-2 flex-shrink-0"
                                />
                                <span className="text-sm">Wedding Collection</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="navaratriCollection"
                                    checked={formData.navaratriCollection}
                                    onChange={handleChange}
                                    className="mr-2 flex-shrink-0"
                                />
                                <span className="text-sm">Navaratri Collection</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isReel"
                                    checked={formData.isReel}
                                    onChange={handleChange}
                                    className="mr-2 flex-shrink-0"
                                />
                                <span className="text-sm">Instagram Reel</span>
                            </label>
                        </div>
                    </div>

                    {/* Instagram Link field for create form */}
                    {formData.isReel && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram Reel Link</label>
                            <input
                                name="instaLink"
                                value={formData.instaLink}
                                onChange={handleChange}
                                placeholder="Instagram reel URL"
                                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    )}

                    {/* IMPROVED IMAGES SECTION */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                        {imageInputs.map((input, index) => (
                            <div key={index} className="mb-4 p-3 sm:p-4 border border-gray-200 rounded-lg">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(index, e.target.files[0])}
                                        className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImageInput(index)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm transition-colors w-full sm:w-auto"
                                    >
                                        Remove
                                    </button>
                                </div>
                                {input.preview && (
                                    <div className="mt-2">
                                        <img
                                            src={input.preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md border"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addImageInput}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors w-full sm:w-auto"
                        >
                            Add Another Image
                        </button>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
                        >
                            Add Product
                        </button>
                    </div>
                </form>
            </div>

            {/* Products Grid */}
            <div>
                <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-800">Existing Products</h3>
                {products.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-xl mb-2">🛍️</div>
                        <p className="text-gray-500">No products found. Create your first product above!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {products.map((product) => (
                            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                                    {product.images && product.images.length > 0 ? (
                                        <img
                                            src={`${API}${product.images?.[0]?.url}`}
                                            alt={product.name}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <div className="text-gray-400 text-4xl">🛍️</div>
                                    )}
                                </div>
                                <div className="p-3 sm:p-4">
                                    <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-1 truncate" title={product.name}>
                                        {product.name}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-600 mb-1">
                                        {product.category?.name} {product.subcategory && `• ${product.subcategory.name}`}
                                    </p>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-base sm:text-lg font-bold text-green-600">₹{product.price}</span>
                                        {product.priceBeforeDiscount > 0 && (
                                            <span className="text-xs sm:text-sm text-gray-500 line-through">₹{product.priceBeforeDiscount}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => openEditModal(product)}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editModal.open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                        <div className="p-4 sm:p-6">
                            <div className="flex justify-between items-center mb-4 sm:mb-6">
                                <h3 className="text-lg font-semibold text-gray-800">Edit Product</h3>
                                <button
                                    onClick={closeEditModal}
                                    className="text-gray-500 hover:text-gray-700 text-xl font-bold p-2 -m-2"
                                >
                                    ×
                                </button>
                            </div>

                            <form onSubmit={handleEditProduct} className="space-y-4">
                                {/* Current Images Preview */}
                                {editModal.product.images && editModal.product.images.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Images</label>
                                        <div className="flex gap-2 flex-wrap">
                                            {editModal.product.images.map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={`${API}${image.url}`}
                                                    alt={`Product ${index + 1}`}
                                                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded border"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Form fields - same structure as create form but with single column layout for mobile */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                    <input
                                        name="name"
                                        value={editFormData.name || ""}
                                        onChange={handleEditChange}
                                        className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                {/* Categories */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <select
                                            name="category"
                                            value={editFormData.category || ""}
                                            onChange={handleEditCategoryChange}
                                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat._id} value={cat._id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                                        <select
                                            name="subcategory"
                                            value={editFormData.subcategory || ""}
                                            onChange={handleEditChange}
                                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            disabled={editSubcategories.length === 0}
                                        >
                                            <option value="">Select Subcategory</option>
                                            {editSubcategories.map(sub => (
                                                <option key={sub._id} value={sub._id}>
                                                    {sub.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Pricing */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={editFormData.price || ""}
                                            onChange={handleEditChange}
                                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>


                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price Before Discount</label>
                                        <input
                                            type="number"
                                            name="priceBeforeDiscount"
                                            value={editFormData.priceBeforeDiscount || ""}
                                            onChange={handleEditChange}
                                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">totalStock</label>
                                        <input
                                            type="number"
                                            name="totalStock"
                                            value={editFormData.totalStock || ""}
                                            onChange={handleEditChange}
                                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fabric</label>
                                        <input
                                            name="fabric"
                                            value={editFormData.fabric || ""}
                                            onChange={handleEditChange}
                                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Work Details</label>
                                        <input
                                            name="workDetails"
                                            value={editFormData.workDetails || ""}
                                            onChange={handleEditChange}
                                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={editFormData.description || ""}
                                        onChange={handleEditChange}
                                        rows="3"
                                        className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Details</label>
                                    <textarea
                                        name="details"
                                        value={editFormData.details || ""}
                                        onChange={handleEditChange}
                                        rows="2"
                                        className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Material & Care</label>
                                    <textarea
                                        name="materialAndCare"
                                        value={editFormData.materialAndCare || ""}
                                        onChange={handleEditChange}
                                        rows="2"
                                        className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Shipping & Return</label>
                                    <textarea
                                        name="shippingAndReturn"
                                        value={editFormData.shippingAndReturn || ""}
                                        onChange={handleEditChange}
                                        rows="2"
                                        className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Colors and Sizes */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Colors</label>
                                        <input
                                            name="colors"
                                            value={(editFormData.colors || []).join(", ")}
                                            onChange={(e) =>
                                                setEditFormData({ ...editFormData, colors: e.target.value.split(",").map(c => c.trim()) })
                                            }
                                            placeholder="e.g., Red, Blue, Green"
                                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Sizes</label>
                                        <input
                                            name="sizes"
                                            value={(editFormData.sizes || []).join(", ")}
                                            onChange={(e) =>
                                                setEditFormData({ ...editFormData, sizes: e.target.value.split(",").map(s => s.trim()) })
                                            }
                                            placeholder="e.g., S, M, L, XL"
                                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Collections</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="newArrivals"
                                                checked={editFormData.newArrivals || false}
                                                onChange={handleEditChange}
                                                className="mr-2 flex-shrink-0"
                                            />
                                            <span className="text-sm">New Arrival</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="bestSellers"
                                                checked={editFormData.bestSellers || false}
                                                onChange={handleEditChange}
                                                className="mr-2 flex-shrink-0"
                                            />
                                            <span className="text-sm">Best Sellers</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="weddingCollection"
                                                checked={editFormData.weddingCollection || false}
                                                onChange={handleEditChange}
                                                className="mr-2 flex-shrink-0"
                                            />
                                            <span className="text-sm">Wedding Collection</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="navaratriCollection"
                                                checked={editFormData.navaratriCollection || false}
                                                onChange={handleEditChange}
                                                className="mr-2 flex-shrink-0"
                                            />
                                            <span className="text-sm">Navaratri Collection</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="isReel"
                                                checked={editFormData.isReel || false}
                                                onChange={handleEditChange}
                                                className="mr-2 flex-shrink-0"
                                            />
                                            <span className="text-sm">Instagram Reel</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Instagram Link field for edit form */}
                                {editFormData.isReel && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Instagram Reel Link</label>
                                        <input
                                            name="instaLink"
                                            value={editFormData.instaLink || ""}
                                            onChange={handleEditChange}
                                            placeholder="Instagram reel URL"
                                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                )}

                                {/* IMPROVED EDIT IMAGES SECTION */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Add New Images (Optional)
                                    </label>
                                    <p className="text-xs text-gray-500 mb-3">
                                        Note: Adding new images will replace all existing images. Leave empty to keep current images.
                                    </p>

                                    {editImageInputs.map((input, index) => (
                                        <div key={index} className="mb-4 p-3 sm:p-4 border border-gray-200 rounded-lg">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleEditImageChange(index, e.target.files[0])}
                                                    className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeEditImageInput(index)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm transition-colors w-full sm:w-auto"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                            {input.preview && (
                                                <div className="mt-2">
                                                    <img
                                                        src={input.preview}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md border"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={addEditImageInput}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors w-full sm:w-auto"
                                    >
                                        Add Another Image
                                    </button>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeEditModal}
                                        className="w-full sm:flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
                                    >
                                        Update Product
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;