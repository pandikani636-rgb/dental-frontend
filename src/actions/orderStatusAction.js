import axios from "axios";
import {
    ALL_ORDER_STATUS_REQUEST,
    ALL_ORDER_STATUS_SUCCESS,
    ALL_ORDER_STATUS_FAIL,
    NEW_ORDER_STATUS_REQUEST,
    NEW_ORDER_STATUS_SUCCESS,
    NEW_ORDER_STATUS_FAIL,
    UPDATE_ORDER_STATUS_REQUEST,
    UPDATE_ORDER_STATUS_SUCCESS,
    UPDATE_ORDER_STATUS_FAIL,
    DELETE_ORDER_STATUS_REQUEST,
    DELETE_ORDER_STATUS_SUCCESS,
    DELETE_ORDER_STATUS_FAIL,
    ORDER_STATUS_DETAILS_REQUEST,
    ORDER_STATUS_DETAILS_SUCCESS,
    ORDER_STATUS_DETAILS_FAIL,
    CLEAR_ERRORS,
} from "../constants/orderStatusConstants";

// Get All Order Statuses
export const getOrderStatuses = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_ORDER_STATUS_REQUEST });

        const { data } = await axios.get("/api/v1/admin/order-statuses");

        dispatch({
            type: ALL_ORDER_STATUS_SUCCESS,
            payload: data.orderStatuses,
        });
    } catch (error) {
        dispatch({
            type: ALL_ORDER_STATUS_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Create Order Status
export const createOrderStatus = (orderStatusData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_ORDER_STATUS_REQUEST });

        const config = {
            headers: { "Content-Type": "application/json" },
        };

        const { data } = await axios.post(
            "/api/v1/admin/order-status/new",
            orderStatusData,
            config
        );

        dispatch({
            type: NEW_ORDER_STATUS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: NEW_ORDER_STATUS_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Update Order Status
export const updateOrderStatus = (id, orderStatusData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_ORDER_STATUS_REQUEST });

        const config = {
            headers: { "Content-Type": "application/json" },
        };

        const { data } = await axios.put(
            `/api/v1/admin/order-status/${id}`,
            orderStatusData,
            config
        );

        dispatch({
            type: UPDATE_ORDER_STATUS_SUCCESS,
            payload: data.success,
        });
    } catch (error) {
        dispatch({
            type: UPDATE_ORDER_STATUS_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Delete Order Status
export const deleteOrderStatus = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_ORDER_STATUS_REQUEST });

        const { data } = await axios.delete(`/api/v1/admin/order-status/${id}`);

        dispatch({
            type: DELETE_ORDER_STATUS_SUCCESS,
            payload: data.success,
        });
    } catch (error) {
        dispatch({
            type: DELETE_ORDER_STATUS_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Get Order Status Details
export const getOrderStatusDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: ORDER_STATUS_DETAILS_REQUEST });

        const { data } = await axios.get(`/api/v1/admin/order-status/${id}`);

        dispatch({
            type: ORDER_STATUS_DETAILS_SUCCESS,
            payload: data.orderStatus,
        });
    } catch (error) {
        dispatch({
            type: ORDER_STATUS_DETAILS_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};
