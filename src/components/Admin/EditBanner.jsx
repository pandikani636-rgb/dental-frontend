import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Button, 
  TextField, 
  Switch, 
  FormControlLabel, 
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { useSnackbar } from 'notistack';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';

const backendUrl = process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL.replace(/\/$/, '') : 'http://localhost:4000';

const EditBanner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [isYoutubeShorts, setIsYoutubeShorts] = useState(false);

  useEffect(() => {
    fetchBanner();
    
    // Cleanup function to revoke object URLs
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [id]);

  const fetchBanner = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/v1/banner/${id}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.banner) {
        const banner = data.banner;
        
        setFormData({
          title: banner.title || '',
          description: banner.description || '',
          isActive: banner.isActive !== undefined ? banner.isActive : true,
          bannerType: banner.bannerType || 'image',
        });
        
        if (banner.videoUrl) {
          setVideoUrl(banner.videoUrl);
          const type = getVideoPreviewType(banner.videoUrl);
          setVideoPreviewType(type);
          setIsYoutubeShorts(checkIfYoutubeShorts(banner.videoUrl));
        }
        
        if (banner.media?.url) {
          let mediaUrl = banner.media.url;
          
          // Ensure proper URL format for the image
          if (!mediaUrl.startsWith('http')) {
            mediaUrl = `${backendUrl}/${mediaUrl.replace(/^\/+/, '')}`;
          }
          
          setImagePreview(mediaUrl);
          setExistingImageUrl(mediaUrl);
        }
      } else {
        enqueueSnackbar(data.message || 'Failed to fetch banner', { variant: 'error' });
        navigate('/admin/banner');
      }
    } catch (error) {
      console.error('Error fetching banner:', error);
      enqueueSnackbar('Error fetching banner details', { variant: 'error' });
      navigate('/admin/banner');
    } finally {
      setLoading(false);
    }
  };

  // Check if URL is YouTube Shorts
  const checkIfYoutubeShorts = useCallback((url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.includes('/shorts/');
    } catch {
      return url.includes('/shorts/');
    }
  }, []);

  // Extract video ID from various YouTube URLs
  const extractYoutubeVideoId = useCallback((url) => {
    try {
      const urlObj = new URL(url);
      let videoId = '';
      
      // Handle different YouTube URL formats
      if (url.includes('youtube.com/shorts/')) {
        // Extract from shorts URL: /shorts/VIDEO_ID
        const match = url.match(/shorts\/([a-zA-Z0-9_-]+)/);
        videoId = match ? match[1] : '';
      } else if (url.includes('youtube.com/watch?v=')) {
        // Extract from watch URL: v=VIDEO_ID
        videoId = urlObj.searchParams.get('v');
      } else if (url.includes('youtu.be/')) {
        // Extract from youtu.be URL: youtu.be/VIDEO_ID
        videoId = urlObj.pathname.slice(1);
      }
      
      return videoId ? videoId.split('?')[0] : ''; // Remove any query parameters from video ID
    } catch {
      return '';
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    if (name === 'bannerType') {
      setErrors(prev => ({ 
        ...prev, 
        videoUrl: '', 
        media: '', 
        file: '' 
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      enqueueSnackbar('Please select an image file (JPG, PNG, WebP)', { variant: 'error' });
      e.target.value = '';
      return;
    }
    
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      enqueueSnackbar('File size too large. Maximum size is 5MB', { variant: 'error' });
      e.target.value = '';
      return;
    }
    
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    
    setErrors(prev => ({ ...prev, media: '', file: '' }));
    
    e.target.value = '';
  };

  const handleVideoUrlChange = (e) => {
    const url = e.target.value.trim();
    setVideoUrl(url);
    
    if (url) {
      const isValid = isValidUrl(url);
      if (isValid) {
        const isShorts = checkIfYoutubeShorts(url);
        setIsYoutubeShorts(isShorts);
        
        if (isShorts) {
          const videoId = extractYoutubeVideoId(url);
          if (videoId) {
            setVideoPreviewType('youtube');
            setErrors(prev => ({ ...prev, videoUrl: '', media: '' }));
          } else {
            setVideoPreviewType(null);
            setErrors(prev => ({ 
              ...prev, 
              videoUrl: 'Could not extract video ID from YouTube Shorts URL' 
            }));
          }
        } else {
          const type = getVideoPreviewType(url);
          setVideoPreviewType(type);
          setErrors(prev => ({ ...prev, videoUrl: '', media: '' }));
        }
      } else {
        setVideoPreviewType(null);
        setIsYoutubeShorts(false);
        setErrors(prev => ({ ...prev, videoUrl: 'Please enter a valid URL' }));
      }
    } else {
      setVideoPreviewType(null);
      setIsYoutubeShorts(false);
      setErrors(prev => ({ ...prev, videoUrl: '' }));
    }
  };

  const removeImage = () => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    
    setImage(null);
    setImagePreview('');
    setExistingImageUrl('');
    
    setErrors(prev => ({ ...prev, media: '', file: '' }));
  };

  const removeVideoUrl = () => {
    setVideoUrl('');
    setVideoPreviewType(null);
    setIsVideoPlaying(false);
    setIsYoutubeShorts(false);
    
    setErrors(prev => ({ ...prev, videoUrl: '', media: '' }));
  };

  const toggleVideoPlay = useCallback(() => {
    if (!videoRef.current) return;
    
    if (isVideoPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(error => {
        console.error('Error playing video:', error);
        enqueueSnackbar('Could not play video. Please check the URL', { variant: 'warning' });
      });
    }
    setIsVideoPlaying(!isVideoPlaying);
  }, [isVideoPlaying, enqueueSnackbar]);

  const isValidUrl = useCallback((string) => {
    try {
      const url = new URL(string);
      return ['http:', 'https:'].includes(url.protocol);
    } catch (_) {
      return false;
    }
  }, []);

  const getVideoPreviewType = useCallback((url) => {
    const lowerUrl = url.toLowerCase();
    
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
      return 'youtube';
    } else if (lowerUrl.includes('vimeo.com')) {
      return 'vimeo';
    } else if (/\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)$/i.test(url)) {
      return 'direct';
    }
    return 'unknown';
  }, []);

  const getEmbedUrl = useCallback((url) => {
    const videoId = extractYoutubeVideoId(url);
    
    if (videoId) {
      // For both regular YouTube videos and Shorts, use the same embed URL
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('vimeo.com/')) {
      const vimeoId = url.split('/').pop()?.split('?')[0];
      return vimeoId ? `https://player.vimeo.com/video/${vimeoId}` : url;
    }
    return url;
  }, [extractYoutubeVideoId]);

  const getYouTubeShortsMessage = useCallback((url) => {
    const videoId = extractYoutubeVideoId(url);
    if (!videoId) return null;
    
    return (
      <Alert severity="info" sx={{ mt: 1, mb: 2 }}>
        <Typography variant="body2">
          <strong>YouTube Shorts Detected</strong>
          <br />
          YouTube Shorts URLs are automatically converted to regular embed format for preview.
        </Typography>
      </Alert>
    );
  }, [extractYoutubeVideoId]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.bannerType === 'image') {
      if (!image && !existingImageUrl) {
        newErrors.media = 'Please upload an image or keep the existing one';
      }
    }
    
    if (formData.bannerType === 'video') {
      if (!videoUrl.trim()) {
        newErrors.videoUrl = 'Video URL is required for video banners';
      } else if (!isValidUrl(videoUrl)) {
        newErrors.videoUrl = 'Please enter a valid URL';
      } else if (checkIfYoutubeShorts(videoUrl)) {
        const videoId = extractYoutubeVideoId(videoUrl);
        if (!videoId) {
          newErrors.videoUrl = 'Could not extract video ID from YouTube Shorts URL';
        }
      }
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      enqueueSnackbar('Please fix the errors in the form', { variant: 'error' });
      return;
    }
    
    setIsSubmitting(true);
    
    const data = new FormData();
    data.append('title', formData.title.trim());
    data.append('description', formData.description.trim());
    data.append('isActive', formData.isActive);
    data.append('bannerType', formData.bannerType);
    
    // Handle image upload or existing image
    if (formData.bannerType === 'image') {
      if (image) {
        data.append('image', image);
      } else if (existingImageUrl) {
        // If no new image but existing image URL, send a flag to keep it
        data.append('keepExistingImage', 'true');
      } else {
        // This should not happen due to validation, but as a fallback
        enqueueSnackbar('Image is required for image banners', { variant: 'error' });
        setIsSubmitting(false);
        return;
      }
    }
    
    // Handle video URL
    if (formData.bannerType === 'video') {
      if (videoUrl) {
        data.append('videoUrl', videoUrl.trim());
      } else {
        // This should not happen due to validation, but as a fallback
        enqueueSnackbar('Video URL is required for video banners', { variant: 'error' });
        setIsSubmitting(false);
        return;
      }
    }
    
    try {
      const response = await fetch(`${backendUrl}/api/v1/admin/banner/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: data,
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        enqueueSnackbar(result.message || 'Banner updated successfully', { variant: 'success' });
        navigate('/admin/banner');
      } else {
        // Handle server-side validation errors
        if (result.errors) {
          setErrors(result.errors);
          enqueueSnackbar('Please fix the form errors', { variant: 'error' });
        } else {
          enqueueSnackbar(result.message || 'Failed to update banner', { variant: 'error' });
        }
      }
    } catch (error) {
      console.error('Error updating banner:', error);
      enqueueSnackbar('Network error. Please try again.', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: '800px', mx: 'auto' }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/admin/banner')}
        sx={{ mb: 3 }}
        variant="outlined"
        disabled={isSubmitting}
      >
        Back to Banners
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Edit Banner
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Title *"
              name="title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              disabled={isSubmitting}
              error={!!errors.title}
              helperText={errors.title}
            />

            <TextField
              label="Description *"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              disabled={isSubmitting}
              error={!!errors.description}
              helperText={errors.description}
            />

            <FormControlLabel
              control={
                <Switch
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
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
                        disabled={isSubmitting}
                      >
                        Image
                      </Button>
                      <Button
                        variant={formData.bannerType === "video" ? "contained" : "outlined"}
                        onClick={() => setFormData({ ...formData, bannerType: "video" })}
                        size="small"
                        disabled={isSubmitting}
                      >
                        Video URL
                      </Button>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                      For images: Upload a file. For videos: Enter a URL (YouTube, Vimeo, etc.)
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
                          <Box
                            component="img"
                            src={imagePreview}
                            draggable="false"
                            sx={{ 
                              width: '100%', 
                              height: '240px', 
                              objectFit: 'contain', 
                              border: '1px solid', 
                              borderColor: 'divider', 
                              borderRadius: 1,
                              p: 2,
                              bgcolor: 'background.paper'
                            }}
                            alt="Preview"
                          />
                          <Button
                            size="small"
                            sx={{ 
                              position: 'absolute', 
                              top: 8, 
                              right: 8, 
                              minWidth: 0, 
                              p: '4px', 
                              bgcolor: 'error.main', 
                              color: 'white',
                              '&:hover': { bgcolor: 'error.dark' }
                            }}
                            onClick={removeImage}
                            disabled={isSubmitting}
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
                            {existingImageUrl ? 'Using existing image' : 'No image selected'}
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
                          disabled={isSubmitting}
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
                            sx={{ fontSize: '0.75rem', px: 1, py: 0.5 }}
                            disabled={isSubmitting}
                          >
                            {isVideoPlaying ? "Pause Preview" : "Play Preview"}
                          </Button>
                        )}
                      </Box>

                      {/* Show YouTube Shorts warning if applicable */}
                      {isYoutubeShorts && getYouTubeShortsMessage(videoUrl)}

                      {/* Video URL Input */}
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Enter video URL (YouTube, YouTube Shorts, Vimeo, or direct video link)"
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
                              sx={{ minWidth: 'auto', p: '4px' }}
                              disabled={isSubmitting}
                            >
                              <DeleteIcon fontSize="small" />
                            </Button>
                          ),
                        }}
                        sx={{ mb: 2 }}
                      />

                      {/* Video Preview */}
                      {videoUrl && isValidUrl(videoUrl) && videoPreviewType && videoPreviewType !== 'unknown' && (
                        <Box sx={{ position: 'relative', border: 1, borderColor: 'divider', borderRadius: 1, p: 2, mb: 2, bgcolor: 'grey.50' }}>
                          {(videoPreviewType === "youtube" || isYoutubeShorts) ? (
                            // Embed for YouTube (including Shorts)
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
                          ) : videoPreviewType === "vimeo" ? (
                            // Embed for Vimeo
                            <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 1 }}>
                              <iframe
                                src={`${getEmbedUrl(videoUrl)}?autoplay=${isVideoPlaying ? 1 : 0}&muted=1&loop=0&controls=1`}
                                title="Video preview"
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowFullScreen
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
                                style={{ width: '100%', height: '240px', objectFit: 'contain', borderRadius: 1 }}
                                src={videoUrl}
                                onLoadedData={() => {
                                  if (isVideoPlaying && videoRef.current) {
                                    videoRef.current.play().catch(() => {
                                      setIsVideoPlaying(false);
                                    });
                                  }
                                }}
                                onError={() => {
                                  setErrors(prev => ({ 
                                    ...prev, 
                                    videoUrl: 'Could not load video from this URL. Make sure the URL is correct and accessible.' 
                                  }));
                                }}
                              />
                              {isVideoPlaying && (
                                <Box sx={{ 
                                  position: 'absolute', 
                                  top: 8, 
                                  left: 8, 
                                  bgcolor: 'rgba(0,0,0,0.5)', 
                                  color: 'white', 
                                  px: 1, 
                                  py: 0.5, 
                                  borderRadius: 1, 
                                  fontSize: '0.75rem' 
                                }}>
                                  Auto-playing
                                </Box>
                              )}
                            </Box>
                          )}
                          
                          {isYoutubeShorts && (
                            <Alert severity="info" sx={{ mt: 2, fontSize: '0.875rem' }}>
                              <Typography variant="body2">
                                <strong>Note:</strong> YouTube Shorts will play as regular YouTube videos in the embed.
                              </Typography>
                            </Alert>
                          )}
                        </Box>
                      )}

                      {videoUrl && isValidUrl(videoUrl) && videoPreviewType === 'unknown' && (
                        <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
                          <Typography variant="body2">
                            <strong>Unsupported URL Format</strong>
                            <br />
                            This URL doesn't appear to be a supported video platform. Please use:
                            <br />
                            • YouTube (youtube.com or youtu.be)
                            <br />
                            • YouTube Shorts (youtube.com/shorts/)
                            <br />
                            • Vimeo (vimeo.com)
                            <br />
                            • Direct video URL (.mp4, .webm, etc.)
                          </Typography>
                        </Alert>
                      )}

                      {(!videoUrl || !isValidUrl(videoUrl)) && (
                        <Box sx={{ border: '2px dashed', borderColor: 'grey.300', borderRadius: 1, p: 3, textAlign: 'center', mb: 2 }}>
                          <Box sx={{ color: 'grey.400', mb: 1 }}>
                            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                          </Box>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Enter a video URL to see preview
                          </Typography>
                        </Box>
                      )}

                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          <strong>Video URL Instructions:</strong>
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          • <strong>Enter a video URL</strong>, not a file upload
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          • YouTube: https://www.youtube.com/watch?v=VIDEO_ID
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          • YouTube Shorts: https://www.youtube.com/shorts/VIDEO_ID
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          • Vimeo: https://vimeo.com/VIDEO_ID
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          • Direct video URL: https://example.com/video.mp4 (must be publicly accessible)
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
                {isSubmitting ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Updating...
                  </>
                ) : 'Update Banner'}
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

export default EditBanner;