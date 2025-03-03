import React, { useEffect, useState } from "react";
import ProductService from "../services/product-service";
import ProductCard from "../components/product-card";

const ProductCategoryList = ({ title, description, categoryId }) => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 8;

    useEffect(() => {
        console.log (page)
        const fetchProducts = async () => {
            try {
                const data = await ProductService.getProductsByCategory(categoryId, page, pageSize);
                setProducts(data.elements);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        };

        fetchProducts();
    }, [page]);

    return (
        <div>
            {/* Tiêu đề */}
            <div className="bg-cream py-6 text-center">
                <div className="flex items-center justify-center gap-4">
                    <div className="w-1/4 h-[2px] bg-gray-300"></div>
                    <h2 className="text-2xl font-bold text-brown-700">{title}</h2>
                    <div className="w-1/4 h-[2px] bg-gray-300"></div>
                </div>
                <p className="text-gray-600 mt-2">
                    {description}
                </p>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:mx-[8rem] px-4">
                {products.length > 0 ? (
                    products.map((item, index) => <ProductCard key={index} {...item} />)
                ) : (
                    <p className="text-center text-gray-500 col-span-4">Không có sản phẩm nào.</p>
                )}
            </div>

            {/* Phân trang */}
            <div className="flex justify-center mt-6">
                <button
                    className="px-4 py-2 cursor-pointer bg-gray-300 rounded disabled:opacity-50 mx-2"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                >
                    Prev
                </button>
                <span className="mx-4 text-lg font-semibold">
                    Page {page} of {totalPages}
                </span>
                <button
                    className="px-4 py-2 cursor-pointer bg-gray-300  rounded disabled:opacity-50 mx-2"
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page >= totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ProductCategoryList;
