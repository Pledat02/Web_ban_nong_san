// src/services/apiService.js
import axios from "axios";

class ApiService {
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
            throw error;
        }
    }

      async  login(email, password) {
        try {
            const response = await this.api.post("/identity/auth/log-in",
                { email, password });
            if(response.data.data.authenticated === true){
                localStorage.setItem("token", response.data.token);
                return true;
            }else{
                return false;
            }

        } catch (error) {
            console.error("Error during login:", error);
            throw error;
        }
    }
}

export default new ApiService(); // Export singleton instance
