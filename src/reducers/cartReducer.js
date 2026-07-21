import { 
    ADD_TO_CART, 
    EMPTY_CART, 
    REMOVE_FROM_CART, 
    SAVE_SHIPPING_INFO, 
    GET_CART_ITEMS, 
    UPDATE_CART_QUANTITY 
} from "../constants/cartConstants";

export const cartReducer = (state = { cartItems: [], shippingInfo: {} }, { type, payload }) => {
    switch (type) {
        case ADD_TO_CART:
            const item = payload;
            const isItemExist = state.cartItems.find((el) => el.product === item.product);

            if (isItemExist) {
                return {
                    ...state,
                    cartItems: state.cartItems.map((el) =>
                        el.product === isItemExist.product ? item : el
                    ),
                }
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item],
                }
            }

        case GET_CART_ITEMS:
            return {
                ...state,
                cartItems: payload || []
            }

        case REMOVE_FROM_CART:
            return {
                ...state,
                cartItems: state.cartItems.filter((el) => el.product !== payload)
            }

        case UPDATE_CART_QUANTITY:
            return {
                ...state,
                cartItems: state.cartItems.map(item =>
                    item.product === payload.id
                        ? { ...item, quantity: payload.quantity }
                        : item
                )
            }

        case EMPTY_CART:
            return {
                ...state,
                cartItems: [],
            }

        case SAVE_SHIPPING_INFO:
            return {
                ...state,
                shippingInfo: payload
            }

        default:
            return state;
    }
}