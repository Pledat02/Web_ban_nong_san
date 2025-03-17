import React, { useState } from "react";
import { AddressForm } from "./address-form";
import { CheckCircleIcon, PencilIcon } from "@heroicons/react/24/solid";
import NotificationService from "../services/notification-service";
import ProfileService from "../services/profile-service"; // Giữ nguyên tất cả import
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function ProfileForm({ formData, onChange }) {
    const [editing, setEditing] = useState({ firstName: false, lastName: false, phone: false, email: false });
    const [otpRequested, setOtpRequested] = useState({ phone: false, email: false });
    const [otpVerified, setOtpVerified] = useState({ phone: false, email: false });
    const { user } = useUser();

    // Bật chế độ chỉnh sửa
    const handleEdit = (type) => {
        setEditing((prev) => ({ ...prev, [type]: true }));
    };

    // Cập nhật khi nhấn Enter
    const handleKeyDown = async (e, type) => {
        if (e.key === "Enter") {
            e.preventDefault();
            try {
                await ProfileService.updateProfile({ [type]: formData[type] });
                toast.success("Cập nhật thành công!");
                setEditing((prev) => ({ ...prev, [type]: false }));
            } catch (error) {
                toast.error("Cập nhật thất bại, vui lòng thử lại!");
            }
        }
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
        <form className="space-y-8">
            <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Thông tin cá nhân</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Họ */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Họ</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={onChange}
                                disabled={!editing.firstName}
                                onKeyDown={(e) => handleKeyDown(e, "firstName")}
                                className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm pr-10 ${
                                    editing.firstName ? "border-green-500" : "bg-gray-100 cursor-not-allowed"
                                }`}
                            />
                            {!editing.firstName && (
                                <button type="button" onClick={() => handleEdit("firstName")} className="absolute inset-y-0 right-3 flex items-center">
                                    <PencilIcon className="w-5 h-5 text-gray-500" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Tên */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tên</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={onChange}
                                disabled={!editing.lastName}
                                onKeyDown={(e) => handleKeyDown(e, "lastName")}
                                className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm pr-10 ${
                                    editing.lastName ? "border-green-500" : "bg-gray-100 cursor-not-allowed"
                                }`}
                            />
                            {!editing.lastName && (
                                <button type="button" onClick={() => handleEdit("lastName")} className="absolute inset-y-0 right-3 flex items-center">
                                    <PencilIcon className="w-5 h-5 text-gray-500" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Số điện thoại */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                <div className="relative">
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={onChange}
                        disabled={!editing.phone}
                        className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm pr-24 ${
                            editing.phone ? "border-green-500" : "bg-gray-100 cursor-not-allowed"
                        }`}
                    />
                    {!editing.phone ? (
                        <button
                            type="button"
                            onClick={() => handleEdit("phone")}
                            className="absolute inset-y-0 right-4 flex items-center"
                        >
                            <PencilIcon className="w-5 h-5 text-gray-500" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 bg-gray-600 text-white px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors"
                            onClick={() => handleSendOtp("phone")}
                        >
                            Gửi OTP
                        </button>
                    )}
                </div>
                {/* Ô nhập OTP */}
                {otpRequested.phone && (
                    <div className="mt-2 flex items-center space-x-2">
                        <input
                            type="text"
                            name="phoneOtp"
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
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={onChange}
                        disabled={!editing.email}
                        className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm pr-24 ${
                            editing.email ? "border-green-500" : "bg-gray-100 cursor-not-allowed"
                        }`}
                    />
                    {!editing.email ? (
                        <button
                            type="button"
                            onClick={() => handleEdit("email")}
                            className="absolute inset-y-0 right-4 flex items-center"
                        >
                            <PencilIcon className="w-5 h-5 text-gray-500" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 bg-gray-600 text-white px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors"
                            onClick={() => handleSendOtp("email")}
                        >
                            Gửi OTP
                        </button>
                    )}
                </div>
                {/* Ô nhập OTP */}
                {otpRequested.email && (
                    <div className="mt-2 flex items-center space-x-2">
                        <input
                            type="text"
                            name="emailOtp"
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

            {/* Địa chỉ   */}
            <AddressForm data={formData} onChange={onChange} />
        </form>
    );
}
