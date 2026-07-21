import {
    NEW_BANNER_REQUEST,
    NEW_BANNER_SUCCESS,
    NEW_BANNER_FAIL,
    NEW_BANNER_RESET,
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
    UPDATE_BANNER_RESET,
    DELETE_BANNER_REQUEST,
    DELETE_BANNER_SUCCESS,
    DELETE_BANNER_FAIL,
    DELETE_BANNER_RESET,
    CLEAR_ERRORS
} from "../constants/bannerConstants";

export const newBannerReducer = (state = { banner: {} }, action) => {
    switch (action.type) {
        case NEW_BANNER_REQUEST:
            return { ...state, loading: true };
        case NEW_BANNER_SUCCESS:
            return { ...state, loading: false, success: action.payload.success, banner: action.payload.banner };
        case NEW_BANNER_FAIL:
            return { ...state, loading: false, error: action.payload };
        case NEW_BANNER_RESET:
            return { ...state, success: false };
        case CLEAR_ERRORS:
            return { ...state, error: null };
        default:
            return state;
    }
};

export const bannersReducer = (state = { loading: false, banners: [], error: null }, action) => {
    switch (action.type) {
        case ALL_BANNER_REQUEST:
        case ADMIN_BANNER_REQUEST:
            return { ...state, loading: true, banners: [] };
        case ALL_BANNER_SUCCESS:
        case ADMIN_BANNER_SUCCESS:
            return { ...state, loading: false, banners: action.payload.banners };
        case ALL_BANNER_FAIL:
        case ADMIN_BANNER_FAIL:
            return { ...state, loading: false, error: action.payload };
        case CLEAR_ERRORS:
            return { ...state, error: null };
        default:
            return state;
    }
};

export const bannerDetailsReducer = (state = { banner: {} }, action) => {
    switch (action.type) {
        case BANNER_DETAILS_REQUEST:
            return { ...state, loading: true };
        case BANNER_DETAILS_SUCCESS:
            return { loading: false, banner: action.payload.banner };
        case BANNER_DETAILS_FAIL:
            return { loading: false, banner: {}, error: action.payload };
        case CLEAR_ERRORS:
            return { ...state, error: null };
        default:
            return state;
    }
};

export const updateBannerReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_BANNER_REQUEST:
            return { ...state, loading: true };
        case UPDATE_BANNER_SUCCESS:
            return { ...state, loading: false, isUpdated: action.payload.success };
        case UPDATE_BANNER_FAIL:
            return { ...state, loading: false, error: action.payload };
        case UPDATE_BANNER_RESET:
            return { ...state, isUpdated: false };
        case CLEAR_ERRORS:
            return { ...state, error: null };
        default:
            return state;
    }
};

export const deleteBannerReducer = (state = {}, action) => {
    switch (action.type) {
        case DELETE_BANNER_REQUEST:
            return { ...state, loading: true };
        case DELETE_BANNER_SUCCESS:
            return { ...state, loading: false, isDeleted: action.payload.success };
        case DELETE_BANNER_FAIL:
            return { ...state, loading: false, error: action.payload };
        case DELETE_BANNER_RESET:
            return { ...state, isDeleted: false };
        case CLEAR_ERRORS:
            return { ...state, error: null };
        default:
            return state;
    }
};