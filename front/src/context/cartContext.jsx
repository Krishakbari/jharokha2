import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { API } from "../constant";
import { useAuth } from "./auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [auth] = useAuth();
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const navigate =useNavigate()

  // 🔢 Calculate total
  const calculateTotal = (items) => {
    const newTotal = items.reduce((acc, item) => {
      const price = item.product?.price || 0;
      const quantity = item.quantity || 1;
      return acc + price * quantity;
    }, 0);
    setTotal(newTotal);
  };

  // 🔁 Auto-fetch cart when token changes
  useEffect(() => {
    if (auth?.token) fetchCart();
  }, [auth?.token]);

  // 🛒 Get cart
  const fetchCart = async () => {
    try {
      const { data } = await axios.get(`${API}/cart`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      const items = data.items || [];
      setCart(items);
      calculateTotal(items);
    } catch (error) {
      console.error("Fetch cart failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // ➕ Add to cart with size and color
  // const addToCart = async (productId, quantity = 1, size, color) => {
  const addToCart = async (productId, quantity = 1, color) => {
    if (!auth?.token) {
      toast.error("Please login to add items to your cart.");
      navigate("/login")
      return;
    }

    try {
      const payload = { productId, quantity };
      // if (size) payload.size = size;
      if (color) payload.color = color;

      const { data } = await axios.post(
        `${API}/cart`,
        payload,
        {
          headers: { Authorization: `Bearer ${auth?.token}` },
        }
      );
      const items = data.cart.items || [];
      setCart(items);
      calculateTotal(items);
      toast.success("Item added to cart");
    } catch (error) {
      console.error("Add to cart failed:", error);
      toast.error("Could not add to cart");
    }
  };

  // ❌ Remove from cart with productId, size, and color
  // const removeFromCart = async (productId, size, color) => {
  const removeFromCart = async (productId,color) => {
    try {
      let url = `${API}/cart/${productId}`;
      const params = new URLSearchParams();

      // if (size) params.append('size', size);
      if (color) params.append('color', color);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const { data } = await axios.delete(url, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });

      if (data.cart && data.cart.items) {
        const items = data.cart.items;
        setCart(items);
        calculateTotal(items);
      } else {
        setCart([]);
        setTotal(0);
      }

      toast.success(data.message || "Item removed");
      fetchCart();
    } catch (error) {
      console.error("Remove from cart failed:", error);
      toast.error("Failed to remove item");
    }
  };

  // 🔄 Update quantity by productId + size + color
  const updateQuantity = async (productId, quantity, size, color) => {
    try {
      const payload = { quantity };
      // if (size) payload.size = size;
      if (color) payload.color = color;

      const { data } = await axios.patch(
        `${API}/cart/${productId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${auth?.token}` },
        }
      );
      const items = data.cart.items || [];
      setCart(items);
      calculateTotal(items);
    } catch (error) {
      console.error("Update quantity failed:", error);
      toast.error("Failed to update quantity");
    }
  };

  const clearCart = async () => {
    try {
      // Call backend to clear user's cart
      await axios.delete(`${API}/cart/clear`, {
        headers: {
          Authorization: `Bearer ${auth?.token}`, // if your API needs auth
        },
      });

      // Clear cart in local state
      setCart([]);
      setTotal(0);

      // Clear cart from localStorage (if you use it)
      localStorage.removeItem("cart");
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };


  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        fetchCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};