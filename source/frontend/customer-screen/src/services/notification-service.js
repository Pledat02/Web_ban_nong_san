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
            const response = await this.api.post("/send-confirm-phone-otp", { phone });

            if (response.status === 200) {
                toast.success(response.data.data, { position: "top-right" });
                return true;
            } else {
                toast.error(response.data.data, { position: "top-right" });
                return false;
            }
        } catch (error) {
            toast.error("Lỗi khi gửi OTP!", { position: "top-right" });
            return false;
        }
    }

    async sendEmailOtp(email) {
        try {
            const response = await this.api.post("/send-confirm-email-otp", { email });

            if (response.status === 200) {
                toast.success(response.data.data, { position: "top-right" });
                return true;
            } else {
                toast.error(response.data.data, { position: "top-right" });
                return false;
            }
        } catch (error) {
            toast.error("Lỗi khi gửi OTP!", { position: "top-right" });
            return false;
        }
    }

    async verifyPhoneOtp(phone, otp, userId) {
        try {
            const response = await this.api.post(`/verify-confirm-phone-otp/${userId}`, { phone, otp });

            if (response.status === 200 && response.data.code === 1000) {
                toast.success(response.data.data, { position: "top-right" });
                return true;
            } else {
                toast.error(response.data.data, { position: "top-right" });
                return false;
            }
        } catch (error) {
            toast.error("Lỗi khi xác thực OTP!", { position: "top-right" });
            return false;
        }
    }

    async verifyEmailOtp(email, otp, userId) {
        try {
            const response = await this.api.post(`/verify-confirm-email-otp/${userId}`, { email, otp });

            if (response.status === 200 && response.data.code === 1000) {
                toast.success(response.data.data, { position: "top-right" });
                return true;
            } else {
                toast.error(response.data.data, { position: "top-right" });
                return false;
            }
        } catch (error) {
            toast.error("Lỗi khi xác thực OTP!", { position: "top-right" });
            return false;
        }
    }

    async sendForgotPasswordOtp(email) {
        try {
            const response = await this.api.post("/send-forgot-password-email-otp", { email });

            if (response.status === 200) {
                toast.success(response.data.data, { position: "top-right" });
                return true;
            } else {
                toast.error(response.data.data, { position: "top-right" });
                return false;
            }
        } catch (error) {
            toast.error("Lỗi khi gửi OTP đặt lại mật khẩu!", { position: "top-right" });
            return false;
        }
    }

    async verifyForgotPasswordOtp(email, otp) {
        try {
            const response = await this.api.post(`/verify-forgot-password-email-otp`, { email, otp });
            console.log(response)
            if (response.status === 200 && response.data.code === 1000) {
                toast.success(response.data.data, { position: "top-right" });
                return true;
            } else {
                toast.error(response.data.data, { position: "top-right" });
                return false;
            }
        } catch (error) {
            toast.error("Lỗi khi xác thực OTP đặt lại mật khẩu!", { position: "top-right" });
            return false;
        }
    }
    async updatePassword(password,email, otp) {
        try {
            const response = await this.api.post(`/update-password`, {
                otp,
                email,
                password,

            });

            if (response.status === 200 && response.data.code === 1000) {
                toast.success(response.data.data, { position: "top-right" });
                return true;
            } else {
                toast.error(response.data.data, { position: "top-right" });
                return false;
            }
        } catch (error) {
            toast.error("Lỗi khi cập nhật mật khẩu!", { position: "top-right" });
            return false;
        }
    }
}

export default new NotificationService();
