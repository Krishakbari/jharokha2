import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlay, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API } from "../constant"; // Assuming you have this constant

const Instagram = () => {
    const [reelProducts, setReelProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [playingVideo, setPlayingVideo] = useState(null);
    const navigate = useNavigate();

    // Fetch products where isReel is true
    const fetchReelProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API}/products/reels`);
            setReelProducts(response.data);
        } catch (err) {
            console.error('Error fetching reel products:', err);
            setError('Failed to load Instagram reels');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReelProducts();
    }, []);

    // Navigate to product details
    const handleViewProduct = (product) => {
        navigate(`/${product.slug}/${product._id}`);
    };

    // Extract video ID from Instagram reel URL
    const extractInstagramVideoId = (url) => {
        if (!url) return null;

        // Instagram reel URL patterns:
        // https://www.instagram.com/reel/VIDEO_ID/
        // https://instagram.com/reel/VIDEO_ID/
        const match = url.match(/\/reel\/([A-Za-z0-9_-]+)/);
        return match ? match[1] : null;
    };

    // Get Instagram embed URL
    const getInstagramEmbedUrl = (instaLink) => {
        const videoId = extractInstagramVideoId(instaLink);
        if (!videoId) return null;
        return `https://www.instagram.com/reel/${videoId}/embed/`;
    };

    // Check if it's a mobile device
    const isMobile = () => {
        return window.innerWidth < 768; // Tailwind md breakpoint
    };

    // Handle video play
    const handleVideoPlay = (productId, instaLink) => {
        if (!instaLink) return;

        // On mobile, redirect to Instagram directly
        if (isMobile()) {
            window.open(instaLink, '_blank');
            return;
        }

        // On desktop, use embed
        if (playingVideo === productId) {
            // If already playing, stop it
            setPlayingVideo(null);
        } else {
            // Play this video
            setPlayingVideo(productId);
        }
    };

    if (loading) {
        return (
            <div className="py-4 md:py-10 max-w-[1450px] mx-auto px-4">
                <h2 className="text-center text-lg md:text-2xl font-semibold mb-6 md:mb-8" style={{ fontFamily: "'Trirong', serif" }}>
                    Visit Instagram
                </h2>
                <div className="flex justify-center items-center h-32 md:h-64">
                    <div className="text-gray-500 text-sm md:text-base">Loading Instagram reels...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-4 md:py-10 max-w-[1450px] mx-auto px-4">
                <h2 className="text-center text-lg md:text-2xl font-semibold mb-6 md:mb-8" style={{ fontFamily: "'Trirong', serif" }}>
                    Visit Instagram
                </h2>
                <div className="flex justify-center items-center h-32 md:h-64">
                    <div className="text-red-500 text-sm md:text-base text-center px-4">{error}</div>
                </div>
            </div>
        );
    }

    if (reelProducts.length === 0) {
        return (
            <div className="py-4 md:py-10 max-w-[1450px] mx-auto px-4">
                <h2 className="text-center text-lg md:text-2xl font-semibold mb-6 md:mb-8" style={{ fontFamily: "'Trirong', serif" }}>
                    Visit Instagram
                </h2>
                <div className="flex justify-center items-center h-32 md:h-64">
                    <div className="text-gray-500 text-sm md:text-base text-center px-4">No Instagram reels available at the moment.</div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-4 md:py-10 max-w-[1450px] mx-auto px-4">
            <h2 className="text-center text-lg md:text-2xl font-semibold mb-6 md:mb-8" style={{ fontFamily: "'Trirong', serif" }}>
                Visit Instagram
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {reelProducts.map((product) => {
                    const embedUrl = getInstagramEmbedUrl(product.instaLink);
                    const isPlaying = playingVideo === product._id;

                    return (
                        <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                            {/* Video/Image Container */}
                            <div className="relative aspect-[3/4] bg-gray-100">
                                {isPlaying && embedUrl && !isMobile() ? (
                                    // Instagram Embed - Only on desktop
                                    <iframe
                                        src={embedUrl}
                                        className="w-full h-full"
                                        allowTransparency="true"
                                        allow="encrypted-media"
                                        title={`Instagram reel - ${product.name}`}
                                    />
                                ) : (
                                    // Product Image with Play Overlay
                                    <div className="relative w-full h-full group">
                                        <img
                                            src={product.images && product.images.length > 0
                                                ? `${API}${product.images[0].url}`
                                                : '/placeholder-image.jpg'
                                            }
                                            alt={product.name}
                                            className="w-full h-full object-cover cursor-pointer"
                                            onClick={() => handleVideoPlay(product._id, product.instaLink)}
                                            onError={(e) => {
                                                e.target.src = '/placeholder-image.jpg';
                                            }}
                                        />

                                        {/* Dark Overlay on Hover */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                        {/* Play Button - Always visible on mobile, hover on desktop */}
                                        <div
                                            className="absolute inset-0 flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                                            onClick={() => handleVideoPlay(product._id, product.instaLink)}
                                        >
                                            <div className="bg-white rounded-full p-2 md:p-4 shadow-lg hover:scale-110 transition-transform">
                                                <FaPlay className="text-black text-sm md:text-xl ml-0.5 md:ml-1" />
                                            </div>
                                        </div>

                                        {/* Mobile Instagram Indicator */}
                                        <div className="absolute bottom-2 left-2 md:hidden">
                                            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full shadow">
                                                Instagram
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="p-2 md:p-4">
                                {/* <h3 className="font-medium text-gray-800 mb-1 md:mb-2 line-clamp-2 text-xs md:text-sm" title={product.name}>
                                    {product.name}
                                </h3>

                                <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3 line-clamp-2 hidden sm:block" title={product.description}>
                                    {product.description || "No description available"}
                                </p> */}

                                {/* Price */}
                                {/* <div className="mb-2 md:mb-4">
                                    <span className="text-sm md:text-lg font-bold text-green-600">₹{product.price}</span>
                                    {product.priceBeforeDiscount > 0 && (
                                        <span className="text-xs md:text-sm text-gray-500 line-through ml-1 md:ml-2">
                                            ₹{product.priceBeforeDiscount}
                                        </span>
                                    )}
                                </div> */}

                                {/* Colors if available */}
                                {/* {product.colors && product.colors.length > 0 && (
                                    <div className="flex gap-1 md:gap-2 mb-2 md:mb-3">
                                        {product.colors.slice(0, 3).map((color, index) => (
                                            <span
                                                key={index}
                                                className="w-3 h-3 md:w-4 md:h-4 rounded-full border border-gray-300"
                                                style={{ backgroundColor: color }}
                                                title={color}
                                            ></span>
                                        ))}
                                        {product.colors.length > 3 && (
                                            <span className="text-xs text-gray-500 self-center">
                                                +{product.colors.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )} */}

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-1 md:gap-2">
                                    <button
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 md:px-4 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1 md:gap-2"
                                        onClick={() => handleViewProduct(product)}
                                    >
                                        <FaEye className="text-xs" />
                                        <span className="hidden sm:inline">View Product</span>
                                        <span className="sm:hidden">View</span>
                                    </button>

                                    {isPlaying && !isMobile() ? (
                                        <button
                                            className="px-2 md:px-4 py-1.5 md:py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs md:text-sm font-medium transition-colors duration-200"
                                            onClick={() => setPlayingVideo(null)}
                                        >
                                            Stop
                                        </button>
                                    ) : (
                                        <button
                                            className="px-2 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-md text-xs md:text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1 md:gap-2"
                                            onClick={() => handleVideoPlay(product._id, product.instaLink)}
                                        >
                                            <FaPlay className="text-xs" />
                                            <span className="md:hidden">Instagram</span>
                                            <span className="hidden md:inline">Play</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Instagram;