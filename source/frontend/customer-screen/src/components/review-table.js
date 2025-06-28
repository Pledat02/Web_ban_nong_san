import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import ReviewService from "../services/review-service";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";

const ReviewTable = ({ product }) => {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useUser();

    useEffect(() => {
        if (product?.id_product) {
            setIsLoading(true);
            ReviewService.getReviewsByProductId(product.id_product)
                .then(data => {
                    setReviews(data || []);
                    setIsLoading(false);
                })
                .catch(error => {
                    toast.error("Error loading reviews", { position: "top-right" });
                    setIsLoading(false);
                });
        }
    }, [product]);

    const handleSubmitReview = async () => {
        if (!user) {
            toast.warn("Vui lòng đăng nhập trước để thực hiện đánh giá!", { position: "top-right" });
            return;
        }

        if (rating === 0 || content.trim() === "") {
            toast.warn("Hãy chọn số sao và gửi đánh giá của bạn!", { position: "top-right" });
            return;
        }

        const newReview = {
            id_product: product.id_product,
            id_user: user.id_user,
            rating,
            content
        };

        try {
            const response = await ReviewService.createReview(newReview);
            if (response) {
                setReviews([response, ...reviews]);
                setRating(0);
                setContent("");
                toast.success("Đăng bình luận thành công!", { position: "top-right" });
            }
        } catch (error) {
            toast.error(error.message || "Error submitting review", { position: "top-right" });
        }
    };

    if (isLoading) {
        return (
            <div className="h-[600px] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-green-500 mx-auto" />
                    <p className="mt-4 text-gray-600">Loading reviews...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg h-[600px] flex flex-col">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Đánh giá sản phẩm</h3>

            {/* Reviews List */}
            <div className="flex-1 overflow-y-auto mb-4 pr-2 custom-scrollbar">
                {reviews.length > 0 ? (
                    <div className="space-y-4">
                        {reviews.map((review, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-4 transition-all duration-200 hover:shadow-md">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={review.avatar || "https://tse4.mm.bing.net/th?id=OIP.ggX8e6U3YzyhPvp8qGZtQwHaHa&pid=Api&P=0&h=180"}
                                        alt="User avatar"
                                        className="w-10 h-10 rounded-full object-cover border-2 border-green-500"
                                    />
                                    <div>
                                        <span className="font-semibold text-gray-800">
                                            {review.reviewerResponse?.username || "User"}
                                        </span>
                                        <div className="flex items-center gap-1 mt-1">
                                            {[...Array(review.rating)].map((_, i) => (
                                                <span key={i} className="text-yellow-400 text-lg">★</span>
                                            ))}
                                        </div>
                                    </div>
                                    <span className="ml-auto text-sm text-gray-500">
                                        {(() => {
                                            const parts = review.create_date.split(" ");
                                            if (parts.length === 2) {
                                                const [day, month, year] = parts[0].split("/");
                                                const time = parts[1];
                                                const formattedDate = `${year}-${month}-${day}T${time}`;
                                                return new Date(formattedDate).toLocaleString("vi-VN", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                });
                                            }
                                            return "No date";
                                        })()}
                                    </span>
                                </div>
                                <p className="mt-2 text-gray-600 pl-13">{review.content}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!
                    </div>
                )}
            </div>

            {/* Review Form */}
            <div className="border-t pt-4 mt-auto">
                <h4 className="text-lg font-semibold mb-3">Viết đánh giá của bạn</h4>
                <div className="flex items-center gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            className={`text-2xl transition-colors duration-200 hover:scale-110 ${
                                rating >= star ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            onClick={() => setRating(star)}
                        >
                            ★
                        </button>
                    ))}
                </div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="
Chia sẻ suy nghĩ của bạn về sản phẩm này..."
                    rows={3}
                />
                <button
                    onClick={handleSubmitReview}
                    className="mt-3 w-full py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  Gửi đánh giá
                </button>
            </div>
        </div>
    );
};

export default ReviewTable;