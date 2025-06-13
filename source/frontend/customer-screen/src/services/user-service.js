import axios from "axios";
import { toast } from "react-toastify";

class UserService {
    constructor() {
        this.api = axios.create({
            baseURL: "http://localhost:8888/api/v1/identity/users",
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true, // Giữ session nếu dùng cookie
        });

        this.api.interceptors.request.use((config) => {
            const user = JSON.parse(localStorage.getItem("user")) || {};
            const token = user.token;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        }, (error) => {
            return Promise.reject(error);
        });
    }

    // 🟢 Đăng ký người dùng
    async register(userData) {
        try {
            const response = await this.api.post("/registration", userData);
            if (response.status === 200) {
                toast.success("Đăng ký thành công!", { position: "top-right" });
                return true;
            }
            toast.error(response.data?.message || "Có lỗi xảy ra!", { position: "top-right" });
            return false;
        } catch (error) {
            console.error("Lỗi khi đăng ký:", error.message);
            if (error.response) {
                toast.error(error.response.data?.message || "Lỗi từ server!", { position: "top-right" });
            } else {
                toast.error("Lỗi kết nối đến server!", { position: "top-right" });
            }
            return false;
        }
    }

    // 🟢 Lấy thông tin người dùng theo ID
    async getUserById(userId) {
        try {
            const response = await this.api.get(`/${userId}`);
            return response.data.data;
        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
            throw error;
        }
    }
    async getMyInfo() {
        try {
            const response = await this.api.get("/my-info");
            console.log(response)
            return response.data.data;
        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
        }
    }

    // 🟢 Cập nhật thông tin người dùng
    async updateUsername(userId, updatedData) {
        try {
            const response = await this.api.put(`username/${userId}`, updatedData);
            return response.status === 200?true:false;
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin người dùng:", error);
            throw error;
        }
    }
    async changePassword(userId, request) {
        try {
            await this.api.put(`change-password/${userId}`, request);
            toast.success("Thay đổi mật khẩu thành công!");
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin người dùng:", error);
            throw error;
        }
    }

    // 🟢 Upload Avatar
    async uploadAvatar(userId, file) {
        try {
            const formData = new FormData();
            formData.append("userId", userId);
            formData.append("file", file);

            const response = await this.api.post("/upload-avatar", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Cập nhật ảnh đại diện thành công!");
            return response.data.data;
        } catch (error) {
            console.error("Lỗi khi upload avatar:", error);

            const errorMessage = error.response?.data?.message || "Lỗi khi upload ảnh!";
            toast.error(errorMessage);
        }
    }
}

export default new UserService();
