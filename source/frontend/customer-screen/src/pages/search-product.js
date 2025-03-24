import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import CategorySidebar from "../components/category-sidebar-search";
import FilterProductList from "../list/filter-product-list";
import ProductService from "../services/product-service";

export default function SearchPage() {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filters, setFilters] = useState({ brand: '', origin: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const size = 6;
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");

    const fetchProducts = async (page = 1, filterParams = {}) => {
        setIsLoading(true);
        try {
            const response = await ProductService.getFilteredProducts({
                query,
                ...filterParams,
                page,
                size,
            });

            console.log("Product data:", response);
            setFilteredProducts(response.elements || []);
            setTotalPages(response.totalPages || 1);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(1, filters);
    }, [query, filters]);

    const handleFilter = async (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1);
        fetchProducts(1, newFilters);
    };

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

            {/* Product Content */}
            <main className="flex-1 p-4">
                {isLoading ? (
                    <div className="min-h-[400px] flex items-center justify-center">
                        <Loader2 className="w-12 h-12 animate-spin text-gray-600" />
                    </div>
                ) : (
                    <>
                        <FilterProductList products={filteredProducts} />

                        {/* Pagination */}
                        <div className="flex justify-between items-center mt-8 mb-4 px-4 py-2 bg-gray-100 rounded-md">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1 || isLoading}
                                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition-colors"
                            >
                                ← Previous Page
                            </button>
                            <span className="font-semibold">
                                Page {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages || isLoading}
                                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition-colors"
                            >
                                Next Page →
                            </button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}