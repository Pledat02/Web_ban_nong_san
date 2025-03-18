import axios from "axios";
import { toast } from "react-toastify";

class PaymentService {
    constructor() {
        this.api = axios.create({
            baseURL: "http://localhost:8888/api/v1/payment",
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
    async CreatePaymentVNPay(amount) {
        try {
            const response = await this.api.get("/vnpay/pay", { params: { amount } });

            if (response.status === 200) {
                return response.data.data.paymentUrl;
            } else {
                toast.error(response.data.message, {position: "top-right"});
            }
        } catch (error) {
            toast.error("Lỗi khi lấy danh sách đơn hàng", {position: "top-right"});
        }
    }
    handlePaymentCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const responseCode = urlParams.get("vnp_ResponseCode");

        if (responseCode === "00") {
            toast.success("Thanh toán thành công!", { position: "top-right" });
            window.location.href = "/payment-result";
            return { success: true, message: "Thanh toán thành công!" };
        } else {
            toast.error("Thanh toán thất bại!", { position: "top-right" });
            return { success: false, message: "Thanh toán thất bại!" };
        }
    }

}
export default new PaymentService();