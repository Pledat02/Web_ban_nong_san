import React, { useEffect, useState } from "react";
import { Camera, Pencil, CheckCircle } from "lucide-react"; // Import check and x icons
import UserService from "../services/user-service";
import { toast } from "react-toastify";
import "../style/ProfileSidebar.css";
export function ProfileSidebar() {
    const [editMode, setEditMode] = useState({ username: false, email: false });
    const [avatar, setAvatar] = useState("default-avatar.png");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
    });
    const [user, setUser] = useState(null);
    useEffect(() =>{
        if(loading)
            toast.info('đang tải ...')
    },[loading])
    useEffect(() => {
        async function fetchUserInfo() {
            try {
                const userInfo = await UserService.getMyInfo();
                setUser(userInfo);
                setAvatar(userInfo?.avatar || "default-avatar.png");
                setFormData({
                    username: userInfo?.username || "",
                    email: userInfo?.email || "",
                });
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
            }
        }
        fetchUserInfo();
    }, []);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            updateUsername();
        }
    };

    const toggleEdit = (field) => {
        setEditMode({ ...editMode, [field]: !editMode[field] });
    };

    const updateUsername = async () => {
        try {
            setLoading(true);
            const response = await UserService.updateUsername(user.id_user, formData.username);
            if (response) {
                setUser({ ...user, username: formData.username });
                toast.success("Cập nhật tên đăng nhập thành công!");
            }
        } catch (error) {
            console.error("Cập nhật tên đăng nhập thất bại:", error);
            toast.error("Đã có lỗi xảy ra khi cập nhật tên đăng nhập.");
        } finally {
            setLoading(false);
        }
    };


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
            setAvatar(response.avatar);
        } catch (error) {
            console.error("Upload failed:", error);
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
                    <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-green-600 p-2 rounded-full text-white hover:bg-green-700 transition-colors cursor-pointer">
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
                    <div className="relative flex flex-col mb-16 text-gray-600">
                        <span>Tên đăng nhập</span>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            className="border rounded p-2 pr-10"
                            disabled={!editMode.username}
                        />
                        <button
                            onClick={() => toggleEdit("username")}
                            className="absolute right-3 top-9 text-gray-500 hover:text-blue-600"
                        >
                            {editMode.username ? <CheckCircle size={18}/> : <Pencil size={18}/>}
                        </button>
                    </div>
                    {/* Typewriter Text */}
                    <TypewriterText
                        text="Vui lòng nhập đầy đủ thông tin địa chỉ, email, sdt và kiểm tra kỹ trước để tiến hành đặt hàng"
                    />
                </div>

            </div>
        </div>
    );
}

function TypewriterText({ text }) {
    const [displayText, setDisplayText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timer = setTimeout(() => {
                setDisplayText((prev) => prev + text[currentIndex]);
                setCurrentIndex((prev) => prev + 1);
            }, 100); // Tốc độ gõ (ms mỗi ký tự)
            return () => clearTimeout(timer);
        }
    }, [currentIndex, text]);

    return (
        <div className="max-w-md break-words text-gray-600 mt-4">
            {displayText}
            <span className="border-r-2 border-orange-500 animate-blink">|</span>
        </div>
    )}