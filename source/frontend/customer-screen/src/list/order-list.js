import React, { useState } from 'react';
import { Package2, Clock, MapPin, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';


export const OrderList= ({ orders, getStatusColor }) => {
    const [expandedOrder, setExpandedOrder] = useState(null);

    const toggleOrder = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    return (
        <div className="space-y-4">
            {orders.map((order) => {
                const statusColors = getStatusColor(order.status);
                const isExpanded = expandedOrder === order.id;

                return (
                    <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        {/* Order Header */}
                        <div
                            className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => toggleOrder(order.id)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-6 flex-grow">
                                    {/* Order Icon */}
                                    <div className="flex-shrink-0">
                                        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <ShoppingBag className="w-8 h-8 text-blue-600" />
                                        </div>
                                    </div>

                                    {/* Order Details */}
                                    <div className="flex-grow">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Order {order.id}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors.bg} ${statusColors.text}`}>
                                                {order.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="flex items-center text-gray-600">
                                                <Clock className="w-4 h-4 mr-2" />
                                                <span>{order.date}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Package2 className="w-4 h-4 mr-2" />
                                                <span>{order.items} items</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <MapPin className="w-4 h-4 mr-2" />
                                                <span className="truncate">{order.address}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total and Action */}
                                    <div className="flex items-center space-x-6">
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">Total Amount</p>
                                            <p className="text-lg font-semibold text-gray-900">
                                                ${order.total.toFixed(2)}
                                            </p>
                                        </div>
                                        <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100">
                                            {isExpanded ? (
                                                <ChevronUp className="w-5 h-5 text-gray-400" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Products List */}
                        {isExpanded && (
                            <div className="border-t border-gray-200 bg-gray-50">
                                <div className="p-6">
                                    <h4 className="text-sm font-medium text-gray-900 mb-4">Order Items</h4>
                                    <div className="space-y-4">
                                        {order.products.map((product, index) => (
                                            <div key={index} className="flex items-center space-x-4 bg-white p-4 rounded-lg">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-[100px] h-[100px] object-cover rounded-lg"
                                                />
                                                <div className="flex-grow">
                                                    <h5 className="text-sm font-medium text-gray-900">{product.name}</h5>
                                                    <div className="mt-1 text-sm text-gray-500">
                                                        <p>Quantity: {product.quantity}</p>
                                                        <p>Weight: {product.weight}kg</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-900 font-medium">
                                                        ${product.price.toFixed(2)}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        per unit
                                                    </p>
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