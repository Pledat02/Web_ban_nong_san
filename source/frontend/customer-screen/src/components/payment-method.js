import React from 'react';
import { CreditCard } from 'lucide-react';

const PaymentMethod = ({ formData, handleChange }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Phương thức thanh toán
            </h2>
            <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === "cod"}
                        onChange={handleChange}
                        className="w-4 h-4 accent-green-600"
                    />
                    <span className="ml-3">Thanh toán khi nhận hàng (COD)</span>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="Vnpay"
                        checked={formData.paymentMethod === "Vnpay"}
                        onChange={handleChange}
                        className="w-4 h-4 accent-green-600"
                    />
                    <span className="ml-3">Chuyển khoản ngân hàng</span>
                </label>
            </div>
        </div>
    );
}

export default PaymentMethod;