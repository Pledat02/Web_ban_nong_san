import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductService from "../services/product-service";
import ReviewTable from "../components/review-table";
import ProductCategoryList from "../list/product-category-list";
import { CartActionTypes, useCart } from "../context/cart-context";
import {toast} from "react-toastify";

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedType, setSelectedType] = useState(product?.weightTypes?.[0] || null);
    const { dispatch } = useCart();
    const navigate = useNavigate();

    const addToCart = () => {
        dispatch({
            type: CartActionTypes.ADD_TO_CART,
            payload: {
                id_product: product.id_product,
                name: product.name,
                price: product.price,
                weight:selectedType,
                image: product.image,
                quantity,
            },
        });
    };
    useEffect(() => {
        if (product?.weightTypes?.length > 0) {
            setSelectedType(product.weightTypes[0]);
        }
    }, [product]);

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const data = await ProductService.getProductById(id);
                console.log(data)
                setProduct(data);
            } catch (error) {
                console.error("Failed to fetch product details:", error);
            }
        };

        fetchProductDetail();
    }, [id]);

    if (!product) {
        return <p className="text-center text-gray-500">Đang tải sản phẩm...</p>;
    }

    return (
        <div className="grid " >
            <div className="container w-full mx-auto px-4 lg:px-16 py-8">
                <div className="flex flex-col lg:flex-row gap-8  bg-white shadow-lg pb-8">
                    {/* Hình ảnh sản phẩm */}
                    <div className="rounded-lg border-2 border-yellow-400 p-6 w-full lg:w-1/2 relative">
                        {product.oldPrice && (
                            <div
                                className="absolute top-2 left-2 bg-[#16A34A] text-white px-4 py-2 rounded-full text-m font-bold">
                                -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                            </div>
                        )}
                        <img src={product.image} alt={product.name}
                             className="w-full sm:h-40 lg:h-[20rem] object-cover rounded-lg shadow-lg"/>
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-around">
                        <div>
                            <h2 className="text-3xl font-bold text-brown-700">{product.name}</h2>
                            <p className="text-gray-500 mt-2">{product.description}</p>

                            {/* Hiển thị giá hiện tại dựa vào loại sản phẩm */}
                            <div className="mt-4 flex items-center">
                            <span className="text-xl font-bold text-[#16A34A]">
                                {selectedType
                                    ? new Intl.NumberFormat("vi-VN", {style: "currency", currency: "VND"}).format(
                                        selectedType.unit === "g" ?
                                            selectedType.weight * product.price / 1000 : selectedType.weight * product.price
                                    )
                                    : `${new Intl.NumberFormat("vi-VN", {style: "currency", currency: "VND"}).format(
                                        ProductService.getMinPrice(product.weightTypes, product.oldPrice)
                                    )} - ${new Intl.NumberFormat("vi-VN", {style: "currency", currency: "VND"}).format(
                                        ProductService.getMaxPrice(product.weightTypes, product.oldPrice)
                                    )}`}
                            </span>
                            </div>
                        </div>

                        {/* Chọn loại sản phẩm */}
                        <div className="mt-4">
                            <label className="text-gray-700 font-semibold">Loại</label>
                            <div className="flex mt-2">
                                {product.weightTypes.map((item) => (
                                    <button
                                        key={item.weight}
                                        className={`px-4 py-2 border rounded mr-2 ${selectedType === item ? "border-green-500 text-green-600" : "border-gray-400"}`}
                                        onClick={() => setSelectedType(item)}
                                    >
                                        {item.weight + item.unit}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Hiển thị số lượng tồn kho dựa vào loại đã chọn */}
                        <div className="mt-2">
                            <p className="text-gray-600">
                                Số lượng tồn kho:{" "}
                                <span className="font-bold">
                                {product.stock}
                            </span>
                            </p>
                        </div>

                        {/* Bộ chọn số lượng */}
                        <div className="flex items-center mt-6">
                            <button
                                className="px-3 py-1 border border-gray-400"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                                -
                            </button>
                            <input type="text" value={quantity} readOnly
                                   className="w-12 py-1 font-bold text-center border border-gray-400 mx-0"/>
                            <button
                                className="px-3 py-1 border border-gray-400"
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                +
                            </button>
                        </div>

                        {/* Số lượng và nút mua hàng */}
                        <div className="mt-6 flex items-center">
                            <button
                                onClick={() => {
                                    addToCart();
                                    navigate("/cart");
                                }}
                                className="px-4 py-2 bg-yellow-500 text-white font-bold rounded mr-4"
                            >
                                Mua ngay
                            </button>
                            <button onClick={() => {
                                addToCart();
                                toast.success("Thêm vào giỏ hàng thành công", {position: "top-right"});
                            }} className="px-4 py-2 bg-orange-500 text-white font-bold rounded">
                                Thêm vào giỏ hàng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Đánh giá và thông tin sản phẩm */}
            <div className="flex flex-col lg:flex-row gap-8 mx-14 my-8">
                {/* Cột 1 - Bảng Đánh Giá */}
                <div className="w-full  lg:w-2/3 flex flex-col h-full">
                    <div className="w-full rounded-lg shadow-md bg-white flex flex-col flex-1 h-full">
                        <ReviewTable product={product}/>
                    </div>
                </div>

                {/* Cột 2 - Thông Tin Sản Phẩm */}
                <div className="w-full lg:w-1/3 flex flex-col h-full">
                    <div className="w-full p-4 rounded-lg shadow-md bg-white flex flex-col flex-1 h-full">
                        <InformationTable product={product}/>
                    </div>
                </div>
            </div>


            {/*sản phẩm liên quan*/}
            <ProductCategoryList title="Sản phẩm tương tự" categoryId={product.category.id_category}/>
            <br/>
        </div>

    );
};
const InformationTable = ({product}) => {
    return (
        <div className="bg-white">
            <h3 className="text-2xl font-bold text-gray-800">Thông tin sản phẩm</h3>
            <table className="mt-4 overflow-hidden w-full border-collapse border border-gray-300">
                <tbody>
                <tr>
                    <td className="border p-2 font-semibold">Danh mục</td>
                    <td className="border p-2">{product.category.name}</td>
                </tr>
                <tr>
                    <td className="border p-2 font-semibold">Thương hiệu</td>
                    <td className="border p-2">{product.brand}</td>
                </tr>
                <tr>
                    <td className="border p-2 font-semibold">Hữu cơ</td><td className="border p-2">{product.organic ? "Có" : "Không"}</td></tr>
                <tr><td className="border p-2 font-semibold">Xuất xứ</td><td className="border p-2">{product.origin}</td></tr>
                <tr><td className="border p-2 font-semibold">Đóng gói</td><td className="border p-2">{product.packaging}</td></tr>
                <tr><td className="border p-2 font-semibold">Cách sử dụng</td><td className="border p-2">{product.howToUse}</td></tr>
                <tr><td className="border p-2 font-semibold">Bảo quản</td><td className="border p-2">{product.howToPreserve}</td></tr>
                </tbody>
            </table>
        </div>
    );
};

export default ProductDetail;
