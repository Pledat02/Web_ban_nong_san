import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const paymentStatus = searchParams.get("status");

        if (paymentStatus === "success") {
            setStatus("success");
        } else {
            setStatus("failed");
        }

        // Quay về trang chủ sau 5 giây
        setTimeout(() => navigate("/"), 5000);
    }, [searchParams, navigate]);

    return (
        <div className="text-center mt-10">
            {status === "success" ? (
                <h2 className="text-green-500 text-2xl font-bold">Thanh toán thành công!</h2>
            ) : (
                <h2 className="text-red-500 text-2xl font-bold">Thanh toán thất bại!</h2>
            )}
            <p>Đang quay về trang chủ...</p>
        </div>
    );
};

export default PaymentResult;
