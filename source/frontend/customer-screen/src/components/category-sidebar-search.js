import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const categories = [
    { name: "Tất cả",  type: "radio" },
    { name: "Các loại hạt dinh dưỡng", key: "categoryId", value: 3, type: "radio" },
    { name: "Các loại quả Organic", key: "categoryId", value: 1, type: "radio" },
    { name: "Các loại rau xanh", key: "categoryId", value: 2, type: "radio" },
    { name: "Xuất xứ", key: "origin", type: "radio", subcategories: ["Việt Nam", "Mỹ", "Úc", "Nhật Bản"] },
    { name: "Vùng giá", key: "price", type: "radio", subcategories: ["Tất cả", "0-25k", "25-50k", "Lớn hơn 50k"] },
    { name: "Nhãn hiệu", key: "brand", type: "radio", subcategories: [ "Vinamilk", "TH True Milk", "Nestlé", "Nutifood"] },
];

export default function CategorySidebar({ onFilter }) {
    const [openCategories, setOpenCategories] = useState({});
    const [selectedFilters, setSelectedFilters] = useState({
        categoryId: null,
        origin: "",
        price: "",
        brand: "",
    });

    const toggleCategory = (index) => {
        setOpenCategories((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const updateFilters = (filterType, value) => {
        let newFilters = { ...selectedFilters };
        if (value === "Tất cả") {
            if (filterType === "price") {
                delete newFilters.minPrice;
                delete newFilters.maxPrice;
            }else{
                newFilters.categoryId = null;
                newFilters.origin = "";
                newFilters.price = "";
                newFilters.brand = "";
            }
        }
        if(value==1){
            newFilters.organic = true;
        }
        if (filterType === "price") {
            if (value === "0-25k") {
                newFilters.minPrice = 0;
                newFilters.maxPrice = 25000;
            } else if (value === "25-50k") {
                newFilters.minPrice = 25000;
                newFilters.maxPrice = 50000;
            } else if (value === "Lớn hơn 50k") {
                newFilters.minPrice = 50000;
                newFilters.maxPrice = null;
            }
            newFilters.price = value;
        } else {
            newFilters[filterType] = value;
        }

        setSelectedFilters(newFilters);
        onFilter(newFilters);
    };


    return (
        <div className="border rounded-md w-80">
            <div className="bg-green-600 text-white font-bold p-3 text-center">
                DANH MỤC SẢN PHẨM
            </div>
            <ul className="bg-white p-2">
                {categories.map((category, index) => (
                    <li key={index} className="border-b last:border-none">
                        {category.subcategories ? (
                            <>
                                <button
                                    className="w-full flex justify-between items-center p-3 text-gray-700 font-medium"
                                    onClick={() => toggleCategory(index)}
                                >
                                    <span className="font-bold text-black">{category.name}</span>
                                    <span className="flex items-center">
                                        {openCategories[index] ? <FaChevronUp /> : <FaChevronDown />}
                                    </span>
                                </button>
                                {openCategories[index] && (
                                    <ul className="pl-6 pb-2 text-gray-600">
                                        {category.subcategories.map((sub, subIndex) => (
                                            <li key={subIndex} className="py-1 flex items-center">
                                                <input
                                                    type={category.type}
                                                    name={category.key}
                                                    checked={selectedFilters[category.key] === sub}
                                                    onChange={() => updateFilters(category.key, sub)}
                                                    className="mr-2"
                                                />
                                                <label className="cursor-pointer">{sub}</label>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </>
                        ) : (
                            <label className="flex items-center p-3 text-gray-700 font-medium cursor-pointer">
                                <input
                                    type={category.type}
                                    name="categoryId"
                                    checked={selectedFilters.categoryId === category.value}
                                    onChange={() => updateFilters("categoryId", category.value)}
                                    className="mr-2"
                                />
                                {category.name}
                            </label>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
