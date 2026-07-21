import axios from "axios";
import {
    NEW_BANNER_REQUEST,
    NEW_BANNER_SUCCESS,
    NEW_BANNER_FAIL,
    ALL_BANNER_REQUEST,
    ALL_BANNER_SUCCESS,
    ALL_BANNER_FAIL,
    ADMIN_BANNER_REQUEST,
    ADMIN_BANNER_SUCCESS,
    ADMIN_BANNER_FAIL,
    BANNER_DETAILS_REQUEST,
    BANNER_DETAILS_SUCCESS,
    BANNER_DETAILS_FAIL,
    UPDATE_BANNER_REQUEST,
    UPDATE_BANNER_SUCCESS,
    UPDATE_BANNER_FAIL,
    DELETE_BANNER_REQUEST,
    DELETE_BANNER_SUCCESS,
    DELETE_BANNER_FAIL,
    CLEAR_ERRORS
} from "../constants/bannerConstants";

// Create new banner with separate image/video upload
export const createBanner = (formData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_BANNER_REQUEST });

        const config = {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true
        };

        const { data } = await axios.post("/api/v1/admin/banner/new", formData, config);

        dispatch({
            type: NEW_BANNER_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: NEW_BANNER_FAIL,
            payload: error.response?.data?.message || "Failed to create banner",
        });
    }
};

// Get all banners (public)
export const getBanners = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_BANNER_REQUEST });

        const { data } = await axios.get("/api/v1/banners");

        dispatch({
            type: ALL_BANNER_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ALL_BANNER_FAIL,
            payload: error.response?.data?.message || "Failed to load banners",
        });
    }
};

// Get all banners (ADMIN)
export const getAdminBanners = () => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_BANNER_REQUEST });

        const { data } = await axios.get("/api/v1/admin/banners", {
            withCredentials: true
        });

        dispatch({
            type: ADMIN_BANNER_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ADMIN_BANNER_FAIL,
            payload: error.response?.data?.message || "Failed to load banners",
        });
    }
};

// Get single banner
export const getBannerDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: BANNER_DETAILS_REQUEST });

        const { data } = await axios.get(`/api/v1/banner/${id}`);

        dispatch({
            type: BANNER_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: BANNER_DETAILS_FAIL,
            payload: error.response?.data?.message || "Failed to load banner",
        });
    }
};

// Update banner
export const updateBanner = (id, formData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_BANNER_REQUEST });

        const config = {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true
        };

        const { data } = await axios.put(`/api/v1/admin/banner/${id}`, formData, config);

        dispatch({
            type: UPDATE_BANNER_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: UPDATE_BANNER_FAIL,
            payload: error.response?.data?.message || "Failed to update banner",
        });
    }
};

// Delete banner
export const deleteBanner = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_BANNER_REQUEST });

        const { data } = await axios.delete(`/api/v1/admin/banner/${id}`, {
            withCredentials: true
        });

        dispatch({
            type: DELETE_BANNER_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: DELETE_BANNER_FAIL,
            payload: error.response?.data?.message || "Failed to delete banner",
        });
    }
};

// Clear errors
export const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};