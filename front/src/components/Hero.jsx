
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import heroimg from "../assets/heroimg.png";

// const Hero = () => {
//   const navigate = useNavigate();

//   const handleShopNow = () => {
//     navigate("/collection/wedding");
//   };

//   return (
//     <div className="relative w-full h-[18vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-hidden">
//       {/* Hero Image */}
//       <img
//         src={heroimg}
//         alt="Wedding Collection Hero"
//         className="absolute inset-0 w-full h-full object-cover object-center"
//       />
      
//       {/* Dark overlay for better text readability */}
//       <div className="absolute inset-0 bg-black bg-opacity-20 sm:bg-opacity-10"></div>
      
//       {/* Content */}
//       <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4 sm:px-6 md:px-8 max-w-4xl mx-auto">
//         <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-3 sm:mb-4">
//           Wedding Collection
//         </h1>
//         <p className="mt-2 sm:mt-4 text-sm sm:text-base md:text-lg lg:text-xl opacity-90 leading-relaxed">
//           Celebrate Love. Discover Our Wedding Collection
//         </p>
//         <button
//           onClick={handleShopNow}
//           className="mt-6 sm:mt-8 px-6 sm:px-8 py-3 sm:py-4 bg-black text-white text-sm sm:text-base font-medium rounded-full hover:bg-gray-800 active:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
//         >
//           Shop Now
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Hero;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import { API } from "../constant";

// const Hero = () => {
//   const [sliders, setSliders] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchSliders = async () => {
//       try {
//         const res = await fetch(`${API}/slider`);
//         const data = await res.json();
//         console.log("Fetched sliders:", data); // Debug log
//         console.log("Number of sliders:", data.length); // Debug log
//         setSliders(data);
//       } catch (err) {
//         console.error("Error fetching sliders:", err);
//       }
//     };
//     fetchSliders();
//   }, []);

//   const handleRedirect = (redirectTo) => {
//     navigate(redirectTo);
//   };

//   // Show loading state
//   if (sliders.length === 0) {
//     return (
//       <div className="relative w-full h-[18vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] flex items-center justify-center">
//         <p>Loading slides...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="relative w-full h-[18vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh]">
//       <Swiper
//         modules={[Autoplay, Pagination]}
//         autoplay={{ 
//           delay: 3000, 
//           disableOnInteraction: false 
//         }}
//         pagination={{ 
//           clickable: true,
//           dynamicBullets: true // Better for single slide
//         }}
//         loop={sliders.length > 1} // Only loop if multiple slides
//         className="w-full h-full"
//         spaceBetween={0}
//         slidesPerView={1}
//         allowTouchMove={sliders.length > 1} // Disable touch if single slide
//       >
//         {sliders.map((slide, idx) => (
//           <SwiperSlide key={slide.id || idx}>
//             <div className="relative w-full h-full">
//               <img
//                 src={`${API}${slide.image}`}
//                 alt={slide.title || "Slide image"}
//                 className="absolute inset-0 w-full h-full object-cover object-center"
//                 onError={(e) => {
//                   console.error("Image failed to load:", e.target.src);
//                 }}
//               />
//               <div className="absolute inset-0 bg-black bg-opacity-30"></div>
              
//               <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4 max-w-4xl mx-auto">
//                 <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-3">
//                   {slide.title}
//                 </h1>
//                 <p className="mt-2 text-sm sm:text-base md:text-lg lg:text-xl opacity-90 leading-relaxed">
//                   {slide.subtitle}
//                 </p>
//                 {slide.redirectTo && (
//                   <button
//                     onClick={() => handleRedirect(slide.redirectTo)}
//                     className="mt-6 px-6 py-3 bg-black text-white text-sm sm:text-base font-medium rounded-full hover:bg-gray-800 transition-all shadow-lg"
//                   >
//                     Shop Now
//                   </button>
//                 )}
//               </div>
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
      
//       {/* Debug info - remove in production */}
//       <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-2 text-xs z-50">
//         Slides: {sliders.length}
//       </div>
//     </div>
//   );
// };

// export default Hero;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules"; // Removed Pagination from imports
import "swiper/css";
// Removed pagination CSS import
import { API } from "../constant";

const Hero = () => {
  const [sliders, setSliders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        console.log("API URL:", `${API}/slider`); // Debug log
        const res = await fetch(`${API}/slider`);
        console.log("Response status:", res.status); // Debug log
        console.log("Response headers:", res.headers); // Debug log
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("Raw API response:", data); // Debug log
        console.log("Response type:", typeof data); // Debug log
        console.log("Is array:", Array.isArray(data)); // Debug log
        console.log("Number of sliders:", data?.length); // Debug log
        
        // Ensure we have an array
        if (Array.isArray(data)) {
          setSliders(data);
        } else {
          console.error("API did not return an array:", data);
          setSliders([]);
        }
      } catch (err) {
        console.error("Error fetching sliders:", err);
        console.error("Error details:", err.message);
      }
    };
    fetchSliders();
  }, []);

  const handleRedirect = (redirectTo) => {
    navigate(redirectTo);
  };

  // Show loading state
  if (sliders.length === 0) {
    return (
      <div className="relative w-full h-[18vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] flex items-center justify-center">
        <p>Loading slides...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[18vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh]">
      <Swiper
        modules={[Autoplay]} // Removed Pagination from modules
        autoplay={{ 
          delay: 3000, 
          disableOnInteraction: false 
        }}
        // Removed pagination configuration
        loop={sliders.length > 1}
        className="w-full h-full"
        spaceBetween={0}
        slidesPerView={1}
        allowTouchMove={true}
        watchOverflow={true} // Disable swiper when not enough slides
      >
        {sliders.map((slide, idx) => (
          <SwiperSlide key={slide.id || idx}>
            <div className="relative w-full h-full">
              <img
                src={`${API}${slide.image}`}
                alt={slide.title || "Slide image"}
                className="absolute inset-0 w-full h-full object-cover object-center"
                onError={(e) => {
                  console.error("Image failed to load:", e.target.src);
                }}
              />
              {/* <div className="absolute inset-0 bg-black bg-opacity-30"></div> */}
              
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-2 sm:px-4 max-w-4xl mx-auto">
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-1 sm:mb-3">
                  {slide.title}
                </h1>
                <p className="mt-1 sm:mt-2 text-sm sm:text-base md:text-lg lg:text-xl opacity-90 leading-relaxed">
                  {slide.subtitle}
                </p>
                {slide.redirectTo && (
                  <button
                    onClick={() => handleRedirect(slide.redirectTo)}
                    className="mt-3 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-black text-white text-sm sm:text-base font-medium rounded-full hover:bg-gray-800 transition-all shadow-lg"
                  >
                    Shop Now
                  </button>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Hero;