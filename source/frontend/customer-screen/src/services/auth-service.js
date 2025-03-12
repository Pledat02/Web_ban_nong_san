import axios from "axios";
import {toast} from "react-toastify";

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
            toast.error(error.message, { position: "top-right" });
        }
    }

    async login(email, password) {
        try {
            const response = await this.api.post("/log-in", { email, password });
           if(response.status !== 200){
               toast.error(response.data.message, { position: "top-right" });
               return false;
           }
            return response.data?.data;
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data?.message || "Invalid credentials", { position: "top-right" });
            } else {
                toast.error("An error occurred. Please try again later.", { position: "top-right" });
            }
            return false;
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
    async logout() {
        localStorage.removeItem('user');
        try {
            await this.api.post("/logout");
        } catch (error) {
            console.error("Error logging out:", error);
            throw error;
        }
    }
}

export default new AuthService();
