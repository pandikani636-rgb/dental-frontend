export const getBackendUrl = () => {
    // If the app is running in production (on Vercel/deployed domain), force the deployed backend URL.
    if (typeof window !== 'undefined' && window.location && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return 'https://dental-backend-ten.vercel.app';
    }
    // Otherwise (local development), use environment variable or fallback
    return process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL.replace(/\/$/, '') : 'https://dental-backend-ten.vercel.app';
};

export const backendUrl = getBackendUrl();
