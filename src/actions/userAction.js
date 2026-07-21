import {
    LOGIN_USER_REQUEST,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    LOGOUT_USER_SUCCESS,
    LOGOUT_USER_FAIL,
    CLEAR_ERRORS,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAIL,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_FAIL,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL,
    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAIL,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAIL,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    ALL_USERS_REQUEST,
    ALL_USERS_SUCCESS,
    ALL_USERS_FAIL,
    CLEAR_REGISTRATION_SUCCESS,
    VERIFY_OTP_REQUEST,
    VERIFY_OTP_SUCCESS,
    VERIFY_OTP_FAIL,
    CLEAR_OTP_VERIFICATION,
    SET_REGISTRATION_STEP,
    STORE_REGISTRATION_DATA,
    CLEAR_REGISTRATION_DATA
} from '../constants/userConstants';
import axios from 'axios';

// Create axios instance with base URL (if needed)
const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || '',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Login User
export const loginUser = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: LOGIN_USER_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const { data } = await axios.post(
            '/api/v1/login',
            { email, password },
            config
        );

        dispatch({
            type: LOGIN_USER_SUCCESS,
            payload: data.user,
        });

    } catch (error) {
        dispatch({
            type: LOGIN_USER_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

// Create User by Admin - Use separate request to avoid session conflicts
export const createUser = (userData) => async (dispatch) => {
    try {
        dispatch({ type: REGISTER_USER_REQUEST });

        // Create a separate axios instance without credentials to avoid session conflicts
        const response = await fetch('/api/v1/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
            // Don't include credentials to avoid session conflicts
            credentials: 'omit'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
        }

        const data = await response.json();

        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: { success: true, message: "User created successfully" },
        });

    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error.message,
        });
    }
};

// Register User
export const registerUser = (userData) => async (dispatch) => {
    try {
        dispatch({ type: REGISTER_USER_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const { data } = await axios.post(
            "/api/v1/register",
            userData,
            config
        );

        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data.user,
        });

    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

// Load User
export const loadUser = () => async (dispatch) => {
    try {
        dispatch({ type: LOAD_USER_REQUEST });

        const { data } = await axios.get('/api/v1/me');

        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data.user,
        });

    } catch (error) {
        dispatch({
            type: LOAD_USER_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

// Logout User
export const logoutUser = () => async (dispatch) => {
    try {
        await axios.get('/api/v1/logout');
        // Clear cart and shipping info from localStorage on logout
        localStorage.removeItem('cartItems');
        localStorage.removeItem('shippingInfo');
        localStorage.removeItem('saveForLaterItems');
        localStorage.removeItem('wishlistItems');
        localStorage.removeItem('buyNowItem');
        dispatch({ type: LOGOUT_USER_SUCCESS });
    } catch (error) {
        dispatch({
            type: LOGOUT_USER_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

// Clear Registration Success
export const clearRegistrationSuccess = () => async (dispatch) => {
    dispatch({ type: CLEAR_REGISTRATION_SUCCESS });
};

const backendUrl = process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL.replace(/\/$/, '') : 'http://localhost:4000';

// Update User Profile
export const updateProfile = (userData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PROFILE_REQUEST });

        let response;
        
        if (userData instanceof FormData) {
            // Handle FormData (with file)
            response = await fetch(`${backendUrl}/api/v1/me/update`, {
                method: 'PUT',
                credentials: 'include',
                body: userData,
            });
        } else {
            // Handle JSON data (without file)
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            
            const { data } = await axios.put(
                '/api/v1/me/update',
                userData,
                config
            );
            
            dispatch({
                type: UPDATE_PROFILE_SUCCESS,
                payload: data,
            });
            return;
        }

        const data = await response.json();
        
        if (response.ok) {
            dispatch({
                type: UPDATE_PROFILE_SUCCESS,
                payload: data,
            });
        } else {
            dispatch({
                type: UPDATE_PROFILE_FAIL,
                payload: data.message || 'Failed to update profile',
            });
        }

    } catch (error) {
        dispatch({
            type: UPDATE_PROFILE_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

// Update User Password
export const updatePassword = (passwords) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PASSWORD_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const { data } = await axios.put(
            '/api/v1/password/update',
            passwords,
            config
        );

        dispatch({
            type: UPDATE_PASSWORD_SUCCESS,
            payload: data.success,
        });

    } catch (error) {
        dispatch({
            type: UPDATE_PASSWORD_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

// Forgot Password
// Forgot Password
export const forgotPassword = (email) => async (dispatch) => {
    try {
        dispatch({ type: FORGOT_PASSWORD_REQUEST });

        const config = { 
            headers: { 
                "Content-Type": "application/json" 
            } 
        };

        const { data } = await axios.post(
            '/api/v1/password/forgot', 
            { email }, 
            config
        );

        dispatch({
            type: FORGOT_PASSWORD_SUCCESS,
            payload: { 
                message: data.message,
                otpSent: true,
                email: email  // Store email in state
            }
        });

    } catch (error) {
        dispatch({
            type: FORGOT_PASSWORD_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Reset Password
export const resetPassword = (email, otp, newPassword) => async (dispatch) => {
    try {
        dispatch({ type: RESET_PASSWORD_REQUEST });

        const config = { 
            headers: { 
                "Content-Type": "application/json" 
            } 
        };
        
        const { data } = await axios.put(
            '/api/v1/password/reset', 
            { email, otp, newPassword }, 
            config
        );

        dispatch({ 
            type: RESET_PASSWORD_SUCCESS, 
            payload: data.message || "Password reset successfully"
        });
    } catch (error) {
        dispatch({
            type: RESET_PASSWORD_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

// Clear OTP Verification State
export const clearOtpVerification = () => async (dispatch) => {
    dispatch({ type: CLEAR_OTP_VERIFICATION });
};

// Get All Users --- ADMIN
export const getAllUsers = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_USERS_REQUEST });
        const { data } = await axios.get('/api/v1/admin/users');
        dispatch({
            type: ALL_USERS_SUCCESS,
            payload: data.users,
        });

    } catch (error) {
        dispatch({
            type: ALL_USERS_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

// Get User Details --- ADMIN
export const getUserDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: USER_DETAILS_REQUEST });
        const { data } = await axios.get(`/api/v1/admin/user/${id}`);

        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data.user,
        });

    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

// Update User Details --- ADMIN
export const updateUser = (id, userData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_USER_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const { data } = await axios.put(
            `/api/v1/admin/user/${id}`,
            userData,
            config
        );

        dispatch({
            type: UPDATE_USER_SUCCESS,
            payload: data.success,
        });

    } catch (error) {
        dispatch({
            type: UPDATE_USER_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

// Delete User --- ADMIN 
export const deleteUser = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_USER_REQUEST });
        const { data } = await axios.delete(`/api/v1/admin/user/${id}`);

        dispatch({
            type: DELETE_USER_SUCCESS,
            payload: { success: true, deletedUserId: id },
        });

    } catch (error) {
        dispatch({
            type: DELETE_USER_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

// Verify OTP for Password Reset
export const verifyOTP = (email, otp) => async (dispatch) => {
    try {
        dispatch({ type: VERIFY_OTP_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const { data } = await axios.post(
            '/api/v1/verify-otp',
            { email, otp },
            config
        );

        dispatch({
            type: VERIFY_OTP_SUCCESS,
            payload: data,
        });
        
        return data;

    } catch (error) {
        dispatch({
            type: VERIFY_OTP_FAIL,
            payload: error.response?.data?.message || error.message,
        });
        throw error;
    }
};

// Set Registration Step
export const setRegistrationStep = (step) => (dispatch) => {
    dispatch({ type: SET_REGISTRATION_STEP, payload: step });
};

// Store Registration Data
export const storeRegistrationData = (data) => (dispatch) => {
    dispatch({ type: STORE_REGISTRATION_DATA, payload: data });
};

// Clear Registration Data
export const clearRegistrationData = () => (dispatch) => {
    dispatch({ type: CLEAR_REGISTRATION_DATA });
};

// Clear All Errors - This MUST be exported
export const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};