import axios from "axios";

class AuthService {
    constructor() {
        this.api = axios.create({
            baseURL: "http://localhost:8888/api/v1/identity/auth",
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });
    }

    async loginFirebase(user){
        try{
            const response = await this.api.post("/firebase", user);
            return response.data?.data;
        }
        catch(error){
            console.error("Error during login with firebase:", error);
        }
    }

    async login(email, password) {
        try {
            const response = await this.api.post("/log-in", { email, password });
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
