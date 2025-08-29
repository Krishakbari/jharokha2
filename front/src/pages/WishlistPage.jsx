import React, { useEffect } from "react"; // ⬅️ Add useEffect
import { useWishlist } from "../context/wishlistContext";
import { FiTrash2 } from "react-icons/fi";
import { API } from "../constant";
import { useNavigate } from "react-router-dom";

const WishlistPage = () => {
    const { wishlist, removeFromWishlist, fetchWishlist } = useWishlist();
    const navigate = useNavigate();

    useEffect(() => {
        fetchWishlist();
    }, []);


    if (!wishlist.length) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-semibold mb-4">Your Wishlist is Empty</h2>
                <p className="text-gray-600 mb-6">Explore and add your favorite items.</p>
                <button
                    onClick={() => navigate("/collections")}
                    className="px-6 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
                >
                    Browse Collections
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto py-10 px-4">
            <h1 className="text-3xl font-semibold mb-8">My Wishlist</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishlist.map((item) => {
                    const product = item.product || item;
                    return (
                        <div
                            key={product._id}
                            className="bg-white shadow rounded-lg hover:shadow-lg transition relative"
                        >
                            <img
                                src={`${API}${product.images?.[0]?.url}`}
                                alt={product.name}
                                className="w-full h-70 object-cover rounded-t-lg"
                                onClick={() => navigate(`/${product.slug}/${product._id}`)}
                            />
                            <div className="p-4">
                                <h3 className="font-medium text-lg truncate">{product.name}</h3>
                                <p className="mt-2 text-pink-600 font-semibold">₹{product.price}</p>
                                <button
                                    onClick={() => removeFromWishlist(product._id)}
                                    className="absolute top-3 right-3 text-white hover:text-red-500"
                                    aria-label="Remove from wishlist"
                                >
                                    <FiTrash2 size={20} />
                                </button>
                                {/* <button
                                    onClick={() => navigate(`/${product.slug}/${product._id}`)}
                                    className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800"
                                >
                                    Add to Cart
                                </button> */}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WishlistPage;
