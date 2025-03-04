import React from "react";

const FoodCard = ({ image, discount, name, oldPrice, newPrice }) => {
    return (
        <div className="relative border border-yellow-300 rounded-3xl p-4 shadow-md text-center bg-white overflow-hidden">
            {/* Badge giảm giá */}
            <div className="absolute top-2 left-2 bg-pink-500 text-white text-xs sm:text-sm font-bold px-2 py-1 rounded-full z-10">
                -{discount}%
            </div>

            {/* Ảnh sản phẩm */}
            <div className="overflow-hidden rounded-md">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover rounded-md transition-transform duration-300 hover:scale-110"
                />
            </div>

            {/* Thông tin sản phẩm */}
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mt-3">{name}</h3>

            {/* Giá cũ và giá mới */}
            <div className="mt-2">
                <span className="text-xs sm:text-sm text-gray-400 line-through mr-2">{oldPrice}đ</span>
                <span className="text-sm sm:text-base text-red-500 font-bold">{newPrice}đ</span>
            </div>

            {/* Nút mua ngay */}
            <button className="mt-3 bg-green-600 text-white text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 transition">
                Mua ngay
            </button>
        </div>
    );
};

export default FoodCard;
