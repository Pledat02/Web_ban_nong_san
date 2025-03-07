import React from "react";
import { MapPin, Phone, Mail, Globe } from "lucide-react";

const Footer = () => {
    return (
        <footer className="w-full bg-gray-900 text-gray-300 text-sm">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between gap-8">

                    {/* Liên hệ */}
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-3">Liên hệ</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2"><MapPin size={16} /> <span>Địa chỉ: 490A, Điện Biên Phủ, P.21, Q.Bình Thạnh, TP.HCM</span></li>
                            <li className="flex items-center gap-2"><Phone size={16} /> <span>Hotline: 0999 000 000</span></li>
                            <li className="flex items-center gap-2"><Mail size={16} /> <span>Email: support@webdemo.com</span></li>
                            <li className="flex items-center gap-2"><Globe size={16} /> <span>Website: <a href="https://fb.com/webdemo.com" className="hover:underline">fb.com/webdemo.com</a></span></li>
                        </ul>
                    </div>

                    {/* Tin tức */}
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-3">Tin tức</h3>
                        <ul className="space-y-2">
                            <li className="hover:text-white transition">📰 Kỹ thuật trồng rau sạch tại nhà hiệu quả</li>
                            <li className="hover:text-white transition">🥗 Eat Clean – Bí kíp giữ dáng và bảo vệ sức khỏe</li>
                            <li className="hover:text-white transition">🍏 Công thức detox giúp lấy lại vòng eo nhanh chóng</li>
                            <li className="hover:text-white transition">🛒 Mẹo chọn thực phẩm sạch và an toàn</li>
                        </ul>
                    </div>

                    {/* Về chúng tôi */}
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-3">Về chúng tôi</h3>
                        <ul className="space-y-2">
                            <li className="hover:text-white transition">🔹 <strong>Giới thiệu:</strong> Chúng tôi cam kết mang đến sản phẩm chất lượng và dịch vụ chuyên nghiệp.</li>
                            <li className="hover:text-white transition">🔹 <strong>Lĩnh vực hoạt động:</strong> Chuyên cung cấp thực phẩm sạch, dịch vụ tư vấn sức khỏe.</li>
                            <li className="hover:text-white transition">🔹 <strong>Chính sách chất lượng:</strong> Đảm bảo nguồn hàng rõ ràng, an toàn, không hóa chất.</li>
                            <li className="hover:text-white transition">🔹 <strong>Triết lý kinh doanh:</strong> Lấy uy tín và sự hài lòng của khách hàng làm trọng tâm.</li>
                        </ul>
                    </div>

                </div>

                {/* Copyright */}
                <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-500 text-xs">
                    © {new Date().getFullYear()} WebDemo. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
