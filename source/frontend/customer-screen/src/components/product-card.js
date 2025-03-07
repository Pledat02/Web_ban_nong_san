import React from "react";
import { useNavigate } from "react-router-dom";
import {CartActionTypes, useCart} from "../context/cart-context";
const ProductCard = ({id_product,name,price,oldPrice,image}) => {
    const navigate = useNavigate();
    const { dispatch } = useCart();
    const handleClick = () => {
        navigate(`/product-detail/${id_product}`);
    };
    const addToCart = () => {
        dispatch({
            type: CartActionTypes.ADD_TO_CART,
            payload: {
                id: id_product,
                name: name,
                price: price,
                quantity: 1,
            },
        });
    };

    return (
        <div className="relative border border-yellow-300 rounded-3xl p-4 shadow-md text-center bg-white overflow-hidden">
            {/* Badge giảm giá */}
            <div className="absolute top-2 left-2 bg-[#16A34A] text-white text-xs sm:text-sm font-bold px-2 py-1 rounded-full z-10">
                -{100-Math.round(price*100/oldPrice)}%
            </div>

            {/* Ảnh sản phẩm */}
            <div className="overflow-hidden rounded-md">
                <img
                    src={image}
                    alt={name}
                    className="cursor-pointer w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover rounded-md transition-transform duration-300 hover:scale-110"
                    onClick={handleClick}
                />
            </div>

            {/* Thông tin sản phẩm */}
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mt-3">{name}</h3>

            {/* Giá cũ và giá mới */}
            <div className="mt-2">
                <span className="text-xs sm:text-sm text-gray-400 line-through mr-2">{oldPrice}đ</span>
                <span className="text-sm sm:text-base text-orange-500 font-bold">{price}đ</span>
            </div>

            {/* Nút mua ngay */}
            <button className="mt-3 bg-green-600 text-white text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 transition">
                Mua ngay
            </button>
        </div>
    );
};

export default ProductCard;
