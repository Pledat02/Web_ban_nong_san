import React, { useState } from 'react';
import { Phone, Mail, X, Package2, Clock, MapPin, ChevronDown, ChevronUp, ShoppingBag, AlertCircle } from 'lucide-react';
import { getStatusColor, canCancelOrder, canReturnOrder, getStatusLabel, getStatusIcon } from '../utils/statusUtils'; // Thêm getStatusIcon
import OrderService from '../services/order-service';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                >
                    <X size={20} />
                </button>
                {children}
            </div>
        </div>
    );
};

export const OrderList = ({ orders, onOrderUpdate }) => {
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [returnReason, setReturnReason] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);

    const toggleOrder = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const openCancelModal = (orderId) => {
        setSelectedOrderId(orderId);
        setIsModalOpen(true);
    };

    const closeCancelModal = () => {
        setIsModalOpen(false);
        setSelectedOrderId(null);
    };

    const handleCancelOrder = async () => {
        if (!selectedOrderId) return;

        try {
            setLoading(true);
            await OrderService.cancelOrder(selectedOrderId);
            onOrderUpdate();
        } catch (error) {
            console.error("Error canceling order:", error);
        } finally {
            setLoading(false);
            closeCancelModal();
        }
    };

    const handleRequestReturn = async (orderId) => {
        if (!returnReason.trim()) {
            alert('Vui lòng nhập lý do trả hàng');
            return;
        }

        try {
            setLoading(true);
            await OrderService.requestReturn(orderId, returnReason);
            setReturnReason('');
            onOrderUpdate();
            setShowContactModal(true);
        } catch (error) {
            console.error('Error requesting return:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-3">
            {orders.map((order) => {
                const { bgStatus, textStatus } = getStatusColor(order.status);
                const isExpanded = expandedOrder === order.id;

                return (
                    <div key={order.id} className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
                        {/* Order Header */}
                        <div
                            className="p-4 hover:bg-green-50 transition-colors cursor-pointer"
                            onClick={() => toggleOrder(order.id)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 flex-grow">
                                    {/* Order Icon */}
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-green-100 rounded-md flex items-center justify-center">
                                            <ShoppingBag className="w-6 h-6 text-green-600" />
                                        </div>
                                    </div>

                                    {/* Order Details */}
                                    <div className="flex-grow">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="text-m font-semibold text-green-700">
                                                Đơn hàng #{order.id}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(order.status)} {/* Thêm icon trạng thái */}
                                                <span className={`px-2 py-0.5 rounded-full text-sm font-medium ${bgStatus} ${textStatus}`}>
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <Clock className="w-3 h-3 mr-1 text-green-600" />
                                                <span>{order.date}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Package2 className="w-3 h-3 mr-1 text-green-600" />
                                                <span>{order.items} sản phẩm</span>
                                            </div>
                                            <div className="flex items-center">
                                                <MapPin className="w-3 h-3 mr-1 text-green-600" />
                                                <span className="truncate">{order.address}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total and Action */}
                                    <div className="flex items-center space-x-4 px-4">
                                        <div className="text-right">
                                            <p className="text-m text-gray-500 whitespace-nowrap">Thành tiền</p>
                                            <p className="text-m text-green-700 font-medium">
                                                {new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                }).format(order.total)}
                                            </p>
                                        </div>
                                        <button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-green-100">
                                            {isExpanded ? (
                                                <ChevronUp className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4 text-green-600" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Products List and Actions */}
                        {isExpanded && (
                            <div className="border-t border-gray-200 bg-gray-50">
                                <div className="p-4">
                                    <h4 className="text-sm font-medium text-green-700 mb-3">Sản phẩm</h4>
                                    <div className="space-y-3">
                                        {order.products.map((product, index) => (
                                            <div key={index} className="flex items-center space-x-3 bg-white p-3 rounded-md">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-12 h-12 object-cover rounded-md"
                                                />
                                                <div className="flex-grow">
                                                    <h5 className="text-m font-medium text-green-700">{product.name}</h5>
                                                    <div className="mt-0.5 text-sm text-gray-500">
                                                        <p>Số lượng: {product.quantity}</p>
                                                        <p>Trọng lượng: {product.weight}kg</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-m text-green-700 font-medium">
                                                        {new Intl.NumberFormat('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        }).format(product.price)}
                                                    </p>
                                                    <p className="text-sm text-gray-500">đơn giá</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Actions */}
                                    <div className="mt-4 space-y-4">
                                        {canCancelOrder(order.status) && (
                                            <button
                                                onClick={() => openCancelModal(order.id)}
                                                disabled={loading}
                                                className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                                            >
                                                Hủy đơn hàng
                                            </button>
                                        )}

                                        {canReturnOrder(order.status) && (
                                            <div className="space-y-2">
                                                <textarea
                                                    value={returnReason}
                                                    onChange={(e) => setReturnReason(e.target.value)}
                                                    placeholder="Lý do trả hàng..."
                                                    className="w-full p-2 border border-gray-300 rounded-md"
                                                    rows="3"
                                                />
                                                <button
                                                    onClick={() => handleRequestReturn(order.id)}
                                                    disabled={loading || !returnReason.trim()}
                                                    className="w-full py-2 px-4 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
                                                >
                                                    Yêu cầu trả hàng
                                                </button>
                                            </div>
                                        )}

                                        {loading && (
                                            <div className="flex items-center justify-center text-gray-600">
                                                <AlertCircle className="w-4 h-4 mr-2" />
                                                Đang xử lý...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Cancel Confirmation Modal */}
            <Modal isOpen={isModalOpen} onClose={closeCancelModal}>
                <h2 className="text-2xl font-bold mb-4">Xác nhận hủy đơn hàng</h2>
                <p className="text-gray-600 mb-6">
                    Bạn có chắc muốn hủy đơn hàng này không?
                </p>
                <div className="flex gap-4 justify-end">
                    <button
                        onClick={closeCancelModal}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                        Không
                    </button>
                    <button
                        onClick={handleCancelOrder}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Có, hủy đơn hàng
                    </button>
                </div>
            </Modal>

            {/* Contact Information Modal */}
            <Modal isOpen={showContactModal} onClose={() => setShowContactModal(false)}>
                <h2 className="text-2xl font-bold mb-4">Thông tin liên hệ Admin</h2>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Phone className="text-gray-600" />
                        <div>
                            <p className="font-medium">Điện thoại</p>
                            <p className="text-gray-600">+84 123 456 789</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Mail className="text-gray-600" />
                        <div>
                            <p className="font-medium">Email</p>
                            <p className="text-gray-600">admin@example.com</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                        Vui lòng liên hệ với admin để được hỗ trợ về việc trả hàng.
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default OrderList;