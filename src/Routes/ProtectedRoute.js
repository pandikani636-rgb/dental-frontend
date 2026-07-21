import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAdmin }) => {
    const { loading, isAuthenticated, user } = useSelector(state => state.user);

    // Show loading or nothing while checking authentication
    if (loading) {
        return <div>Loading...</div>; // or your loading component
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // If admin route but user is not admin, redirect to login
    if (isAdmin && user?.role !== "admin") {
        return <Navigate to="/login" />;
    }

    // If all checks pass, render children
    return children;
};

export default ProtectedRoute;
