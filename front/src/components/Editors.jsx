import React from 'react';
import { useNavigate } from "react-router-dom";
import bannerLeft from "../assets/bannerL.png";
import bannerRight from "../assets/bannerR.png";

const Editors = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full px-4 sm:px-6 md:px-12 my-8 sm:my-12">
      <h2 
        className="text-center text-lg sm:text-xl md:text-2xl font-semibold mb-6 sm:mb-8" 
        style={{ fontFamily: "'Trirong', serif" }}
      >
        Editor's Picks
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Wedding */}
        <div className="relative group overflow-hidden rounded-lg h-64 sm:h-80 md:h-full">
          <img 
            src={bannerLeft} 
            alt="Wedding Collection" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-l from-black/60 via-black/30 to-transparent flex flex-col justify-end sm:justify-center items-center sm:items-end p-4 sm:p-6 md:p-8 text-center sm:text-right">
            <h3 className="text-white text-lg sm:text-xl md:text-2xl font-semibold mb-2">
              Wedding Collection
            </h3>
            <p className="text-white text-xs sm:text-sm mb-3 sm:mb-4 opacity-90 max-w-xs">
              Celebrate Love. Discover Our Wedding Collection
            </p>
            <button 
              onClick={() => navigate("/collection/wedding")}
              className="bg-white text-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-200 active:bg-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              Shop Now
            </button>
          </div>
        </div>

        {/* Navratri */}
        <div className="relative group overflow-hidden rounded-lg h-64 sm:h-80 md:h-full">
          <img 
            src={bannerRight} 
            alt="Navratri Collection" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-l from-black/60 via-black/30 to-transparent flex flex-col justify-end sm:justify-center items-center sm:items-end p-4 sm:p-6 md:p-8 text-center sm:text-right">
            <h3 className="text-white text-lg sm:text-xl md:text-2xl font-semibold mb-2">
              Navratri Collection
            </h3>
            <p className="text-white text-xs sm:text-sm mb-3 sm:mb-4 opacity-90 max-w-xs">
              Dance to the Divine Rhythms of Navratri
            </p>
            <button 
              onClick={() => navigate("/collection/navratri")}
              className="bg-white text-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-200 active:bg-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              Shop Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Editors;