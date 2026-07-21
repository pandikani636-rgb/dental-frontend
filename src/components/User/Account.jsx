import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom';
import MinCategory from '../Layouts/MinCategory';
import MetaData from '../Layouts/MetaData';
import { loadUser } from '../../actions/userAction';
import Loader from '../Layouts/Loader';

const Account = () => {
    const dispatch = useDispatch();
    const { user, loading, isAuthenticated } = useSelector(state => state.user);

    useEffect(() => {
        if (!user && isAuthenticated !== false) {
            dispatch(loadUser()).catch(err => {
                console.error('Failed to load user:', err);
            });
        }
    }, [dispatch, user, isAuthenticated]);

    const getFirstName = () => {
        if (!user?.name) return 'N/A';
        return user.name.split(" ")[0] || 'N/A';
    };

    const getLastName = () => {
        if (!user?.name) return 'N/A';
        const nameArray = user.name.split(" ");
        return nameArray.length > 1 ? nameArray[nameArray.length - 1] : 'N/A';
    };

    const getInitials = () => {
        if (!user?.name) return 'U';
        const names = user.name.split(" ");
        return names.length > 1 ? names[0][0] + names[names.length - 1][0] : names[0][0];
    };

    if (loading) {
        return <Loader />;
    }

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Please log in to view your account</h2>
                    <Link to="/login" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <MetaData title="My Profile" />
            
            <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                        {/* <div className="lg:w-1/4">
                            <Sidebar activeTab={"profile"} />
                        </div>
                         */}
                        <div className="lg:w-3/4 mx-auto mt-8">
                            {/* Profile Header */}
                            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl border border-gray-200 p-6 lg:p-8 mb-6 lg:mb-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full -translate-y-16 translate-x-16"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/10 to-green-400/10 rounded-full translate-y-12 -translate-x-12"></div>
                                <div className="relative text-center">
                                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-600 to-blue-400 p-1">
                                        {user.avatar?.url ? (
                                            <img 
                                                src={user.avatar.url} 
                                                alt="User Avatar" 
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                                <span className="text-2xl font-bold text-gray-700">{getInitials()}</span>
                                            </div>
                                        )}
                                    </div>
                                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">{user.name}</h1>
                                    <p className="text-gray-600 text-base lg:text-lg mb-4">{user.email}</p>
                                    <span className="inline-block px-4 py-2 bg-gradient-to-r from-green-600 to-blue-400 text-white rounded-full text-sm font-semibold shadow-lg">
                                        {user.role || 'Customer'}
                                    </span>
                                </div>
                            </div>

                            {/* Unified Profile Information Card */}
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 lg:p-8 mb-6 lg:mb-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-dental-600/5 to-blue-400/5 rounded-full -translate-y-10 translate-x-10"></div>
                                <div className="relative space-y-8">
                                    {/* Personal Information Section */}
                                    <div>
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3 sm:gap-0">
                                            <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                                            <Link to="/account/update" className="bg-dental-600 hover:bg-dental-700 text-white px-4 py-2 rounded-xl transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105">
                                                 Edit Profile
                                            </Link>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-600">First Name</label>
                                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                    <span className="text-gray-800 font-medium">{getFirstName()}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-600">Last Name</label>
                                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                    <span className="text-gray-800 font-medium">{getLastName()}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-600">Gender</label>
                                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                    <span className="text-gray-800 font-medium capitalize">{user.gender || 'Not specified'}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-600">Role</label>
                                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                    <span className="text-gray-800 font-medium">{user.role || 'Customer'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-gray-200"></div>

                                    {/* Contact Information Section */}
                                    <div>
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3 sm:gap-0">
                                            <h2 className="text-2xl font-bold text-gray-800">Contact Information</h2>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-600">Email Address</label>
                                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                    <span className="text-gray-800 font-medium">{user.email}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-600">Phone Number</label>
                                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                    <span className="text-gray-800 font-medium">{user.phone || 'Not provided'}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-sm font-semibold text-gray-600">Address</label>
                                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                    <span className="text-gray-800 font-medium">{user.address || 'Not provided'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Professional Information (if Doctor) */}
                                    {user.role === 'DOCTOR' && (
                                        <>
                                            {/* Divider */}
                                            <div className="border-t border-gray-200"></div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Professional Information</h2>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-semibold text-gray-600">Qualification</label>
                                                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                            <span className="text-gray-800 font-medium">{user.qualification || 'Not provided'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-semibold text-gray-600">Specialization</label>
                                                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                            <span className="text-gray-800 font-medium">{user.specialization || 'Not provided'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-semibold text-gray-600">Registration Number</label>
                                                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                            <span className="text-gray-800 font-medium">{user.registrationNumber || 'Not provided'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-semibold text-gray-600">Experience</label>
                                                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                            <span className="text-gray-800 font-medium">{user.yearsOfExperience ? `${user.yearsOfExperience} years` : 'Not provided'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Account Actions */}
                            {/* <div className="bg-white rounded-2xl shadow-xl p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Actions</h2>
                                <div className="flex flex-wrap gap-4">
                                    <Link to="/orders" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200">
                                        View Orders
                                    </Link>
                                    <Link to="/wishlist" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200">
                                        My Wishlist
                                    </Link>
                                    <Link to="/" className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200">
                                        Deactivate Account
                                    </Link>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>

            </main>
        </>
    );
};

export default Account;
