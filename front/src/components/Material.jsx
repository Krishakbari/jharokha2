import React from 'react';
import material from "../assets/matrial.png";

const Material = () => {
  return (
    <div className="w-full px-4 md:px-12 my-12">
      <div className="relative max-w-[1430px] mx-auto h-[500px] group overflow-hidden rounded-lg">
        {/* Background Image */}
        <img
          src={material}
          alt="Dress Materials"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Dark Overlay + Right Aligned Content */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/40 to-transparent flex flex-col justify-center items-end p-8 md:p-12 text-right">
          <h2 className="text-white text-3xl font-semibold mb-2">Dress Materials</h2>
          <p className="text-white text-sm mb-4">
            Celebrate Love. Discover Our Wedding Collection
          </p>
          <button className="bg-white text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Material;
