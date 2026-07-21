import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField'
import { useSnackbar } from 'notistack';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, loadUser, updatePassword } from '../../actions/userAction';
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstants';
import BackdropLoader from '../Layouts/BackdropLoader';
import MetaData from '../Layouts/MetaData';
import FormSidebar from './FormSidebar';

const UpdatePassword = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const { error, isUpdated, loading } = useSelector((state) => state.profile);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
    const [touched, setTouched] = useState({ oldPassword: false, newPassword: false, confirmPassword: false });

    // Validation rules
    const validate = (field, value, allValues = {}) => {
        switch (field) {
            case "oldPassword":
                if (!value) return "Current password is required";
                if (value.length < 6) return "Password must be at least 6 characters";
                return "";
            case "newPassword":
                if (!value) return "New password is required";
                if (value.length < 8) return "New password must be at least 8 characters";
                if (!/[A-Z]/.test(value)) return "Must contain at least one uppercase letter";
                if (!/[0-9]/.test(value)) return "Must contain at least one number";
                return "";
            case "confirmPassword":
                if (!value) return "Please confirm your password";
                if (value !== (allValues.newPassword ?? newPassword)) return "Passwords do not match";
                return "";
            default: return "";
        }
    };

    const handleChange = (field, value) => {
        if (field === "oldPassword") setOldPassword(value);
        if (field === "newPassword") setNewPassword(value);
        if (field === "confirmPassword") setConfirmPassword(value);

        if (touched[field]) {
            const allValues = { oldPassword, newPassword, confirmPassword, [field]: value };
            setErrors(prev => ({ ...prev, [field]: validate(field, value, allValues) }));
            // Also re-validate confirmPassword when newPassword changes
            if (field === "newPassword" && touched.confirmPassword) {
                setErrors(prev => ({ ...prev, confirmPassword: validate("confirmPassword", confirmPassword, { newPassword: value }) }));
            }
        }
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        const value = field === "oldPassword" ? oldPassword : field === "newPassword" ? newPassword : confirmPassword;
        setErrors(prev => ({ ...prev, [field]: validate(field, value) }));
    };

    const updatePasswordSubmitHandler = (e) => {
        e.preventDefault();
        const allErrors = {
            oldPassword: validate("oldPassword", oldPassword),
            newPassword: validate("newPassword", newPassword),
            confirmPassword: validate("confirmPassword", confirmPassword),
        };
        setErrors(allErrors);
        setTouched({ oldPassword: true, newPassword: true, confirmPassword: true });
        if (Object.values(allErrors).some(e => e)) return;

        const formData = new FormData();
        formData.set("oldPassword", oldPassword);
        formData.set("newPassword", newPassword);
        formData.set("confirmPassword", confirmPassword);
        dispatch(updatePassword(formData));
    }

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
        if (isUpdated) {
            enqueueSnackbar("Password Updated Successfully", { variant: "success" });
            dispatch(loadUser());
            navigate('/account');

            dispatch({ type: UPDATE_PASSWORD_RESET });
        }
    }, [dispatch, error, isUpdated, navigate, enqueueSnackbar]);

    return (
        <>
            <MetaData title="Password Update | Flipkart" />

            {loading && <BackdropLoader />}
            <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-4 px-2 sm:py-12 sm:px-4">
                <div className="w-full max-w-5xl mx-auto">
                    {/* Mobile Header */}
                    <div className="sm:hidden text-center mb-6 pt-16">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                            <span className="text-3xl">🔒</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Update Password</h1>
                        <p className="text-gray-600">Enter your current and new password</p>
                    </div>

                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
                        <div className="flex flex-col lg:flex-row">
                            <div className="hidden lg:block lg:w-2/5">
                                <FormSidebar
                                    title="Looks like you want to update password!"
                                    tag="Enter your current and new password to update"
                                />
                            </div>

                            <div className="flex-1 p-4 sm:p-6 lg:p-12">
                                <div className="max-w-md mx-auto">
                                    <div className="hidden sm:block text-center mb-6 lg:mb-8">
                                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Update Password</h2>
                                        <p className="text-gray-600">Enter your current and new password</p>
                                    </div>

                                    <form onSubmit={updatePasswordSubmitHandler} className="space-y-4 sm:space-y-6">
                                        <TextField
                                            fullWidth
                                            label="Current Password"
                                            type="password"
                                            name="oldPassword"
                                            value={oldPassword}
                                            onChange={(e) => handleChange("oldPassword", e.target.value)}
                                            onBlur={() => handleBlur("oldPassword")}
                                            error={touched.oldPassword && Boolean(errors.oldPassword)}
                                            helperText={touched.oldPassword && errors.oldPassword}
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
                                            label="New Password"
                                            type="password"
                                            name="newPassword"
                                            value={newPassword}
                                            onChange={(e) => handleChange("newPassword", e.target.value)}
                                            onBlur={() => handleBlur("newPassword")}
                                            error={touched.newPassword && Boolean(errors.newPassword)}
                                            helperText={touched.newPassword ? errors.newPassword : "Min 8 chars, 1 uppercase, 1 number"}
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
                                            label="Confirm New Password"
                                            type="password"
                                            name="confirmPassword"
                                            value={confirmPassword}
                                            onChange={(e) => handleChange("confirmPassword", e.target.value)}
                                            onBlur={() => handleBlur("confirmPassword")}
                                            error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                                            helperText={touched.confirmPassword && errors.confirmPassword}
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
                                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 sm:py-4 px-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 active:scale-95"
                                        >
                                            Update Password
                                        </button>

                                        <Link
                                            to="/account"
                                            className="block w-full text-center py-3 px-4 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
                                        >
                                            Cancel
                                        </Link>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default UpdatePassword