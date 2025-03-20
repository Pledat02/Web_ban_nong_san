import React, { useState } from 'react';
import { Package2, Clock, MapPin, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import {getStatusColor} from "../utils/status";

export const OrderList = ({ orders }) => {
    const [expandedOrder, setExpandedOrder] = useState(null);

    const toggleOrder = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
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
                                                Order {order.id}
                                            </h3>
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-sm font-medium ${bgStatus} ${textStatus}`}>
                                                      {order.status}
                                            </span>

                                        </div>

                                        <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                                        <div className="flex items-center">
                                                <Clock className="w-3 h-3 mr-1 text-green-600" />
                                                <span>{order.date}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Package2 className="w-3 h-3 mr-1 text-green-600" />
                                                <span>{order.items} items</span>
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
                                        <button
                                            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-green-100">
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

                        {/* Products List */}
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
                                                    <p className="text-sm text-gray-500">per unit</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
