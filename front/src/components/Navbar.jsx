import React, { useState, useEffect } from "react";
import { FaInstagram, FaEnvelope, FaPhone, FaLinkedin, FaFacebook, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // Twitter X logo
import { FiSearch, FiShoppingBag, FiUser, FiHeart, FiMenu, FiX } from "react-icons/fi";
// import logo from "../assets/log.png";
// import logo from "../assets/l.png";
import logo from "../assets/l2.png";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useWishlist } from "../context/wishlistContext";
import { useCart } from "../context/cartContext";
import { useLocation } from "react-router-dom";
import { API } from "../constant";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const { wishlist } = useWishlist();
  const { cart } = useCart();
  const location = useLocation();
  const [sareeSubcategories, setSareeSubcategories] = useState([]);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  // Fetch saree subcategories on component mount
  useEffect(() => {
    const fetchSareeSubcategories = async () => {
      try {
        // First get all categories to find the sarees category
        const categoriesRes = await axios.get(`${API}/categories`);
        const sareeCategory = categoriesRes.data.find(cat =>
          cat.slug === 'sarees' || cat.name.toLowerCase().includes('saree')
        );

        if (sareeCategory) {
          // Then get subcategories for the sarees category
          const subcategoriesRes = await axios.get(`${API}/categories/${sareeCategory.slug}`);
          setSareeSubcategories(subcategoriesRes.data);
        }
      } catch (err) {
        console.error("Failed to fetch saree subcategories", err);
      }
    };

    fetchSareeSubcategories();
  }, []);

  const handleMouseEnter = () => {
    if (window.innerWidth >= 768) { // Only on desktop
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
      setOpenDropdown("sarees");
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 768) { // Only on desktop
      const timeout = setTimeout(() => {
        setOpenDropdown(null);
      }, 150); // Small delay before closing
      setHoverTimeout(timeout);
    }
  };

  const toggleDropdown = (menu) => {
    if (menu === "collections") {
      navigate("/collections");
    }
    setOpenDropdown(prev => (prev === menu ? null : menu));
  };

  // Check if user is logged in based on auth context
  const isLoggedIn = auth?.user && auth?.token;

  const handleLogout = () => {
    // Reset auth context
    setAuth({ user: null, token: "" });

    // Clear localStorage
    localStorage.removeItem("auth");

    // Manually remove Authorization header
    delete axios.defaults.headers.common["Authorization"];

    // Reset state and redirect
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const handleSubcategoryClick = (subcategoryId) => {
    navigate(`/subcategory/${subcategoryId}`);
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="w-full">
      {/* Top Green Bar - Hidden on mobile */}
      {/* <div className="bg-[#1A2E07] text-white text-sm py-2  px-4 md:px-20 flex items-center justify-between">
        <div className="hidden md:flex items-center gap-6">
          <FaInstagram size={18} className="cursor-pointer" />
          <FaXTwitter size={18} className="cursor-pointer" />
        </div>

        <p className="text-center text-lg sm:text-sm flex-1 md:flex-initial">
          - - Welcome to JHAROKHA   - - 
        </p>

        <div className="hidden md:flex items-center gap-6">
          <FaLinkedin size={18} className="cursor-pointer" />
          <FaFacebook size={18} className="cursor-pointer" />
        </div>
      </div> */}

      {/* Main Navigation */}
      <div className="relative bg-gray-100 flex items-center justify-between py-2 md:py-8 px-4 md:px-20 border-b border-gray-200">
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Desktop Left Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <span
            className="cursor-pointer flex items-center gap-1"
            onClick={() => navigate("/collections")}
          >
            SHOP {openDropdown === "shop"}
          </span>

          {/* SAREES with Dropdown - FIXED HOVER AREA */}
          {/* <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span
              className="cursor-pointer flex items-center gap-1 py-2"
              onClick={() => navigate("/category/saree")}
            >
              SAREES {openDropdown === "sarees" ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </span>

            {openDropdown === "sarees" && sareeSubcategories.length > 0 && (
              <div
                className="absolute top-full left-0 mt-0 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="py-2">
                  {sareeSubcategories.map((subcategory) => (
                    <button
                      key={subcategory._id}
                      onClick={() => handleSubcategoryClick(subcategory._id)}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150 flex items-center gap-3"
                    >
                      <span>{subcategory.name}</span>
                    </button>
                  ))}

                  <hr className="my-2 border-gray-200" />
                  <button
                    onClick={() => {
                      navigate("/category/saree");
                      setOpenDropdown(null);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-blue-600 hover:bg-gray-100 font-medium transition-colors duration-150"
                  >
                    View All Sarees
                  </button>
                </div>
              </div>
            )}
          </div> */}

          {/* COLLECTIONS with Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => {
              if (hoverTimeout) clearTimeout(hoverTimeout);
              setOpenDropdown("collections");
            }}
            onMouseLeave={() => {
              const timeout = setTimeout(() => setOpenDropdown(null), 150);
              setHoverTimeout(timeout);
            }}
          >
            <span className="cursor-pointer flex items-center gap-1 py-2">
              COLLECTIONS {openDropdown === "collections" ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </span>

            {openDropdown === "collections" && (
              <div
                className="absolute top-full left-0 mt-0 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                onMouseEnter={() => {
                  if (hoverTimeout) clearTimeout(hoverTimeout);
                  setOpenDropdown("collections");
                }}
                onMouseLeave={() => {
                  const timeout = setTimeout(() => setOpenDropdown(null), 150);
                  setHoverTimeout(timeout);
                }}
              >
                <div className="py-2">
                  <button
                    onClick={() => {
                      navigate("/collection/navratri");
                      setOpenDropdown(null);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                  >
                    Navratri Collection
                  </button>
                  <button
                    onClick={() => {
                      navigate("/collection/wedding");
                      setOpenDropdown(null);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                  >
                    Wedding Collection
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* <span className="cursor-pointer" onClick={() => navigate("/category/lehenga")}>LEHENGA CHOLI</span> */}
        </div>

        {/* Logo (Centered on desktop, left-aligned on mobile after menu button) */}
        <div className="flex-1 md:absolute md:left-1/2 md:transform md:-translate-x-1/2 flex justify-center md:justify-center">
          <img
            src={logo}
            alt="Sareefy Logo"
            className="h-20 md:h-32 object-cover cursor-pointer sm:py-2"
            onClick={() => navigate("/")}
          />
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4 md:gap-6">
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/cart")}
          >
            <FiShoppingBag size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </div>

          {/* Profile Icon with Dropdown */}
          <div className="relative">
            <FiUser
              size={20}
              className="cursor-pointer"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            />

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 top-8 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div className="py-1">
                  {isLoggedIn ? (
                    <>
                      <a
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        My Profile
                      </a>
                      <a
                        href="/my-order"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        My Orders
                      </a>
                      {auth?.user?.email === "admin@gmail.com" && (
                        <a
                          href="/admin/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Admin Orders
                        </a>
                      )}
                      {auth?.user?.email === "admin@gmail.com" && (
                        <a
                          href="/admin/sliders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Manage Slider
                        </a>
                      )}

                      {auth?.user?.email === "admin@gmail.com" && (
                        <a
                          href="/admin/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Dashboard
                        </a>
                      )}
                      {auth?.user?.email === "admin@gmail.com" && (
                        <a
                          href="/admin/users"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Admin Users
                        </a>
                      )}
                      {auth?.user?.email === "admin@gmail.com" && (
                        <a
                          href="/admin/categories"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Manage Categories
                        </a>
                      )}
                      {auth?.user?.email === "admin@gmail.com" && (
                        <a
                          href="/admin/products"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Manage Products
                        </a>
                      )}
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <a
                        href="/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Login
                      </a>
                      <a
                        href="/register"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Register
                      </a>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div
            className="relative cursor-pointer"
            onClick={() => {
              if (location.pathname === "/wishlist") {
                // Force reload if already on wishlist page
                window.location.reload();
              } else {
                navigate("/wishlist");
              }
            }}
          >
            <FiHeart size={20} />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in">
          <div
            className={`fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto rounded-r-2xl transition-all duration-500 ease-out transform ${isMobileMenuOpen
                ? 'translate-x-0 opacity-100'
                : '-translate-x-full opacity-0'
              }`}
          >
            <div className="p-4">
              {/* Close Button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110 active:scale-95"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Mobile Navigation Menu */}
              <div className="space-y-4">
                <div
                  className="py-3 border-b border-gray-200 cursor-pointer font-semibold text-gray-800 hover:text-pink-600 transition-all duration-300 hover:translate-x-2 hover:bg-pink-50 px-2 rounded-lg"
                  onClick={() => handleNavClick("/collections")}
                >
                  SHOP
                </div>

                {/* COLLECTIONS with Mobile Dropdown */}
                <div className="border-b border-gray-200">
                  <div
                    className="py-3 cursor-pointer font-semibold flex items-center justify-between text-gray-800 hover:text-pink-600 transition-all duration-300 hover:translate-x-2 hover:bg-pink-50 px-2 rounded-lg"
                    onClick={() => toggleDropdown("collections")}
                  >
                    COLLECTIONS
                    <div className="transition-transform duration-300 ease-in-out">
                      {openDropdown === "collections" ? (
                        <FaChevronUp
                          size={12}
                          className="transform rotate-0 transition-transform duration-300"
                        />
                      ) : (
                        <FaChevronDown
                          size={12}
                          className="transform rotate-0 transition-transform duration-300"
                        />
                      )}
                    </div>
                  </div>

                  {/* Animated Dropdown */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${openDropdown === "collections"
                        ? 'max-h-40 opacity-100'
                        : 'max-h-0 opacity-0'
                      }`}
                  >
                    <div className="pl-4 pb-2 space-y-2 transform transition-all duration-300">
                      <div
                        onClick={() => handleNavClick("/collection/navratri")}
                        className="py-2 text-gray-600 cursor-pointer hover:text-pink-600 transition-all duration-300 hover:translate-x-2 hover:bg-pink-50 px-2 rounded-lg transform"
                      >
                        Navratri Collection
                      </div>
                      <div
                        onClick={() => handleNavClick("/collection/wedding")}
                        className="py-2 text-gray-600 cursor-pointer hover:text-pink-600 transition-all duration-300 hover:translate-x-2 hover:bg-pink-50 px-2 rounded-lg transform"
                      >
                        Wedding Collection
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media Links for Mobile */}
                <div className="pt-6 transform transition-all duration-700 delay-300">
                  <h3 className="font-semibold mb-3 text-gray-800">Follow Us</h3>
                  <div className="flex items-center gap-4">
                    <FaInstagram
                      size={20}
                      className="cursor-pointer text-gray-600 hover:text-pink-600 hover:scale-125 transition-all duration-300 hover:rotate-12"
                    />
                    <FaXTwitter
                      size={20}
                      className="cursor-pointer text-gray-600 hover:text-pink-600 hover:scale-125 transition-all duration-300 hover:-rotate-12"
                    />
                    <FaLinkedinIn
                      size={20}
                      className="cursor-pointer text-gray-600 hover:text-pink-600 hover:scale-125 transition-all duration-300 hover:rotate-12"
                    />
                    <FaFacebook
                      size={20}
                      className="cursor-pointer text-gray-600 hover:text-pink-600 hover:scale-125 transition-all duration-300 hover:-rotate-12"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add this CSS to your global styles or styled-components */}
      <style jsx>{`
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
`}</style>


      {/* Overlay to close profile dropdown when clicking outside */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Navbar;  