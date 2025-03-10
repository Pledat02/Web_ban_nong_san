import axios from "axios";
import {toast} from "react-toastify";

class UserService {
    constructor() {
        this.api = axios.create({
            baseURL: "http://localhost:8888/api/v1/identity/users",
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true, // Giữ session nếu dùng cookie
        });
    }

    // 🟢 Đăng ký tài khoản mới
    async register(userData) {
        try {
            const response = await this.api.post("/registration", userData);
            console.log(response)
            if (response.status === 200) {
                toast.success("Đăng ký thành công!", { position: "top-right" });
                return true;
            }

            toast.error(response.data?.message || "Có lỗi xảy ra!", { position: "top-right" });
            return false;

        } catch (error) {
            console.error("Lỗi khi đăng ký:", error.message);

            if (error.response) {
                const errorMessage = error.response.data?.message || "Lỗi từ server!";
                toast.error(errorMessage, { position: "top-right" });
            } else {
                toast.error("Lỗi kết nối đến server!", { position: "top-right" });
            }

            return false;
        }
    }


    // 🟢 Lấy thông tin người dùng theo ID
    async getUserById(userId, token) {
        try {
            const response = await this.api.get(`/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.data;
        } catch (error) {
            console.error("Error fetching user info:", error);
            throw error;
        }
    }

    // 🟢 Cập nhật thông tin người dùng
    async updateUser(userId, updatedData, token) {
        try {
            const response = await this.api.put(`/${userId}`, updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.data;
        } catch (error) {
            console.error("Error updating user info:", error);
            throw error;
        }
    }

    // 🟢 Đăng xuất
    async logout() {
        try {
            await this.api.post("/logout");
        } catch (error) {
            console.error("Error logging out:", error);
            throw error;
        }
    }
}

export default new UserService();
