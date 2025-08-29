// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FaRegHeart, FaHeart } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { API } from "../constant";
// import { FiSearch, FiChevronDown, FiChevronUp } from "react-icons/fi";
// import { useWishlist } from "../context/wishlistContext";

// const CollectionsPage = () => {
//     const [products, setProducts] = useState([]);
//     const [filteredProducts, setFilteredProducts] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [subcategories, setSubcategories] = useState({});
//     const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

//     // Mobile filter state
//     const [isFilterOpen, setIsFilterOpen] = useState(false);

//     const navigate = useNavigate();

//     // Filter states
//     const [priceRange, setPriceRange] = useState([0, 100000]);
//     const [selectedCategory, setSelectedCategory] = useState(null);
//     const [selectedSubcategory, setSelectedSubcategory] = useState(null);
//     const [selectedFabric, setSelectedFabric] = useState([]);
//     const [selectedWorkDetails, setSelectedWorkDetails] = useState([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             const prodRes = await axios.get(`${API}/products`);
//             setProducts(prodRes.data);
//             setFilteredProducts(prodRes.data);

//             if (prodRes.length > 0) {
//                 const prices = prodRes.map((p) => p.price);
//                 const min = Math.min(...prices);
//                 const max = Math.max(...prices);
//                 setPriceRange([min, max]);
//             }

//             const catRes = await axios.get(`${API}/categories`);
//             setCategories(catRes.data);
//         };
//         fetchData();
//     }, []);

//     // Get unique filters from product data
//     const fabrics = [...new Set(products.map(p => p.fabric).filter(Boolean))];
//     const workDetails = [...new Set(products.map(p => p.workDetails).filter(Boolean))];
//     const minPrice = products.length ? Math.min(...products.map((p) => p.price)) : 0;
//     const maxPrice = products.length ? Math.max(...products.map((p) => p.price)) : 0;

//     // Handle category click -> fetch subcategories
//     const handleCategoryClick = async (slug) => {
//         const res = await axios.get(`${API}/categories/${slug}`);
//         setSubcategories(prev => ({ ...prev, [slug]: res.data }));
//         setSelectedCategory(slug);
//     };

//     // Apply filters locally
//     useEffect(() => {
//         let filtered = [...products];

//         // Search filter
//         if (searchTerm.trim() !== "") {
//             filtered = filtered.filter(p =>
//                 p.name.toLowerCase().includes(searchTerm.toLowerCase())
//             );
//         }

//         filtered = filtered.filter(
//             (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
//         );

//         if (selectedCategory) {
//             filtered = filtered.filter(p => p.category?.slug === selectedCategory);
//         }
//         if (selectedSubcategory) {
//             filtered = filtered.filter(p => p.subcategory?.slug === selectedSubcategory);
//         }
//         if (selectedFabric.length) {
//             filtered = filtered.filter(p => selectedFabric.includes(p.fabric));
//         }
//         if (selectedWorkDetails.length) {
//             filtered = filtered.filter(p => selectedWorkDetails.includes(p.workDetails));
//         }

//         setFilteredProducts(filtered);
//     }, [products, searchTerm, priceRange, selectedCategory, selectedSubcategory, selectedFabric, selectedWorkDetails]);

//     const clearFilters = () => {
//         setPriceRange([minPrice, maxPrice]);
//         setSelectedCategory(null);
//         setSelectedSubcategory(null);
//         setSelectedFabric([]);
//         setSelectedWorkDetails([]);
//         setSearchTerm("");
//     };

//     const handleWishlistToggle = (e, productId) => {
//         e.stopPropagation();
//         if (isInWishlist(productId)) {
//             removeFromWishlist(productId);
//         } else {
//             addToWishlist(productId);
//         }
//     };

//     // Filter Section Component
//     const FilterSection = ({ isMobile = false }) => (
//         <div className={`${isMobile ? 'p-4' : 'p-6'} bg-gray-50 rounded-lg`}>
//             <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-lg font-semibold">Filters</h3>
//                 <button
//                     onClick={clearFilters}
//                     className="text-sm text-blue-600 underline"
//                 >
//                     Clear All
//                 </button>
//             </div>

//             {/* Search Bar */}
//             <div className="mb-6 pb-6 border-b border-gray-400">
//                 <div className="relative">
//                     <FiSearch
//                         className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                         size={18}
//                     />
//                     <input
//                         type="text"
//                         placeholder="Search..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="w-full border border-gray-300 rounded pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
//                     />
//                 </div>
//             </div>

//             {/* Price Filter */}
//             <div className="mb-6 pb-6 border-b border-gray-400">
//                 <h4 className="font-semibold mb-4">Price Range</h4>
//                 <input
//                     type="range"
//                     min={minPrice}
//                     max={maxPrice}
//                     value={priceRange[1]}
//                     onChange={(e) => setPriceRange([minPrice, Number(e.target.value)])}
//                     className="w-full accent-black"
//                 />
//                 <div className="flex justify-between text-sm text-gray-600">
//                     <span>₹{priceRange[0]}</span>
//                     <span>₹{priceRange[1]}</span>
//                 </div>
//             </div>

//             {/* Categories */}
//             {/* <div className="mb-6 pb-6 border-b border-gray-400">
//                 <h4 className="font-semibold mb-4">Categories</h4>
//                 <div className="space-y-2">
//                     {categories.map(cat => (
//                         <div key={cat._id} className="space-y-2">
//                             <button
//                                 onClick={() => handleCategoryClick(cat.slug)}
//                                 className={`w-full text-left px-3 py-2 rounded hover:bg-gray-500 transition-colors ${selectedCategory === cat.slug ? 'bg-black text-white' : ''
//                                     }`}
//                             >
//                                 {cat.name}
//                             </button>
//                             {subcategories[cat.slug] && (
//                                 <div className="pl-4 space-y-1">
//                                     {subcategories[cat.slug].map(sub => (
//                                         <label key={sub._id} className="flex items-center space-x-2 cursor-pointer">
//                                             <input
//                                                 type="radio"
//                                                 name="subcategory"
//                                                 value={sub.slug}
//                                                 checked={selectedSubcategory === sub.slug}
//                                                 onChange={() => setSelectedSubcategory(sub.slug)}
//                                                 className="text-black focus:ring-black"
//                                             />
//                                             <span className="text-sm text-gray-700">{sub.name}</span>
//                                         </label>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     ))}
//                 </div>
//             </div> */}

//             {/* Fabric Filter */}
//             <div className="mb-6 pb-6 border-b border-gray-400">
//                 <h4 className="font-semibold mb-4">Fabric</h4>
//                 <div className={`${isMobile ? 'max-h-32 overflow-y-auto' : ''} space-y-2`}>
//                     {fabrics.map(f => (
//                         <label key={f} className="flex items-center space-x-2 cursor-pointer">
//                             <input
//                                 type="checkbox"
//                                 checked={selectedFabric.includes(f)}
//                                 onChange={() =>
//                                     setSelectedFabric(prev =>
//                                         prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
//                                     )
//                                 }
//                                 className="rounded text-black focus:ring-black"
//                             />
//                             <span className="text-sm">{f}</span>
//                         </label>
//                     ))}
//                 </div>
//             </div>

//             {/* Work Details Filter */}
//             <div>
//                 <h4 className="font-semibold mb-4">Work Details</h4>
//                 <div className={`${isMobile ? 'max-h-32 overflow-y-auto' : ''} space-y-2`}>
//                     {workDetails.map(w => (
//                         <label key={w} className="flex items-center space-x-2 cursor-pointer">
//                             <input
//                                 type="checkbox"
//                                 checked={selectedWorkDetails.includes(w)}
//                                 onChange={() =>
//                                     setSelectedWorkDetails(prev =>
//                                         prev.includes(w) ? prev.filter(x => x !== w) : [...prev, w]
//                                     )
//                                 }
//                                 className="rounded text-black focus:ring-black"
//                             />
//                             <span className="text-sm">{w}</span>
//                         </label>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );

//     return (
//         <>
//             {/* Hero Section - Commented out as per original */}
//             {/* <div className="relative mb-10">
//                 <img
//                     src={heroimg}
//                     alt="Wedding Collection"
//                     className="w-full h-[200px] md:h-[300px] sm:object-cover"
//                 />
//                 <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
//                     <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold text-white drop-shadow-md">
//                         Navaratri Collection
//                     </h2>
//                     <p className="mt-2 text-white text-sm sm:text-lg md:text-xl">
//                         Celebrate Love. Discover Our Premium Navaratri Collection
//                     </p>
//                     <button
//                         onClick={() => navigate('/collection/navratri')}
//                         className="mt-4 sm:mt-6 bg-white text-black px-4 sm:px-6 py-2 text-sm sm:text-base rounded hover:bg-gray-800 transition-colors"
//                     >
//                         Shop Now
//                     </button>
//                 </div>
//             </div> */}

//             <div className="max-w-[1450px] mx-auto px-4 py-4 md:py-8">
//                 {/* Mobile Filter Header */}
//                 <div className="md:hidden mb-4">
//                     <button
//                         onClick={() => setIsFilterOpen(!isFilterOpen)}
//                         className="flex items-center justify-between w-full p-3 bg-gray-100 rounded-lg"
//                     >
//                         <span className="font-semibold">Filters</span>
//                         {isFilterOpen ? (
//                             <FiChevronUp size={20} />
//                         ) : (
//                             <FiChevronDown size={20} />
//                         )}
//                     </button>

//                     {/* Mobile Filter Dropdown */}
//                     {isFilterOpen && (
//                         <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-lg">
//                             <FilterSection isMobile={true} />
//                         </div>
//                     )}
//                 </div>

//                 <div className="flex flex-col md:flex-row gap-4 md:gap-8">
//                     {/* Desktop Sidebar Filters */}
//                     <aside className="hidden md:block w-80 h-fit">
//                         <FilterSection />
//                     </aside>

//                     {/* Product Grid */}
//                     <main className="flex-1">
//                         <div className="flex justify-between items-center mb-4 md:mb-6">
//                             <p className="text-xs md:text-sm text-gray-600">
//                                 Showing {filteredProducts.length} of {products.length} products
//                             </p>
//                         </div>

//                         {filteredProducts.length > 0 ? (
//                             <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
//                                 {filteredProducts.map(product => (
//                                     <div
//                                         key={product._id}
//                                         className="relative cursor-pointer"
//                                         onClick={() => navigate(`/${product.slug}/${product._id}`)}
//                                     >
//                                         <div className="relative overflow-hidden group">
//                                             {/* Badges Container - RIGHT SIDE */}
//                                             <div className="absolute top-1 md:top-2 right-1 md:right-2 z-10 flex flex-col gap-1">
//                                                 {/* New Arrivals Badge */}
//                                                 {product.newArrivals && (
//                                                     <span className="bg-pink-400 text-white text-[12px] md:text-xs font-semibold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full shadow">
//                                                         NewArrival
//                                                     </span>
//                                                 )}

//                                                 {/* Best Sellers Badge */}
//                                                 {product.bestSellers && (
//                                                     <span className="bg-purple-400 text-white text-[12px] md:text-xs font-semibold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full shadow">
//                                                         BestSeller
//                                                     </span>
//                                                 )}
//                                             </div>

//                                             <img
//                                                 src={`${API}${product.images?.[0]?.url}`}
//                                                 alt={product.name}
//                                                 className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
//                                             />

//                                             {/* Wishlist Icon */}
//                                             <div className="absolute top-1 md:top-2 left-1 md:left-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                                                 <button
//                                                     className="bg-white p-1 md:p-1.5 rounded-full shadow-md hover:shadow-lg transition-shadow"
//                                                     onClick={(e) => handleWishlistToggle(e, product._id)}
//                                                 >
//                                                     {isInWishlist(product._id) ? (
//                                                         <FaHeart size={12} className="text-pink-500 md:w-4 md:h-4" />
//                                                     ) : (
//                                                         <FaRegHeart size={12} className="text-gray-600 md:w-4 md:h-4" />
//                                                     )}
//                                                 </button>
//                                             </div>
//                                         </div>

//                                         <div className="mt-2 sm:mt-3">
//                                             <p className="text-xs sm:text-sm text-gray-800 font-medium line-clamp-2">{product.name}</p>
//                                             <p className="text-sm sm:text-lg font-semibold mt-1">₹{product.price}</p>

//                                             {product.colors?.length > 0 && (
//                                                 <div className="flex gap-1 sm:gap-2 mt-1 sm:mt-2">
//                                                     {product.colors.slice(0, 4).map((color, index) => (
//                                                         <span
//                                                             key={index}
//                                                             className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-gray-300"
//                                                             style={{ backgroundColor: color }}
//                                                             title={color}
//                                                         ></span>
//                                                     ))}
//                                                     {product.colors.length > 4 && (
//                                                         <span className="text-xs text-gray-500 self-center">
//                                                             +{product.colors.length - 4}
//                                                         </span>
//                                                     )}
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <div className="text-center py-8 md:py-12">
//                                 <p className="text-gray-500 text-base md:text-lg mb-4">No products found matching your filters</p>
//                                 <button
//                                     onClick={clearFilters}
//                                     className="bg-black text-white px-4 md:px-6 py-2 rounded hover:bg-gray-800 transition-colors"
//                                 >
//                                     Clear Filters
//                                 </button>
//                             </div>
//                         )}
//                     </main>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default CollectionsPage;



import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../constant";
import { FiSearch } from "react-icons/fi";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useWishlist } from "../context/wishlistContext";

const PRODUCTS_PER_PAGE = 8;

const NewCollection = () => {
    const { type } = useParams();
    const navigate = useNavigate();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [priceRange, setPriceRange] = useState([0, 100000]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [selectedFabric, setSelectedFabric] = useState([]);
    const [selectedWorkDetails, setSelectedWorkDetails] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false); // Mobile filter toggle
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch products
    useEffect(() => {
        const fetchData = async () => {
            const prodRes = await axios.get(`${API}/products`);
            setProducts(prodRes.data);
            setFilteredProducts(prodRes.data);

            if (prodRes.length > 0) {
                const prices = prodRes.map((p) => p.price);
                const min = Math.min(...prices);
                const max = Math.max(...prices);
                setPriceRange([min, max]);
            }

            const catRes = await axios.get(`${API}/categories`);
            setCategories(catRes.data);
        };
        fetchData();
    }, []);


    const minPrice = products.length ? Math.min(...products.map((p) => p.price)) : 0;
    const maxPrice = products.length ? Math.max(...products.map((p) => p.price)) : 0;
    const fabrics = [...new Set(products.map((p) => p.fabric).filter(Boolean))];
    const workDetails = [...new Set(products.map((p) => p.workDetails).filter(Boolean))];

    const handleCategoryClick = async (slug) => {
        const res = await axios.get(`${API}/categories/${slug}`);
        setSubcategories((prev) => ({ ...prev, [slug]: res.data }));
        setSelectedCategory(slug);
    };

    // Filtering logic
    useEffect(() => {
        let filtered = [...products];

        if (searchTerm.trim() !== "") {
            filtered = filtered.filter((p) =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        filtered = filtered.filter(
            (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
        );

        if (selectedCategory) {
            filtered = filtered.filter((p) => p.category?.slug === selectedCategory);
        }
        if (selectedSubcategory) {
            filtered = filtered.filter((p) => p.subcategory?.slug === selectedSubcategory);
        }
        if (selectedFabric.length) {
            filtered = filtered.filter((p) => selectedFabric.includes(p.fabric));
        }
        if (selectedWorkDetails.length) {
            filtered = filtered.filter((p) =>
                selectedWorkDetails.includes(p.workDetails)
            );
        }

        setFilteredProducts(filtered);
        setCurrentPage(1); // Reset to page 1 on filter change
    }, [
        products,
        searchTerm,
        priceRange,
        selectedCategory,
        selectedSubcategory,
        selectedFabric,
        selectedWorkDetails,
    ]);

    const clearFilters = () => {
        setPriceRange([minPrice, maxPrice]);
        setSelectedCategory(null);
        setSelectedSubcategory(null);
        setSelectedFabric([]);
        setSelectedWorkDetails([]);
        setSearchTerm("");
    };

    const handleWishlistToggle = (e, productId) => {
        e.stopPropagation();
        if (isInWishlist(productId)) {
            removeFromWishlist(productId);
        } else {
            addToWishlist(productId);
        }
    };

    // Pagination logic
    const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
    const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="max-w-[1450px] mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
            {/* Filter Toggle for Mobile */}
            <button
                onClick={() => setIsFilterOpen(true)}
                className="md:hidden bg-gray-600 text-white py-2 px-4 rounded mb-0 flex justify-between items-center"
            >
                Filters <span>▼</span>
            </button>

            {/* 🔥 Mobile Sliding Drawer */}
            {isFilterOpen && (
                <div className="fixed inset-0 z-40 flex md:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-30"
                        onClick={() => setIsFilterOpen(false)}
                    ></div>

                    {/* Drawer */}
                    <div className="relative w-[250px] bg-gray-50 p-6 rounded-r-lg h-full shadow-lg transform transition-transform duration-300 translate-x-0">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold">Filters</h3>
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="text-sm text-blue-600 underline"
                            >
                                Close
                            </button>
                        </div>

                        {/* 🔍 Search */}
                        <div className="mb-6 pb-6 border-b border-gray-400">
                            <div className="relative">
                                <FiSearch
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={18}
                                />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full border border-gray-300 rounded pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                        </div>

                        {/* 💰 Price Range */}
                        <div className="mb-6 pb-6 border-b border-gray-400">
                            <h4 className="font-semibold mb-4">Price Range</h4>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    // value={priceRange[0] !== 0 ? priceRange[0] : ""}
                                    onChange={(e) => {
                                        const val = e.target.value ? Number(e.target.value) : 0;
                                        setPriceRange([val, priceRange[1]]);
                                    }}
                                    className="w-1/2 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                />
                                <input
                                    type="number"
                                    placeholder="Max"
                                    // value={priceRange[1] !== 100000 ? priceRange[1] : ""}
                                    onChange={(e) => {
                                        const val = e.target.value ? Number(e.target.value) : 100000;
                                        setPriceRange([priceRange[0], val]);
                                    }}
                                    className="w-1/2 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                        </div>

                        {/* 🧵 Fabric */}
                        <div className="mb-6 pb-6 border-b border-gray-400">
                            <h4 className="font-semibold mb-4">Fabric</h4>
                            {fabrics.map((f) => (
                                <label
                                    key={f}
                                    className="flex items-center space-x-2 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedFabric.includes(f)}
                                        onChange={() =>
                                            setSelectedFabric((prev) =>
                                                prev.includes(f)
                                                    ? prev.filter((x) => x !== f)
                                                    : [...prev, f]
                                            )
                                        }
                                    />
                                    <span className="text-sm">{f}</span>
                                </label>
                            ))}
                        </div>

                        {/* 🎨 Work Details */}
                        <div>
                            <h4 className="font-semibold mb-4">Work Details</h4>
                            {workDetails.map((w) => (
                                <label
                                    key={w}
                                    className="flex items-center space-x-2 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedWorkDetails.includes(w)}
                                        onChange={() =>
                                            setSelectedWorkDetails((prev) =>
                                                prev.includes(w)
                                                    ? prev.filter((x) => x !== w)
                                                    : [...prev, w]
                                            )
                                        }
                                    />
                                    <span className="text-sm">{w}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 🔥 Desktop Sidebar */}
            <aside className="hidden md:block w-80 bg-gray-50 p-6 rounded-lg h-fit">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Filters</h3>
                    <button
                        onClick={clearFilters}
                        className="text-sm text-blue-600 underline"
                    >
                        Clear All
                    </button>
                </div>

                <div className="mb-6 pb-6 border-b border-gray-400">
                    <div className="relative">
                        <FiSearch
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border border-gray-300 rounded pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                </div>

                {/* 💰 Price Range */}
                <div className="mb-6 pb-6 border-b border-gray-400">
                    <h4 className="font-semibold mb-4">Price Range</h4>
                    <div className="flex items-center gap-3">
                        <input
                            type="number"
                            placeholder="Min"
                            // value={priceRange[0] !== 0 ? priceRange[0] : ""}
                            onChange={(e) => {
                                const val = e.target.value ? Number(e.target.value) : 0;
                                setPriceRange([val, priceRange[1]]);
                            }}
                            className="w-1/2 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            // value={priceRange[1] !== 100000 ? priceRange[1] : ""}
                            onChange={(e) => {
                                const val = e.target.value ? Number(e.target.value) : 100000;
                                setPriceRange([priceRange[0], val]);
                            }}
                            className="w-1/2 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                </div>

                {/* 🧵 Fabric */}
                <div className="mb-6 pb-6 border-b border-gray-400">
                    <h4 className="font-semibold mb-4">Fabric</h4>
                    {fabrics.map((f) => (
                        <label
                            key={f}
                            className="flex items-center space-x-2 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={selectedFabric.includes(f)}
                                onChange={() =>
                                    setSelectedFabric((prev) =>
                                        prev.includes(f)
                                            ? prev.filter((x) => x !== f)
                                            : [...prev, f]
                                    )
                                }
                            />
                            <span className="text-sm">{f}</span>
                        </label>
                    ))}
                </div>

                {/* 🎨 Work Details */}
                <div>
                    <h4 className="font-semibold mb-4">Work Details</h4>
                    {workDetails.map((w) => (
                        <label
                            key={w}
                            className="flex items-center space-x-2 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={selectedWorkDetails.includes(w)}
                                onChange={() =>
                                    setSelectedWorkDetails((prev) =>
                                        prev.includes(w)
                                            ? prev.filter((x) => x !== w)
                                            : [...prev, w]
                                    )
                                }
                            />
                            <span className="text-sm">{w}</span>
                        </label>
                    ))}
                </div>
            </aside>

            {/* Product Grid */}
            <main className="flex-1">
                <h1 className="text-2xl font-semibold mb-6 capitalize">{type} Collection</h1>
                {currentProducts.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {currentProducts.map((product) => {
                                const inWishlist = isInWishlist(product._id);
                                return (
                                    <div
                                        key={product._id}
                                        className="relative group cursor-pointer"
                                        onClick={() => navigate(`/${product.slug}/${product._id}`)}
                                    >
                                        <div className="relative overflow-hidden group">
                                            {/* Badges */}
                                            <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
                                                {product.newArrivals && (
                                                    <span className="bg-pink-400 text-white text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full shadow">
                                                        NewArrival
                                                    </span>
                                                )}
                                                {product.bestSellers && (
                                                    <span className="bg-purple-400 text-black text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full shadow">
                                                        BestSeller
                                                    </span>
                                                )}
                                            </div>

                                            <img
                                                src={`${API}${product.images?.[0]?.url}`}
                                                alt={product.name}
                                                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                                            />

                                            {/* Wishlist Icon */}
                                            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <button
                                                    className="bg-white p-1.5 rounded-full shadow-md hover:shadow-lg"
                                                    onClick={(e) => handleWishlistToggle(e, product._id)}
                                                >
                                                    {inWishlist ? (
                                                        <FaHeart size={16} className="text-pink-500" />
                                                    ) : (
                                                        <FaRegHeart size={16} className="text-gray-600" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-sm mt-2">{product.name}</p>
                                        <p className="font-medium">₹{product.price}</p>
                                        <div className="flex gap-2 mt-1">
                                            {product.colors?.map((color, index) => (
                                                <span
                                                    key={index}
                                                    className="w-4 h-4 rounded-full border"
                                                    style={{ backgroundColor: color }}
                                                ></span>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center mt-6 space-x-2">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`px-3 py-1 border rounded ${currentPage === i + 1
                                        ? "bg-black text-white"
                                        : "bg-white text-black"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <p className="text-gray-500">No products found</p>
                )}
            </main>
        </div>
    );
};

export default NewCollection;







