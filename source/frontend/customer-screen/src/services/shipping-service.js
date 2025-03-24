import axios from "axios";
import { toast } from "react-toastify";

class ShippingService {
    constructor() {
        this.api = axios.create({
            baseURL: "http://localhost:8888/api/v1/shipping",
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

    //  Lấy phí vận chuyển từ GHTK
    async getShippingFee(shippingData) {
        try {
            const response = await this.api.post("/fee", shippingData);

            if (response.status === 200) {
                return response.data.data.fee.fee;
            } else {
                toast.error(response.data.message || "Không thể lấy phí vận chuyển!", { position: "top-right" });
            }
        } catch (error) {
            console.error("Error fetching shipping fee:", error);
            throw error;
        }
    }


}

export default new ShippingService();
