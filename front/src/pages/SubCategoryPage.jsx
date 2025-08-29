import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../constant";
import { useParams, Link } from "react-router-dom";

const SubCategoryPage = () => {
  const { slug } = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const res = await axios.get(`${API}/categories/${slug}`);
        setSubcategories(res.data);

        if (res.data.length > 0 && res.data[0].parent?.name) {
          setCategoryName(res.data[0].parent.name);
        } else {
          // If no parent name, take from slug
          setCategoryName(slug.charAt(0).toUpperCase() + slug.slice(1));
        }
      } catch (err) {
        console.error("Failed to fetch subcategories", err);
        // On error, still show name from slug
        setCategoryName(slug.charAt(0).toUpperCase() + slug.slice(1));
      }
    };

    fetchSubcategories();
  }, [slug]);

  return (
    <div className="max-w-[1450px] mx-auto px-4 mt-4 mb-20">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-gray-800 inline-block relative">
          {`Explore Our ${categoryName} Collection`}
          <span className="block w-16 h-1 bg-pink-500 mx-auto mt-2 rounded-full"></span>
        </h2>
      </div>

      {/* Grid */}
      {subcategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {subcategories.map((sub) => (
            <Link to={`/subcategory/${sub._id}`} key={sub._id}>
              <div className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300">
                <img
                  src={`${API}/img/${sub.image}`}
                  alt={sub.name}
                  className="w-full h-[450px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition"></div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
                  <h3 className="text-white text-xl font-semibold drop-shadow-lg">
                    {sub.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center text-lg">
          No subcategories found.
        </p>
      )}
    </div>
  );
};

export default SubCategoryPage;
