import React, { useState } from "react";

function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
        });
    };

    const handleSocialClick = (platform) => {
        console.log(`Clicked on ${platform}`);
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-12 mx-20 rounded-lg overflow-hidden h-96 shadow-md">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4946681007846!2d106.69908937465353!3d10.771595089387617!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4670702e31%3A0xa5777fb3a5bb9972!2sB%E1%BA%BFn%20Th%C3%A0nh%20Market!5e0!3m2!1sen!2s!4v1686727019924!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Bản đồ cửa hàng"
                ></iframe>
            </div>

            <div className="grid md:grid-cols-2 mx-16 gap-12">
                <div>
                    <h2 className="text-2xl font-bold mb-6">Gửi tin nhắn cho chúng tôi</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-gray-700 mb-2">
                                Họ tên
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-gray-700 mb-2">
                                Số điện thoại
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="subject" className="block text-gray-700 mb-2">
                                Chủ đề
                            </label>
                            <select
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            >
                                <option value="">-- Chọn chủ đề --</option>
                                <option value="hoi-dap">Hỏi đáp sản phẩm</option>
                                <option value="phan-hoi">Phản hồi dịch vụ</option>
                                <option value="hop-tac">Đề xuất hợp tác</option>
                                <option value="khac">Khác</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-gray-700 mb-2">
                                Nội dung
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                rows={5}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition duration-300 cursor-pointer !rounded-button whitespace-nowrap"
                        >
                            Gửi tin nhắn
                        </button>
                    </form>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-6">Thông tin liên hệ</h2>
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center">
                                <i className="fas fa-map-marker-alt text-green-600 mr-3"></i>
                                Địa chỉ các chi nhánh
                            </h3>
                            <ul className="space-y-3 pl-9">
                                <li className="text-gray-700">
                                    <span className="font-medium">Chi nhánh 1:</span> 123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh
                                </li>
                                <li className="text-gray-700">
                                    <span className="font-medium">Chi nhánh 2:</span> 456 Lê Văn Lương, Quận Thanh Xuân, Hà Nội
                                </li>
                                <li className="text-gray-700">
                                    <span className="font-medium">Chi nhánh 3:</span> 789 Nguyễn Tất Thành, TP. Đà Nẵng
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center">
                                <i className="fas fa-phone-alt text-green-600 mr-3"></i>
                                Hotline hỗ trợ 24/7
                            </h3>
                            <p className="text-gray-700 pl-9">
                                <a href="tel:1900123456" className="hover:text-green-600">
                                    1900 123 456
                                </a>
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center">
                                <i className="fas fa-envelope text-green-600 mr-3"></i>
                                Email hỗ trợ
                            </h3>
                            <p className="text-gray-700 pl-9">
                                <a href="mailto:support@agrifresh.vn" className="hover:text-green-600">
                                    support@agrifresh.vn
                                </a>
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center">
                                <i className="fas fa-clock text-green-600 mr-3"></i>
                                Giờ làm việc
                            </h3>
                            <p className="text-gray-700 pl-9">
                                Thứ 2 - Thứ 6: 8:00 - 20:00
                                <br />
                                Thứ 7 - Chủ nhật: 8:00 - 18:00
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-3">Kết nối với chúng tôi</h3>
                            <div className="flex space-x-4 pl-2">
                                <button
                                    type="button"
                                    onClick={() => handleSocialClick("Facebook")}
                                    className="text-gray-700 hover:text-blue-600 text-2xl"
                                    aria-label="Follow us on Facebook"
                                >
                                    <i className="fab fa-facebook-square"></i>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSocialClick("Instagram")}
                                    className="text-gray-700 hover:text-pink-600 text-2xl"
                                    aria-label="Follow us on Instagram"
                                >
                                    <i className="fab fa-instagram"></i>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSocialClick("YouTube")}
                                    className="text-gray-700 hover:text-red-600 text-2xl"
                                    aria-label="Follow us on YouTube"
                                >
                                    <i className="fab fa-youtube"></i>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSocialClick("TikTok")}
                                    className="text-gray-700 hover:text-green-600 text-2xl"
                                    aria-label="Follow us on TikTok"
                                >
                                    <i className="fab fa-tiktok"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;