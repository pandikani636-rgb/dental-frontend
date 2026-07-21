import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Button,
  TextField,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { createBanner } from '../../actions/bannerAction';
import { NEW_BANNER_RESET } from '../../constants/bannerConstants';

const AddBanner = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const videoRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isActive: true,
    bannerType: 'image',
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoPreviewType, setVideoPreviewType] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'bannerType') {
      // Reset media when switching type
      if (value === 'image') {
        setVideoUrl('');
        setVideoPreviewType(null);
        setIsVideoPlaying(false);
      } else {
        setImage(null);
        setImagePreview('');
      }
    }
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type.split('/')[0];
      const expectedType = 'image';

      if (fileType !== expectedType) {
        enqueueSnackbar(`Please select an image file`, { variant: 'error' });
        e.target.value = '';
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB for images
      if (file.size > maxSize) {
        enqueueSnackbar(`File size too large. Max 5MB`, {
          variant: 'error'
        });
        e.target.value = '';
        return;
      }

      setImage(file);
      setImagePreview(URL.createObjectURL(file));

      if (errors.file) {
        setErrors({ ...errors, file: '' });
      }
    }
  };

  const handleVideoUrlChange = (e) => {
    const url = e.target.value;
    setVideoUrl(url);
    
    if (url) {
      const isValid = isValidUrl(url);
      if (isValid) {
        const type = getVideoPreviewType(url);
        setVideoPreviewType(type);
        setErrors({ ...errors, videoUrl: '', media: '' });
      } else {
        setVideoPreviewType(null);
        setErrors({ ...errors, videoUrl: 'Please enter a valid URL' });
      }
    } else {
      setVideoPreviewType(null);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview('');
    if (errors.file) {
      setErrors({ ...errors, file: '' });
    }
  };

  const removeVideoUrl = () => {
    setVideoUrl('');
    setVideoPreviewType(null);
    setIsVideoPlaying(false);
    if (errors.videoUrl || errors.media) {
      setErrors({ ...errors, videoUrl: '', media: '' });
    }
  };

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const getVideoPreviewType = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube';
    } else if (url.includes('vimeo.com')) {
      return 'vimeo';
    } else {
      return 'direct';
    }
  };

  const getEmbedUrl = (url) => {
    if (url.includes('youtube.com')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be')) {
      const videoId = url.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.bannerType === 'image' && !image) {
      newErrors.media = 'Please select an image file';
    }

    if (formData.bannerType === 'video' && !videoUrl) {
      newErrors.media = 'Please enter a video URL';
    }

    if (formData.bannerType === 'video' && videoUrl && !isValidUrl(videoUrl)) {
      newErrors.videoUrl = 'Please enter a valid URL';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      enqueueSnackbar('Please fix the errors in the form', { variant: 'error' });
      return;
    }

    setIsSubmitting(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('isActive', formData.isActive);
    data.append('bannerType', formData.bannerType);

    if (formData.bannerType === 'image' && image) {
      data.append('image', image);
    }

    if (formData.bannerType === 'video' && videoUrl) {
      data.append('videoUrl', videoUrl);
    }

    try {
      await dispatch(createBanner(data));
      dispatch({ type: NEW_BANNER_RESET });
      enqueueSnackbar('Banner added successfully', { variant: 'success' });
      navigate('/admin/banner');
    } catch (error) {
      enqueueSnackbar(`Error: ${error.message}`, { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: '800px', mx: 'auto' }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/admin/banner')}
        sx={{ mb: 3 }}
        variant="outlined"
      >
        Back to Banners
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Add New Banner
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              fullWidth
              error={!!errors.title}
              helperText={errors.title}
              disabled={isSubmitting}
            />

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              required
              error={!!errors.description}
              helperText={errors.description}
              disabled={isSubmitting}
            />



            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  disabled={isSubmitting}
                />
              }
              label="Active"
            />

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  
                  {/* BANNER TYPE SELECTION */}
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: 'text.secondary', mb: 2 }}>
                      Select Media Type *
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                      <Button
                        variant={formData.bannerType === "image" ? "contained" : "outlined"}
                        onClick={() => setFormData({ ...formData, bannerType: "image" })}
                        size="small"
                      >
                        Image
                      </Button>
                      <Button
                        variant={formData.bannerType === "video" ? "contained" : "outlined"}
                        onClick={() => setFormData({ ...formData, bannerType: "video" })}
                        size="small"
                      >
                        Video URL
                      </Button>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                      Note: You can upload images or provide video URLs - only one type at a time.
                    </Typography>
                  </Box>

                  {/* IMAGE SECTION */}
                  {formData.bannerType === "image" && (
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'text.secondary', mb: 1 }}>
                        Banner Image *
                      </Typography>

                      {imagePreview ? (
                        <Box sx={{ mb: 2, position: 'relative' }}>
                          <img
                            src={imagePreview}
                            draggable="false"
                            style={{ width: '100%', height: '240px', objectFit: 'contain', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '16px' }}
                            alt="Preview"
                          />
                          <Button
                            size="small"
                            sx={{ position: 'absolute', top: 8, right: 8, minWidth: 0, padding: '4px', bgcolor: 'error.main', color: 'white' }}
                            onClick={removeImage}
                          >
                            <DeleteIcon fontSize="small" />
                          </Button>
                        </Box>
                      ) : (
                        <Box sx={{ border: '2px dashed', borderColor: 'grey.300', borderRadius: 1, p: 3, textAlign: 'center', mb: 2 }}>
                          <Box sx={{ color: 'grey.400', mb: 1 }}>
                            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                          </Box>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            No image selected
                          </Typography>
                        </Box>
                      )}

                      <Button
                        component="label"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={isSubmitting}
                        sx={{ mt: 1 }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={handleImageChange}
                        />
                        {imagePreview ? "Change Image" : "Choose Image"}
                      </Button>

                      {errors.media && (
                        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                          {errors.media}
                        </Typography>
                      )}
                      <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
                        Upload one image. Supported formats: JPG, PNG, WebP. Max size: 5MB
                      </Typography>
                    </Box>
                  )}

                  {/* VIDEO URL SECTION */}
                  {formData.bannerType === "video" && (
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'text.secondary' }}>
                          Banner Video URL *
                        </Typography>
                        {videoUrl && isValidUrl(videoUrl) && videoPreviewType && (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={toggleVideoPlay}
                            sx={{ fontSize: '0.75rem', padding: '2px 8px' }}
                          >
                            {isVideoPlaying ? "Pause Preview" : "Play Preview"}
                          </Button>
                        )}
                      </Box>

                      {/* Video URL Input */}
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Enter video URL (YouTube, Vimeo, or direct video link)"
                        value={videoUrl}
                        onChange={handleVideoUrlChange}
                        error={!!errors.videoUrl || !!errors.media}
                        helperText={errors.videoUrl || errors.media}
                        disabled={isSubmitting}
                        InputProps={{
                          endAdornment: videoUrl && (
                            <Button
                              size="small"
                              onClick={removeVideoUrl}
                              sx={{ minWidth: 'auto', padding: '4px' }}
                            >
                              <DeleteIcon fontSize="small" />
                            </Button>
                          ),
                        }}
                        sx={{ mb: 2 }}
                      />

                      {/* Video Preview */}
                      {videoUrl && isValidUrl(videoUrl) && videoPreviewType && (
                        <Box sx={{ position: 'relative', border: 1, borderColor: 'divider', borderRadius: 1, p: 2, mb: 2, bgcolor: 'grey.50' }}>
                          {videoPreviewType === "youtube" || videoPreviewType === "vimeo" ? (
                            // Embed for YouTube/Vimeo
                            <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 1 }}>
                              <iframe
                                src={`${getEmbedUrl(videoUrl)}?autoplay=${isVideoPlaying ? 1 : 0}&mute=1&loop=0&controls=1&playsinline=1`}
                                title="Video preview"
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                referrerPolicy="strict-origin-when-cross-origin"
                              />
                            </Box>
                          ) : (
                            // Direct video file
                            <Box sx={{ position: 'relative' }}>
                              <video
                                ref={videoRef}
                                controls={!isVideoPlaying}
                                muted
                                loop
                                style={{ width: '100%', height: '240px', objectFit: 'contain', borderRadius: '4px' }}
                                src={videoUrl}
                                onLoadedData={() => {
                                  if (isVideoPlaying && videoRef.current) {
                                    videoRef.current.play();
                                  }
                                }}
                              />
                              {isVideoPlaying && (
                                <Box sx={{ position: 'absolute', top: 8, left: 8, bgcolor: 'black', bgcolor: 'rgba(0,0,0,0.5)', color: 'white', px: 1, py: 0.5, borderRadius: 1, fontSize: '0.75rem' }}>
                                  Auto-playing
                                </Box>
                              )}
                            </Box>
                          )}
                        </Box>
                      )}

                      {(!videoUrl || !isValidUrl(videoUrl)) && (
                        <Box sx={{ border: '2px dashed', borderColor: 'grey.300', borderRadius: 1, p: 3, textAlign: 'center', mb: 2 }}>
                          <Box sx={{ color: 'grey.400', mb: 1 }}>
                            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                          </Box>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Enter a valid video URL to see preview
                          </Typography>
                        </Box>
                      )}

                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          <strong>Supported URLs:</strong>
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          • YouTube: https://www.youtube.com/watch?v=dQw4w9WgXcQ
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          • Vimeo: https://vimeo.com/123456789
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          • Direct video: https://example.com/video.mp4
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                sx={{ minWidth: '120px' }}
              >
                {isSubmitting ? 'Adding...' : 'Add Banner'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/admin/banner')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AddBanner;