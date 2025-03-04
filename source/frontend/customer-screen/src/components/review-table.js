import React, { useState, useEffect } from "react";
import ReviewService from "../services/review-service"; // Import service gọi API

const ReviewTable = ({ product }) => {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    useEffect(() => {
        if (product?.id_product) {
            ReviewService.getReviewsByProductId(product.id_product)
                .then(data => setReviews(data))
                .catch(err => console.error("Lỗi khi tải đánh giá:", err));
        }
    }, [product]);

    // 🔹 Xử lý gửi đánh giá mới
    const handleSubmitReview = async () => {
        if (rating === 0 || comment.trim() === "") {
            alert("Vui lòng chọn số sao và nhập đánh giá!");
            return;
        }

        const newReview = {
            productId: product.id_product,
            userId: "67079075-801a-42b8-bfca-aece2c09bbc4", // Thay bằng user thực tế
            rating,
            comment
        };

        try {
            const response = await ReviewService.createReview(newReview);
            setReviews([...reviews, response]); // Thêm review mới vào danh sách
            setRating(0);
            setComment("");
        } catch (error) {
            console.error("Lỗi khi gửi đánh giá:", error);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-800">Đánh giá sản phẩm</h3>

            {/* Danh sách đánh giá có thanh cuộn */}
            <div className="mt-4 max-h-60 overflow-y-auto">
                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <div key={index} className="flex flex-col gap-2 py-2">
                            {/* Avatar + Username */}
                            <div className="flex items-center gap-2">
                                <img
                                    src={review.avatar || "https://tse4.mm.bing.net/th?id=OIP.ggX8e6U3YzyhPvp8qGZtQwHaHa&pid=Api&P=0&h=180"}
                                    className="w-8 h-8 rounded-full"
                                />
                                <div className="flex flex-col">
                                    <span className="font-semibold">{review.reviewerResponse.username}</span>
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

                            {/* Đánh giá sao + nội dung (xuống dòng) */}
                            <div className="flex flex-col ml-4">
                                <div className="flex">
                                    {/* Hiển thị sao */}
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


            {/* Form viết đánh giá */}
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
                <textarea className="w-full mt-2 p-2 border rounded" placeholder="Nhập đánh giá của bạn..."></textarea>
                <button className="mt-2 px-4 py-2 bg-green-500 text-white font-bold rounded">Gửi đánh giá</button>
            </div>
        </div>
    );
};

export default ReviewTable;
