import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Card, CardContent, Typography, Box, Switch, FormControlLabel, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Swal from 'sweetalert2';
import axios from 'axios';
import MetaData from '../Layouts/MetaData';

const HomeOfferForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        name: '',
        isActive: false
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            fetchHomeOffer();
        }
    }, [id]);

    const fetchHomeOffer = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/v1/admin/homeoffer/${id}`);
            setFormData({
                name: data.homeOffer.name,
                isActive: data.homeOffer.isActive
            });
            setImagePreview(data.homeOffer.image?.url);
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch home offer', 'error');
        }
        setLoading(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name) {
            Swal.fire('Error', 'Please enter a name', 'error');
            return;
        }

        if (!isEditMode && !image) {
            Swal.fire('Error', 'Please select an image', 'error');
            return;
        }

        setLoading(true);

        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('isActive', formData.isActive);
        if (image) {
            submitData.append('image', image);
        }

        try {
            if (isEditMode) {
                await axios.put(`/api/v1/admin/homeoffer/${id}`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                Swal.fire({
                    title: "Success!",
                    text: "Home offer updated successfully!",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                await axios.post('/api/v1/admin/homeoffer', submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                Swal.fire({
                    title: "Success!",
                    text: "Home offer created successfully!",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
            }
            navigate('/admin/homeoffer');
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Something went wrong', 'error');
        }
        setLoading(false);
    };

    if (loading && isEditMode) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            <MetaData title={`${isEditMode ? 'Edit' : 'Add'} Home Offer | Medical Store`} />

            <Box sx={{ mb: 3 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/homeoffer')} variant="outlined">
                    Back to Home Offers
                </Button>
            </Box>

            <Card className="shadow-lg border-0 max-w-2xl mx-auto">
                <CardContent className="p-6">
                    <h2 variant="h5" component="h2" className="text-2xl font-bold text-gray-800 text-center mt-6 mb-6">
                        {isEditMode ? 'Edit Home Offer' : 'Add Home Offer'}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField
                                label="Name"
                                variant="outlined"
                                fullWidth
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />

                            <Box>
                                <Typography variant="body1" className="mb-2 font-medium">Upload Image</Typography>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'block', marginBottom: '10px' }}
                                />
                                {imagePreview && (
                                    <Box sx={{ mt: 2 }}>
                                        <img src={imagePreview} alt="Preview" style={{ width: '300px', height: '180px', objectFit: 'cover', borderRadius: '8px' }} />
                                    </Box>
                                )}
                            </Box>

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        color="primary"
                                    />
                                }
                                label={
                                    <Box>
                                        <Typography variant="body1" className="font-medium">
                                            Show on Home Page
                                        </Typography>
                                    </Box>
                                }
                            />

                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                                <Button variant="outlined" onClick={() => navigate('/admin/homeoffer')}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" disabled={loading}>
                                    {loading ? <CircularProgress size={24} /> : (isEditMode ? 'Update' : 'Create')}
                                </Button>
                            </Box>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default HomeOfferForm;
