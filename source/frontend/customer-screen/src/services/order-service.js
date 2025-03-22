import axios from "axios";
import { toast } from "react-toastify";

class OrderService {
    constructor() {
        this.api = axios.create({
            baseURL: "http://localhost:8888/api/v1/orders",
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

    // Tạo đơn hàng mới
    async createOrder(orderData) {
        try {
            const response = await this.api.post("/", orderData);
            if (response.status === 200) {
                toast.success("Đặt hàng thành công!", {position: "top-right"});
                return response.data.data;
            } else {
                toast.error(response.data.message, {position: "top-right"});
            }
        } catch (error) {
            toast.error("Đặt hàng thất bại, vui lòng thử lại", {position: "top-right"});
        }
    }
    async getMyOrders(page = 1, size = 5,) {
        try {
            const response = await this.api.get("/my-orders",
                {
                    params: {
                        page,
                        size,
                    },
                });
            if (response.status === 200) {
               return response.data.data;

            } else {
                toast.error(response.data.message, {position: "top-right"});
            }
        } catch (error) {
        }
    }

    // Lấy chi tiết một đơn hàng
    async getOrderById(orderId) {
        try {
            const response = await this.api.get(`/${orderId}`);
            if (response.status === 200) {
                return response.data.data;
            } else {
                toast.error(response.data.message, {position: "top-right"});
            }
        } catch (error) {
            toast.error("Không tìm thấy đơn hàng", {position: "top-right"});
        }
    }
    // huy don hang
    async cancelOrder(orderId) {
        try {
            const response = await this.api.put(`cancel/${orderId}`);
            if (response.status === 200) {
                toast.success(response.data.message, {position: "top-right"});
            } else {
                toast.error(response.data.message, {position: "top-right"});
            }
        } catch (error) {
            toast.error("Không tìm thấy đơn hàng", {position: "top-right"});
        }
    }

}
export default new OrderService();
