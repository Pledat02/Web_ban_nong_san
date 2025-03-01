import React, { useState, useEffect } from "react";
import { FaSearch, FaShoppingBag, FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showHeader, setShowHeader] = useState(true);
    let lastScrollY = window.scrollY;

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY < lastScrollY) {
                setShowHeader(true); // Cuộn lên -> Hiển thị header
            } else {
                setShowHeader(false); // Cuộn xuống -> Ẩn header
            }
            lastScrollY = window.scrollY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`w-full fixed top-0 left-0 z-50 bg-white shadow-md transition-transform duration-300 
    ${showHeader ? "translate-y-0" : "-translate-y-full absolute"}`}
        >
            {/* Top Bar */}
            <div className="bg-green-600 text-white flex justify-between items-center px-8 py-2 text-sm">
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
                    <button
                        className="md:hidden text-2xl text-gray-700 hover:text-green-600"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <div></div> : <FaBars/>}
                    </button>

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

                    {/* Mobile Menu Button */}
                    <div className="relative lg:hidden md:block">
                        <FaShoppingBag
                            className="text-2xl text-gray-700 hover:text-green-600 transition cursor-pointer"/>
                        <span
                            className="absolute -top-2 -right-2 bg-black text-white text-xs px-2 rounded-full">0</span>
                    </div>

                    {/* Search Bar (Ẩn trên mobile) */}
                    <div className="hidden md:flex items-center border rounded-lg overflow-hidden w-1/3">
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="px-4 py-2 w-full outline-none"
                        />
                        <button className="bg-green-600 p-3 text-white">
                            <FaSearch/>
                        </button>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-6 text-gray-700 font-medium">
                        <a href="#" className="hover:text-green-600 transition">Trang chủ</a>
                        <a href="#" className="hover:text-green-600 transition">Cửa hàng #Halona</a>
                        <a href="#" className="hover:text-green-600 transition">Giỏ hàng</a>
                        <a href="#" className="hover:text-green-600 transition">Giới thiệu</a>
                        <a href="#" className="hover:text-green-600 transition">Liên hệ</a>
                    </nav>

                    {/* Cart Icon */}
                    <div className="relative hidden md:block">
                        <FaShoppingBag
                            className="text-2xl text-gray-700 hover:text-green-600 transition cursor-pointer"/>
                        <span
                            className="absolute -top-2 -right-2 bg-black text-white text-xs px-2 rounded-full">0</span>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {menuOpen && (
                    <div
                        className="md:hidden bg-emerald-400 w-full flex flex-col items-center py-4 space-y-4 shadow-md">
                        {/* Search Bar */}
                        <div className="w-4/5 flex items-center bg-white rounded-lg overflow-hidden shadow-md">
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                className="px-4 py-2 w-full outline-none text-gray-700"
                            />
                            <button className="bg-green-600 p-3 text-white">
                                <FaSearch/>
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <a href="#" className="hover:text-white text-gray-100 text-lg transition">Trang chủ</a>
                        <a href="#" className="hover:text-white text-gray-100 text-lg transition">Cửa hàng #Halona</a>
                        <a href="#" className="hover:text-white text-gray-100 text-lg transition">Giỏ hàng</a>
                        <a href="#" className="hover:text-white text-gray-100 text-lg transition">Giới thiệu</a>
                        <a href="#" className="hover:text-white text-gray-100 text-lg transition">Liên hệ</a>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
