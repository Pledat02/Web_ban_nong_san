import React, { useState, useEffect } from "react";
import ReviewService from "../services/review-service";
import { useUser } from "../context/UserContext";
import {toast} from "react-toastify";

const ReviewTable = ({ product }) => {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState("");
    const { user } = useUser();


    useEffect(() => {
        if (product?.id_product) {
            ReviewService.getReviewsByProductId(product.id_product)
                .then(data => setReviews(data || []))
                .catch(error => toast.error("Lỗi khi tải đánh giá", { position: "top-right" }));
        }
    }, [product]);


    // 🔹 Xử lý gửi đánh giá mới
    const handleSubmitReview = async () => {
        if (!user) {
            toast.warn("Bạn cần đăng nhập để gửi đánh giá!", { position: "top-right" });
            return;
        }

        if (rating === 0 || content.trim() === "") {
            toast.warn("Vui lòng chọn số sao và nhập đánh giá!", { position: "top-right" });
            return;
        }

        const newReview = {
            id_product: product.id_product,
            id_user: user.id_user,
            rating,
            content
        };

        try {
            const response = await ReviewService.createReview(newReview, user.token);
            if (response) {
                setReviews([response, ...reviews]);
                setRating(0);
                setContent("");
                toast.success("Gửi đánh giá thành công!", { position: "top-right" });
            }
        } catch (error) {
            toast.error(error.message || "Lỗi khi gửi đánh giá", { position: "top-right" });
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-800">Đánh giá sản phẩm</h3>

            {/* Danh sách đánh giá */}
            <div className="mt-4 max-h-[200px] overflow-y-auto">
                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <div key={index} className="flex flex-col gap-2 py-2">
                            <div className="flex items-center gap-2">
                                <img
                                    src={review.avatar || "https://tse4.mm.bing.net/th?id=OIP.ggX8e6U3YzyhPvp8qGZtQwHaHa&pid=Api&P=0&h=180"}
                                    className="w-8 h-8 rounded-full"
                                />
                                <div className="flex flex-col">
                                    <span className="font-semibold">{review.reviewerResponse?.username || "Người dùng"}</span>
                                    <span className="text-sm text-gray-500">
                                        {new Date(review.create_date).toLocaleString("vi-VN", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </span>
                                </div>
                            </div>

                            {/* Hiển thị sao và nội dung */}
                            <div className="flex flex-col ml-4">
                                <div className="flex">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <span key={i} className="text-yellow-500">⭐</span>
                                    ))}
                                </div>
                                <p className="text-gray-600">{review.content}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">Chưa có đánh giá nào.</p>
                )}
            </div>

            {/* Form gửi đánh giá */}
            <div className="mt-4 border-t pt-4">
                <h4 className="text-lg font-semibold">Viết đánh giá của bạn</h4>
                <div className="flex items-center gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`cursor-pointer text-2xl ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                            onClick={() => setRating(star)}
                        >
                            ★
                        </span>
                    ))}
                </div>
                <textarea
                    onChange={(e) => setContent(e.target.value)}
                    value={content}
                    className="w-full mt-2 p-2 border rounded"
                    placeholder="Nhập đánh giá của bạn..."
                />
                <button
                    onClick={handleSubmitReview}
                    className="mt-2 px-4 py-2 cursor-pointer bg-green-500 text-white font-bold rounded"
                >
                    Gửi đánh giá
                </button>
            </div>
        </div>
    );
};

export default ReviewTable;
