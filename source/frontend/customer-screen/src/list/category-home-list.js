import React from "react";
import CategoryCard from "../components/category-card";

const foodCategories = [
    { image: "link_to_image_1", title: "Rau củ tươi", description: "Được kiểm định rõ ràng" },
    { image: "link_to_image_2", title: "Thực phẩm sạch", description: "Quy trình sản xuất kín" },
    { image: "link_to_image_3", title: "Trái cây tươi", description: "Nhập khẩu và trong nước" }
];
const CategoriesList = () => {
    return (
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  lg:flex justify-center gap-10 py-6">
            {foodCategories.map((category, index) => (
                <CategoryCard key={index} {...category} />
            ))}
        </div>

    );
};

export default CategoriesList;
