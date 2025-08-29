import React, { useState, useEffect } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../constant.js";
import { useWishlist } from "../context/wishlistContext.jsx";

const Dress = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    const fetchDresses = async () => {
      try {
        const { data } = await axios.get(`${API}/products/by-category?category=Dress`);
        // Filter out products where isReel is true
        const filteredProducts = data.filter(product => !product.isReel);
        setProducts(filteredProducts);
      } catch (err) {
        console.error("Failed to fetch dresses", err);
      }
    };

    fetchDresses();
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
    <div className="max-w-[1450px] mx-auto px-4 my-10">
      <h2 className="text-center text-xl font-semibold mb-8" style={{ fontFamily: "'Trirong', serif" }}>
        Dress Collection
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => {
          const inWishlist = isInWishlist(product._id);

          return (
            <div
              key={product._id}
              className="relative group cursor-pointer"
              onClick={() => navigate(`/${product.slug}/${product._id}`)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={`${API}${product.images?.[0]?.url}`}
                  alt={product.name}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow"
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

              {product.colors?.length > 0 && (
                <div className="flex gap-2 mt-1">
                  {product.colors.slice(0, 4).map((color, index) => (
                    <span
                      key={index}
                      className="w-4 h-4 rounded-full border border-gray-300"
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
          );
        })}
      </div>
    </div>
  );
};

export default Dress;