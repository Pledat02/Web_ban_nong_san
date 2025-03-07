import axios from "axios";

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
            return response.data.data;
        } catch (error) {
            console.error("Error registering user:", error);
            throw error;
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
