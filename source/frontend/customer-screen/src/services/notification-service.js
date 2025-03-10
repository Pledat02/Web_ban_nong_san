import axios from "axios";
import { toast } from "react-toastify";

class NotificationService {
    constructor() {
        this.api = axios.create({
            baseURL: "http://localhost:8888/api/v1/notifications",
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true, // Giữ session nếu dùng cookie
        });
    }

    async sendOtp(phone) {
        try {
            const response = await this.api.post("/send-otp", { phone });

            if (response.status === 200) {
                toast.success("OTP đã được gửi!", { position: "top-right" });
                return true;
            } else {
                toast.error(response.data.message, { position: "top-right" });
                return false;
            }
        } catch (error) {
            toast.error("Lỗi khi gửi OTP!", { position: "top-right" });
            return false;
        }
    }

    async verifyOtp(phone, otp) {
        try {
            const response = await this.api.post("/verify-otp", { phone, otp });

            if (response.status === 200 && response.data.success) {
                toast.success("Xác thực OTP thành công!", { position: "top-right" });
                return true;
            } else {
                toast.error("OTP không hợp lệ!", { position: "top-right" });
                return false;
            }
        } catch (error) {
            toast.error("Lỗi khi xác thực OTP!", { position: "top-right" });
            return false;
        }
    }
}

export default new NotificationService();
