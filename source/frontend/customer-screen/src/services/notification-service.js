import axios from "axios";
import { toast } from "react-toastify";

class NotificationService {
    constructor() {
        this.api = axios.create({
            baseURL: "http://localhost:8888/api/v1/notifications",
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });
    }

    async sendPhoneOtp(phone) {
        try {
            const response = await this.api.post("/send-phone-otp", { phone });

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
    async sendEmailOtp(email) {
        try {
            const response = await this.api.post("/send-email-otp", { email });

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

    async verifyPhoneOtp(phone, otp, userId) {
        try {
            const response = await this.api.post(`/verify-phone-otp/${userId}`, { phone, otp });

            if (response.status === 200 && response.data.code===1000) {
                toast.success("Xác thực OTP thành công!", { position: "top-right" });
                return true;
            } else {
                toast.error("OTP không hợp lệ!", { position: "top-right" });
                return false;
            }
        } catch (error) {
            toast.error("Lỗi khi xác thực OTP!" +error, { position: "top-right" });
            return false;
        }
    }

    async verifyEmailOtp(email, otp, userId) {
        try {
            const response = await this.api.post(`/verify-email-otp/${userId}`, { email, otp });

            if (response.status === 200 && response.data.code===1000) {
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
