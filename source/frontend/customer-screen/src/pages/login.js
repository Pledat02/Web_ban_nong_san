import React, { useState } from "react";
import { auth, googleProvider, facebookProvider } from "../components/firebase";
import { signInWithPopup } from "firebase/auth";
import ApiService from "../services/api";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Normal Login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const isAuthenticated = await ApiService.login(email, password);
            if (isAuthenticated) {
                alert("Login thành công!");
            }
        } catch (error) {
            alert(error.message);
        }
    };

    // Google Login
    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            alert("Google login successful!");
        } catch (error) {
            alert(error.message);
        }
    };

    // Facebook Login
    const handleFacebookLogin = async () => {
        try {
            await signInWithPopup(auth, facebookProvider);
            alert("Facebook login successful!");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="max-w-md mx-auto my-6 p-6 border border-gray-300 rounded-lg bg-white shadow-md text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">ĐĂNG NHẬP</h2>
            <form onSubmit={handleLogin} className="space-y-4">
                <div className="text-left">
                    <label className="block text-sm font-semibold text-gray-600">Email hoặc Tên tài khoản</label>
                    <input
                        type="email"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Nhập email của bạn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="text-left">
                    <label className="block text-sm font-semibold text-gray-600">Mật khẩu</label>
                    <input
                        type="password"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
                >
                    ĐĂNG NHẬP
                </button>
            </form>

            <div className="mt-6">
                <button
                    onClick={handleGoogleLogin}
                    className="w-full p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 mb-2"
                >
                    Đăng nhập với Google
                </button>
                <button
                    onClick={handleFacebookLogin}
                    className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                >
                    Đăng nhập với Facebook
                </button>
            </div>

            <p className="mt-4 text-sm text-blue-500 cursor-pointer hover:underline">Quên mật khẩu?</p>
        </div>
    );
};

export default Login;
