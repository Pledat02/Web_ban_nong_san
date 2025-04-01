import { createContext, useContext, useReducer } from "react";

// Lấy giỏ hàng từ Local Storage
const getCartFromStorage = () => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
};
export const CartActionTypes = {
    ADD_ITEM: "ADD_ITEM",
    REMOVE_ITEM: "REMOVE_ITEM",
    UPDATE_QUANTITY: "UPDATE_QUANTITY",
    CLEAR_CART: "CLEAR_CART"
};
const CartContext = createContext();

const cartReducer = (state, action) => {
    let updatedCart;
    switch (action.type) {
        case CartActionTypes.ADD_ITEM:
            updatedCart = [...state, action.payload];
            break;

        case CartActionTypes.REMOVE_ITEM:
            updatedCart = state.filter(item => item.id !== action.payload.id);
            break;

        case CartActionTypes.UPDATE_QUANTITY:
            updatedCart = state.map(item =>
                item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
            );
            break;

        case CartActionTypes.CLEAR_CART:
            updatedCart = [];
            break;

        default:
            return state;
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    return updatedCart;
};


export const CartProvider = ({ children }) => {
    const [cart, dispatch] = useReducer(cartReducer, [], getCartFromStorage);

    // Tính tổng số lượng sản phẩm
    const getTotalQuantity = () => {
        return cart.reduce((total ) => total + 1, 0);
    };

    // Tính tổng giá tiền
    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity * item.weight.weightType.value, 0);
    };

    return (
        <CartContext.Provider value={{ cart, dispatch, getTotalQuantity, getTotalPrice }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
