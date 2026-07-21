import axios from "axios"
import { ADD_TO_CART, EMPTY_CART, REMOVE_FROM_CART, SAVE_SHIPPING_INFO, GET_CART_ITEMS } from "../constants/cartConstants";
import { getImageUrl } from '../utils/mediaUtils';

// add to cart
export const addItemsToCart = (id, quantity = 1) => async (dispatch, getState) => {
    try {
        const { data } = await axios.get(`/api/v1/product/${id}`);
        
        const product = data.product;
        const firstImage = product.images && product.images.length > 0 ? product.images[0] : null;
        
        const cartData = {
            product: product._id,
            name: product.name,
            seller: product.brand?.name || 'SriChakraDental',
            price: product.price,
            cuttedPrice: product.cuttedPrice,
            image: getImageUrl(firstImage),
            images: product.images || [],
            video: product.video || null,
            video_url: product.video_url || '',
            media_type: product.media_type || '',
            stock: product.stock,
            quantity,
            discount: product.discount || 0,
            delivery_charge: product.delivery_charge || 0,
            gst: product.gst || 0
        };
        
        // Save to database - will fail with 401 if not logged in
        await axios.post('/api/v1/cart', cartData);
        
        // Dispatch to Redux store
        dispatch({
            type: ADD_TO_CART,
            payload: cartData,
        });
        
        // Also update localStorage (only reached if API call succeeded = user is logged in)
        const state = getState();
        localStorage.setItem('cartItems', JSON.stringify(state.cart.cartItems));
        
    } catch (error) {
        // If 401 Unauthorized - user is not logged in, don't save to localStorage
        if (error.response && error.response.status === 401) {
            console.warn("User not authenticated. Cannot add to cart.");
            return;
        }
        console.error("Error adding to cart:", error);
    }
}

// get cart items with video support
export const getCartItems = () => async (dispatch) => {
    try {
        const { data } = await axios.get('/api/v1/cart');
        
        if (data.success && data.cartItems) {
            // Fetch complete product data for each cart item to get video_url
            const cartItemsWithDetails = await Promise.all(
                data.cartItems.map(async (item) => {
                    try {
                        // Get full product details including video_url
                        const productResponse = await axios.get(`/api/v1/product/${item.product}`);
                        const product = productResponse.data.product;
                        const firstImage = product.images && product.images.length > 0 ? product.images[0] : null;
                        
                        return {
                            _id: item._id,
                            product: item.product,
                            name: item.name || product.name,
                            seller: item.seller || product.brand?.name || 'SriChakraDental',
                            price: item.price || product.price,
                            cuttedPrice: item.cuttedPrice || product.cuttedPrice,
                            image: item.image || getImageUrl(firstImage),
                            images: product.images || [],
                            video: product.video || null,
                            video_url: product.video_url || '',
                            media_type: product.media_type || '',
                            stock: item.stock || product.stock,
                            quantity: item.quantity || 1,
                            discount: item.discount || product.discount || 0,
                            delivery_charge: item.delivery_charge || product.delivery_charge || 0,
                            gst: item.gst || product.gst || 0,
                            createdAt: item.createdAt,
                            updatedAt: item.updatedAt
                        };
                    } catch (error) {
                        console.error(`Error fetching product ${item.product}:`, error);
                        return item; // Return original item if product fetch fails
                    }
                })
            );
            
            dispatch({
                type: GET_CART_ITEMS,
                payload: cartItemsWithDetails,
            });
            
            // Save to localStorage
            localStorage.setItem('cartItems', JSON.stringify(cartItemsWithDetails));
        }
    } catch (error) {
        console.error("Error fetching cart:", error);
        
        // Fallback to localStorage if API fails
        const storedCart = localStorage.getItem('cartItems');
        if (storedCart) {
            dispatch({
                type: GET_CART_ITEMS,
                payload: JSON.parse(storedCart),
            });
        }
    }
}

// remove cart item
export const removeItemsFromCart = (id) => async (dispatch, getState) => {
    try {
        await axios.delete(`/api/v1/cart/${id}`);
        
        dispatch({
            type: REMOVE_FROM_CART,
            payload: id,
        });
        
        // Update localStorage
        const state = getState();
        localStorage.setItem('cartItems', JSON.stringify(state.cart.cartItems));
        
    } catch (error) {
        console.error("Error removing from cart:", error);
    }
}

// empty cart
export const emptyCart = () => async (dispatch, getState) => {
    try {
        await axios.delete('/api/v1/cart/empty');
        
        dispatch({ type: EMPTY_CART });
        
        // Clear localStorage
        localStorage.removeItem('cartItems');
        
    } catch (error) {
        console.error("Error emptying cart:", error);
    }
}

// save shipping info
export const saveShippingInfo = (data) => async (dispatch) => {
    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data,
    });

    localStorage.setItem('shippingInfo', JSON.stringify(data));
}

// update cart item quantity
export const updateCartQuantity = (id, quantity) => async (dispatch, getState) => {
    try {
        await axios.put(`/api/v1/cart/${id}`, { quantity });
        
        dispatch({
            type: 'UPDATE_CART_QUANTITY',
            payload: { id, quantity }
        });
        
        // Update localStorage
        const state = getState();
        localStorage.setItem('cartItems', JSON.stringify(state.cart.cartItems));
        
    } catch (error) {
        console.error("Error updating cart quantity:", error);
    }
}

// sync cart from localStorage
export const syncCartFromStorage = () => async (dispatch) => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
        const cartItems = JSON.parse(storedCart);
        
        // Sync each item with the server
        for (const item of cartItems) {
            try {
                await axios.post('/api/v1/cart/sync', item);
            } catch (error) {
                console.error(`Error syncing cart item ${item.product}:`, error);
            }
        }
        
        dispatch({
            type: GET_CART_ITEMS,
            payload: cartItems,
        });
    }
}