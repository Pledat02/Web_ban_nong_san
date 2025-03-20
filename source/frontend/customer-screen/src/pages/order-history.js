import React, { useEffect, useState } from "react";
import { OrderList } from "../list/order-list";
import { Search } from "lucide-react";
import OrderService from "../services/order-service";

const ITEMS_PER_PAGE = 5;

const statusTabs = [
    { key: "All", label: "Tất cả" },
    { key: "PENDING_CONFIRMATION", label: "Đang chờ xác nhận" },
    { key: "WAITING_FOR_SHIPMENT", label: "Chờ giao hàng" },
    { key: "SHIPPING", label: "Đang giao hàng" },
    { key: "DELIVERED", label: "Giao hàng thành công" },
    { key: "CANCELED", label: "Đơn hàng bị hủy" },
    { key: "RETURN_REQUESTED", label: "Đang yêu cầu trả hàng" },
    { key: "RETURN_APPROVED", label: "Yêu cầu trả hàng đã được duyệt" },
    { key: "WAITING_FOR_PICKUP", label: "Chờ nhân viên tới lấy hàng" },
    { key: "RETURNED", label: "Trả hàng" },
];

function OrderHistory() {
    const [currentPage, setCurrentPage] = useState(1);
    const [activeStatus, setActiveStatus] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [orders, setOrders] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await OrderService.getMyOrders(currentPage, ITEMS_PER_PAGE);
                console.log("Dữ liệu API:", response);

                const allOrders = response.elements.map(order => ({
                    id: order.id,
                    date: order.orderDate.split("T")[0],
                    status: order.status,
                    total: order.totalPrice,
                    items: order.orderItems.length,
                    address: order.address,
                    products: order.orderItems.map(item => ({
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        weight: item.weight,
                        image: item.image
                    }))
                }));

                setOrders(allOrders || []);
                setTotalPages(response?.totalPages || 1);
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
                setOrders([]);
                setTotalPages(1);
            }
        };

        fetchOrders();
    }, [currentPage]);

    const filteredOrders = orders.filter((order) => {
        const matchesStatus = activeStatus === "All" || order.status === activeStatus;
        const matchesQuery = searchQuery === "" || (order.id && order.id.toString().toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesStatus && matchesQuery;
    });

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-green-700">Lịch sử đơn hàng</h1>
                    <p className="mt-2 text-gray-600">Theo dõi và quản lý các đơn hàng gần đây của bạn</p>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        {/* Search Bar */}
                        <div className="relative w-full sm:w-96">
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo mã đơn hàng hoặc ngày..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>

                        {/* Status Filter */}
                        <div className="flex gap-2 flex-wrap">
                            {statusTabs.map(({ key, label }) => (
                                <button
                                    key={key}
                                    onClick={() => {
                                        setActiveStatus(key);
                                        setCurrentPage(1);
                                    }}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                        activeStatus === key
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <OrderList orders={filteredOrders} />
                </div>

                {/* Pagination */}
                <div className="mt-6 flex justify-between items-center bg-white rounded-lg shadow-sm p-4">
                    <div className="text-sm text-gray-600">
                        Hiển thị {filteredOrders.length ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} đến{" "}
                        {Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)} trong tổng số {filteredOrders.length} đơn hàng
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Trước
                        </button>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Tiếp theo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderHistory;
