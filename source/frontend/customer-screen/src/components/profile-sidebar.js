import React, {useEffect, useState} from "react";
import { Camera, Pencil } from "lucide-react";
import UserService from "../services/user-service";
import { toast } from "react-toastify";

export function ProfileSidebar() {
    const [editMode, setEditMode] = useState({ username: false, email: false });
    const [avatar, setAvatar] = useState("default-avatar.png");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        newPassword: "",
        confirmPassword: "",
        oldPassword: "",
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchUserInfo() {
            try {
                const userInfo = await UserService.getMyInfo();
                setUser(userInfo);
                setAvatar(userInfo?.avatar || "default-avatar.png");
                setFormData({
                    username: userInfo?.username || "",
                    email: userInfo?.email || "",
                    newPassword: "",
                    confirmPassword: "",
                    oldPassword: "",
                });
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
            }
        }

        fetchUserInfo();
    }, []);


    const toggleEdit = (field) => {
        setEditMode({ ...editMode, [field]: !editMode[field] });
    };

    const isUpdateDisabled = !formData.oldPassword.trim(); // Chặn cập nhật nếu chưa nhập mật khẩu cũ

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Ảnh phải nhỏ hơn 5MB!");
            return;
        }

        if (!["image/png", "image/jpeg"].includes(file.type)) {
            toast.error("Chỉ chấp nhận ảnh PNG hoặc JPEG!");
            return;
        }

        try {
            setLoading(true);
            const response = await UserService.uploadAvatar(user.id_user, file);
            setAvatar(response.avatar); // Cập nhật avatar hiển thị
            toast.success("Cập nhật ảnh đại diện thành công!");
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error("Lỗi khi upload ảnh!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 border-b md:border-r md:border-b-0 border-gray-200">
            <div className="flex flex-col items-center">
                {/* Avatar */}
                <div className="relative">
                    <img
                        src={avatar}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover"
                    />
                    <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-green-600 p-2 rounded-full text-white hover:bg-blue-700 transition-colors cursor-pointer">
                        <Camera size={20} />
                    </label>
                    <input
                        id="avatar-upload"
                        type="file"
                        accept="image/png, image/jpeg"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>

                {/* Username & Email */}
                <h2 className="mt-4 text-xl font-semibold text-gray-900">{user?.username}</h2>
                <p className="text-gray-500">{user?.email}</p>

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
