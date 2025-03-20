import axios from "axios";
import { toast } from "react-toastify";

class ProfileService {
    constructor() {
        this.api = axios.create({
            baseURL: "http://localhost:8888/api/v1/profiles",
            headers: {
                "Content-Type": "application/json",
            },
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
            toast.error("Lỗi khi lấy thông tin,vui lòng đăng nhập trước", { position: "top-right" });
        }
    }

    // Cập nhật địa chỉ cá nhân
    async updateAddress(idUser, profileData) {
        try {
            const response = await this.api.post(`address/${idUser}`, profileData);
            if (response.status === 200) {
                toast.success("Cập nhật thành công", { position: "top-right" });
                return response.data;
            } else {
                toast.error(response.data?.message || "Có lỗi xảy ra!", { position: "top-right" });
                return null;
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật profile:", error);
            toast.error("Cập nhật thất bại, vui lòng thử lại!", { position: "top-right" });
            return null;
        }
    }
    // cập nhật thong tin cá nhân
    async updateProfile(idUser, profileData) {
        try {
            const response = await this.api.put(`/${idUser}`, profileData);
            if (response.status === 200) {
                toast.success("Cập nhật thành công", { position: "top-right" });
            } else {
                toast.error(response.data?.message || "Có l��i xảy ra!", { position: "top-right" });
                return null;
            }
        } catch (error) {
            toast.error("Cập nhật thất bại, vui lòng thử lại!", { position: "top-right" });
            return null;
        }
    }

}

export default new ProfileService();
