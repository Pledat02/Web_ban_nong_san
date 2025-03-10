import React, { useState, useEffect } from "react";
import NotificationService from "../services/notification-service"; // Import service
import { AddressForm } from "./address-form";

export function ProfileForm({ formData, onChange, onSubmit }) {
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");

    const handleSendOtp = async () => {
        if (!formData.phone) {
            alert("Vui lòng nhập số điện thoại!");
            return;
        }

        const success = await NotificationService.sendOtp(formData.phone);
        if (success) {
            setOtpSent(true);
        }
    };

    useEffect(() => {
        if (otp.length === 6) {
            handleVerifyOtp();
        }
    }, [otp]);

    const handleVerifyOtp = async () => {
        const success = await NotificationService.verifyOtp(formData.phone, otp);
        if (!success) setOtp("");
    };

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={onChange}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Nhập OTP */}
            {otpSent && (
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Nhập mã OTP
                    </label>
                    <input
                        type="text"
                        name="otp"
                        value={otp}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, ""); // Chỉ cho nhập số
                            if (value.length <= 6) {
                                setOtp(value);
                            }
                        }}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Nhập mã OTP"
                    />
                </div>
            )}

            {/* Nút gửi OTP */}
            <button
                type="button"
                onClick={handleSendOtp}
                className="mt-2 bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors hover:bg-gray-700"
            >
                {otpSent ? "Gửi lại OTP" : "Gửi OTP"}
            </button>

            <AddressForm data={formData} onChange={onChange} />

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Update
                </button>
            </div>
        </form>
    );
}
