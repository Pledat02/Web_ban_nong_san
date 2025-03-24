import React from "react";
import TagCard from "../components/category-card";
import  vegetableImg from "../images/tag/vegetables-861357_1280.jpg";
import  healthImg from "../images/tag/health-9086445_1280.jpg";
import  fruitImg from "../images/tag/fruit-bowl-1600003_1280.jpg";
const foodCategories = [
    { image: vegetableImg, title: "Rau củ tươi", description: "Được kiểm định rõ ràng" },
    { image: healthImg, title: "Thực phẩm sạch", description: "Quy trình sản xuất kín" },
    { image: fruitImg, title: "Trái cây tươi", description: "Nhập khẩu và trong nước" }
];
const CategoriesList = () => {
    return (
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  lg:flex justify-center gap-20 py-6">
            {foodCategories.map((category, index) => (
                <TagCard key={index} {...category} />
            ))}
        </div>

    );
};

export default CategoriesList;
