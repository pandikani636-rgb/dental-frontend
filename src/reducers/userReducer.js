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
    UPDATE_PROFILE_RESET,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_FAIL,
    UPDATE_PASSWORD_RESET,
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

const initialState = {
    // User authentication state
    user: null,
    loading: true,
    isAuthenticated: false,
    error: null,
    message: null,
    
    // Registration state
    registrationStep: 1,
    registrationData: {},
    registrationSuccess: false,
    
    // ADD THESE CRITICAL MISSING PROPERTIES
    isUpdated: false,
    isDeleted: false,
    
    // Forgot Password State
    forgotPassword: {
        loading: false,
        error: null,
        message: null,
        success: false,
        otpSent: false,
        otpVerified: false,
        email: ""
    },
    
    // Reset Password State
    resetPassword: {
        loading: false,
        error: null,
        message: null,
        success: false
    },
    
    
    // Admin Users State
    users: [],
    usersLoading: false,
    usersError: null,
    
    // Single User Details (Admin)
    userDetails: null,
    userDetailsLoading: false,
    userDetailsError: null
};

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        // Login Cases
        case LOGIN_USER_REQUEST:
        case LOAD_USER_REQUEST:
            return {
                ...state,
                loading: true,
                isAuthenticated: false,
                error: null
            };
            
        case LOGIN_USER_SUCCESS:
        case LOAD_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload,
                error: null
            };
            
        case LOGIN_USER_FAIL:
        case LOAD_USER_FAIL:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user: null,
                error: action.payload
            };
            
        // Registration Cases
        case REGISTER_USER_REQUEST:
            return {
                ...state,
                loading: true,
                registrationSuccess: false,
                error: null,
                message: null
            };
            
        case REGISTER_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                registrationSuccess: true,
                // CRITICAL: Preserve admin authentication state - don't change user or isAuthenticated
                message: action.payload.message || "Registration successful!",
                error: null
            };
            
        case REGISTER_USER_FAIL:
            return {
                ...state,
                loading: false,
                registrationSuccess: false,
                // Preserve admin authentication state - don't logout
                error: action.payload
            };
            
        // Logout Cases
        case LOGOUT_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user: null,
                error: null,
                message: null,
                registrationSuccess: false,
                isUpdated: false,
                isDeleted: false
            };
            
        case LOGOUT_USER_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
            
        // Update Profile Cases
        case UPDATE_PROFILE_REQUEST:
        case UPDATE_PASSWORD_REQUEST:
            return {
                ...state,
                profile: {
                    ...state.profile,
                    loading: true,
                    error: null,
                    success: false,
                    message: null
                }
            };
            
        case UPDATE_PROFILE_SUCCESS:
        case UPDATE_PASSWORD_SUCCESS:
            return {
                ...state,
                profile: {
                    ...state.profile,
                    loading: false,
                    success: true,
                    message: action.payload.message || "Updated successfully",
                    error: null
                },
                user: {
                    ...state.user,
                    ...action.payload.user
                }
            };
            
        case UPDATE_PROFILE_FAIL:
        case UPDATE_PASSWORD_FAIL:
            return {
                ...state,
                profile: {
                    ...state.profile,
                    loading: false,
                    error: action.payload,
                    success: false,
                    message: null
                }
            };
            
        case UPDATE_PROFILE_RESET:
        case UPDATE_PASSWORD_RESET:
            return {
                ...state,
                profile: {
                    loading: false,
                    error: null,
                    success: false,
                    message: null
                }
            };
            
        // Forgot Password Cases
        case FORGOT_PASSWORD_REQUEST:
            return {
                ...state,
                forgotPassword: {
                    ...state.forgotPassword,
                    loading: true,
                    error: null,
                    message: null,
                    success: false
                }
            };
            
        case FORGOT_PASSWORD_SUCCESS:
            return {
                ...state,
                forgotPassword: {
                    ...state.forgotPassword,
                    loading: false,
                    message: action.payload.message,
                    otpSent: true,
                    email: action.payload.email || action.payload,
                    error: null
                }
            };
            
        case FORGOT_PASSWORD_FAIL:
            return {
                ...state,
                forgotPassword: {
                    ...state.forgotPassword,
                    loading: false,
                    error: action.payload,
                    message: null,
                    otpSent: false,
                    email: ""
                }
            };
            
        // Verify OTP Cases
        case VERIFY_OTP_REQUEST:
            return {
                ...state,
                forgotPassword: {
                    ...state.forgotPassword,
                    loading: true,
                    error: null
                }
            };
            
        case VERIFY_OTP_SUCCESS:
            return {
                ...state,
                forgotPassword: {
                    ...state.forgotPassword,
                    loading: false,
                    otpVerified: true,
                    error: null
                }
            };
            
        case VERIFY_OTP_FAIL:
            return {
                ...state,
                forgotPassword: {
                    ...state.forgotPassword,
                    loading: false,
                    error: action.payload,
                    otpVerified: false
                }
            };
            
        // Reset Password Cases
        case RESET_PASSWORD_REQUEST:
            return {
                ...state,
                resetPassword: {
                    ...state.resetPassword,
                    loading: true,
                    error: null,
                    success: false,
                    message: null
                }
            };
            
        case RESET_PASSWORD_SUCCESS:
            return {
                ...state,
                resetPassword: {
                    ...state.resetPassword,
                    loading: false,
                    success: true,
                    message: action.payload
                },
                forgotPassword: {
                    loading: false,
                    error: null,
                    message: null,
                    success: false,
                    otpSent: false,
                    otpVerified: false,
                    email: ""
                }
            };
            
        case RESET_PASSWORD_FAIL:
            return {
                ...state,
                resetPassword: {
                    ...state.resetPassword,
                    loading: false,
                    error: action.payload,
                    success: false,
                    message: null
                }
            };
            
        // Registration Step Cases
        case SET_REGISTRATION_STEP:
            return {
                ...state,
                registrationStep: action.payload
            };
            
        case STORE_REGISTRATION_DATA:
            return {
                ...state,
                registrationData: {
                    ...state.registrationData,
                    ...action.payload
                }
            };
            
        case CLEAR_REGISTRATION_DATA:
            return {
                ...state,
                registrationStep: 1,
                registrationData: {}
            };
            
        case CLEAR_REGISTRATION_SUCCESS:
            return {
                ...state,
                registrationSuccess: false,
                message: null,
                error: null
            };
            
        // Admin User Management Cases
        case ALL_USERS_REQUEST:
            return {
                ...state,
                usersLoading: true,
                usersError: null
            };
            
        case ALL_USERS_SUCCESS:
            return {
                ...state,
                usersLoading: false,
                users: action.payload,
                usersError: null
            };
            
        case ALL_USERS_FAIL:
            return {
                ...state,
                usersLoading: false,
                usersError: action.payload
            };
            
        case USER_DETAILS_REQUEST:
            return {
                ...state,
                userDetailsLoading: true,
                userDetailsError: null
            };
            
        case USER_DETAILS_SUCCESS:
            return {
                ...state,
                userDetailsLoading: false,
                userDetails: action.payload,
                userDetailsError: null
            };
            
        case USER_DETAILS_FAIL:
            return {
                ...state,
                userDetailsLoading: false,
                userDetailsError: action.payload
            };
            
        // Admin User Update/Delete Cases - FIXED to not affect current user
        case UPDATE_USER_REQUEST:
        case DELETE_USER_REQUEST:
            return {
                ...state,
                // Don't affect main loading/user state
                isUpdated: false,
                isDeleted: false
            };
            
        case UPDATE_USER_SUCCESS:
            return {
                ...state,
                isUpdated: action.payload.success || true,
                error: null
            };
            
        case 'UPDATE_USER_RESET':
            return {
                ...state,
                isUpdated: false,
                error: null
            };
            
        case DELETE_USER_SUCCESS:
            return {
                ...state,
                isDeleted: action.payload.success || true,
                users: state.users.filter(user => user && user._id !== action.payload.deletedUserId),
                error: null
            };
            
        case UPDATE_USER_FAIL:
        case DELETE_USER_FAIL:
            return {
                ...state,
                error: action.payload,
                isUpdated: false,
                isDeleted: false
            };
            
        case 'DELETE_USER_RESET':
            return {
                ...state,
                isDeleted: false,
                error: null
            };
            
        // Clear States Cases
        case CLEAR_OTP_VERIFICATION:
            return {
                ...state,
                forgotPassword: {
                    ...state.forgotPassword,
                    otpVerified: false
                }
            };
            
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
                message: null,
                forgotPassword: {
                    ...state.forgotPassword,
                    error: null,
                    message: null
                },
                resetPassword: {
                    ...state.resetPassword,
                    error: null,
                    message: null
                },
                profile: {
                    ...state.profile,
                    error: null,
                    message: null
                }
            };
            
        default:
            return state;
    }
};