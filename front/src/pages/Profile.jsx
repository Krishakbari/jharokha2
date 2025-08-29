import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/auth";
import { API } from "../constant";

const ProfilePage = () => {
    const [auth, setAuth] = useAuth();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        fullName: "",
        email: "",
        phone: "",
        country: "",
        state: "",
        city: "",
        area: "",
        address: "",
        landmarks: "",
        pincode: "",
        type: "Home",
    });

    // Load user data into form when component mounts
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

                setFormData({
                    firstName: user.firstName || "",
                    lastName: user.lastName || "",
                    fullName: user.fullName || "",
                    email: user.email || "",
                    phone: user.phone || "",
                    country: user.country || "",
                    state: user.state || "",
                    city: user.city || "",
                    area: user.area || "",
                    address: user.address || "",
                    landmarks: user.landmarks || "",
                    pincode: user.pincode || "",
                    type: user.type || "Home",
                });

                // ✅ Update localStorage and context
                localStorage.setItem("auth", JSON.stringify({ ...authData, user }));
                setAuth({ ...authData, user }); // <-- ADD THIS LINE

            }
        } catch (err) {
            console.error("Failed to fetch profile", err);
        }
    };

    fetchUserProfile();
}, []);



    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Submit form to update profile
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(`${API}/auth/update-profile`, formData, {
                headers: {
                    Authorization: `Bearer ${auth?.token}`,   // ✅ fixed
                },
            });


            if (data.success) {
                setAuth({ ...auth, user: data.updatedUser });
                localStorage.setItem("auth", JSON.stringify({ ...auth, user: data.updatedUser }));
                alert("Profile updated successfully!");
            } else {
                alert("Failed to update profile.");
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("Something went wrong.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-6">Update Profile</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
                <div className="flex space-x-4">
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="w-1/2 border p-2 rounded" />
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="w-1/2 border p-2 rounded" />
                </div>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className="w-full border p-2 rounded" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" disabled className="w-full border p-2 rounded bg-gray-100" />
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full border p-2 rounded" />
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="w-full border p-2 rounded" />
                <input type="text" name="area" value={formData.area} onChange={handleChange} placeholder="Area" className="w-full border p-2 rounded" />
                <input type="text" name="landmarks" value={formData.landmarks} onChange={handleChange} placeholder="Landmarks" className="w-full border p-2 rounded" />
                <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full border p-2 rounded" />
                <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" className="w-full border p-2 rounded" />
                <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" className="w-full border p-2 rounded" />
                <input type="number" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" className="w-full border p-2 rounded" />
                <select name="type" value={formData.type} onChange={handleChange} className="w-full border p-2 rounded">
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                </select>
                <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
                    Update Profile
                </button>
            </form>
        </div>
    );
};

export default ProfilePage;
