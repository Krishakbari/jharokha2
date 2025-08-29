import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../constant";
import { useNavigate } from "react-router-dom";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API}/categories`);
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="max-w-[1450px] mx-auto px-4 py-12">
       <h2 
        className="text-center text-lg sm:text-xl md:text-2xl font-semibold mb-6 sm:mb-8" 
        style={{ fontFamily: "'Trirong', serif" }}
      >
        Categories
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {categories.map((category) => (
          <div
            key={category._id}
            className="relative overflow-hidden group shadow-md"
          >
            <img
              src={`${API}/img/${category.image}`}
              alt={category.name}
              className="w-full h-[450px] object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition duration-300"></div>
            <div className="absolute bottom-6 w-full flex flex-col items-center text-white">
              <h3 className="text-lg font-medium">{category.name}</h3>
              <button
                onClick={() => navigate(`/category/${category.slug}`)}
                className="mt-3 bg-white text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition"
              >
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
