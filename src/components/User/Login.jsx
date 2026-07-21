import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, loginUser } from '../../actions/userAction';
import { useSnackbar } from 'notistack';
import BackdropLoader from '../Layouts/BackdropLoader';
import MetaData from '../Layouts/MetaData';
import Swal from 'sweetalert2'

const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const location = useLocation();

    const { loading, isAuthenticated, error, user } = useSelector((state) => state.user);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ email: "", password: "" });
    const [touched, setTouched] = useState({ email: false, password: false });

    // Real-time validation functions
    const validateEmail = (value) => {
        if (!value) return "Email or Phone is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!emailRegex.test(value) && !phoneRegex.test(value)) {
            return "Enter a valid email or 10-digit phone number";
        }
        return "";
    };

    const validatePassword = (value) => {
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return "";
    };

    // onChange handlers with instant validation
    const handleEmailChange = (e) => {
        const val = e.target.value;
        setEmail(val);
        if (touched.email) {
            setErrors(prev => ({ ...prev, email: validateEmail(val) }));
        }
    };

    const handlePasswordChange = (e) => {
        const val = e.target.value;
        setPassword(val);
        if (touched.password) {
            setErrors(prev => ({ ...prev, password: validatePassword(val) }));
        }
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        if (field === 'email') setErrors(prev => ({ ...prev, email: validateEmail(email) }));
        if (field === 'password') setErrors(prev => ({ ...prev, password: validatePassword(password) }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        // Final validation on submit
        const emailErr = validateEmail(email);
        const passwordErr = validatePassword(password);
        setErrors({ email: emailErr, password: passwordErr });
        setTouched({ email: true, password: true });
        if (emailErr || passwordErr) return;
        dispatch(loginUser(email, password));
    };

    const redirect = location.search ? location.search.split("=")[1] : "account";

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
        if (isAuthenticated) {
            Swal.fire({
                title: "Success!",
                text: "Login Successfully!",
                icon: "success",
                timer: 2000,
            });
            
            if (user?.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/");
            }
        }
    }, [dispatch, redirect, error, isAuthenticated, user, navigate, enqueueSnackbar]);

    return (
        <>
            <MetaData title="Login | MedStore" />
            {loading && <BackdropLoader />}

            <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-4 px-2 sm:py-12 sm:px-4">
                <div className="w-full max-w-6xl mx-auto mt-24"> {/* Added mt-24 for 100px top margin */}
                    {/* Mobile Header */}
                    <div className="sm:hidden text-center mb-6 pt-16">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-600 to-blue-400 rounded-full flex items-center justify-center mb-4 shadow-lg">
                            <span className="text-3xl">🏥</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                        <p className="text-gray-600">Sign in to your account</p>
                    </div>

                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
                        <div className="flex flex-col sm:flex-row">
                            {/* Desktop Sidebar */}
                            <div className="hidden sm:flex flex-col justify-center items-center w-full sm:w-2/5 relative overflow-hidden bg-gradient-to-br from-green-600 to-blue-400 min-h-[500px]">
                                <div className="absolute inset-0 bg-black opacity-20"></div>
                                <div className="relative z-10 text-center p-8">
                                    <div className="mb-8">
                                        <div className="w-32 h-32 mx-auto bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30 shadow-2xl">
                                            <span className="text-6xl animate-pulse">🏥</span>
                                        </div>
                                    </div>
                                    <h1 className="font-bold text-white text-3xl mb-4 drop-shadow-lg">Welcome Back</h1>
                                    <p className="text-white text-lg opacity-90">Access your medical orders and prescriptions</p>
                                </div>
                            </div>

                            {/* Form Section */}
                            <div className="flex-1 p-4 sm:p-8 lg:p-12">
                                <div className="max-w-md mx-auto">
                                    <div className="text-center mb-6 sm:mb-8">
                                        <h2 className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">Sign In</h2>
                                        <p className="text-gray-600 text-sm sm:text-base">Welcome back!</p>
                                    </div>

                                    <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
                                        <TextField
                                            fullWidth
                                            id="email"
                                            label="Email / Phone Number"
                                            type="text"
                                            value={email}
                                            onChange={handleEmailChange}
                                            onBlur={() => handleBlur('email')}
                                            error={touched.email && Boolean(errors.email)}
                                            helperText={touched.email && errors.email}
                                            required
                                            variant="outlined"
                                            size="medium"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '12px',
                                                    fontSize: { xs: '14px', sm: '16px' }
                                                },
                                                '& .MuiInputLabel-root': {
                                                    fontSize: { xs: '14px', sm: '16px' }
                                                }
                                            }}
                                        />

                                        <TextField
                                            fullWidth
                                            id="password"
                                            label="Password"
                                            type="password"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            onBlur={() => handleBlur('password')}
                                            error={touched.password && Boolean(errors.password)}
                                            helperText={touched.password && errors.password}
                                            required
                                            variant="outlined"
                                            size="medium"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '12px',
                                                    fontSize: { xs: '14px', sm: '16px' }
                                                },
                                                '& .MuiInputLabel-root': {
                                                    fontSize: { xs: '14px', sm: '16px' }
                                                }
                                            }}
                                        />

                                        <button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-green-600 to-blue-400 text-white py-3 sm:py-4 px-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl hover:from-green-700 hover:to-blue-500 transition-all duration-200 active:scale-95"
                                        >
                                            Sign In
                                        </button>

                                        <Link
                                            to="/password/forgot"
                                            className="block text-center text-green-600 hover:text-green-800 font-medium text-sm sm:text-base transition-colors"
                                        >
                                            Forgot your password?
                                        </Link>
                                    </form>

                                    <div className="mt-6 sm:mt-8 text-center">
                                        <p className="text-gray-600 text-sm sm:text-base">
                                            Don't have an account?{" "}
                                            <Link to="/register" className="text-green-600 hover:text-green-800 font-semibold transition-colors">
                                                Create Account
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Login;
