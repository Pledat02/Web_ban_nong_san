import axios from "axios";

class AuthService {
    constructor() {
        this.api = axios.create({
            baseURL: "http://localhost:8888/api/v1",
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });
    }

    async getPosts() {
        try {
            const response = await this.api.get("/posts");
            return response.data;
        } catch (error) {
            console.error("Error fetching posts:", error);
            return null;
        }
    }

    async login(email, password) {
        try {
            const response = await this.api.post("/identity/auth/log-in", { email, password });
            return response.data?.data;
        } catch (error) {
            console.error("Error during login:", error);
            return false; // Trả về false nếu có lỗi
        }
    }
    checkExpiredToken(){
        const token = localStorage.getItem('token');
        if(token){
            const expired = new Date(token.exp * 1000) < new Date();
            return expired;
        }
        return true;
    }
}

export default new AuthService();
