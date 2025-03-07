import React, { useEffect, useState } from "react";
import CategorySidebar from "../components/category-sidebar-search";
import FilterProductList from "../list/filter-product-list";
import ProductService from "../services/product-service";
import {useSearchParams} from "react-router-dom";

export default function SearchPage() {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filters, setFilters] = useState({ brand: '', origin: '' }); // Bộ lọc mặc định
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const size = 6;
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const fetchProducts = async (page = 1, filterParams = {}) => {
        try {
            const response = await ProductService.getFilteredProducts({
                query,
                ...filterParams,
                page,
                size,
            });

            console.log("Dữ liệu sản phẩm:", response);
            setFilteredProducts(response.elements || []);
            setTotalPages(response.totalPages || 1);
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm:", error);
        }
    };

    // Lấy dữ liệu ban đầu ngay khi trang tải
    useEffect(() => {
        fetchProducts(1, filters);
    }, [query,filters]);

    // Xử lý khi bộ lọc thay đổi
    const handleFilter = async (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset về trang đầu
        fetchProducts(1, newFilters);
    };

    // Xử lý khi chuyển trang
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            fetchProducts(newPage, filters);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen">
            {/* Sidebar */}
            <aside className="w-full lg:w-1/4 bg-gray-100 p-4 lg:sticky top-20 h-full">
                <CategorySidebar onFilter={handleFilter} />
            </aside>

            {/* Nội dung sản phẩm */}
            <main className="flex-1 p-4">
                <FilterProductList products={filteredProducts}/>

                {/* Phân trang */}
                <div className="flex justify-between items-center mb-4 px-4 py-2 bg-gray-100 rounded-md">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                    >
                        ← Trang trước
                    </button>
                    <span className="font-semibold">
                        Trang {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                    >
                        Trang sau →
                    </button>
                </div>
            </main>
        </div>
    );
}
