import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    clearErrors,
    forgotPassword,
    resetPassword,
    verifyOTP
} from '../../actions/userAction';
import { useSnackbar } from 'notistack';
import BackdropLoader from '../Layouts/BackdropLoader';
import MetaData from '../Layouts/MetaData';

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    // Get state from Redux - FIXED: Use correct state structure
    const {
        error,
        message,
        loading,
        otpSent = false,
        otpVerified = false,
        email: storedEmail = ""
    } = useSelector((state) => state.user?.forgotPassword || {});

    const { success, loading: resetLoading } = useSelector((state) => state.user?.resetPassword || {});

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [otpError, setOtpError] = useState("");
    const [passwordErrors, setPasswordErrors] = useState([]);

    const handleSendOtp = (e) => {
        e.preventDefault();
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            enqueueSnackbar("Please enter a valid email address", { variant: "error" });
            return;
        }

        // Clear previous state
        dispatch(clearErrors());
        setOtp("");
        setOtpError("");

        // Send email for OTP
        dispatch(forgotPassword(email));
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        const trimmedOtp = otp.trim();

        if (!trimmedOtp || trimmedOtp.length !== 6) {
            setOtpError("Please enter a valid 6-digit OTP");
            enqueueSnackbar("Please enter a valid 6-digit OTP", { variant: "error" });
            return;
        }

        setOtpError("");
        const emailToUse = storedEmail || email;

        if (!emailToUse) {
            enqueueSnackbar("Email not found. Please start over.", { variant: "error" });
            setStep(1);
            return;
        }

        console.log('Verifying OTP:', { email: emailToUse, otp: trimmedOtp });

        try {
            await dispatch(verifyOTP(emailToUse, trimmedOtp));
        } catch (error) {
            console.error('OTP verification error:', error);
        }
    }

    const validatePassword = (password) => {
        const errors = [];
        if (password.length < 8) errors.push("At least 8 characters");
        if (!/(?=.*[a-z])/.test(password)) errors.push("One lowercase letter");
        if (!/(?=.*[A-Z])/.test(password)) errors.push("One uppercase letter");
        if (!/(?=.*\d)/.test(password)) errors.push("One number");
        if (!/(?=.*[@$!%*?&])/.test(password)) errors.push("One special character (@$!%*?&)");
        return errors;
    };

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setNewPassword(password);
        setPasswordErrors(validatePassword(password));
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            enqueueSnackbar("Passwords do not match", { variant: "error" });
            return;
        }

        if (passwordErrors.length > 0) {
            enqueueSnackbar("Please fix password requirements", { variant: "error" });
            return;
        }

        // Use stored email from Redux or local state
        const emailToUse = storedEmail || email;

        if (!emailToUse) {
            enqueueSnackbar("Email not found. Please start over.", { variant: "error" });
            setStep(1);
            return;
        }

        if (!otp) {
            enqueueSnackbar("OTP verification required", { variant: "error" });
            setStep(2);
            return;
        }

        try {
            await dispatch(resetPassword(emailToUse, otp, newPassword));
        } catch (error) {
            console.error('Password reset error:', error);
        }
    }

    // Main effect for handling state changes
    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });

            if (error.includes("OTP") || error.includes("verification") || error.includes("Invalid")) {
                setOtpError(error);
                setStep(2);
            } else if (error.includes("email") || error.includes("not found") || error.includes("User")) {
                setStep(1);
            }

            dispatch(clearErrors());
        }

        if (message && !error) {
            enqueueSnackbar(message, { variant: "success" });
        }
    }, [dispatch, error, message, enqueueSnackbar]);

    // Effect to handle OTP verification success
    useEffect(() => {
        if (otpVerified) {
            enqueueSnackbar("OTP verified successfully!", { variant: "success" });
            setStep(3);
        }
    }, [otpVerified, enqueueSnackbar]);

    // Effect to handle OTP sent state
    useEffect(() => {
        if (otpSent && step === 1) {
            enqueueSnackbar("OTP sent successfully! Check your email.", { variant: "success" });
            setStep(2);
        }
    }, [otpSent, step, enqueueSnackbar]);

    // Effect to handle reset password success
    useEffect(() => {
        if (success) {
            enqueueSnackbar("Password reset successfully! Redirecting to login...", { variant: "success" });
            
            // Small delay to show success message before redirect
            setTimeout(() => {
                navigate("/login");
            }, 2000); // Increased delay to show success message longer
        }
    }, [success, enqueueSnackbar, navigate]);

    // Initialize component
    useEffect(() => {
        // Clear any existing errors on component mount
        dispatch(clearErrors());

        // If there's a stored email in Redux and OTP was sent, go to step 2
        if (storedEmail && otpSent) {
            setEmail(storedEmail);
            setStep(2);
        }

        // Cleanup
        return () => {
            dispatch(clearErrors());
        };
    }, [dispatch, storedEmail, otpSent]);

    // Reset component state when starting over
    const handleStartOver = () => {
        setStep(1);
        setEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setOtpError("");
        dispatch(clearErrors());
    };

    const renderStep1 = () => (
        <>
            <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">Forgot Password</h2>
                <p className="text-gray-600 text-sm sm:text-base">Enter your email to receive OTP</p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4 sm:space-y-6">
                <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    variant="outlined"
                    size="medium"
                    error={!!error && error.includes("email")}
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
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Send OTP"}
                </button>
            </form>
        </>
    );

    const renderStep2 = () => (
        <>
            <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">Verify OTP</h2>
                <p className="text-gray-600 text-sm sm:text-base">
                    Enter the 6-digit OTP sent to <span className="font-semibold">{storedEmail || email}</span>
                </p>
                <button
                    onClick={handleStartOver}
                    className="text-sm text-blue-600 hover:text-blue-800 mt-2"
                    disabled={loading}
                >
                    Change Email
                </button>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4 sm:space-y-6">
                <div className="flex justify-center space-x-2">
                    {[...Array(6)].map((_, index) => (
                        <TextField
                            key={index}
                            type="text"
                            inputProps={{
                                maxLength: 1,
                                style: {
                                    textAlign: 'center',
                                    fontSize: '24px',
                                    fontWeight: 'bold'
                                }
                            }}
                            value={otp[index] || ''}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    const newOtp = otp.split('');
                                    newOtp[index] = value;
                                    const updatedOtp = newOtp.join('').slice(0, 6);
                                    setOtp(updatedOtp);
                                    setOtpError("");

                                    // Auto-focus next input
                                    if (value && index < 5) {
                                        document.getElementById(`otp-${index + 1}`)?.focus();
                                    }
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Backspace' && !otp[index] && index > 0) {
                                    document.getElementById(`otp-${index - 1}`)?.focus();
                                }
                            }}
                            id={`otp-${index}`}
                            variant="outlined"
                            error={!!otpError}
                            sx={{
                                width: '60px',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px',
                                    height: '60px',
                                    borderColor: otpError ? '#ef4444' : undefined
                                }
                            }}
                        />
                    ))}
                </div>

                {/* OTP Error Message */}
                {otpError && (
                    <div className="text-center">
                        <p className="text-red-600 text-sm font-medium">{otpError}</p>
                    </div>
                )}

                <div className="text-center">
                    <button
                        type="button"
                        onClick={() => {
                            dispatch(forgotPassword(storedEmail || email));
                            enqueueSnackbar("OTP resent successfully!", { variant: "success" });
                            setOtp("");
                            setOtpError("");
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        disabled={loading}
                    >
                        {loading ? "Resending..." : "Resend OTP"}
                    </button>
                </div>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-blue-400 text-white py-3 sm:py-4 px-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl hover:from-green-700 hover:to-blue-500 transition-all duration-200 active:scale-95"
                    disabled={loading || otp.length !== 6}
                >
                    {loading ? "Verifying..." : "Verify OTP"}
                </button>
            </form>
        </>
    );

    const renderStep3 = () => {
        const displayEmail = storedEmail || email;

        return (
            <>
                <div className="text-center mb-6 sm:mb-8">
                    <div className="mb-4">
                        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">✅</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">Set New Password</h2>
                        <p className="text-gray-600 text-sm sm:text-base">
                            OTP verified for <span className="font-semibold">{displayEmail}</span>
                        </p>
                    </div>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-4 sm:space-y-6">
                    <TextField
                        fullWidth
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={handlePasswordChange}
                        required
                        variant="outlined"
                        size="medium"
                        error={passwordErrors.length > 0}
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
                    {passwordErrors.length > 0 && (
                        <div className="text-sm text-red-600 space-y-1">
                            <p className="font-medium">Password must contain:</p>
                            <ul className="list-disc list-inside space-y-1">
                                {passwordErrors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <TextField
                        fullWidth
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        variant="outlined"
                        size="medium"
                        error={newPassword !== confirmPassword && confirmPassword !== ""}
                        helperText={newPassword !== confirmPassword && confirmPassword !== "" ? "Passwords do not match" : ""}
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
                        disabled={resetLoading || newPassword !== confirmPassword || passwordErrors.length > 0}
                    >
                        {resetLoading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </>
        );
    };

    return (
        <>
            <MetaData title="Forgot Password" />

            {(loading || resetLoading) && <BackdropLoader />}
            <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-4 px-2 sm:py-12 sm:px-4">
                <div className="w-full max-w-6xl mx-auto mt-24">
                    {/* Mobile Header */}
                    <div className="sm:hidden text-center mb-6 pt-16">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-600 to-blue-400 rounded-full flex items-center justify-center mb-4 shadow-lg">
                            <span className="text-3xl">🏥</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            {step === 1 ? "Forgot Password" : step === 2 ? "Verify OTP" : "New Password"}
                        </h1>
                        <p className="text-gray-600">
                            {step === 1 ? "Reset your account password" :
                                step === 2 ? "Enter verification code" :
                                    "Create your new password"}
                        </p>
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
                                    <h1 className="font-bold text-white text-3xl mb-4 drop-shadow-lg">
                                        {step === 1 ? "Forgot Your Password?" :
                                            step === 2 ? "Check Your Email" :
                                                "Create New Password"}
                                    </h1>
                                    <p className="text-white text-lg opacity-90">
                                        {step === 1 ? "Enter the email address associated with your account." :
                                            step === 2 ? "Enter the 6-digit code sent to your email." :
                                                "Enter your new password and confirm it."}
                                    </p>

                                    {/* Progress Steps */}
                                    <div className="mt-8 flex justify-center items-center space-x-4">
                                        {[1, 2, 3].map((stepNumber) => (
                                            <div key={stepNumber} className="flex items-center">
                                                <div className={`
                                                    w-8 h-8 rounded-full flex items-center justify-center
                                                    ${step >= stepNumber ? 'bg-white text-green-600' : 'bg-white bg-opacity-30 text-white'}
                                                    font-bold
                                                `}>
                                                    {stepNumber}
                                                </div>
                                                {stepNumber < 3 && (
                                                    <div className={`w-8 h-1 ${step > stepNumber ? 'bg-white' : 'bg-white bg-opacity-30'}`}></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Form Section */}
                            <div className="flex-1 p-4 sm:p-8 lg:p-12">
                                <div className="max-w-md mx-auto">
                                    {step === 1 && renderStep1()}
                                    {step === 2 && renderStep2()}
                                    {step === 3 && renderStep3()}

                                    <div className="flex justify-between">
                                        <div className="mt-6 sm:mt-8 text-start">
                                            <p className="text-gray-600 text-sm sm:text-base">
                                                {step === 1 ? (
                                                    <>
                                                        Remember your password?{" "}
                                                        <Link to="/login" className="text-green-600 hover:text-green-800 font-semibold transition-colors">
                                                            Back to Login
                                                        </Link>
                                                    </>
                                                ) 
                                                : (
                                                    <button
                                                        onClick={handleStartOver}
                                                        className="text-green-600 hover:text-green-800 font-semibold transition-colors"
                                                    >
                                                        Start Over
                                                    </button>
                                                )}
                                            </p>
                                        </div>
                                        { (!step === 1) ?(
                                        <div className="mt-6 sm:mt-8 text-end">
                                            <button
                                                onClick={() => navigate("/login")}
                                                className="text-green-600 hover:text-green-800 font-semibold transition-colors"
                                            >
                                                Back to Login
                                            </button>
                                        </div>
                                        ) : null
}
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

export default ForgotPassword; 