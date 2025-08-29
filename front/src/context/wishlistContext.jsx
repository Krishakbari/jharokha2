import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { API } from "../constant";
import { useAuth } from "./auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [auth] = useAuth();
    const navigate=useNavigate()

    // ✅ Fetch wishlist when logged in
    useEffect(() => {
        if (auth?.token) {
            fetchWishlist();
        } else {
            setWishlist([]);
        }
    }, [auth?.token]);

    const fetchWishlist = async () => {
        try {
            const { data } = await axios.get(`${API}/wishlist`, {
                headers: { Authorization: `Bearer ${auth?.token}` },
            });
            setWishlist(data.items || []);
        } catch (error) {
            console.error("Fetch wishlist failed:", error);
        }
    };

    // ➕ Add to wishlist
    const addToWishlist = async (productId) => {
        if (!auth?.token) {
            toast.error("Please login to add items to your wishlist.");
            navigate("/login")
            return;
        }

        // Check if already in wishlist
        const isAlreadyInWishlist = wishlist.some((item) => {
            // Handle different data structures
            const itemProductId = item.product?._id || item.product || item.productId;
            return itemProductId === productId;
        });

        if (isAlreadyInWishlist) {
            toast.error("Item is already in your wishlist");
            return;
        }

        try {
            const { data } = await axios.post(
                `${API}/wishlist`,
                { productId },
                {
                    headers: { Authorization: `Bearer ${auth?.token}` },
                }
            );

            if (data.success) {
                setWishlist((prev) => [...prev, data.item]); 
                toast.success("Added to wishlist");
            }
        } catch (error) {
            console.error("Add to wishlist failed:", error);
            toast.error("Could not add to wishlist");
        }
    };

    // ❌ Remove from wishlist
    const removeFromWishlist = async (productId) => {
        try {
            await axios.delete(`${API}/wishlist/${productId}`, {
                headers: { Authorization: `Bearer ${auth?.token}` },
            });

            setWishlist((prev) => prev.filter((item) => {
                // Handle different data structures consistently
                const itemProductId = item.product?._id || item.product || item.productId;
                return itemProductId !== productId;
            }));
            toast.success("Removed from wishlist");
        } catch (error) {
            console.error("Remove from wishlist failed:", error);
            toast.error("Could not remove from wishlist");
        }
    };

    // Helper function to check if product is in wishlist
    const isInWishlist = (productId) => {
        return wishlist.some((item) => {
            const itemProductId = item.product?._id || item.product || item.productId;
            return itemProductId === productId;
        });
    };

    return (
        <WishlistContext.Provider
            value={{ wishlist, addToWishlist, removeFromWishlist, fetchWishlist, isInWishlist }}
        >
            {children}
        </WishlistContext.Provider>
    );
};