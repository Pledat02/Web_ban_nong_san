import axios from "axios";

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
            return response.data.data;
        } catch (error) {
            console.error("Error fetching reviews:", error);
            throw error;
        }
    }

    // 🟢 Gửi một review mới
    async createReview(reviewData) {
        try {
            const response = await this.api.post("/", reviewData);
            return response.data;
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
