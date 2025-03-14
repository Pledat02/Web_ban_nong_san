import axios from "axios";
import {toast} from "react-toastify";

class ReviewService {
    constructor() {
        this.api = axios.create({
            baseURL: "http://localhost:8888/api/v1/reviews",
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true, // Giữ session nếu dùng cookie
        });
    }

    // 🟢 Lấy danh sách review theo productId
    async getReviewsByProductId(productId) {
        try {
            const response = await this.api.get(`/product/${productId}`);
            if(response.status === 200){
                return response.data.data;

            }else {
                toast.error(response.data.message, { position: "top-right" });
            }

        } catch (error) {
            // console.error("Error fetching reviews:", error);
            // throw error;
        }
    }

    // 🟢 Gửi một review mới
    async createReview(reviewData, token) {
        try {
            const response = await this.api.post("/", reviewData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.data;
        } catch (error) {
            console.error("Error creating review:", error);
            throw error;
        }
    }


    // 🟢 Xóa review theo ID
    async deleteReview(reviewId) {
        try {
            const response = await this.api.delete(`/${reviewId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting review:", error);
            throw error;
        }
    }
}

export default new ReviewService();
