import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField'
import { Avatar, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { useSnackbar } from 'notistack';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, loadUser, updateProfile } from '../../actions/userAction';
import { UPDATE_PROFILE_RESET } from '../../constants/userConstants';
import BackdropLoader from '../Layouts/BackdropLoader';
import MetaData from '../Layouts/MetaData';

const UpdateProfile = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const { user } = useSelector((state) => state.user);
    const { error, success: isUpdated, loading } = useSelector((state) => state.user.profile || {});

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("");

    const updateProfileHandler = (e) => {
        e.preventDefault();

        if (avatar) {
            // Use FormData when image is selected
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('gender', gender);
            formData.append('address', address);
            formData.append('avatar', avatar);

            dispatch(updateProfile(formData));
        } else {
            // Use JSON when no image
            const userData = {
                name,
                email,
                phone,
                gender,
                address
            };

            dispatch(updateProfile(userData));
        }
    }

    const handleUpdateDataChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    }

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setPhone(user.phone || "");
            setGender(user.gender);
            setAddress(user.address || "");
            setAvatarPreview(user.avatar?.url || "");
        }
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
        if (isUpdated) {
            enqueueSnackbar("Profile Updated Successfully", { variant: "success" });
            dispatch(loadUser());
            navigate('/account');
            dispatch({ type: UPDATE_PROFILE_RESET });
        }
    }, [dispatch, error, user, isUpdated, navigate, enqueueSnackbar]);

    return (
        <>
            <MetaData title="Update Profile | Flipkart" />

            {loading && <BackdropLoader />}
            <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 pt-20 pb-8 px-4">

                {/* Main Container */}
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
                        <div className="flex flex-col lg:flex-row">
                            {/* Sidebar */}
                            <div className="bg-gradient-to-br from-green-600 to-blue-400 px-8 py-12 lg:w-2/5 flex flex-col justify-center relative overflow-hidden">
                                {/* Animated Background Elements */}
                                <div className="absolute inset-0">
                                    <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
                                    <div className="absolute top-32 right-8 w-16 h-16 bg-white/5 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
                                    <div className="absolute bottom-20 left-16 w-12 h-12 bg-white/15 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
                                    <div className="absolute bottom-32 right-12 w-8 h-8 bg-white/10 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                                    <div className="absolute top-1/2 left-4 w-6 h-6 bg-white/20 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>
                                </div>
                                
                                <div className="text-center lg:text-left relative z-10">
                                    <h1 className="font-bold text-white text-3xl lg:text-4xl mb-4">Update Your Profile!</h1>
                                    <p className="text-white/90 text-lg leading-relaxed">Keep your information up to date for the best experience</p>
                                </div>
                            </div>

                            {/* Form Section */}
                            <div className="flex-1 p-8 lg:p-12">
                                <div className="max-w-md mx-auto">
                                    <h2 className="text-center text-3xl font-bold text-gray-800 mb-8">Update Profile</h2>
                                    
                                    <form onSubmit={updateProfileHandler} encType="multipart/form-data" className="space-y-6">
                                        {/* Avatar Section */}
                                        <div className="text-center mb-8">
                                            <div className="relative inline-block">
                                                <Avatar
                                                    alt="Avatar Preview"
                                                    src={avatarPreview}
                                                    sx={{ 
                                                        width: { xs: 100, sm: 120 }, 
                                                        height: { xs: 100, sm: 120 },
                                                        border: '4px solid #e5e7eb',
                                                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                                <label className="absolute bottom-0 right-0 bg-gradient-to-r from-green-600 to-blue-400 text-white p-2 rounded-full cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-110">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <input
                                                        type="file"
                                                        name="avatar"
                                                        accept="image/*"
                                                        onChange={handleUpdateDataChange}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-2">Click the camera icon to change photo</p>
                                        </div>

                                        {/* Form Fields */}
                                        <div className="space-y-4">
                                            <TextField
                                                fullWidth
                                                label="Full Name"
                                                name="name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                                variant="outlined"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '12px',
                                                        '&:hover fieldset': {
                                                            borderColor: '#10b981',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#10b981',
                                                        },
                                                    },
                                                    '& .MuiInputLabel-root.Mui-focused': {
                                                        color: '#10b981',
                                                    },
                                                }}
                                            />
                                            
                                            <TextField
                                                fullWidth
                                                label="Email"
                                                type="email"
                                                name="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                variant="outlined"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '12px',
                                                        '&:hover fieldset': {
                                                            borderColor: '#10b981',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#10b981',
                                                        },
                                                    },
                                                    '& .MuiInputLabel-root.Mui-focused': {
                                                        color: '#10b981',
                                                    },
                                                }}
                                            />
                                            
                                            <TextField
                                                fullWidth
                                                label="Phone Number"
                                                name="phone"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                variant="outlined"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '12px',
                                                        '&:hover fieldset': {
                                                            borderColor: '#10b981',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#10b981',
                                                        },
                                                    },
                                                    '& .MuiInputLabel-root.Mui-focused': {
                                                        color: '#10b981',
                                                    },
                                                }}
                                            />
                                            
                                            <TextField
                                                fullWidth
                                                label="Address"
                                                name="address"
                                                multiline
                                                rows={3}
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                variant="outlined"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '12px',
                                                        '&:hover fieldset': {
                                                            borderColor: '#10b981',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#10b981',
                                                        },
                                                    },
                                                    '& .MuiInputLabel-root.Mui-focused': {
                                                        color: '#10b981',
                                                    },
                                                }}
                                            />
                                        </div>

                                        {/* Gender Selection */}
                                        <div className="bg-gray-50 p-4 rounded-xl">
                                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Gender</h3>
                                            <RadioGroup
                                                row
                                                aria-labelledby="radio-buttons-group-label"
                                                name="radio-buttons-group"
                                                className="justify-center"
                                            >
                                                <FormControlLabel 
                                                    name="gender" 
                                                    value="male" 
                                                    checked={gender === "male"} 
                                                    onChange={(e) => setGender(e.target.value)} 
                                                    control={<Radio required sx={{ color: '#10b981', '&.Mui-checked': { color: '#10b981' } }} />} 
                                                    label="Male" 
                                                />
                                                <FormControlLabel 
                                                    name="gender" 
                                                    value="female" 
                                                    checked={gender === "female"} 
                                                    onChange={(e) => setGender(e.target.value)} 
                                                    control={<Radio required sx={{ color: '#10b981', '&.Mui-checked': { color: '#10b981' } }} />} 
                                                    label="Female" 
                                                />
                                            </RadioGroup>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="space-y-3 pt-4">
                                            <button 
                                                type="submit" 
                                                className="w-full bg-gradient-to-r from-green-600 to-blue-400 hover:from-green-700 hover:to-blue-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                                            >
                                                Update Profile
                                            </button>
                                            
                                            <Link 
                                                to="/account" 
                                                className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-300 border border-gray-200 hover:border-gray-300"
                                            >
                                                Cancel
                                            </Link>
                                        </div>
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

export default UpdateProfile;