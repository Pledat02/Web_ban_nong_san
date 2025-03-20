import React, { useState } from 'react';
import { OrderList } from '../list/order-list';
import { allOrders } from '../data/order';
import { getStatusColor } from '../utils/status';
import { Search } from 'lucide-react';

const ITEMS_PER_PAGE = 5;

function App() {
    const [currentPage, setCurrentPage] = useState(1);
    const [activeStatus, setActiveStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const statusTabs = ['All', 'In Transit', 'Delivered', 'Cancelled', 'Pending'];

    const filteredOrders = allOrders.filter(order => {
        const matchesStatus = activeStatus === 'All' || order.status === activeStatus;
        const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.date.includes(searchQuery);
        return matchesStatus && matchesSearch;
    });

    const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
                    <p className="mt-2 text-gray-600">Track and manage your recent orders</p>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        {/* Search Bar */}
                        <div className="relative w-full sm:w-96">
                            <input
                                type="text"
                                placeholder="Search by order ID or date..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>

                        {/* Status Filter */}
                        <div className="flex gap-2">
                            {statusTabs.map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setActiveStatus(status)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                                        ${activeStatus === status
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <OrderList orders={paginatedOrders} getStatusColor={getStatusColor} />
                </div>

                {/* Pagination */}
                <div className="mt-6 flex justify-between items-center bg-white rounded-lg shadow-sm p-4">
                    <div className="text-sm text-gray-600">
                        Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length} orders
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-300
                                     hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white
                                     hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;