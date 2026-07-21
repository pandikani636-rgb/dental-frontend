import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, clearErrors } from '../../actions/userAction';
import { useSnackbar } from 'notistack';
import BackdropLoader from '../Layouts/BackdropLoader';
import MetaData from '../Layouts/MetaData';
import FormSidebar from './FormSidebar';

const ResetPassword = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();

  const { error, success, loading } = useSelector((state) => state.forgotPassword);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      enqueueSnackbar("Password length must be atleast 8 characters", { variant: "warning" });
      return;
    }
    if (newPassword !== confirmPassword) {
      enqueueSnackbar("Password Doesn't Match", { variant: "error" });
      return;
    }

    const formData = new FormData();
    formData.set("password", newPassword);
    formData.set("confirmPassword", confirmPassword);
    dispatch(resetPassword(params.token, formData));
  }

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    if (success) {
      enqueueSnackbar("Password Updated Successfully", { variant: "success" });
      navigate("/login")
    }
  }, [dispatch, error, success, navigate, enqueueSnackbar]);

  return (
    <>
      <MetaData title="Password Reset | Flipkart" />

      {loading && <BackdropLoader />}
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center py-12 px-4 pt-32">
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="hidden md:block md:w-2/5">
              <FormSidebar
                title="Reset Password"
                tag="Get access to your Orders, Wishlist and Recommendations"
              />
            </div>

            <div className="flex-1 p-6 sm:p-8 md:p-12">
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Reset Password</h2>
                  <p className="text-gray-600">Enter your new password</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  />

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-100 text-gray-800 py-3 px-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                  >
                    Reset Password
                  </button>

                  <div className="text-center">
                    <p className="text-gray-600 text-sm mb-4">
                      By continuing, you agree to our Terms of Use and Privacy Policy.
                    </p>
                    <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                      New to MedStore? Create an account
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ResetPassword;
