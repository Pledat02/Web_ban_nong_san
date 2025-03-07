import React from "react";
import ProductCard from "../components/product-card";

const FilterProductList = ({ products }) => {
    return (
        <div>
            {/* Danh sách sản phẩm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:mx-[8rem] px-4">
                {products.length > 0 ? (
                    products.map((item, index) => <ProductCard key={index} {...item} />)
                ) : (
                    <p className="text-center text-gray-500 col-span-4">Không có sản phẩm nào.</p>
                )}
            </div>
        </div>
    );
};

export default FilterProductList;
