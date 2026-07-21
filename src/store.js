import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { userReducer } from './reducers/userReducer';
import { newProductReducer, newReviewReducer, productDetailsReducer, productReducer, productsReducer, productReviewsReducer, reviewReducer } from './reducers/productReducer';
import { cartReducer } from './reducers/cartReducer';
import { saveForLaterReducer } from './reducers/saveForLaterReducer';
import { allOrdersReducer, myOrdersReducer, newOrderReducer, orderDetailsReducer, orderReducer, paymentStatusReducer } from './reducers/orderReducer';
import { wishlistReducer } from './reducers/wishlistReducer';
import {
    newCategoryReducer,
    categoriesReducer,
    categoryDetailsReducer,
    updateCategoryReducer,
    deleteCategoryReducer,
} from "./reducers/categoryReducer";
import {
    newBannerReducer,
    bannersReducer,
    bannerDetailsReducer,
    updateBannerReducer,
    deleteBannerReducer,
} from "./reducers/bannerReducer";

import {
    newRoleReducer,
    rolesReducer,
    deleteRoleReducer,
    updateRoleReducer,
    roleDetailsReducer,
} from "./reducers/rolesReducer";
import {
    newContactusReducer,
    contactusListReducer,
    contactusDetailsReducer,
    deleteContactusReducer
} from "./reducers/contactusReducer";
import {
    newOrderStatusReducer,
    orderStatusesReducer,
    orderStatusDetailsReducer,
    updateOrderStatusReducer,
    deleteOrderStatusReducer
} from "./reducers/orderStatusReducer";

// Wrapper reducers to extract nested state from userReducer
const allUsersReducer = (state = { users: [], loading: false, error: null }, action) => {
    const userState = userReducer(undefined, action);
    return {
        users: userState.users,
        loading: userState.usersLoading,
        error: userState.usersError
    };
};

const profileReducer = (state = { loading: false, isUpdated: false, isDeleted: false, error: null }, action) => {
    const userState = userReducer(undefined, action);
    return {
        loading: userState.loading,
        isUpdated: userState.isUpdated,
        isDeleted: userState.isDeleted,
        error: userState.error
    };
};

const reducer = combineReducers({
    user: userReducer,
    users: allUsersReducer,
    profile: profileReducer,
    products: productsReducer,
    productDetails: productDetailsReducer,
    product: productReducer,
    newProduct: newProductReducer,
    newReview: newReviewReducer,
    reviews: productReviewsReducer,
    review: reviewReducer,
    cart: cartReducer,
    saveForLater: saveForLaterReducer,
    wishlist: wishlistReducer,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    orderDetails: orderDetailsReducer,
    allOrders: allOrdersReducer,
    order: orderReducer,
    paymentStatus: paymentStatusReducer,
    categories: categoriesReducer,
    newCategory: newCategoryReducer,
    categoryDetails: categoryDetailsReducer,
    updateCategory: updateCategoryReducer,
    deleteCategory: deleteCategoryReducer,
    banners: bannersReducer,
    newBanner: newBannerReducer,
    bannerDetails: bannerDetailsReducer,
    updateBanner: updateBannerReducer,
    deleteBanner: deleteBannerReducer,
    roles: rolesReducer,
    newRole: newRoleReducer,
    deleteRole: deleteRoleReducer,
    updateRole: updateRoleReducer,
    roleDetails: roleDetailsReducer,

    roles: rolesReducer,
    newRole: newRoleReducer,
    deleteRole: deleteRoleReducer,
    updateRole: updateRoleReducer,
    roleDetails: roleDetailsReducer,
    contacts: contactusListReducer,
    newContactus: newContactusReducer,
    contactDetails: contactusDetailsReducer,
    deleteContact: deleteContactusReducer,
    orderStatuses: orderStatusesReducer,
    newOrderStatus: newOrderStatusReducer,
    orderStatusDetails: orderStatusDetailsReducer,
    updateOrderStatus: updateOrderStatusReducer,
    deleteOrderStatus: deleteOrderStatusReducer,
});

let initialState = {
    cart: {
        // Don't preload from localStorage - cart will be fetched from database after auth check
        // This prevents showing stale cart items to unauthenticated users
        cartItems: [],
        shippingInfo: localStorage.getItem("shippingInfo")
            ? JSON.parse(localStorage.getItem("shippingInfo"))
            : {},
    },
    saveForLater: {
        saveForLaterItems: localStorage.getItem('saveForLaterItems')
            ? JSON.parse(localStorage.getItem('saveForLaterItems'))
            : [],
    },
    wishlist: {
        wishlistItems: localStorage.getItem('wishlistItems')
            ? JSON.parse(localStorage.getItem('wishlistItems'))
            : [],
    },
};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
