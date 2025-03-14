import axios from "axios";
import { toast } from "react-toastify";

class ProfileService {
    constructor() {
        this.api = axios.create({
            baseURL: "http://localhost:8888/api/v1/profiles",
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

    // Lấy thông tin cá nhân
    async getMyProfile() {
        try {
            const response = await this.api.get("/my-profile");
            if (response.status === 200) {
                return response.data.data;
            } else {
                toast.error(response.data.message, { position: "top-right" });
            }
        } catch (error) {
            toast.error("Lỗi khi lấy profile", { position: "top-right" });
        }
    }

    // Cập nhật thông tin cá nhân
    async updateProfile(profileData) {
        try {
            const response = await this.api.put("/my-profile", profileData);
            if (response.status === 200) {
                toast.success("Cập nhật thành công", { position: "top-right" });
                return response.data;
            } else {
                toast.error(response.data.message, { position: "top-right" });
            }
        } catch (error) {
            toast.error("Cập nhật thất bại", { position: "top-right" });
        }
    }
}

export default new ProfileService();
