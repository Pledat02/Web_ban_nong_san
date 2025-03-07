import { createContext, useReducer, useContext } from "react";

// Khởi tạo Context
const CartContext = createContext();
export const CartActionTypes = {
    ADD_TO_CART: "ADD_TO_CART",
    UPDATE_QUANTITY: "UPDATE_QUANTITY",
    REMOVE_ITEM: "REMOVE_ITEM",
    CLEAR_CART: "CLEAR_CART",
};

const cartReducer = (state, action) => {
    switch (action.type) {
        case CartActionTypes.ADD_TO_CART:
            const existingItem = state.find(item => item.id === action.payload.id);
            if (existingItem) {
                return state.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: item.quantity + action.payload.quantity }
                        : item
                );
            }
            return [...state, action.payload];

        case CartActionTypes.UPDATE_QUANTITY:
            return state.map(item =>
                item.id === action.payload.id
                    ? { ...item, quantity: Math.max(1, action.payload.quantity) }
                    : item
            );

        case CartActionTypes.REMOVE_ITEM:
            return state.filter(item => item.id !== action.payload.id);

        case CartActionTypes.CLEAR_CART:
            return [];

        default:
            return state;
    }
};

// Tạo Provider
export const CartProvider = ({ children }) => {
    const initialCart = [

    ];

    const [cart, dispatch] = useReducer(cartReducer, initialCart);

    return (
        <CartContext.Provider value={{ cart, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};


// Hook dùng để truy cập CartContext
export const useCart = () => useContext(CartContext);
