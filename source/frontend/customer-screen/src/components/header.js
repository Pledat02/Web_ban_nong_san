import React, { useState, useEffect } from "react";
import { FaSearch, FaShoppingBag, FaBars } from "react-icons/fa";
import {Link, useNavigate} from "react-router-dom"; // Import useNavigate
import DropdownAccount from "../list/dropdown-account";
import {useCart} from "../context/cart-context";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showHeader, setShowHeader] = useState(true);
    const [searchTerm, setSearchTerm] = useState(""); // State lưu giá trị ô input
    const navigate = useNavigate();
    const {getTotalQuantity} = useCart();

    let lastScrollY = window.scrollY;

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY < lastScrollY) {
                setShowHeader(true);
            } else {
                setShowHeader(false);
            }
            lastScrollY = window.scrollY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Xử lý tìm kiếm
    const handleSearch = () => {
        if (searchTerm.trim() !== "") {
            navigate(`/search?query=${searchTerm}`); // Điều hướng sang trang search
        }
    };
    const clearSearch = () => {
        setSearchTerm(""); // Xóa nội dung ô input
        navigate("/search"); // Điều hướng về trang tìm kiếm trống (hoặc "/" nếu muốn về trang chủ)
    };

    return (
        <header
            className={`w-full fixed top-0 left-0 z-50 bg-white shadow-md transition-transform duration-300 
    ${showHeader ? "translate-y-0" : "-translate-y-full absolute"}`}
        >
            <div className="bg-green-600 text-white flex justify-between items-center px-8 py-2 text-sm">
                <div>Chuyên cung cấp thực phẩm sạch | Halona Fruits</div>
                <div className="hidden md:flex space-x-4">
                    <DropdownAccount />
                    <a onClick={ ()=> navigate("/checkout")} className="hover:underline">Thanh toán</a>
                    <a onClick={handleSearch} className="hover:underline">Cửa hàng</a>
                </div>
            </div>

            <div className="bg-white shadow-md">
                <div className="container mx-auto flex items-center justify-between py-4 px-4 lg:px-12">
                    <button className="md:hidden text-2xl text-gray-700 hover:text-green-600"
                            onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <div></div> : <FaBars/>}
                    </button>

                    <div className="flex items-center space-x-2 cursor-pointer"
                    onClick={()=>navigate("/")}
                    >
                        <img
                            src="https://nongsan4.vnwordpress.net/wp-content/uploads/2019/07/halonalogo.png"
                            alt="Halona Fruits"
                            className="h-12"
                        />
                        <span className="text-green-700 text-xl font-bold">
                            Halona <span className="text-red-500">Fruits</span>
                        </span>
                    </div>

                    <div className="relative lg:hidden md:block">
                        <FaShoppingBag
                            className="text-2xl text-gray-700 hover:text-green-600 transition cursor-pointer"
                        />
                        <span
                            className="absolute -top-2 -right-2 bg-black text-white text-xs px-2 rounded-full">totalQuantity()</span>
                    </div>

                    {/* Search Bar (Ẩn trên mobile) */}
                    <div className="hidden md:flex items-center border rounded-lg overflow-hidden w-1/3 relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="px-4 py-2 w-full outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Nhấn Enter để tìm kiếm
                        />
                        {searchTerm && (
                            <button
                                className="absolute right-12 text-gray-500 hover:text-gray-700"
                                onClick={clearSearch}// Xóa nội dung search
                            >
                                ✖
                            </button>
                        )}
                        <button className="bg-green-600 p-3 text-white" onClick={handleSearch}>
                            <FaSearch/>
                        </button>
                    </div>


                    <nav className="hidden md:flex space-x-6 text-gray-700 font-medium">
                        <Link to="/" className="hover:text-green-600 transition">Trang chủ</Link>
                        <Link to="/search" className="hover:text-green-600 transition">Cửa hàng #Halona</Link>
                        <Link to="/cart" className="hover:text-green-600 transition">Giỏ hàng</Link>
                        <Link to="/" className="hover:text-green-600 transition">Giới thiệu</Link>
                        <Link to="/" className="hover:text-green-600 transition">Liên hệ</Link>
                    </nav>

                    <div className="relative hidden md:block">
                        <FaShoppingBag
                            className="text-2xl text-gray-700 hover:text-green-600 transition cursor-pointer"
                        />
                        <span
                            className="absolute -top-2 -right-2 bg-black text-white text-xs px-2 rounded-full">{getTotalQuantity()}</span>
                    </div>
                </div>

                {menuOpen && (
                    <div
                        className="md:hidden bg-emerald-400 w-full flex flex-col items-center py-4 space-y-4 shadow-md">
                        <div className="w-4/5 flex items-center bg-white rounded-lg overflow-hidden shadow-md">
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                className="px-4 py-2 w-full outline-none text-gray-700"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                            <button className="bg-green-600 p-3 text-white" onClick={handleSearch}>
                                <FaSearch />
                            </button>
                        </div>

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
