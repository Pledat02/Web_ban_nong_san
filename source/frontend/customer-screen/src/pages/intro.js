import React from "react";

function Introduction() {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="relative h-96 mx-16 mb-12 rounded-lg overflow-hidden">
                <img
                    src="https://readdy.ai/api/search-image?query=Fresh%20organic%20vegetables%20and%20fruits%20arranged%20beautifully%20on%20wooden%20table%2C%20vibrant%20colors%2C%20natural%20lighting%2C%20clean%20background%2C%20professional%20food%20photography%2C%20high%20resolution%2C%20farm%20fresh%20produce%20display%20with%20leafy%20greens%20and%20colorful%20fruits&width=1200&height=400&seq=1&orientation=landscape"
                    alt="Rau củ quả tươi sạch"
                    className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 to-transparent flex items-center">
                    <div className="text-white p-12 max-w-xl">
                        <h1 className="text-4xl font-bold mb-4">Về AGRI FRESH</h1>
                        <p className="text-lg">
                            Chúng tôi cam kết mang đến những sản phẩm nông nghiệp tươi sạch, an toàn và chất lượng cao nhất cho mọi gia đình Việt.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid mx-16 md:grid-cols-3 gap-8 mb-16">
                <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
                    <div className="text-green-600 text-4xl mb-4">
                        <i className="fas fa-seedling"></i>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Sứ mệnh & Tầm nhìn</h2>
                    <p className="text-gray-700 mb-4">
                        AGRI FRESH ra đời với sứ mệnh mang đến những sản phẩm nông nghiệp sạch, an toàn và giàu dinh dưỡng cho người tiêu dùng Việt Nam.
                    </p>
                    <p className="text-gray-700">
                        Chúng tôi hướng đến việc trở thành nhà cung cấp thực phẩm sạch hàng đầu, góp phần nâng cao sức khỏe cộng đồng và phát triển nền nông nghiệp bền vững.
                    </p>
                </div>

                <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
                    <div className="text-green-600 text-4xl mb-4">
                        <i className="fas fa-check-circle"></i>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Quy trình kiểm soát chất lượng</h2>
                    <p className="text-gray-700 mb-4">
                        Mỗi sản phẩm của AGRI FRESH đều trải qua quy trình kiểm soát chất lượng nghiêm ngặt từ khâu tuyển chọn giống, canh tác, thu hoạch đến đóng gói và vận chuyển.
                    </p>
                    <p className="text-gray-700">
                        Chúng tôi áp dụng các tiêu chuẩn VietGAP, GlobalGAP và hệ thống quản lý an toàn thực phẩm hiện đại nhất.
                    </p>
                </div>

                <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
                    <div className="text-green-600 text-4xl mb-4">
                        <i className="fas fa-handshake"></i>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Cam kết với khách hàng</h2>
                    <p className="text-gray-700 mb-4">
                        AGRI FRESH cam kết cung cấp sản phẩm tươi sạch, nguồn gốc rõ ràng, giá cả hợp lý và dịch vụ chăm sóc khách hàng tận tâm.
                    </p>
                    <p className="text-gray-700">
                        Chúng tôi luôn sẵn sàng hoàn tiền 100% nếu sản phẩm không đạt chất lượng như cam kết.
                    </p>
                </div>
            </div>

            <div className=" mx-16 bg-green-600 text-white rounded-lg p-10 mb-16">
                <h2 className="text-2xl font-bold text-center mb-10">Thành tựu của chúng tôi</h2>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div>
                        <div className="text-5xl font-bold mb-2">10+</div>
                        <p className="text-xl">Năm kinh nghiệm</p>
                    </div>
                    <div>
                        <div className="text-5xl font-bold mb-2">50.000+</div>
                        <p className="text-xl">Khách hàng tin dùng</p>
                    </div>
                    <div>
                        <div className="text-5xl font-bold mb-2">300+</div>
                        <p className="text-xl">Sản phẩm đang cung cấp</p>
                    </div>
                </div>
            </div>

            <div className="mx-16 mb-16">
                <h2 className="text-2xl font-bold text-center mb-8">Quy trình sản xuất & đóng gói</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-lg overflow-hidden h-64">
                        <img
                            src="https://readdy.ai/api/search-image?query=Organic%20farming%20process%2C%20workers%20in%20field%20harvesting%20fresh%20vegetables%2C%20sustainable%20agriculture%20practices%2C%20clean%20environment%2C%20natural%20sunlight%2C%20high%20quality%20professional%20photography&width=400&height=300&seq=2&orientation=landscape"
                            alt="Quy trình thu hoạch"
                            className="w-full h-full object-cover object-top"
                        />
                    </div>
                    <div className="rounded-lg overflow-hidden h-64">
                        <img
                            src="https://readdy.ai/api/search-image?query=Quality%20control%20process%20for%20organic%20vegetables%2C%20workers%20inspecting%20and%20sorting%20fresh%20produce%2C%20clean%20facility%2C%20bright%20lighting%2C%20professional%20food%20safety%20practices%2C%20high%20resolution%20photography&width=400&height=300&seq=3&orientation=landscape"
                            alt="Quy trình kiểm soát chất lượng"
                            className="w-full h-full object-cover object-top"
                        />
                    </div>
                    <div className="rounded-lg overflow-hidden h-64">
                        <img
                            src="https://readdy.ai/api/search-image?query=Eco-friendly%20packaging%20process%20for%20organic%20produce%2C%20workers%20carefully%20packing%20fresh%20vegetables%2C%20clean%20modern%20facility%2C%20sustainable%20packaging%20materials%2C%20professional%20food%20packaging%20photography&width=400&height=300&seq=4&orientation=landscape"
                            alt="Quy trình đóng gói"
                            className="w-full h-full object-cover object-top"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Introduction;