import React from "react";
import FoodCard from "../components/food-card";

const foodItems = [
    {
        image: "https://tse3.mm.bing.net/th?id=OIP.XfxDrlD1UWo6VhFVmse4ygHaFj&pid=Api&P=0&h=180",
        discount: 10,
        name: "Bom Mỹ",
        oldPrice: "200.000",
        newPrice: "180.000",
    },
    {
        image: "https://tse3.mm.bing.net/th?id=OIP.XfxDrlD1UWo6VhFVmse4ygHaFj&pid=Api&P=0&h=180",
        discount: 25,
        name: "Vải nhập khẩu",
        oldPrice: "80.000",
        newPrice: "60.000",
    },
    {
        image: "https://tse2.mm.bing.net/th?id=OIP.4dn_jEyvL33fVxje4dWybwHaJ3&pid=Api&P=0&h=180",
        discount: 40,
        name: "Táo nhập khẩu",
        oldPrice: "50.000",
        newPrice: "30.000",
    },
    {
        image: "https://tse3.mm.bing.net/th?id=OIP.XfxDrlD1UWo6VhFVmse4ygHaFj&pid=Api&P=0&h=180",
        discount: 20,
        name: "Cà chua Đà Lạt",
        oldPrice: "100.000",
        newPrice: "80.000",
    },
    {
        image: "https://tse3.mm.bing.net/th?id=OIP.XfxDrlD1UWo6VhFVmse4ygHaFj&pid=Api&P=0&h=180",
        discount: 25,
        name: "Vải nhập khẩu",
        oldPrice: "80.000",
        newPrice: "60.000",
    },
];

const FoodList = () => {
    return (
        <div className="bg-[#FFFDF1] ">
            <div className="bg-cream py-6 text-center">
                <div className="flex items-center justify-center gap-4">
                    <div className="w-1/4 h-[2px] bg-gray-300"></div>
                    <h2 className="text-2xl font-bold text-brown-700">TRÁI CÂY NHẬP KHẨU</h2>
                    <div className="w-1/4 h-[2px] bg-gray-300"></div>
                </div>
                <p className="text-gray-600 mt-2">Là nhà cung cấp thực phẩm tươi sạch hàng đầu khu vực phía nam</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:mx-[8rem] px-4">
                {foodItems.map((item, index) => (
                    <FoodCard key={index} {...item} />
                ))}
            </div>
        </div>
    )
        ;
};

export default FoodList;
