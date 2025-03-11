import React, { useState } from "react";
import { AddressForm } from "./address-form";
import { CheckCircleIcon, PencilIcon } from "@heroicons/react/24/solid";
import NotificationService from "../services/notification-service";
import {useUser} from "../context/UserContext";

export function ProfileForm({ formData, onChange, onSubmit }) {
    const [editing, setEditing] = useState({ phone: false, email: false });
    const [otpRequested, setOtpRequested] = useState({ phone: false, email: false });
    const [otpVerified, setOtpVerified] = useState({ phone: false, email: false });
    const {user} = useUser();

    // Xử lý bật chế độ chỉnh sửa
    const handleEdit = (type) => {
        setEditing((prev) => ({ ...prev, [type]: true }));
        setOtpRequested((prev) => ({ ...prev, [type]: false }));
        setOtpVerified((prev) => ({ ...prev, [type]: false }));
    };

    // Gửi OTP
    const handleSendOtp = async (type) => {
        let success = false;

        if (type === "phone") {
            success = await NotificationService.sendPhoneOtp(formData.phone);
        } else if (type === "email") {
            success = await NotificationService.sendEmailOtp(formData.email);
        }

        if (success) {
            setOtpRequested((prev) => ({ ...prev, [type]: true }));
        }
    };

    // Xác thực OTP
    const handleVerifyOtp = async (type, otp) => {
        if (otp.length !== 6) return;

        let success = false;
        const userId = user.id_user;

        if (type === "phone") {
            success = await NotificationService.verifyPhoneOtp(formData.phone, otp, userId);
        } else if (type === "email") {
            success = await NotificationService.verifyEmailOtp(formData.email, otp, userId);
        }

        setOtpVerified((prev) => ({ ...prev, [type]: success }));
    };

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                            First Name
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            value={formData.firstName}
                            onChange={onChange}
                            className="mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                            Last Name
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            value={formData.lastName}
                            onChange={onChange}
                            className="mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Số điện thoại */}
            <div className="mt-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                </label>
                <div className="flex gap-3 items-center">
                    <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={onChange}
                        disabled={!editing.phone}
                        className={`mt-1 flex-1 rounded-lg border px-3 py-2 shadow-sm ${
                            editing.phone ? "border-blue-500" : "bg-gray-100 cursor-not-allowed"
                        }`}
                    />
                    {!editing.phone ? (
                        <button type="button" onClick={() => handleEdit("phone")}>
                            <PencilIcon className="w-5 h-5 text-gray-500" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                            onClick={() => handleSendOtp("phone")}
                        >
                            Gửi OTP
                        </button>
                    )}
                </div>

                {/* Nhập mã OTP */}
                {otpRequested.phone && (
                    <div className="mt-2 flex items-center space-x-2">
                        <input
                            type="text"
                            name="phoneOtp"
                            id="phoneOtp"
                            value={formData.phoneOtp}
                            onChange={(e) => {
                                onChange(e);
                                handleVerifyOtp("phone", e.target.value);
                            }}
                            className="w-full rounded-lg border px-3 py-2 shadow-sm"
                            placeholder="Nhập mã OTP"
                        />
                        {otpVerified.phone && <CheckCircleIcon className="w-6 h-6 text-green-500" />}
                    </div>
                )}
            </div>

            {/* Email */}
            <div className="mt-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                </label>
                <div className="flex gap-3 items-center">
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={onChange}
                        disabled={!editing.email}
                        className={`mt-1 flex-1 rounded-lg border px-3 py-2 shadow-sm ${
                            editing.email ? "border-blue-500" : "bg-gray-100 cursor-not-allowed"
                        }`}
                    />
                    {!editing.email ? (
                        <button type="button" onClick={() => handleEdit("email")}>
                            <PencilIcon className="w-5 h-5 text-gray-500" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                            onClick={() => handleSendOtp("email")}
                        >
                            Gửi OTP
                        </button>
                    )}
                </div>

                {/* Nhập mã OTP */}
                {otpRequested.email && (
                    <div className="mt-2 flex items-center space-x-2">
                        <input
                            type="text"
                            name="emailOtp"
                            id="emailOtp"
                            value={formData.emailOtp}
                            onChange={(e) => {
                                onChange(e);
                                handleVerifyOtp("email", e.target.value);
                            }}
                            className="w-full rounded-lg border px-3 py-2 shadow-sm"
                            placeholder="Nhập mã OTP"
                        />
                        {otpVerified.email && <CheckCircleIcon className="w-6 h-6 text-green-500" />}
                    </div>
                )}
            </div>

            {/* Địa chỉ */}
            <AddressForm data={formData} onChange={onChange} />

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Cập nhật
                </button>
            </div>
        </form>
    );
}
