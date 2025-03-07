import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import UserService from "../services/user-service";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const { login } = useUser();

    // Đăng ký bằng email
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const newUser = {
                username,
                email,
                password,
            };
            const userCredential = await UserService.register(newUser);
           // alert(userCredential)
            navigate("/login");
        } catch (error) {
            alert(error.message);
        }
    };


    return (
        <div className="max-w-md mx-auto mb-12 p-6 border border-gray-300 rounded-lg bg-white shadow-md text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">ĐĂNG KÝ</h2>
            <form onSubmit={handleRegister} className="space-y-4">
                <div className="text-left">
                    <label className="block text-sm font-semibold text-gray-600">Tên tài khoản</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập tên của bạn"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="text-left">
                    <label className="block text-sm font-semibold text-gray-600">Email</label>
                    <input
                        type="email"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                >
                    ĐĂNG KÝ
                </button>
            </form>

            <p className="mt-4 text-sm">
                Đã có tài khoản?{" "}
                <span
                    className="text-blue-500 cursor-pointer hover:underline"
                    onClick={() => navigate("/login")}
                >
                    Đăng nhập ngay
                </span>
            </p>
        </div>
    );
};

export default Register;
