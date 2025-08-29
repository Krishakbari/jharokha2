

import React, { useEffect, useState } from "react";
import { useCart } from "../context/cartContext";
import { useAuth } from "../context/auth";
import { API } from "../constant";
import { PiPlusLight, PiMinusLight } from "react-icons/pi";
import { FaSpinner, FaEdit, FaMapMarkerAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cart, total, loading, removeFromCart, updateQuantity, fetchCart, clearCart } = useCart();
  const [auth] = useAuth();
  const navigate = useNavigate();

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressData, setAddressData] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    phone: ""
  });

  useEffect(() => {
    fetchCart();
  }, []);

  // Initialize address data from user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const authData = JSON.parse(localStorage.getItem("auth"));
        if (!authData?.token) return;

        const { data } = await axios.get(`${API}/auth/user-profile`, {
          headers: {
            Authorization: `Bearer ${authData.token}`
          }
        });

        if (data.success) {
          const user = data.user;

          setAddressData({
            address: user.address || "",
            city: user.city || "",
            state: user.state || "",
            pincode: user.pincode || "",
            country: user.country || "",
            phone: user.phone || ""
          });

          // Optionally update localStorage (not mandatory here)
          localStorage.setItem("auth", JSON.stringify({ ...authData, user }));
        }
      } catch (err) {
        console.error("Failed to fetch user profile in cart page:", err);
      }
    };

    if (auth?.token) {
      fetchUserProfile();
    }
  }, [auth?.token]);


  if (loading) return <p className="text-center mt-10 text-gray-500">Loading your cart...</p>;

  if (!cart.length) {
    return (
      <div className="text-center my-20">
        <p className="text-gray-500 text-lg">🛒 Your cart is empty.</p>
        <p className="text-sm text-gray-400 mt-2">Start adding some amazing products!</p>
      </div>
    );
  }

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.product._id, item.quantity - 1, item.size, item.color);
    } else {
      toast.error("Quantity cannot be less than 1");
    }
  };

  const handleIncrease = (item) => {
    updateQuantity(item.product._id, item.quantity + 1, item.size, item.color);
  };

  const handleRemove = (item) => {
    removeFromCart(item.product._id, item.size, item.color);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateAddress = () => {
    const requiredFields = ["address", "city", "state", "pincode", "country", "phone"];
    const missingFields = requiredFields.filter(field => {
      const value = addressData[field];
      return !value || (typeof value === 'string' && !value.trim());
    });

    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(", ")}`);
      return false;
    }

    // Basic phone validation
    const phoneValue = String(addressData.phone || '').replace(/\D/g, '');
    if (!/^\d{10}$/.test(phoneValue)) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }

    // Basic pincode validation
    const pincodeValue = String(addressData.pincode || '');
    if (!/^\d{6}$/.test(pincodeValue)) {
      toast.error("Please enter a valid 6-digit pincode");
      return false;
    }

    return true;
  };

  const placeOrder = async (finalAddressData = addressData) => {
    try {
      setCheckoutLoading(true);

      if (!auth?.token) {
        toast.error("Please login to place order");
        navigate("/login");
        return;
      }

      if (!validateAddress()) {
        return;
      }

      // Prepare order items
      const orderItems = cart.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
        size: item.size || "Default",
        color: item.color || "Default"
      }));

      const orderData = {
        items: orderItems,
        total: total,
        shippingAddress: finalAddressData,
        paymentMethod: "COD"
      };

      const response = await axios.post(`${API}/order/place`, orderData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.data.success) {
        clearCart();
        toast.success("Order placed successfully! 🎉");

        // 🔹 Push event to GTM dataLayer for conversion tracking
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "purchase",                // Custom event name for GTM
          transaction_id: response.data.orderId || "",  // if backend returns orderId
          value: total,                     // order total
          currency: "INR"
        });

        navigate("/my-order");
      } else {
        throw new Error(response.data.message || "Failed to place order");
      }

    } catch (error) {
      console.error("Order placement error:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setCheckoutLoading(false);
    }
  };


  const handleCheckout = () => {
    if (!auth?.token) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }

    // Check if address data is complete
    const requiredFields = ["address", "city", "state", "pincode", "country", "phone"];
    const missingFields = requiredFields.filter(field => {
      const value = addressData[field];
      return !value || (typeof value === 'string' && !value.trim());
    });

    if (missingFields.length > 0) {
      setShowAddressForm(true);
      toast.error("Please complete the delivery address");
      return;
    }

    placeOrder();
  };

  const resetToProfileAddress = () => {
    if (auth?.user) {
      const { address, city, state, pincode, phone, country } = auth.user;
      setAddressData({
        address: address || "",
        city: city || "",
        state: state || "",
        pincode: pincode || "",
        country: country || "",
        phone: phone || ""
      });
      toast.success("Address reset to profile data");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 grid lg:grid-cols-3 gap-10">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Your Shopping Cart</h1>

        {cart.map((item) => (
          <div
            key={`${item.product._id}-${item.size || "no-size"}-${item.color || "no-color"}`}
            className="flex flex-col sm:flex-row gap-6 bg-white/70 shadow-lg rounded-xl p-4"
          >
            <img
              src={`${API}${item.product.images?.[0]?.url}`}
              alt={item.product.name}
              className="w-full sm:w-32 h-100 object-cover rounded-lg"
            />
            <div className="flex flex-col justify-between flex-1">
              <div>
                <h2 className="font-semibold text-lg">{item.product.name}</h2>
                <p className="text-gray-500 text-sm">₹{item.product.price}</p>
                {/* <div className="text-sm text-gray-600 mt-1">Size: {item.size || "Default"}</div> */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  Color:
                  {item.color ? (
                    <span
                      className="inline-block w-5 h-5 rounded-full border"
                      style={{ backgroundColor: item.color }}
                    />
                  ) : "Default"}
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <button onClick={() => handleDecrease(item)} className="p-2 bg-gray-100 rounded-full">
                  <PiMinusLight size={18} />
                </button>
                <span className="font-medium">{item.quantity}</span>
                <button onClick={() => handleIncrease(item)} className="p-2 bg-gray-100 rounded-full">
                  <PiPlusLight size={18} />
                </button>
                <button onClick={() => handleRemove(item)} className="ml-auto text-red-500 font-medium">
                  Remove
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Subtotal: ₹{(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary & Address */}
      <div className="space-y-6">
        {/* Delivery Address Section */}
        <div className="bg-white/80 shadow-xl rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FaMapMarkerAlt className="text-green-600" />
              Delivery Address
            </h2>
            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="text-green-600 hover:text-green-700 flex items-center gap-1 text-sm"
            >
              <FaEdit size={14} />
              {showAddressForm ? "Hide" : "Edit"}
            </button>
          </div>

          {!showAddressForm ? (
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium">{addressData.address || "No address set"}</p>
              <p>{addressData.city}, {addressData.state} - {addressData.pincode}</p>
              <p>{addressData.country}</p>
              <p>Phone: {addressData.phone}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <textarea
                  name="address"
                  value={addressData.address}
                  onChange={handleAddressChange}
                  placeholder="Enter full address"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={addressData.city}
                    onChange={handleAddressChange}
                    placeholder="City"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={addressData.state}
                    onChange={handleAddressChange}
                    placeholder="State"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={addressData.pincode}
                    onChange={handleAddressChange}
                    placeholder="123456"
                    maxLength={6}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                  <input
                    type="text"
                    name="country"
                    value={addressData.country}
                    onChange={handleAddressChange}
                    placeholder="Country"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={addressData.phone}
                  onChange={handleAddressChange}
                  placeholder="1234567890"
                  maxLength={10}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {auth?.user?.address && (
                <button
                  onClick={resetToProfileAddress}
                  className="text-sm text-blue-600 hover:text-blue-700 underline"
                >
                  Reset to profile address
                </button>
              )}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white/80 shadow-xl rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span className="text-green-600">Free</span>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="w-full mt-6 bg-green-800 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            {checkoutLoading ? (
              <>
                <FaSpinner className="animate-spin" /> Placing Order...
              </>
            ) : (
              "Proceed to Checkout"
            )}
          </button>

          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>🔒 Secure checkout</p>
            <p>📦 Free shipping on all orders</p>
            <p>💰 Cash on Delivery available</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;