import React, { useEffect, useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { API } from "../constant";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/wishlistContext";

const Newarrival = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API}/products`);
        const data = await res.json();
        // Filter for new arrivals that are NOT reels
        const filtered = data.filter(
          (product) => product.newArrivals === true && !product.isReel
        );
        setProducts(filtered);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleWishlistToggle = (e, productId) => {
    e.stopPropagation();
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  return (
    <div className="max-w-[1450px] mx-auto px-4 py-4 md:py-8">
      <h2
        className="text-center text-lg md:text-xl font-semibold mb-6 md:mb-8"
        style={{ fontFamily: "'Trirong', serif" }}
      >
        New Arrivals
      </h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No new arrivals found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {products.map((product) => {
            const inWishlist = isInWishlist(product._id);

            return (
              <div
                key={product._id}
                className="relative group cursor-pointer"
                onClick={() => navigate(`/${product.slug}/${product._id}`)}
              >
                <div className="relative overflow-hidden group">
                  <img
                    src={`${API}${product.images?.[0]?.url}`}
                    alt={product.name}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Wishlist Button - Always visible on mobile, hover on desktop */}
                  <div className="absolute top-2 right-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      className="bg-white p-1.5 md:p-2 rounded-full shadow-md hover:shadow-lg transition-shadow"
                      onClick={(e) => handleWishlistToggle(e, product._id)}
                    >
                      {inWishlist ? (
                        <FaHeart size={14} className="text-pink-500 md:w-[18px] md:h-[18px]" />
                      ) : (
                        <FaRegHeart size={14} className="text-gray-600 md:w-[18px] md:h-[18px]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="mt-2">
                  <p className="text-xs md:text-sm line-clamp-2">{product.name}</p>
                  <p className="font-medium text-sm md:text-base mt-1">₹{product.price}</p>

                  {/* Colors */}
                  {product.colors?.length > 0 && (
                    <div className="flex gap-1 md:gap-2 mt-1">
                      {product.colors.slice(0, 4).map((color, index) => (
                        <span
                          key={index}
                          className="w-3 h-3 md:w-4 md:h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: color }}
                        ></span>
                      ))}
                      {product.colors.length > 4 && (
                        <span className="text-xs text-gray-500 self-center">
                          +{product.colors.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Newarrival;