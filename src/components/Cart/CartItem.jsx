import React, { useState, useEffect, useRef } from 'react';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { addItemsToCart, removeItemsFromCart } from '../../actions/cartAction';
import { Link } from 'react-router-dom';
import YouTubeIcon from '@mui/icons-material/YouTube';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { getImageUrl, detectVideoPlatform } from '../../utils/mediaUtils';

const CartItem = ({
    _id,
    product,
    name,
    seller,
    price = 0,
    cuttedPrice,
    image,
    images = [],
    video,
    video_url,
    media_type,
    stock = 0,
    quantity = 1,
    discount = 0,
    delivery_charge = 0,
    gst,
    inCart,
    onValidationChange
}) => {
    const safePrice = price || 0;
    const safeGst = gst || 0;

    const calculateFinalPrice = () => {
        if (safeGst && safeGst > 0) {
            return safePrice + (safePrice * safeGst / 100);
        }
        return safePrice;
    };

    const finalPrice = calculateFinalPrice();

    // Ensure product ID exists
    const productId = product || _id || product?._id || product?.id;

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const [mediaConfig, setMediaConfig] = useState({
        type: 'none',
        videoType: '',
        embedUrl: '',
        thumbnailUrl: '',
        hasMedia: false
    });

    const [videoState, setVideoState] = useState({
        isLoaded: false,
        loadError: false,
        isPlaying: false,
        isMuted: true
    });

    // State for quantity input
    const [inputQuantity, setInputQuantity] = useState(quantity);
    const [isEditing, setIsEditing] = useState(false);
    const [quantityError, setQuantityError] = useState('');

    const iframeRef = useRef(null);
    const videoRef = useRef(null);
    const playAttemptRef = useRef(null);
    const quantityInputRef = useRef(null);

    // Video handlers
    const videoHandlers = {
        youtube: {
            extractId: (url) => {
                try {
                    // Handle YouTube Shorts
                    const shortsMatch = url.match(/youtube\.com\/shorts\/([^/?&]+)/);
                    if (shortsMatch) return shortsMatch[1];

                    const urlObj = new URL(url);

                    // Regular YouTube URL
                    const videoId = urlObj.searchParams.get('v');
                    if (videoId) return videoId;

                    // youtu.be URL
                    if (urlObj.hostname.includes('youtu.be')) {
                        return urlObj.pathname.slice(1).split('?')[0];
                    }

                    // YouTube embed URL
                    const embedMatch = url.match(/youtube\.com\/embed\/([^/?&]+)/);
                    if (embedMatch) return embedMatch[1];

                    return null;
                } catch {
                    return null;
                }
            },
            getEmbedUrl: (videoId) => {
                return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&playsinline=1&enablejsapi=1`;
            },
            getThumbnailUrl: (videoId) => {
                return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
            },
            getPlatformIcon: () => <YouTubeIcon sx={{ fontSize: "16px" }} />,
            platformName: "YouTube"
        },

        vimeo: {
            extractId: (url) => {
                try {
                    const urlObj = new URL(url);
                    const pathParts = urlObj.pathname.split('/');
                    const videoId = pathParts[pathParts.length - 1];
                    return videoId && !isNaN(videoId) ? videoId : null;
                } catch {
                    return null;
                }
            },
            getEmbedUrl: (videoId) => {
                return `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1&background=1&autopause=0&controls=0`;
            },
            getThumbnailUrl: () => null,
            getPlatformIcon: () => <PlayCircleIcon sx={{ fontSize: "16px" }} />,
            platformName: "Vimeo"
        },

        direct: {
            getEmbedUrl: (url) => url,
            getPlatformIcon: () => <VideoLibraryIcon sx={{ fontSize: "16px" }} />,
            platformName: "Video"
        }
    };

    // Sync input quantity with prop quantity
    useEffect(() => {
        setInputQuantity(quantity);
    }, [quantity]);

    // Detect video platform
    const detectVideoPlatformLocal = (url) => {
        return detectVideoPlatform(url);
    };

    // Get image URL
    const getImageUrlLocal = () => {
        // Try single image prop first
        if (image && image !== '/default.png' && image !== 'default.png') {
            // If it's already a full URL, return it
            if (image.startsWith('http')) {
                return image;
            }
            // If it's a Cloudinary URL or similar
            if (image.includes('cloudinary') || image.includes('res.cloudinary.com')) {
                return image;
            }
            // Handle local paths
            return getImageUrl(image);
        }

        // Try images array
        if (images && images.length > 0) {
            const firstImg = images[0];
            return getImageUrl(firstImg);
        }

        return null;
    };

    // Configure media
    useEffect(() => {
        const configureMedia = () => {
            let config = {
                type: 'none',
                videoType: '',
                embedUrl: '',
                thumbnailUrl: '',
                hasMedia: false
            };

            const imageUrl = getImageUrlLocal();

            // Check for images first based on media_type
            if (media_type === "images" && imageUrl) {
                config.type = 'image';
                config.hasMedia = true;
                setMediaConfig(config);
                return;
            }

            // Check for video URL
            if (media_type === "videoUrl" && video_url && video_url.trim()) {
                const videoPlatform = detectVideoPlatformLocal(video_url);
                if (videoPlatform) {
                    const handler = videoHandlers[videoPlatform];
                    if (handler) {
                        if (videoPlatform === 'youtube' || videoPlatform === 'vimeo') {
                            const videoId = handler.extractId(video_url);
                            if (videoId) {
                                config.type = 'video';
                                config.videoType = videoPlatform;
                                config.embedUrl = handler.getEmbedUrl(videoId);
                                config.hasMedia = true;

                                if (videoPlatform === 'youtube') {
                                    config.thumbnailUrl = handler.getThumbnailUrl(videoId);
                                }
                            }
                        } else if (videoPlatform === 'direct') {
                            config.type = 'video';
                            config.videoType = videoPlatform;
                            config.embedUrl = video_url;
                            config.hasMedia = true;
                        }
                    }
                }
                setMediaConfig(config);
                return;
            }

            // Check for video file
            if (media_type === "videoFile" && video) {
                let videoUrl = '';
                if (typeof video === 'string') {
                    videoUrl = video;
                } else if (video.url) {
                    videoUrl = video.url;
                } else if (video.public_id) {
                    videoUrl = `https://res.cloudinary.com/your-cloud-name/video/upload/${video.public_id}`;
                }
                
                if (videoUrl) {
                    config.type = 'video';
                    config.videoType = 'direct';
                    config.embedUrl = videoUrl;
                    config.hasMedia = true;
                }
                setMediaConfig(config);
                return;
            }

            // Legacy support - prioritize video if available and media_type is 'video'
            if (video_url && (media_type === 'video' || !media_type)) {
                const videoPlatform = detectVideoPlatformLocal(video_url);
                if (videoPlatform) {
                    const handler = videoHandlers[videoPlatform];
                    if (handler) {
                        if (videoPlatform === 'youtube' || videoPlatform === 'vimeo') {
                            const videoId = handler.extractId(video_url);
                            if (videoId) {
                                config.type = 'video';
                                config.videoType = videoPlatform;
                                config.embedUrl = handler.getEmbedUrl(videoId);
                                config.hasMedia = true;

                                if (videoPlatform === 'youtube') {
                                    config.thumbnailUrl = handler.getThumbnailUrl(videoId);
                                }
                            }
                        } else if (videoPlatform === 'direct') {
                            config.type = 'video';
                            config.videoType = videoPlatform;
                            config.embedUrl = video_url;
                            config.hasMedia = true;
                        }
                    }
                }
                setMediaConfig(config);
                return;
            }

            // If no video, check for image
            if (!config.hasMedia && imageUrl) {
                config.type = 'image';
                config.hasMedia = true;
            }

            setMediaConfig(config);
        };

        configureMedia();
    }, [image, images, video_url, media_type, video]);

    // Handle auto-play for videos
    useEffect(() => {
        const attemptAutoPlay = () => {
            if (videoRef.current && mediaConfig.videoType === 'direct') {
                if (playAttemptRef.current) {
                    clearTimeout(playAttemptRef.current);
                }

                playAttemptRef.current = setTimeout(async () => {
                    try {
                        if (videoRef.current) {
                            videoRef.current.muted = true;
                            videoRef.current.loop = true;
                            videoRef.current.playsInline = true;
                            videoRef.current.preload = "auto";

                            await videoRef.current.play();
                            setVideoState(prev => ({
                                ...prev,
                                isPlaying: true,
                                isLoaded: true,
                                isMuted: true
                            }));
                        }
                    } catch (error) {
                        console.log(`Auto-play failed for video:`, error);
                    }
                }, 100);
            }
        };

        if (mediaConfig.hasMedia && mediaConfig.type === 'video') {
            attemptAutoPlay();
        }

        return () => {
            if (playAttemptRef.current) {
                clearTimeout(playAttemptRef.current);
            }
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            }
        };
    }, [mediaConfig.videoType, mediaConfig.hasMedia, mediaConfig.type]);

    // Handle visibility change for direct videos
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (videoRef.current && mediaConfig.videoType === 'direct') {
                if (document.hidden) {
                    if (videoState.isPlaying) {
                        videoRef.current.pause();
                        setVideoState(prev => ({ ...prev, isPlaying: false }));
                    }
                } else {
                    if (!videoState.isPlaying && !videoState.loadError && videoState.isLoaded) {
                        videoRef.current.play()
                            .then(() => {
                                setVideoState(prev => ({ ...prev, isPlaying: true }));
                            })
                            .catch(error => {
                                console.log("Resume play failed:", error);
                            });
                    }
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [videoState.isPlaying, videoState.loadError, videoState.isLoaded, mediaConfig.videoType]);

    // Handle YouTube/Vimeo iframe messages
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data && event.data.event === 'ready' && iframeRef.current) {
                setVideoState(prev => ({
                    ...prev,
                    isLoaded: true,
                    isPlaying: true
                }));
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    // Quantity input handlers
    const handleInputFocus = () => {
        setIsEditing(true);
        setInputQuantity(quantity);
        // Select all text when focusing
        setTimeout(() => {
            if (quantityInputRef.current) {
                quantityInputRef.current.select();
            }
        }, 0);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        
        // Allow empty input temporarily
        if (value === '') {
            setInputQuantity('');
            return;
        }
        
        // Allow only numbers
        const numValue = parseInt(value);
        if (!isNaN(numValue)) {
            setInputQuantity(numValue);
        }
    };

    const handleInputBlur = () => {
        setIsEditing(false);
        
        const value = inputQuantity;
        let error = '';
        
        if (value === '') {
            error = 'Quantity cannot be empty';
        } else {
            const numValue = parseInt(value);
            
            if (isNaN(numValue)) {
                error = 'Please enter a valid number';
            } else if (numValue < 1) {
                error = 'Quantity must be at least 1';
            } else if (numValue > stock) {
                error = `Cannot exceed stock of ${stock}`;
            }
        }
        
        if (error) {
            setQuantityError(error);
            if (onValidationChange) {
                onValidationChange(productId, error);
            }
        } else {
            updateQuantity();
            setQuantityError('');
            if (onValidationChange) {
                onValidationChange(productId, '');
            }
        }
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            quantityInputRef.current.blur();
        }
        if (e.key === 'Escape') {
            setInputQuantity(quantity);
            setIsEditing(false);
            quantityInputRef.current.blur();
        }
    };

    const handleInputKeyUp = (e) => {
        const value = e.target.value;
        let error = '';
        
        if (value === '') {
            error = 'Quantity cannot be empty';
        } else {
            const numValue = parseInt(value);
            
            if (isNaN(numValue)) {
                error = 'Please enter a valid number';
            } else if (numValue < 1) {
                error = 'Quantity must be at least 1';
            } else if (numValue > stock) {
                error = `Cannot exceed stock of ${stock}`;
            }
        }
        
        setQuantityError(error);
        if (onValidationChange) {
            onValidationChange(productId, error);
        }
    };

    const updateQuantity = () => {
        if (inputQuantity === '' || inputQuantity === quantity) return;
        
        let newQuantity = parseInt(inputQuantity);
        
        if (isNaN(newQuantity) || newQuantity < 1) {
            newQuantity = 1;
        }
        
        if (newQuantity > stock) {
            setQuantityError("Out of stock");
            enqueueSnackbar("Out of stock", { variant: "warning" });
            newQuantity = stock;
        } else {
            setQuantityError("");
        }
        
        dispatch(addItemsToCart(productId, newQuantity));
        setInputQuantity(newQuantity);
    };

    const increaseQuantity = () => {
        const newQty = quantity + 1;
        if (quantity >= stock) {
            setQuantityError("Out of stock");
            enqueueSnackbar("Out of stock", { variant: "warning" });
            return;
        }
        setQuantityError("");
        dispatch(addItemsToCart(productId, newQty));
    };

    const decreaseQuantity = () => {
        const newQty = quantity - 1;
        if (quantity <= 1) return;
        setQuantityError("");
        dispatch(addItemsToCart(productId, newQty));
    };

    const removeCartItem = () => {
        dispatch(removeItemsFromCart(productId));
        enqueueSnackbar("Product Removed From Cart", { variant: "success" });
    };

    // Video handlers
    const handleVideoError = () => {
        setVideoState(prev => ({
            ...prev,
            loadError: true,
            isPlaying: false
        }));
    };

    const handleVideoPlay = () => {
        setVideoState(prev => ({
            ...prev,
            isPlaying: true,
            loadError: false
        }));
    };

    const handleVideoPause = () => {
        setVideoState(prev => ({
            ...prev,
            isPlaying: false
        }));
    };

    const handleVideoClick = () => {
        if (mediaConfig.videoType === 'direct' && videoRef.current) {
            if (videoState.isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play()
                    .then(() => {
                        setVideoState(prev => ({ ...prev, isPlaying: true }));
                    })
                    .catch(error => {
                        console.log("Manual play failed:", error);
                    });
            }
        }
    };

    const toggleMute = (e) => {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setVideoState(prev => ({
                ...prev,
                isMuted: !prev.isMuted
            }));
        }
    };

    const renderNoMedia = () => {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                <div className="text-center p-3">
                    <div className="text-gray-400 mb-2">
                        <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">No preview</span>
                </div>
            </div>
        );
    };

    const renderImagePreview = () => {
        const imageUrl = getImageUrlLocal();
        if (!imageUrl) return renderNoMedia();

        return (
            <img
                draggable="false"
                className="w-full h-full object-contain rounded-lg"
                src={imageUrl}
                alt={name || 'Product image'}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default.png';
                }}
            />
        );
    };

    const renderYouTubeVideo = () => {
        const { embedUrl, thumbnailUrl } = mediaConfig;

        if (!embedUrl) return renderNoMedia();

        return (
            <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
                {!videoState.isLoaded && thumbnailUrl && (
                    <div className="absolute inset-0">
                        <img
                            src={thumbnailUrl}
                            alt="Video thumbnail"
                            className="w-full h-full object-cover opacity-70"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black bg-opacity-50 rounded-full p-2">
                                <PlayCircleIcon sx={{ fontSize: "20px", color: "white" }} />
                            </div>
                        </div>
                    </div>
                )}

                <iframe
                    ref={iframeRef}
                    src={embedUrl}
                    className="absolute top-0 left-0 w-full h-full border-0 rounded-lg"
                    title={`YouTube video for ${name}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    onLoad={() => {
                        setVideoState(prev => ({ ...prev, isLoaded: true }));
                    }}
                    onError={handleVideoError}
                />

                <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white p-1 rounded-full z-10 flex items-center gap-1">
                    <YouTubeIcon sx={{ fontSize: "12px" }} />
                    <span className="text-[8px] font-medium">YouTube</span>
                </div>
            </div>
        );
    };

    const renderDirectVideo = () => {
        const { embedUrl } = mediaConfig;

        if (!embedUrl) return renderNoMedia();

        return (
            <div className="relative w-full h-full" onClick={handleVideoClick}>
                <video
                    ref={videoRef}
                    className="w-full h-full object-contain rounded-lg"
                    muted={videoState.isMuted}
                    playsInline
                    loop
                    autoPlay
                    preload="auto"
                    onPlay={handleVideoPlay}
                    onPause={handleVideoPause}
                    onError={handleVideoError}
                    onLoadedData={() => {
                        setVideoState(prev => ({ ...prev, isLoaded: true }));
                    }}
                >
                    <source src={embedUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {!videoState.isLoaded && !videoState.loadError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-20">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {videoState.loadError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-80">
                        <div className="text-white mb-1">
                            <VideoLibraryIcon sx={{ fontSize: "16px" }} />
                        </div>
                        <span className="text-[10px] text-gray-300 mb-2">Video failed to load</span>
                        <button
                            onClick={handleVideoClick}
                            className="px-2 py-1 bg-blue-600 text-white text-[10px] rounded hover:bg-blue-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                )}

                <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white p-1 rounded-full z-10 flex items-center gap-1">
                    <VideoLibraryIcon sx={{ fontSize: "12px" }} />
                    <span className="text-[8px] font-medium">Video</span>
                </div>

                {!videoState.isPlaying && videoState.isLoaded && !videoState.loadError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer">
                        <div className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>
                )}

                {videoState.isLoaded && !videoState.loadError && (
                    <button
                        onClick={toggleMute}
                        className="absolute top-1 right-1 bg-black bg-opacity-60 text-white p-1 rounded-full z-10 hover:bg-opacity-80 transition-all duration-200"
                        title={videoState.isMuted ? "Unmute" : "Mute"}
                    >
                        {videoState.isMuted ? (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                            </svg>
                        ) : (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                            </svg>
                        )}
                    </button>
                )}
            </div>
        );
    };

    const renderVideoPreview = () => {
        const { videoType, embedUrl } = mediaConfig;

        if (!embedUrl) return renderNoMedia();

        switch (videoType) {
            case 'youtube':
                return renderYouTubeVideo();
            case 'vimeo':
                return (
                    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
                        <iframe
                            ref={iframeRef}
                            src={embedUrl}
                            className="absolute top-0 left-0 w-full h-full border-0 rounded-lg"
                            title={`Vimeo video for ${name}`}
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                            referrerPolicy="strict-origin-when-cross-origin"
                            onLoad={() => {
                                setVideoState(prev => ({ ...prev, isLoaded: true }));
                            }}
                            onError={handleVideoError}
                        />
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white p-1 rounded-full z-10 flex items-center gap-1">
                            <PlayCircleIcon sx={{ fontSize: "12px" }} />
                            <span className="text-[8px] font-medium">Vimeo</span>
                        </div>
                    </div>
                );
            case 'direct':
                return renderDirectVideo();
            default:
                return renderNoMedia();
        }
    };

    const renderMediaPreview = () => {
        if (!mediaConfig.hasMedia) return renderNoMedia();

        if (mediaConfig.type === 'image') {
            return renderImagePreview();
        }

        if (mediaConfig.type === 'video') {
            return renderVideoPreview();
        }

        return renderNoMedia();
    };

    // Calculate display value for input
    const getDisplayValue = () => {
        if (isEditing) {
            return inputQuantity;
        }
        return quantity;
    };

    return (
        <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 md:p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
            <Link to={`/product/${productId}`} className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 items-stretch w-full group">
                <div className="w-full sm:w-24 md:w-32 h-24 sm:h-24 md:h-32 flex-shrink-0 mx-auto sm:mx-0">
                    <div className="h-full w-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg sm:rounded-xl border border-gray-200 p-2 sm:p-3 shadow-md hover:shadow-lg transition-shadow duration-200">
                        <div className="h-full w-full rounded-lg overflow-hidden">
                            {renderMediaPreview()}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-between w-full">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-3">
                        <div className="flex flex-col gap-1 flex-1 w-full">
                            <h3 className="font-semibold text-base sm:text-lg text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                                {name?.length > 50 ? `${name.substring(0, 50)}...` : name}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md inline-block w-fit">
                                {seller}
                            </p>
                        </div>

                        <div className="flex flex-col items-start sm:items-end gap-1 w-full sm:w-auto">
                            <div className="text-xl sm:text-2xl font-bold text-green-600">
                                ₹{finalPrice?.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500 space-y-0.5">
                                <div>₹{finalPrice?.toLocaleString()} × {quantity} = ₹{(finalPrice * quantity).toLocaleString()}</div>
                                {discount > 0 && quantity > 1 && (
                                    <div className="text-green-600">
                                        - {discount}% discount (₹{((finalPrice * quantity * discount) / 100).toLocaleString()})
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <span className="text-xs sm:text-sm font-medium text-gray-600">Quantity:</span>
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={decreaseQuantity}
                            className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-md border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors duration-200 font-semibold text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                            disabled={quantity <= 1}
                        >
                            -
                        </button>
                        <input
                            ref={quantityInputRef}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={getDisplayValue()}
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            onKeyDown={handleInputKeyDown}
                            onKeyUp={handleInputKeyUp}
                            className="w-10 sm:w-12 text-center font-semibold text-sm sm:text-base text-gray-800 bg-transparent border-none outline-none"
                            aria-label={`Quantity for ${name}`}
                        />
                        <button
                            onClick={increaseQuantity}
                            className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-md border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors duration-200 font-semibold text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                        >
                            +
                        </button>
                    </div>
                    <div className="flex flex-col items-start gap-1">
                        <span className="text-xs text-gray-500">Stock: {stock}</span>
                        {quantityError && (
                            <span className="text-xs text-red-500 font-medium">{quantityError}</span>
                        )}
                    </div>
                </div>

                {inCart && (
                    <button
                        onClick={removeCartItem}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 sm:px-6 py-2 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg w-full sm:w-auto"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Remove
                    </button>
                )}
            </div>
        </div>
    );
};

export default CartItem;