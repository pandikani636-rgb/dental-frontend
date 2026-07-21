import {
    ALL_ORDER_STATUS_REQUEST,
    ALL_ORDER_STATUS_SUCCESS,
    ALL_ORDER_STATUS_FAIL,
    NEW_ORDER_STATUS_REQUEST,
    NEW_ORDER_STATUS_SUCCESS,
    NEW_ORDER_STATUS_RESET,
    NEW_ORDER_STATUS_FAIL,
    UPDATE_ORDER_STATUS_REQUEST,
    UPDATE_ORDER_STATUS_SUCCESS,
    UPDATE_ORDER_STATUS_RESET,
    UPDATE_ORDER_STATUS_FAIL,
    DELETE_ORDER_STATUS_REQUEST,
    DELETE_ORDER_STATUS_SUCCESS,
    DELETE_ORDER_STATUS_RESET,
    DELETE_ORDER_STATUS_FAIL,
    ORDER_STATUS_DETAILS_REQUEST,
    ORDER_STATUS_DETAILS_SUCCESS,
    ORDER_STATUS_DETAILS_FAIL,
    CLEAR_ERRORS,
} from "../constants/orderStatusConstants";

export const orderStatusesReducer = (state = { orderStatuses: [] }, action) => {
    switch (action.type) {
        case ALL_ORDER_STATUS_REQUEST:
            return {
                loading: true,
                orderStatuses: [],
            };
        case ALL_ORDER_STATUS_SUCCESS:
            return {
                loading: false,
                orderStatuses: action.payload,
            };
        case ALL_ORDER_STATUS_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

export const newOrderStatusReducer = (state = { orderStatus: {} }, action) => {
    switch (action.type) {
        case NEW_ORDER_STATUS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case NEW_ORDER_STATUS_SUCCESS:
            return {
                loading: false,
                success: action.payload.success,
                orderStatus: action.payload.orderStatus,
            };
        case NEW_ORDER_STATUS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case NEW_ORDER_STATUS_RESET:
            return {
                ...state,
                success: false,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

export const updateOrderStatusReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_ORDER_STATUS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case UPDATE_ORDER_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                isUpdated: action.payload,
            };
        case UPDATE_ORDER_STATUS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case UPDATE_ORDER_STATUS_RESET:
            return {
                ...state,
                isUpdated: false,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

export const deleteOrderStatusReducer = (state = {}, action) => {
    switch (action.type) {
        case DELETE_ORDER_STATUS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case DELETE_ORDER_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload,
            };
        case DELETE_ORDER_STATUS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case DELETE_ORDER_STATUS_RESET:
            return {
                ...state,
                isDeleted: false,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

export const orderStatusDetailsReducer = (state = { orderStatus: {} }, action) => {
    switch (action.type) {
        case ORDER_STATUS_DETAILS_REQUEST:
            return {
                loading: true,
                ...state,
            };
        case ORDER_STATUS_DETAILS_SUCCESS:
            return {
                loading: false,
                orderStatus: action.payload,
            };
        case ORDER_STATUS_DETAILS_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};
