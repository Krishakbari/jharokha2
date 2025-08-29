import axios from "axios";
import React, { useState } from 'react';
import loginpin from "../assets/loginpic.jpg";
import { useNavigate } from 'react-router-dom';
import { API } from "../constant";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [auth, setAuth] = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${API}/auth/login`, {
                email,
                password,
            });

            if (res && res.data.success) {
                toast.success(res.data.message);

                // Save user + token in context and localStorage
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token,
                });
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("auth", JSON.stringify(res.data));

                navigate("/");
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Login failed. Please try again.");
        }
    };

    return (
        <div className="max-h-screen flex flex-col md:flex-row">
            {/* Mobile Image - Half screen at top */}
            <div className="md:hidden h-[60vh] relative">
                <img
                    src={loginpin}
                    alt="Fashion model"
                    className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                    <h2 className="text-3xl font-bold">Hello Again!</h2>
                    <p className="text-base opacity-90">Welcome Back</p>
                </div>
            </div>

            {/* Desktop Image - Left side */}
            <div className="hidden md:flex md:flex-1 relative">
                <img
                    src={loginpin}
                    alt="Fashion model"
                    className="w-full h-screen object-cover object-top"
                />
            </div>

            {/* Form Section */}
            <div className="flex-1 flex items-center justify-center bg-gray-50 px-4 sm:px-6 md:px-8 py-8 min-h-[40vh] md:min-h-0">
                <div className="max-w-md w-full">
                    {/* Desktop header */}
                    <div className="hidden md:block text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Hello Again!</h2>
                        <p className="text-gray-600">Welcome Back</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-3 md:px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-white text-base"
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-3 md:px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-white text-base"
                                placeholder="Password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-800 hover:bg-green-900 text-white font-medium py-3 px-4 rounded-lg transition duration-200 transform active:scale-95 md:hover:scale-105 cursor-pointer text-base"
                        >
                            Login
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600 text-sm md:text-base">
                            Don't have an account?{' '}
                            <button 
                                className="text-green-800 hover:text-green-900 font-medium cursor-pointer underline decoration-green-800/30 hover:decoration-green-900" 
                                onClick={() => navigate("/signup")}
                            >
                                Sign up
                            </button>
                        </p>
                    </div>

                    <div className="mt-4 text-center">
                        <button className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer">
                            {/* Forgot your password? */}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;