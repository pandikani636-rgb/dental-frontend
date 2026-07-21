import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import axios from 'axios';

const OffersForm = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('image', image);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      };

      const { data } = await axios.post('/api/v1/admin/offers/new', formData, config);

      if (data.success) {
        enqueueSnackbar('Offer created and emails sent successfully', { variant: 'success' });
        // Reset form
        setName('');
        setDescription('');
        setImage(null);
        setImagePreview('');
      }
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'Failed to create offer', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const cancelHandler = () => navigate('/admin/offers');

  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <Card sx={{ width: '800px', borderRadius: '12px' }}>
        <h2 className="text-2xl font-bold text-gray-800 text-center mt-6 mb-2">
          Create Offer
        </h2>

        <CardContent sx={{ padding: '28px 40px' }}>
          <Box component="form" onSubmit={handleSubmit} className="space-y-6">
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Offer Image *
              </label>
              
              {imagePreview ? (
                <div className="mb-3">
                  <div className="relative w-full">
                    <img
                      src={imagePreview}
                      draggable="false"
                      className="w-full h-60 object-contain border rounded p-4"
                      alt="Preview"
                    />
                    <Button
                      size="small"
                      className="absolute top-2 right-2 min-w-0 p-1 bg-red-500 text-white"
                      onClick={removeImage}
                    >
                      <DeleteIcon fontSize="small" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-3">
                  <div className="text-gray-400 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <p className="text-gray-500">No image selected</p>
                </div>
              )}

              <label className="mt-2 block w-full text-center rounded font-medium bg-blue-600 cursor-pointer text-white p-3 shadow hover:shadow-lg hover:bg-blue-700 transition">
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                  required={!imagePreview}
                />
                {imagePreview ? 'Change Image' : 'Choose Image'}
              </label>
            </div>

            <Box className="flex justify-end gap-2 pt-4">
              <Button variant="outlined" onClick={cancelHandler} sx={{ minWidth: '200px' }}>
                CANCEL
              </Button>

              <Button
                type="submit"
                variant="contained"
                className="bg-blue-600 hover:bg-blue-700"
                sx={{ minWidth: '200px' }}
                disabled={loading}
              >
                {loading ? 'SENDING...' : 'SEND EMAIL'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default OffersForm;