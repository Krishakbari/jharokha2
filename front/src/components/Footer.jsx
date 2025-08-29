// import React from 'react'
// import { FaLinkedinIn, FaFacebookF, FaTwitter } from 'react-icons/fa'
// import { useNavigate } from 'react-router-dom'

// const Footer = () => {
//   const navigate=useNavigate()
//   return (
//     <footer className="bg-[#21380E] text-white py-12">
//       <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
//         {/* Categories */}
//         <div>
//           <h3 className="font-semibold mb-4">Categories</h3>
//           <ul className="space-y-2 text-sm text-gray-300">
//             <li >Sarees</li>
//             <li>Gowns</li>
//             <li>Blows</li>
//             <li>Dress</li>
//             <li>Lehenga Choli</li>
//             <li>Salwar Kameez</li>
//           </ul>
//         </div>

//         {/* Company */}
//         <div>
//           <h3 className="font-semibold mb-4">Company</h3>
//           <ul className="space-y-2 text-sm text-gray-300">
//             <li>Home</li>
//             <li>About</li>
//             <li>Contact</li>
//             <li>Shop</li>
//             <li>Account</li>
//             <li>Cart</li>
//           </ul>
//         </div>

//         {/* Information */}
//         <div>
//           <h3 className="font-semibold mb-4">Information</h3>
//           <ul className="space-y-2 text-sm text-gray-300">
//             <li>Search</li>
//             <li>Privacy Policy</li>
//             <li>Refund Policy</li>
//             <li>Shipping Policy</li>
//             <li>Terms of Services</li>
//           </ul>
//         </div>

//         {/* Stay Connect */}
//         <div>
//           <h3 className="font-semibold mb-4">Stay Connect</h3>
//           <p className="text-sm mb-2">Email:</p>
//           <p className="text-sm text-gray-300 mb-4">saree@gmail.com</p>
//           <p className="text-sm mb-2">Customer Care Number:</p>
//           <p className="text-sm text-gray-300 mb-4">+91 99999 99999</p>

//           {/* Subscribe */}
//           <div className="flex mb-6">
//             <input 
//               type="email" 
//               placeholder="Email address"
//               className="px-3 py-2 rounded-l-md w-full text-black text-sm outline-none"
//             />
//             <button className="bg-[#A07642] px-4 rounded-r-md hover:bg-[#8f6639]">
//               ➔
//             </button>
//           </div>

//           {/* Social Icons */}
//           <div className="flex space-x-4">
//             <a href="#" className="border border-gray-400 p-2 rounded-full hover:bg-gray-700"><FaLinkedinIn /></a>
//             <a href="#" className="border border-gray-400 p-2 rounded-full hover:bg-gray-700"><FaFacebookF /></a>
//             <a href="#" className="border border-gray-400 p-2 rounded-full hover:bg-gray-700"><FaTwitter /></a>
//           </div>
//         </div>
//       </div>

//       {/* Bottom line */}
//       <div className="border-t border-gray-500 mt-8 pt-6 text-center text-sm text-gray-400">
//         © 2025 Company Name. Design by Godhani Technology
//       </div>
//     </footer>
//   )
// }

// export default Footer

import React, { useEffect, useState } from 'react'
import { FaLinkedinIn, FaFacebookF, FaTwitter , FaInstagram } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API } from '../constant'

const Footer = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API}/categories`)
        setCategories(res.data)
      } catch (err) {
        console.error("Failed to fetch categories", err)
      }
    }

    fetchCategories()
  }, [])

  // Function to handle category click with scroll to top
  const handleCategoryClick = (slug) => {
    // Scroll to top smoothly
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    
    // Small delay to ensure smooth scroll starts before navigation
    setTimeout(() => {
      navigate(`/category/${slug}`)
    }, 100)
  }

  // Function to handle company navigation with scroll to top
  const handleNavigation = (path) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    
    setTimeout(() => {
      navigate(path)
    }, 100)
  }

  return (
    <footer className="bg-[#21380E] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Categories - Dynamic List */}
        <div>
          <h3 className="font-semibold mb-4">Categories</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            {categories.length > 0 ? (
              categories.map((category) => (
                <li 
                  key={category._id}
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleCategoryClick(category.slug)}
                >
                  {category.name}
                </li>
              ))
            ) : (
              // Fallback categories while loading
              <>
                <li className="cursor-pointer hover:text-white transition-colors" onClick={() => handleCategoryClick('sarees')}>Sarees</li>
                <li className="cursor-pointer hover:text-white transition-colors" onClick={() => handleCategoryClick('gowns')}>Gowns</li>
                <li className="cursor-pointer hover:text-white transition-colors" onClick={() => handleCategoryClick('blows')}>Blows</li>
                <li className="cursor-pointer hover:text-white transition-colors" onClick={() => handleCategoryClick('dress')}>Dress</li>
                <li className="cursor-pointer hover:text-white transition-colors" onClick={() => handleCategoryClick('lehenga-choli')}>Lehenga Choli</li>
                <li className="cursor-pointer hover:text-white transition-colors" onClick={() => handleCategoryClick('salwar-kameez')}>Salwar Kameez</li>
              </>
            )}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold mb-4">Jharokha</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="cursor-pointer hover:text-white transition-colors" onClick={() => handleNavigation('/')}>Home</li>
            <li className="cursor-pointer hover:text-white transition-colors" onClick={() => handleNavigation('/about')}>About</li>
            <li className="cursor-pointer hover:text-white transition-colors" onClick={() => handleNavigation('/contact')}>Contact</li>
            <li className="cursor-pointer hover:text-white transition-colors" onClick={() => handleNavigation('/collections')}>Shop</li>
            <li className="cursor-pointer hover:text-white transition-colors" onClick={() => handleNavigation('/profile')}>Account</li>
            <li className="cursor-pointer hover:text-white transition-colors" onClick={() => handleNavigation('/cart')}>Cart</li>
          </ul>
        </div>

        {/* Information */}
        <div>
          <h3 className="font-semibold mb-4">Policies</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="cursor-pointer hover:text-white transition-colors">Privacy Policy</li>
            <li className="cursor-pointer hover:text-white transition-colors">Refund Policy</li>
            <li className="cursor-pointer hover:text-white transition-colors">Shipping Policy</li>
            <li className="cursor-pointer hover:text-white transition-colors">Terms of Services</li>
          </ul>
        </div>

        {/* Stay Connect */}
        <div>
          <h3 className="font-semibold mb-4">Stay Connect</h3>
          <p className="text-sm mb-2">Email:</p>
          <p className="text-sm text-gray-300 mb-4">saree@gmail.com</p>
          <p className="text-sm mb-2">Customer Care Number:</p>
          <p className="text-sm text-gray-300 mb-4">+91 99999 99999</p>

          {/* Subscribe */}
          <div className="flex mb-6">
            <input
              type="email"
              placeholder="Email address"
              className="px-3 py-2 rounded-l-md w-full text-black text-sm outline-none"
            />
            <button className="bg-[#A07642] px-4 rounded-r-md hover:bg-[#8f6639]">
              ➔
            </button>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-4">
            <a href="#" className="border border-gray-400 p-2 rounded-full hover:bg-gray-700"><FaLinkedinIn /></a>
            <a href="#" className="border border-gray-400 p-2 rounded-full hover:bg-gray-700"><FaInstagram /></a>
            <a href="#" className="border border-gray-400 p-2 rounded-full hover:bg-gray-700"><FaFacebookF /></a>
            <a href="#" className="border border-gray-400 p-2 rounded-full hover:bg-gray-700"><FaTwitter /></a>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="border-t border-gray-500 mt-8 pt-6 text-center text-sm text-gray-400">
        © 2025 Company Name. Design by Godhani Technology
      </div>
    </footer>
  )
}

export default Footer