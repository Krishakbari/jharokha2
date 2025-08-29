// import React, { useEffect, useState } from "react";
// import { FaRegHeart, FaHeart } from "react-icons/fa";
// import { API } from "../constant";
// import { useNavigate, useParams } from "react-router-dom";
// import { useWishlist } from "../context/wishlistContext";
// import { FiSearch } from "react-icons/fi";
// import axios from "axios";

// const SubcategoryProductsPage = () => {
//   const { subcategoryId } = useParams();
//   const navigate = useNavigate();

//   const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [priceRange, setPriceRange] = useState([0, 100000]);
//   const [selectedFabric, setSelectedFabric] = useState([]);
//   const [selectedWorkDetails, setSelectedWorkDetails] = useState([]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await axios.get(
//           `${API}/products/by-subcategory?subcategoryId=${subcategoryId}`
//         );
//         setProducts(res.data);
//         setFilteredProducts(res.data);

//         // Auto-set price range based on products
//         if (res.data.length > 0) {
//           const prices = res.data.map(p => p.price);
//           setPriceRange([Math.min(...prices), Math.max(...prices)]);
//         }
//       } catch (err) {
//         console.error("Failed to fetch products", err);
//       }
//     };
//     fetchProducts();
//   }, [subcategoryId]);

//   // Unique filter options
//   const fabrics = [...new Set(products.map(p => p.fabric).filter(Boolean))];
//   const workDetails = [...new Set(products.map(p => p.workDetails).filter(Boolean))];
//   const minPrice = Math.min(...products.map(p => p.price));
//   const maxPrice = Math.max(...products.map(p => p.price));

//   // Filtering logic
//   useEffect(() => {
//     let filtered = [...products];

//     // Search
//     if (searchTerm.trim() !== "") {
//       filtered = filtered.filter(p =>
//         p.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Price
//     filtered = filtered.filter(
//       p => p.price >= priceRange[0] && p.price <= priceRange[1]
//     );

//     // Fabric
//     if (selectedFabric.length) {
//       filtered = filtered.filter(p => selectedFabric.includes(p.fabric));
//     }

//     // Work Details
//     if (selectedWorkDetails.length) {
//       filtered = filtered.filter(p => selectedWorkDetails.includes(p.workDetails));
//     }

//     setFilteredProducts(filtered);
//   }, [products, searchTerm, priceRange, selectedFabric, selectedWorkDetails]);

//   const handleWishlistToggle = (e, productId) => {
//     e.stopPropagation();
//     if (isInWishlist(productId)) {
//       removeFromWishlist(productId);
//     } else {
//       addToWishlist(productId);
//     }
//   };

//   const clearFilters = () => {
//     setSearchTerm("");
//     setPriceRange([minPrice, maxPrice]);
//     setSelectedFabric([]);
//     setSelectedWorkDetails([]);
//   };

//   return (
//     <div className="max-w-[1450px] mx-auto px-4 mt-4 mb-20">
//       <h2
//         className="text-center text-xl font-semibold mb-8"
//         style={{ fontFamily: "'Trirong', serif" }}
//       >
//         Explore
//       </h2>

//       <div className="flex gap-8">
//         {/* Sidebar Filters */}
//         <aside className="w-80 bg-gray-50 p-6 rounded-lg h-fit">
//           <div className="flex justify-between items-center mb-6">
//             <h3 className="text-lg font-semibold">Filters</h3>
//             <button
//               onClick={clearFilters}
//               className="text-sm text-blue-600 hover:text-blue-800 underline"
//             >
//               Clear All
//             </button>
//           </div>

//           {/* Search */}
//           <div className="mb-6 pb-6 border-b border-gray-400">
//             <div className="relative">
//               <FiSearch
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                 size={18}
//               />
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full border border-gray-300 rounded pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
//               />
//             </div>
//           </div>

//           {/* Price Range */}
//           <div className="mb-6 pb-6 border-b border-gray-400">
//             <h4 className="font-semibold mb-4">Price Range</h4>
//             <input
//               type="range"
//               min={minPrice}
//               max={maxPrice}
//               value={priceRange[1]}
//               onChange={(e) => setPriceRange([minPrice, Number(e.target.value)])}
//               className="w-full accent-black"
//             />
//             <div className="flex justify-between text-sm text-gray-600">
//               <span>₹{priceRange[0]}</span>
//               <span>₹{priceRange[1]}</span>
//             </div>
//           </div>

//           {/* Fabric Filter */}
//           <div className="mb-6 pb-6 border-b border-gray-400">
//             <h4 className="font-semibold mb-4">Fabric</h4>
//             <div className="space-y-2 max-h-40 overflow-y-auto">
//               {fabrics.map(f => (
//                 <label key={f} className="flex items-center space-x-2 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={selectedFabric.includes(f)}
//                     onChange={() =>
//                       setSelectedFabric(prev =>
//                         prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
//                       )
//                     }
//                     className="rounded text-black focus:ring-black"
//                   />
//                   <span className="text-sm text-gray-700">{f}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Work Details Filter */}
//           <div>
//             <h4 className="font-semibold mb-4">Work Details</h4>
//             <div className="space-y-2 max-h-40 overflow-y-auto">
//               {workDetails.map(w => (
//                 <label key={w} className="flex items-center space-x-2 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={selectedWorkDetails.includes(w)}
//                     onChange={() =>
//                       setSelectedWorkDetails(prev =>
//                         prev.includes(w) ? prev.filter(x => x !== w) : [...prev, w]
//                       )
//                     }
//                     className="rounded text-black focus:ring-black"
//                   />
//                   <span className="text-sm text-gray-700">{w}</span>
//                 </label>
//               ))}
//             </div>
//           </div>
//         </aside>

//         {/* Product Grid */}
//         <main className="flex-1">
//           {filteredProducts.length === 0 ? (
//             <div className="text-center py-12">
//               <p className="text-gray-500 text-lg mb-4">
//                 No products found matching your filters
//               </p>
//               <button
//                 onClick={clearFilters}
//                 className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
//               >
//                 Clear Filters
//               </button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//               {filteredProducts.map((product) => {
//                 const inWishlist = isInWishlist(product._id);
//                 return (
//                   <div
//                     key={product._id}
//                     className="relative group cursor-pointer"
//                     onClick={() => navigate(`/${product.slug}/${product._id}`)}
//                   >
//                     <div className="relative">
//                       <img
//                         src={`${API}${product.images?.[0]?.url}`}
//                         alt={product.name}
//                         className="w-full h-auto object-cover"
//                       />
//                       <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                         <button
//                           className="bg-white p-2 rounded-full shadow"
//                           onClick={(e) => handleWishlistToggle(e, product._id)}
//                         >
//                           {inWishlist ? (
//                             <FaHeart size={18} className="text-pink-500" />
//                           ) : (
//                             <FaRegHeart size={18} className="text-gray-600" />
//                           )}
//                         </button>
//                       </div>
//                     </div>
//                     <p className="text-sm mt-2">{product.name}</p>
//                     <p className="font-medium">₹{product.price}</p>
//                     <div className="flex gap-2 mt-1">
//                       {product.colors?.map((color, index) => (
//                         <span
//                           key={index}
//                           className="w-4 h-4 rounded-full border"
//                           style={{ backgroundColor: color }}
//                         ></span>
//                       ))}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default SubcategoryProductsPage;


import React, { useEffect, useState } from "react";
import { FaRegHeart, FaHeart, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { API } from "../constant";
import { useNavigate, useParams } from "react-router-dom";
import { useWishlist } from "../context/wishlistContext";
import { FiSearch } from "react-icons/fi";
import axios from "axios";

const SubcategoryProductsPage = () => {
  const { subcategoryId } = useParams();
  const navigate = useNavigate();

  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedFabric, setSelectedFabric] = useState([]);
  const [selectedWorkDetails, setSelectedWorkDetails] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${API}/products/by-subcategory?subcategoryId=${subcategoryId}`
        );
        setProducts(res.data);
        setFilteredProducts(res.data);

        // Auto-set price range based on products
        if (res.data.length > 0) {
          const prices = res.data.map(p => p.price);
          setPriceRange([Math.min(...prices), Math.max(...prices)]);
        }
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, [subcategoryId]);

  // Unique filter options
  const fabrics = [...new Set(products.map(p => p.fabric).filter(Boolean))];
  const workDetails = [...new Set(products.map(p => p.workDetails).filter(Boolean))];
  const minPrice = Math.min(...products.map(p => p.price));
  const maxPrice = Math.max(...products.map(p => p.price));

  // Filtering logic
  useEffect(() => {
    let filtered = [...products];

    // Search
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price
    filtered = filtered.filter(
      p => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Fabric
    if (selectedFabric.length) {
      filtered = filtered.filter(p => selectedFabric.includes(p.fabric));
    }

    // Work Details
    if (selectedWorkDetails.length) {
      filtered = filtered.filter(p => selectedWorkDetails.includes(p.workDetails));
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, priceRange, selectedFabric, selectedWorkDetails]);

  const handleWishlistToggle = (e, productId) => {
    e.stopPropagation();
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPriceRange([minPrice, maxPrice]);
    setSelectedFabric([]);
    setSelectedWorkDetails([]);
  };

  const FilterSection = () => (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Clear All
        </button>
      </div>

      {/* Search */}
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

      {/* Price Range */}
      <div className="mb-6 pb-6 border-b border-gray-400">
        <h4 className="font-semibold mb-4">Price Range</h4>
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([minPrice, Number(e.target.value)])}
          className="w-full accent-black"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>

      {/* Fabric Filter */}
      <div className="mb-6 pb-6 border-b border-gray-400">
        <h4 className="font-semibold mb-4">Fabric</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {fabrics.map(f => (
            <label key={f} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFabric.includes(f)}
                onChange={() =>
                  setSelectedFabric(prev =>
                    prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
                  )
                }
                className="rounded text-black focus:ring-black"
              />
              <span className="text-sm text-gray-700">{f}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Work Details Filter */}
      <div>
        <h4 className="font-semibold mb-4">Work Details</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {workDetails.map(w => (
            <label key={w} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedWorkDetails.includes(w)}
                onChange={() =>
                  setSelectedWorkDetails(prev =>
                    prev.includes(w) ? prev.filter(x => x !== w) : [...prev, w]
                  )
                }
                className="rounded text-black focus:ring-black"
              />
              <span className="text-sm text-gray-700">{w}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1450px] mx-auto px-4 mt-4 mb-20">
      <h2
        className="text-center text-xl font-semibold mb-8"
        style={{ fontFamily: "'Trirong', serif" }}
      >
        Explore
      </h2>

      {/* Desktop Layout */}
      <div className="hidden md:flex gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="w-80 h-fit">
          <FilterSection />
        </aside>

        {/* Desktop Product Grid */}
        <main className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">
                No products found matching your filters
              </p>
              <button
                onClick={clearFilters}
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const inWishlist = isInWishlist(product._id);
                return (
                  <div
                    key={product._id}
                    className="relative group cursor-pointer"
                    onClick={() => navigate(`/${product.slug}/${product._id}`)}
                  >
                    <div className="relative">
                      <img
                        src={`${API}${product.images?.[0]?.url}`}
                        alt={product.name}
                        className="w-full h-auto object-cover"
                      />
                      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="bg-white p-2 rounded-full shadow"
                          onClick={(e) => handleWishlistToggle(e, product._id)}
                        >
                          {inWishlist ? (
                            <FaHeart size={18} className="text-pink-500" />
                          ) : (
                            <FaRegHeart size={18} className="text-gray-600" />
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
          )}
        </main>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Mobile Filter Toggle */}
        <div className="mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-between w-full bg-gray-50 p-4 rounded-lg border border-gray-200"
          >
            <span className="font-semibold">Filters</span>
            {showFilters ? (
              <FaChevronUp className="text-gray-600" />
            ) : (
              <FaChevronDown className="text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Collapsible Filters */}
        {showFilters && (
          <div className="mb-6">
            <FilterSection />
          </div>
        )}

        {/* Mobile Product Grid */}
        <main>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">
                No products found matching your filters
              </p>
              <button
                onClick={clearFilters}
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredProducts.map((product) => {
                const inWishlist = isInWishlist(product._id);
                return (
                  <div
                    key={product._id}
                    className="relative group cursor-pointer"
                    onClick={() => navigate(`/${product.slug}/${product._id}`)}
                  >
                    <div className="relative">
                      <img
                        src={`${API}${product.images?.[0]?.url}`}
                        alt={product.name}
                        className="w-full h-auto object-cover"
                      />
                      <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="bg-white p-1.5 rounded-full shadow"
                          onClick={(e) => handleWishlistToggle(e, product._id)}
                        >
                          {inWishlist ? (
                            <FaHeart size={14} className="text-pink-500" />
                          ) : (
                            <FaRegHeart size={14} className="text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs mt-2">{product.name}</p>
                    <p className="font-medium text-sm">₹{product.price}</p>
                    <div className="flex gap-1 mt-1">
                      {product.colors?.map((color, index) => (
                        <span
                          key={index}
                          className="w-3 h-3 rounded-full border"
                          style={{ backgroundColor: color }}
                        ></span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SubcategoryProductsPage;