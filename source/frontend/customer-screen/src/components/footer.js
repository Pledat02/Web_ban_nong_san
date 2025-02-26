import React from "react";

const Footer = () => {
    return (
        <footer className="w-full bg-gray-800 text-white fix">
            <div className="container mx-auto px-4 py-6 ">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Liên hệ */}
                    <div>
                        <h3 className="text-lg font-bold">Liên hệ</h3>
                        <p>📍 490A, Điện Biên Phủ, P.21, Q.Bình Thạnh</p>
                        <p>📞 0999000000</p>
                        <p>📧 email@gmail.com</p>
                        <p>🌐 fb.com/webdemo.com</p>
                    </div>

                    {/* Tin tức */}
                    <div>
                        <h3 className="text-lg font-bold">Tin tức</h3>
                        <ul className="space-y-2">
                            <li>Kỹ thuật trồng rau sạch tại nhà đơn giản</li>
                            <li>Eat Clean – bí kíp có thân hình đẹp</li>
                            <li>Lấy lại vòng eo với công thức từ củ đậu</li>
                        </ul>
                    </div>

                    {/* Về chúng tôi */}
                    <div>
                        <h3 className="text-lg font-bold">Về chúng tôi</h3>
                        <ul className="space-y-2">
                            <li>Giới thiệu</li>
                            <li>Lĩnh vực hoạt động</li>
                            <li>Chính sách chất lượng</li>
                            <li>Triết lý kinh doanh</li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
