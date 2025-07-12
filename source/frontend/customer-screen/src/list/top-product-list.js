import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import ProductService from "../services/product-service";
import ProductCard from "../components/product-card";

function TopProductsList({ title, description}) {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const pageSize = 8;

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const data = await ProductService.getTopProducts( page, pageSize);
                setProducts(data.elements);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [page]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="w-full">
            {/* Title */}
            <div className="bg-cream py-6 w-full text-center">
                <div className="flex items-center justify-center gap-4">
                    <div className="w-1/4 h-[2px] bg-gray-300"></div>
                    <h2 className="text-2xl font-bold text-brown-700">{title}</h2>
                    <div className="w-1/4 h-[2px] bg-gray-300"></div>
                </div>
                <p className="text-gray-600 mt-2">{description}</p>
            </div>

            {/* Product List */}
            <div className="min-h-[400px] relative">
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:mx-[8rem] px-4">
                        {products.length > 0 ? (
                            products.map((item, index) => <ProductCard key={index} {...item} />)
                        ) : (
                            <p className="text-center text-gray-500 col-span-4">No products available.</p>
                        )}
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-between lg:mx-[8rem] items-center mb-4 px-4 py-2">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1 || isLoading}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition-colors"
                >
                    ← Trang trước
                </button>
                <span className="font-semibold">
          Page {page} / {totalPages}
        </span>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages || isLoading}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition-colors"
                >
                    Trang tiếp →
                </button>
            </div>
        </div>
    );
}

export default TopProductsList;