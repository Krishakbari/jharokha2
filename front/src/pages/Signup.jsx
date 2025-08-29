import axios from "axios";
import React, { useState } from 'react';
import loginpin from "../assets/loginpic.jpg";
import { useNavigate } from 'react-router-dom';
import { API } from "../constant";
import toast from "react-hot-toast";

const Signup = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { fullName, email, password } = formData;

        try {
            const res = await axios.post(`${API}/auth/register`, {
                fullName,
                email,
                password,
            });

            if (res && res.data.success) {
                toast.success(res.data.message);
                navigate("/login");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="max-h-screen flex flex-col md:flex-row">
            {/* Mobile Form Section - Top 40% */}
            <div className="md:hidden flex items-center justify-center bg-gray-50 px-4 py-6 h-[40vh] order-1">
                <div className="max-w-md w-full">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">Hello!</h2>
                        <p className="text-gray-600 text-sm">Sign Up to Get Started</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-white text-sm"
                                placeholder="Full Name"
                                required
                            />
                        </div>
                        
                        <div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-white text-sm"
                                placeholder="Email Address"
                                required
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-white text-sm"
                                placeholder="Password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-800 hover:bg-green-900 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 transform active:scale-95 cursor-pointer text-sm"
                        >
                            Sign Up
                        </button>
                    </form>

                    <div className="mt-3 text-center">
                        <p className="text-gray-600 text-xs">
                            Already have an account?{' '}
                            <button 
                                className="text-green-800 hover:text-green-900 font-medium cursor-pointer underline" 
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            {/* Mobile Image - Bottom 60% */}
            <div className="md:hidden h-[60vh] relative order-2">
                <img
                    src={loginpin}
                    alt="Fashion model"
                    className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent"></div>
            </div>

            {/* Desktop Image - Left side */}
            <div className="hidden md:flex md:flex-1 relative">
                <img
                    src={loginpin}
                    alt="Fashion model"
                    className="w-full h-screen object-cover object-top"
                />
            </div>

            {/* Desktop Form Section */}
            <div className="hidden md:flex md:flex-1 items-center justify-center bg-gray-50 px-8 py-8">
                <div className="max-w-md w-full">
                    {/* Desktop header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Hello!</h2>
                        <p className="text-gray-600">Sign Up to Get Started</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-white text-base"
                                placeholder="Full Name"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-white text-base"
                                placeholder="Email Address"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-white text-base"
                                placeholder="Password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-800 hover:bg-green-900 text-white font-medium py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105 cursor-pointer text-base"
                        >
                            Sign Up
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600 text-base">
                            Already have an account?{' '}
                            <button 
                                className="text-green-800 hover:text-green-900 font-medium cursor-pointer underline decoration-green-800/30 hover:decoration-green-900" 
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;