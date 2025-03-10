import React, { useState } from "react";
import { Camera, Pencil } from "lucide-react";

export function ProfileSidebar({ user }) {
    const [formData, setFormData] = useState({
        username: user?.username || "",
        email: user?.email || "",
        newPassword: "",
        confirmPassword: "",
        oldPassword: "",
    });

    const [editMode, setEditMode] = useState({ username: false, email: false });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleEdit = (field) => {
        setEditMode({ ...editMode, [field]: !editMode[field] });
    };

    const isUpdateDisabled = !formData.oldPassword.trim(); // Chặn cập nhật nếu chưa nhập mật khẩu cũ

    return (
        <div className="p-8 border-b md:border-r md:border-b-0 border-gray-200">
            <div className="flex flex-col items-center">
                {/* Avatar */}
                <div className="relative">
                    <img
                        src={user?.avatar}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover"
                    />
                    <button className="absolute bottom-0 right-0 bg-green-600 p-2 rounded-full text-white hover:bg-blue-700 transition-colors">
                        <Camera size={20} />
                    </button>
                </div>

                {/* Username & Email */}
                <h2 className="mt-4 text-xl font-semibold text-gray-900">{user?.username}</h2>
                <p className="text-gray-500">{user?.email}</p>

                {/* Thông báo */}
                <div className="mt-6 p-3 text-sm text-red-600 bg-red-100 rounded">
                    Vui lòng nhập mật khẩu cũ để xác nhận mọi thay đổi.
                </div>

                {/* Form */}
                <div className="w-full mt-4 space-y-4">
                    {/* Username */}
                    <div className="relative flex flex-col text-gray-600">
                        <span>Tên đăng nhập</span>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="border rounded p-2 pr-10"
                            disabled={!editMode.username}
                        />
                        <button
                            onClick={() => toggleEdit("username")}
                            className="absolute right-3 top-9 text-gray-500 hover:text-blue-600"
                        >
                            <Pencil size={18} />
                        </button>
                    </div>

                    {/* Email */}
                    <div className="relative flex flex-col text-gray-600">
                        <span>Email</span>
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border rounded p-2 pr-10"
                            disabled={!editMode.email}
                        />
                        <button
                            onClick={() => toggleEdit("email")}
                            className="absolute right-3 top-9 text-gray-500 hover:text-blue-600"
                        >
                            <Pencil size={18} />
                        </button>
                    </div>

                    {/* Đổi mật khẩu */}
                    <div className="text-lg font-semibold text-gray-700">Đổi mật khẩu</div>

                    <div className="flex flex-col text-gray-600">
                        <span>Mật khẩu mới</span>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="border rounded p-2"
                        />
                    </div>

                    <div className="flex flex-col text-gray-600">
                        <span>Xác nhận mật khẩu</span>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="border rounded p-2"
                        />
                    </div>

                    {/* Mật khẩu cũ (Bắt buộc) */}
                    <div className="flex flex-col text-gray-600">
                        <span className="font-semibold text-red-600">Nhập mật khẩu cũ (*)</span>
                        <input
                            type="password"
                            name="oldPassword"
                            value={formData.oldPassword}
                            onChange={handleChange}
                            className={`border rounded p-2 ${!formData.oldPassword.trim() ? "border-red-500" : ""}`}
                        />
                    </div>
                </div>

                {/* Nút cập nhật */}
                <button
                    className={`mt-8 w-full py-2 px-4 border rounded-lg text-white transition-colors 
                        ${isUpdateDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                    disabled={isUpdateDisabled}
                >
                    Cập nhật
                </button>
            </div>
        </div>
    );
}
