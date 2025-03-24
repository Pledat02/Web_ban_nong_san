import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import ProductService from "../services/product-service";
import ReviewTable from "../components/review-table";
import ProductCategoryList from "../list/product-category-list";
import { CartActionTypes, useCart } from "../context/cart-context";
import { toast } from "react-toastify";

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedType, setSelectedType] = useState(null);
    const { dispatch } = useCart();
    const navigate = useNavigate();

    const addToCart = () => {
        dispatch({
            type: CartActionTypes.ADD_ITEM,
            payload: {
                id: product.id_product,
                name: product.name,
                price: product.price * selectedType.weight,
                weight: selectedType,
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
            setIsLoading(true);
            try {
                const data = await ProductService.getProductById(id);
                setProduct(data);
            } catch (error) {
                console.error("Failed to fetch product details:", error);
                toast.error("Failed to load product details", { position: "top-right" });
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductDetail();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-green-500 mx-auto" />
                    <p className="mt-4 text-gray-600 text-lg">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-gray-600">Product not found</p>
            </div>
        );
    }

    return (
        <div className="grid">
            <div className="container w-full mx-auto px-4 lg:px-16 py-8">
                <div className="flex flex-col lg:flex-row gap-8 bg-white shadow-lg rounded-xl pb-8">
                    {/* Product Image */}
                    <div className="rounded-xl border-2 border-yellow-400 p-6 w-full lg:w-1/2 relative overflow-hidden group">
                        {product.oldPrice && (
                            <div className="absolute top-4 left-4 bg-green-600 text-white px-6 py-2 rounded-full text-sm font-bold transform rotate-0 transition-transform duration-300 hover:rotate-12">
                                -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                            </div>
                        )}
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full sm:h-40 lg:h-[25rem] object-cover rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>

                    {/* Product Information */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-between p-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h2>
                            <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>

                            <div className="mt-6 space-y-4">
                                <div className="flex items-center">
                                    <span className="text-2xl font-bold text-green-600">
                                        {selectedType
                                            ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                                selectedType.unit === "g"
                                                    ? (selectedType.weight * product.price) / 1000
                                                    : selectedType.weight * product.price
                                            )
                                            : `${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                                ProductService.getMinPrice(product.weightTypes, product.oldPrice)
                                            )} - ${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                                ProductService.getMaxPrice(product.weightTypes, product.oldPrice)
                                            )}`}
                                    </span>
                                </div>

                                {/* Product Types */}
                                <div className="space-y-2">
                                    <label className="text-gray-700 font-semibold block">Select Type</label>
                                    <div className="flex flex-wrap gap-2">
                                        {product.weightTypes.map((item) => (
                                            <button
                                                key={item.weight}
                                                className={`px-6 py-2 rounded-full transition-all duration-200 ${
                                                    selectedType === item
                                                        ? "bg-green-500 text-white shadow-lg transform scale-105"
                                                        : "bg-gray-100 hover:bg-gray-200"
                                                }`}
                                                onClick={() => setSelectedType(item)}
                                            >
                                                {item.weight + item.unit}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Stock Information */}
                                <div className="text-gray-600">
                                    Stock Available: <span className="font-bold text-green-600">{product.stock}</span>
                                </div>

                                {/* Quantity Selector */}
                                <div className="flex items-center space-x-2">
                                    <button
                                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="text"
                                        value={quantity}
                                        readOnly
                                        className="w-16 h-10 text-center border rounded-lg font-bold"
                                    />
                                    <button
                                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
                                        onClick={() => setQuantity(quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 mt-6">
                                    <button
                                        onClick={() => {
                                            addToCart();
                                            navigate("/cart");
                                        }}
                                        className="flex-1 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                                    >
                                        Buy Now
                                    </button>
                                    <button
                                        onClick={() => {
                                            addToCart();
                                            toast.success("Added to cart successfully", { position: "top-right" });
                                        }}
                                        className="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews and Product Information */}
            <div className="flex flex-col lg:flex-row gap-8 mx-14 my-8">
                <div className="w-full lg:w-2/3">
                    <div className="rounded-xl shadow-lg bg-white">
                        <ReviewTable product={product} />
                    </div>
                </div>

                <div className="w-full lg:w-1/3">
                    <div className="rounded-xl shadow-lg bg-white">
                        <InformationTable product={product} />
                    </div>
                </div>
            </div>

            {/* Related Products */}
            <div className="mb-8">
                <ProductCategoryList
                    title="Similar Products"
                    description="You might also like these products"
                    categoryId={product.category.id_category}
                />
            </div>
        </div>
    );
};

const InformationTable = ({ product }) => {
    return (
        <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Product Information</h3>
            <div className="rounded-lg overflow-hidden border border-gray-200">
                <table className="w-full">
                    <tbody>
                    {[
                        { label: "Category", value: product.category.name },
                        { label: "Brand", value: product.brand },
                        { label: "Organic", value: product.organic ? "Yes" : "No" },
                        { label: "Origin", value: product.origin },
                        { label: "Packaging", value: product.packaging },
                        { label: "Usage", value: product.howToUse },
                        { label: "Storage", value: product.howToPreserve },
                    ].map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                            <td className="px-4 py-3 font-semibold text-gray-700">{item.label}</td>
                            <td className="px-4 py-3 text-gray-600">{item.value}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductDetail;

