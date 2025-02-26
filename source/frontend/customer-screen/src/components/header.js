import React from "react";
import { FaSearch, FaShoppingBag } from "react-icons/fa";

const Header = () => {
    return (
        <header className="w-full">
            {/* Top Bar */}
            <div className="bg-green-600 text-white flex justify-between items-center px-4 py-2 text-sm">
                <div>Chuyên cung cấp thực phẩm sạch | Halona Fruits</div>
                <div className="hidden md:flex space-x-4">
                    <a href="#" className="hover:underline">Tài khoản</a>
                    <a href="#" className="hover:underline">Thanh toán</a>
                    <a href="#" className="hover:underline">Cửa hàng</a>
                </div>
            </div>

            {/* Main Header */}
            <div className="bg-white shadow-md">
                <div className="container mx-auto flex items-center justify-between py-4 px-4 lg:px-12">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <img
                            src="https://nongsan4.vnwordpress.net/" // Đổi thành đường dẫn logo của bạn
                            alt="Halona Fruits"
                            className="h-12"
                        />
                        <span className="text-green-700 text-xl font-bold">
                            Halona <span className="text-red-500">Fruits</span>
                        </span>
                    </div>

                    {/* Search Bar */}
                    <div className="hidden md:flex items-center border rounded-lg overflow-hidden w-1/3">
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="px-4 py-2 w-full outline-none"
                        />
                        <button className="bg-green-600 p-3 text-white">
                            <FaSearch />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex space-x-6 text-gray-700 font-medium">
                        <a href="#" className="hover:text-green-600 transition">Trang chủ</a>
                        <a href="#" className="hover:text-green-600 transition">Cửa hàng #Halona</a>
                        <a href="#" className="hover:text-green-600 transition">Giỏ hàng</a>
                        <a href="#" className="hover:text-green-600 transition">Giới thiệu</a>
                        <a href="#" className="hover:text-green-600 transition">Liên hệ</a>
                    </nav>

                    {/* Cart Icon */}
                    <div className="relative">  
                        <FaShoppingBag className="text-2xl text-gray-700 hover:text-green-600 transition cursor-pointer" />
                        <span className="absolute -top-2 -right-2 bg-black text-white text-xs px-2 rounded-full">0</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
