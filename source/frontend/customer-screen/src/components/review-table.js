import React from "react";
const ReviewTable = ({ product }) => {
    const reviews = product.reviews || []; // Nếu reviews là null, gán thành mảng rỗng
    const [rating, setRating] = React.useState(0);

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-800">Đánh giá sản phẩm</h3>

            {/* Danh sách đánh giá */}
            <div className="mt-4">
                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <div key={index} className="border-b py-2">
                            <p className="font-semibold">{review.user}</p>
                            <p className="text-yellow-500">{"⭐".repeat(review.rating)}</p>
                            <p className="text-gray-700">{review.comment}</p>
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
