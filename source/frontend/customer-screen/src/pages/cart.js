import { useCart } from "../context/cart-context";
import CartItem from "../components/cart-item";
import CartSummary from "../components/cart-summary";

const Cart = () => {
    const { cart, dispatch } = useCart();

    return (
        <div className="container mx-auto p-6 flex flex-col lg:flex-row gap-2">
            {/* Danh sách sản phẩm */}
            <div className="flex-1 bg-white p-6  w-full lg:w-3/4 rounded-lg shadow-lg">
                <h1 className=" text-xl font-bold mb-4">GIỎ HÀNG</h1>
                <div className="flex-grow overflow-y-auto max-h-[200px] pr-2">
                    {cart.length > 0 ? (
                        cart.map(item => <CartItem key={item.id} item={item}/>)
                    ) : (
                        <p className="text-gray-600 text-center py-4">Giỏ hàng trống.</p>
                    )}
                </div>

                {/* Button điều hướng */}
                <div className="flex flex-col sm:flex-row justify-between mt-6 gap-3">
                    <button
                        className="border border-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition text-center">
                        ← TIẾP TỤC XEM SẢN PHẨM
                    </button>
                    <button
                        onClick={() => dispatch({type: "CLEAR_CART"})}
                        className={`px-4 py-2 rounded-lg shadow-md transition w-full sm:w-auto
                        ${cart.length > 0 ? "bg-red-400 text-white hover:bg-red-500" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                        disabled={cart.length === 0}
                    >
                        XÓA TOÀN BỘ GIỎ HÀNG
                    </button>
                </div>
            </div>
            {/* Tổng kết giỏ hàng */}
            <div className="w-full h-full lg:w-1/4  flex justify-end ">
                <CartSummary/>
            </div>

        </div>
    );
};

export default Cart;
