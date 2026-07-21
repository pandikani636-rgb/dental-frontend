import { useSnackbar } from 'notistack';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { clearErrors, getProductDetails, getSimilarProducts, newReview } from '../../actions/productAction';
import ProductSlider from '../Home/ProductSlider/ProductSlider';
import Loader from '../Layouts/Loader';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import StarIcon from '@mui/icons-material/Star';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CachedIcon from '@mui/icons-material/Cached';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import { NEW_REVIEW_RESET } from '../../constants/productConstants';
import { addItemsToCart } from '../../actions/cartAction';
import { getDeliveryDate, getDiscount } from '../../utils/functions';
import { addToWishlist, removeFromWishlist } from '../../actions/wishlistAction';
import MetaData from '../Layouts/MetaData';
import Swal from 'sweetalert2'
import VideocamIcon from '@mui/icons-material/Videocam';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

const ProductDetails = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();
    const navigate = useNavigate();

    // reviews toggle
    const [open, setOpen] = useState(false);
    const [viewAll, setViewAll] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showVideo, setShowVideo] = useState(false);
    const [showPanorama, setShowPanorama] = useState(false);
    const [panoramaRotation, setPanoramaRotation] = useState(0);
    const [autoRotate, setAutoRotate] = useState(true);

    // Video states
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const [videoLoading, setVideoLoading] = useState(true);
    const [videoType, setVideoType] = useState("");
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);

    // Refs
    const videoRef = useRef(null);
    const iframeRef = useRef(null);

    const { product, loading, error } = useSelector((state) => state.productDetails);
    const { success, error: reviewError } = useSelector((state) => state.newReview);
    const { cartItems } = useSelector((state) => state.cart);
    const { wishlistItems } = useSelector((state) => state.wishlist);
    const { isAuthenticated } = useSelector((state) => state.user);

    const productId = params.id;
    const itemInWishlist = wishlistItems.some((i) => i.product === productId);

    // Get image URL with proper handling
    // Update the getImageUrl function (around line 53-68):
    const getImageUrl = (image) => {
        if (!image || !image.url) {
            // Return a simple gray placeholder as base64
            return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="18" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E';
        }

        if (image.url.startsWith('http') || image.url.startsWith('/')) {
            return image.url;
        }

        // Handle relative paths
        if (image.url.includes('uploads')) {
            return `/${image.url.replace(/\\/g, '/')}`;
        }

        // Return placeholder for invalid URLs
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="18" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E';
    };

    // Update the renderThumbnail function (around line 590-609):
    const renderThumbnail = (image, index) => {
        const thumbUrl = getImageUrl(image);

        return (
            <div
                key={index}
                onClick={() => {
                    setSelectedImageIndex(index);
                    setShowVideo(false);
                    setShowPanorama(false);
                    setAutoRotate(false);
                }}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${!showVideo && selectedImageIndex === index
                    ? 'border-blue-500 shadow-lg scale-105'
                    : 'border-gray-300 hover:border-blue-300'
                    }`}
            >
                <img
                    src={thumbUrl}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-contain bg-white p-1"
                    onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="12" fill="%239ca3af"%3EError%3C/text%3E%3C/svg%3E';
                        e.target.onerror = null;
                    }}
                />
            </div>
        );
    };

    // Update the renderVideoThumbnail function (around line 611-663) to fix the onError handler:
    const renderVideoThumbnail = () => {
        const youtubeId = getYouTubeId(videoUrl);
        const isYouTubeVideo = videoType === 'youtube' && youtubeId;

        return (
            <div
                onClick={() => {
                    if (videoUrl) {
                        window.open(videoUrl, '_blank');
                    }
                }}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all group relative border-gray-300 hover:border-blue-300 hover:shadow-md`}
            >
                {/* YouTube Thumbnail */}
                {isYouTubeVideo ? (
                    <>
                        <img
                            src={getYouTubeThumbnailUrl(videoUrl, 'hqdefault')}
                            alt="YouTube video thumbnail"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                // Fallback to gradient background
                                e.target.style.display = 'none';
                                const fallbackDiv = e.target.parentNode?.querySelector('.thumbnail-fallback');
                                if (fallbackDiv) {
                                    fallbackDiv.classList.remove('hidden');
                                    fallbackDiv.classList.add('flex');
                                }
                                e.target.onerror = null; // Prevent infinite loop
                            }}
                        />
                        {/* Fallback gradient background (hidden by default) */}
                        <div className="thumbnail-fallback hidden absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                                <PlayArrowIcon sx={{ fontSize: "24px", color: "#3b82f6", marginLeft: "3px" }} />
                            </div>
                        </div>
                    </>
                ) : (
                    // For non-YouTube videos, show a placeholder with play icon
                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center group-hover:bg-white transition-colors">
                                <PlayArrowIcon sx={{ fontSize: "24px", color: "#3b82f6", marginLeft: "3px" }} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Play button overlay for YouTube thumbnails */}
                {isYouTubeVideo && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-200">
                            <PlayArrowIcon sx={{ fontSize: "24px", color: "#3b82f6", marginLeft: "3px" }} />
                        </div>
                    </div>
                )}

                {/* Video indicator badge */}
                <div className="absolute top-1 right-1 bg-black/70 text-white text-[10px] px-1 py-0.5 rounded">
                    <VideoLibraryIcon sx={{ fontSize: "10px" }} />
                </div>
            </div>
        );
    };

    // Update the renderMediaPreview function (around line 425-487):
    const renderMediaPreview = () => {
        if (showPanorama && hasImages && safeImages.length >= 4) {
            return (
                <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-gray-700">
                    <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '1000px' }}>
                        <div 
                            className="relative"
                            style={{
                                width: '250px',
                                height: '250px',
                                transformStyle: 'preserve-3d',
                                transform: `rotateY(${panoramaRotation}deg)`,
                                transition: autoRotate ? 'transform 3s linear' : 'transform 0.8s ease-in-out'
                            }}
                        >
                            {/* Front Face */}
                            <div className="absolute w-full h-full" style={{ transform: 'translateZ(125px)' }}>
                                <img src={getImageUrl(safeImages[0])} alt="Front" className="w-full h-full object-cover rounded-lg" />
                            </div>
                            {/* Right Face */}
                            <div className="absolute w-full h-full" style={{ transform: 'rotateY(90deg) translateZ(125px)' }}>
                                <img src={getImageUrl(safeImages[1] || safeImages[0])} alt="Right" className="w-full h-full object-cover rounded-lg" />
                            </div>
                            {/* Back Face */}
                            <div className="absolute w-full h-full" style={{ transform: 'rotateY(180deg) translateZ(125px)' }}>
                                <img src={getImageUrl(safeImages[2] || safeImages[0])} alt="Back" className="w-full h-full object-cover rounded-lg" />
                            </div>
                            {/* Left Face */}
                            <div className="absolute w-full h-full" style={{ transform: 'rotateY(-90deg) translateZ(125px)' }}>
                                <img src={getImageUrl(safeImages[3] || safeImages[0])} alt="Left" className="w-full h-full object-cover rounded-lg" />
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setShowPanorama(false);
                            setPanoramaRotation(0);
                            setAutoRotate(true);
                        }}
                        className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg z-10"
                    >
                        ✕
                    </button>
                    {/* <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-xs">
                        🔄 {Math.round(panoramaRotation)}° {autoRotate ? '(Auto)' : '(Manual)'}
                    </div> */}
                    {/* <button
                        onClick={() => setAutoRotate(!autoRotate)}
                        className="absolute left-1/2 bottom-16 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg z-10"
                    >
                        {autoRotate ? '⏸ Pause' : '▶ Play'}
                    </button> */}
                </div>
            );
        }
        if (showVideo && hasVideo) {
            return isExternalVideo ? (
                // YouTube/Vimeo embed
                <div className="relative w-full h-full bg-black">
                    <iframe
                        ref={iframeRef}
                        src={embedUrl}
                        className="absolute top-0 left-0 w-full h-full border-0"
                        title={`Video preview for ${safeName}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                        onLoad={() => {
                            setIsVideoLoaded(true);
                            setIsPlaying(true);
                            setVideoLoading(false);
                        }}
                        onError={() => {
                            setVideoError(true);
                            setIsPlaying(false);
                            setVideoLoading(false);
                        }}
                    />
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
                        <VideoLibraryIcon sx={{ fontSize: "14px" }} />
                        {videoType === 'youtube' ? 'YouTube' : 'Vimeo'} Video
                    </div>
                </div>
            ) : (
                // Direct video file
                <div className="relative w-full h-full bg-black">
                    <video
                        ref={videoRef}
                        className="w-full h-full object-contain"
                        muted={isMuted}
                        playsInline
                        loop
                        preload="auto"
                        autoPlay={isPlaying}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onEnded={handleVideoEnded}
                        onError={handleVideoError}
                        onLoadedData={handleVideoLoaded}
                        onLoadStart={handleVideoLoadStart}
                        controls={false}
                    >
                        <source
                            src={videoUrl}
                            type="video/mp4"
                        />
                        Your browser does not support the video tag.
                    </video>

                    <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
                        <VideoLibraryIcon sx={{ fontSize: "14px" }} />
                        Product Video
                    </div>

                    {videoLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    )}

                    {videoError && (
                        <div
                            className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 cursor-pointer"
                            onClick={retryVideoPlay}
                        >
                            <VideocamIcon sx={{ fontSize: "48px", color: "#ef4444" }} />
                            <p className="text-white mt-2 text-sm">Failed to load video</p>
                            <button
                                onClick={retryVideoPlay}
                                className="mt-2 px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                            >
                                Retry
                            </button>
                        </div>
                    )}
                </div>
            );
        } else if (hasImages && safeImages[selectedImageIndex]) {
            // Show selected image
            const image = safeImages[selectedImageIndex];
            const imageUrl = getImageUrl(image);

            return (
                <img
                    draggable="false"
                    className="w-full h-full object-contain bg-white"
                    src={imageUrl}
                    alt={`${safeName} - Image ${selectedImageIndex + 1}`}
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                        e.target.onerror = null; // Prevent infinite loop
                    }}
                />
            );
        } else {
            // No media available
            return (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <p className="text-gray-500 font-medium">No media available</p>
                    <p className="text-gray-400 text-sm mt-1">Images or video will appear here</p>
                </div>
            );
        }
    };

    // Helper to extract YouTube ID
    const getYouTubeId = (url) => {
        if (!url || typeof url !== 'string') return '';

        try {
            const urlStr = url.trim();

            // Handle various YouTube URL formats
            if (urlStr.includes('youtube.com/shorts/')) {
                return urlStr.match(/shorts\/([^?&#]+)/)?.[1] || '';
            } else if (urlStr.includes('youtube.com/watch?v=')) {
                return urlStr.match(/v=([^?&#]+)/)?.[1] || '';
            } else if (urlStr.includes('youtu.be/')) {
                return urlStr.match(/youtu\.be\/([^?&#]+)/)?.[1] || '';
            } else if (urlStr.includes('youtube.com/embed/')) {
                return urlStr.match(/embed\/([^?&#]+)/)?.[1] || '';
            } else if (urlStr.includes('youtube.com/v/')) {
                return urlStr.match(/v\/([^?&#]+)/)?.[1] || '';
            }
        } catch (error) {
            console.error('Error extracting YouTube ID:', error);
        }
        return '';
    };

    // Get video URL with proper handling
    const getVideoUrl = () => {
        if (!product) return '';

        // First check video_url (your JSON has this)
        if (product.video_url) {
            return product.video_url;
        }

        // Then check media_type based structure
        if (product.media_type === "videoUrl" && product.video_url) {
            return product.video_url;
        }

        // Then check for video file
        if (product.media_type === "videoFile" && product.video?.url) {
            if (product.video.url.startsWith('http') || product.video.url.startsWith('/')) {
                return product.video.url;
            }
            return `/${product.video.url.replace(/\\/g, '/')}`;
        }

        return '';
    };

    // Get video type
    const getVideoType = (url) => {
        if (!url || typeof url !== 'string') return "";

        try {
            let urlToCheck = url.trim().toLowerCase();

            // Handle YouTube URLs including shorts
            if (urlToCheck.includes('youtube.com/shorts') ||
                urlToCheck.includes('youtube.com/watch') ||
                urlToCheck.includes('youtu.be') ||
                urlToCheck.includes('youtube.com/embed') ||
                urlToCheck.includes('youtube.com/v/')) {
                return "youtube";
            } else if (urlToCheck.includes('vimeo.com')) {
                return "vimeo";
            } else if (urlToCheck.match(/\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)$/i)) {
                return "direct";
            } else {
                return "unknown";
            }
        } catch {
            return "direct";
        }
    };

    // Get embed URL
    const getEmbedUrl = (url) => {
        if (!url || typeof url !== 'string') return "";

        // Handle YouTube URLs including shorts
        if (url.includes('youtube.com/shorts')) {
            const videoId = getYouTubeId(url);
            return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&modestbranding=1&rel=0` : url;
        }

        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = getYouTubeId(url);
            return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&modestbranding=1&rel=0` : url;
        }

        if (url.includes('vimeo.com')) {
            const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
            return videoId ? `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1` : url;
        }

        return url;
    };

    // Get YouTube thumbnail URL
    const getYouTubeThumbnailUrl = (url, quality = 'hqdefault') => {
        const videoId = getYouTubeId(url);
        if (!videoId) return '';

        // Available qualities: default, mqdefault, hqdefault, sddefault, maxresdefault
        return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
    };

    const addToWishlistHandler = () => {
        if (itemInWishlist) {
            dispatch(removeFromWishlist(productId));
            Swal.fire({
                title: "Success!",
                text: "Removed From Wishlist!",
                icon: "success",
                timer: 2000,
            });
        } else {
            dispatch(addToWishlist(productId));
            Swal.fire({
                title: "Success!",
                text: "Added To Wishlist!",
                icon: "success",
                timer: 2000,
            });
        }
    }

    const reviewSubmitHandler = () => {
        if (rating === 0 || !comment.trim()) {
            Swal.fire({
                title: "Failed!",
                text: "Please add rating and comment!",
                icon: "error",
                timer: 2000,
            });
            return;
        }
        const formData = new FormData();
        formData.set("rating", rating);
        formData.set("comment", comment);
        formData.set("productId", productId);
        dispatch(newReview(formData));
        setOpen(false);
    }

    const addToCartHandler = () => {
        if (!isAuthenticated) {
            enqueueSnackbar("Please login to add items to cart", { variant: "warning" });
            navigate('/login');
            return;
        }
        dispatch(addItemsToCart(productId));
        Swal.fire({
            title: "Success!",
            text: "Product Added to cart!",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
        });
    }

    const handleDialogClose = () => {
        setOpen(!open);
    }

    const itemInCart = cartItems.some((i) => i.product === productId);

    const goToCart = () => {
        navigate('/cart');
    }

    const buyNow = () => {
        if (!isAuthenticated) {
            enqueueSnackbar("Please login to buy products", { variant: "warning" });
            navigate('/login');
            return;
        }
        const safeProduct = product || {};
        const safeImages = safeProduct.images || [];

        const buyNowItem = {
            product: productId,
            name: safeProduct.name || '',
            seller: safeProduct.brand || '',
            price: safeProduct.price || 0,
            gst: safeProduct.gst || 0,
            cuttedPrice: safeProduct.cuttedPrice || 0,
            image: (safeImages.length > 0) ? getImageUrl(safeImages[0]) : '',
            stock: safeProduct.stock || 0,
            quantity: 1,
            discount: safeProduct.discount || 0,
            delivery_charge: safeProduct.delivery_charge || 0
        };
        localStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
        navigate('/shipping');
    }

    // Video control handlers
    const togglePlayPause = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    const toggleFullscreen = () => {
        const videoElement = videoRef.current;
        if (videoElement) {
            if (!document.fullscreenElement) {
                if (videoElement.requestFullscreen) {
                    videoElement.requestFullscreen();
                } else if (videoElement.webkitRequestFullscreen) {
                    videoElement.webkitRequestFullscreen();
                } else if (videoElement.msRequestFullscreen) {
                    videoElement.msRequestFullscreen();
                }
                setIsFullscreen(true);
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                setIsFullscreen(false);
            }
        }
    };

    const handleVideoEnded = () => {
        setIsPlaying(false);
    };

    const handleVideoLoadStart = () => {
        setVideoLoading(true);
        setVideoError(false);
    };

    const handleVideoLoaded = () => {
        setVideoLoading(false);
        setVideoError(false);
        setIsVideoLoaded(true);
    };

    const handleVideoError = () => {
        setVideoError(true);
        setVideoLoading(false);
        setIsVideoLoaded(false);
    };

    const retryVideoPlay = () => {
        setVideoError(false);
        setVideoLoading(true);
        if (videoRef.current) {
            videoRef.current.load();
        }
    };

    useEffect(() => {
        if (showPanorama && autoRotate) {
            setPanoramaRotation(-90);
            const timer1 = setTimeout(() => setPanoramaRotation(-180), 3000);
            const timer2 = setTimeout(() => setPanoramaRotation(-270), 6000);
            const timer3 = setTimeout(() => setPanoramaRotation(-360), 9000);
            const timer4 = setTimeout(() => {
                setPanoramaRotation(0);
                setAutoRotate(false);
                setShowPanorama(false);
            }, 12000);
            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
                clearTimeout(timer3);
                clearTimeout(timer4);
            };
        }
    }, [showPanorama, autoRotate]);

    useEffect(() => {
        if (product?.video_url || (product?.video && product?.video.url)) {
            const videoUrl = getVideoUrl();
            if (videoUrl) {
                const type = getVideoType(videoUrl);
                setVideoType(type);
            }
        }
    }, [product?.video_url, product?.video, product?.media_type]);

    useEffect(() => {
        // Auto-play video on component mount for direct videos
        if (videoRef.current && videoType === 'direct' && !videoError && showVideo) {
            const autoPlayVideo = async () => {
                try {
                    if (videoRef.current) {
                        videoRef.current.muted = true;
                        videoRef.current.loop = true;
                        videoRef.current.playsInline = true;
                        videoRef.current.preload = "auto";

                        await videoRef.current.play();
                        setIsPlaying(true);
                        setVideoError(false);
                    }
                } catch (error) {
                    console.log("Auto-play failed:", error);
                    setIsPlaying(false);
                    setVideoError(false);
                }
            };

            autoPlayVideo();

            return () => {
                if (videoRef.current) {
                    videoRef.current.pause();
                    videoRef.current.currentTime = 0;
                }
            };
        }
    }, [videoType, videoError, showVideo]);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data && event.data.event === 'ready' && iframeRef.current) {
                setIsVideoLoaded(true);
                setIsPlaying(true);
                setVideoLoading(false);
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (videoRef.current && videoType === 'direct') {
                if (document.hidden) {
                    if (isPlaying) {
                        videoRef.current.pause();
                    }
                } else {
                    if (!isPlaying && !videoError && isVideoLoaded) {
                        videoRef.current.play()
                            .then(() => {
                                setIsPlaying(true);
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
    }, [isPlaying, videoError, isVideoLoaded, videoType]);

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
        if (reviewError) {
            enqueueSnackbar(reviewError, { variant: "error" });
            dispatch(clearErrors());
        }
        if (success) {
            Swal.fire({
                title: "Success!",
                text: "Review Submitted Successfully!",
                icon: "success",
                timer: 2000
            });
            dispatch({ type: NEW_REVIEW_RESET });
        }
        dispatch(getProductDetails(productId));
        // eslint-disable-next-line
    }, [dispatch, productId, error, reviewError, success, enqueueSnackbar]);

    useEffect(() => {
        if (product?.category) {
            dispatch(getSimilarProducts(product.category));
        }
    }, [dispatch, product?.category]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            setIsPlaying(false);
            setIsMuted(true);
            setIsFullscreen(false);
        };
    }, []);

    // Early return - show loader while loading OR if product is not available
    if (loading || !product) {
        return <Loader />;
    }

    // Create safe variables to prevent undefined errors
    const safeProduct = product || {};
    const safeImages = safeProduct.images || [];
    const safeReviews = safeProduct.reviews || [];
    const safeCategory = safeProduct.category || 'Uncategorized';
    const safeStock = safeProduct.stock || 0;
    const safePrice = safeProduct.price || 0;
    const safeGst = safeProduct.gst || 0;
    const safeName = safeProduct.name || 'Product Name';
    const safeDescription = safeProduct.description || 'No description available';
    const safeDiscount = safeProduct.discount || 0;
    const safeDeliveryCharge = safeProduct.delivery_charge || 0;
    const safeReturnPolicy = safeProduct.return_policy || 'No';
    const safeReturnDuration = safeProduct.return_duration || '15';
    const safeWarranty = safeProduct.warranty || 'No';
    const safeWarrantyDuration = safeProduct.warranty_duration || '2';
    const safeMediaType = safeProduct.media_type || 'images';

    // Calculate final price with GST
    const calculateFinalPrice = () => {
        if (safeGst && safeGst > 0) {
            return safePrice + (safePrice * safeGst / 100);
        }
        return safePrice;
    };

    const finalPrice = calculateFinalPrice();

    // Check media availability
    const hasVideo = Boolean(
        (safeMediaType === "videoUrl" && safeProduct.video_url) ||
        (safeMediaType === "videoFile" && safeProduct.video?.url) ||
        (safeMediaType === "both" && safeProduct.video_url) ||
        (safeProduct.video_url) // fallback
    );

    const hasImages = Boolean(
        (safeMediaType === "images" && safeImages.length > 0) ||
        (safeMediaType === "both" && safeImages.length > 0) ||
        (safeImages.length > 0) // fallback
    );

    const videoUrl = hasVideo ? getVideoUrl() : '';
    const embedUrl = hasVideo && videoUrl ? getEmbedUrl(videoUrl) : '';
    const isExternalVideo = videoType === 'youtube' || videoType === 'vimeo';

    return (
        <>
            <MetaData title={safeName} />



            <main className="bg-gradient-to-br from-green-50 via-white to-blue-50 min-h-screen">

                {/* product image & description container */}
                <div className="w-full flex flex-col lg:flex-row bg-white lg:p-10 mt-12">

                    {/* MEDIA WRAPPER */}
                    <div className="w-full lg:w-2/5 lg:sticky top-20 lg:h-[85vh]">
                        <div className="flex flex-col lg:flex-row gap-3 m-3">
                            {/* Thumbnails - Images + Video (LEFT SIDE - VERTICAL on desktop, HORIZONTAL on mobile) */}
                            {(hasImages || hasVideo) && (
                                <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible">
                                    {/* Image Thumbnails */}
                                    {hasImages && safeImages.map((img, index) => renderThumbnail(img, index))}

                                    {/* Video Thumbnail - REPLACED WITH THUMBNAIL + PLAY SYMBOL */}
                                    {hasVideo && renderVideoThumbnail()}
                                </div>
                            )}

                            {/* VIDEO/IMAGE DISPLAY */}
                            <div className="flex-1 h-[300px] lg:h-[380px] relative rounded-lg overflow-hidden bg-gray-50 shadow-lg">
                                {renderMediaPreview()}
                            </div>
                        </div>

                        {/* PANORAMA VIEW - 6th option */}
                        {hasImages && safeImages.length >= 4 && (
                            <div className="m-3 mt-0">
                                <button 
                                    onClick={() => {
                                        setShowPanorama(true);
                                        setShowVideo(false);
                                        setPanoramaRotation(0);
                                        setAutoRotate(true);
                                    }}
                                    className="w-full py-2 bg-gradient-to-r from-green-600 to-blue-500 text-white rounded-lg font-medium text-sm hover:from-green-700 hover:to-blue-600 transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                    📸 View 360° Panorama
                                </button>
                            </div>
                        )}

                    </div>

                    {/* PRODUCT DETAILS */}
                    <div className="flex-1 py-2 px-3 lg:max-w-xl lg:ml-16">

                        <div className="flex flex-col gap-2 mb-4">
                            

                            {/* PRODUCT NAME */}
                            <h1 className="text-xl font-bold text-gray-900">{safeName}</h1>

                            {/* STOCK WARNING */}
                            {safeStock > 0 && safeStock <= 5 && (
                                <span className="text-red-500 text-xs font-medium">
                                    Hurry, Only {safeStock} left!
                                </span>
                            )}

                            {/* PRICE */}
                            <div className="flex gap-8 mt-2 items-center text-xs font-medium">
                                <p className="text-gray-500">Price</p>
                                <span className="text-base font-semibold">₹ {finalPrice.toLocaleString()}</span>
                            </div>

                            {/* PRODUCT INFO CARDS */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                {/* Delivery Charge */}
                                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-md border border-blue-200">
                                    <CurrencyRupeeIcon sx={{ fontSize: 16, color: '#2563eb' }} />
                                    <div>
                                        <p className="text-xs font-medium text-blue-700">Delivery</p>
                                        <p className="text-xs text-blue-600">
                                            {safeDeliveryCharge > 0 ? `₹${safeDeliveryCharge.toLocaleString()}` : 'Free'}
                                        </p>
                                    </div>
                                </div>

                                {/* Return Policy */}
                                <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-md border border-orange-200">
                                    <CachedIcon sx={{ fontSize: 16, color: '#ea580c' }} />
                                    <div>
                                        <p className="text-xs font-medium text-orange-700">Return Policy</p>
                                        <p className="text-xs text-orange-600">
                                            {safeReturnPolicy === 'Yes' ? `${safeReturnDuration} days` : 'No Returns'}
                                        </p>
                                    </div>
                                </div>

                                {/* Warranty */}
                                <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-md border border-purple-200">
                                    <VerifiedUserIcon sx={{ fontSize: 16, color: '#9333ea' }} />
                                    <div>
                                        <p className="text-xs font-medium text-purple-700">Warranty</p>
                                        <p className="text-xs text-purple-600">
                                            {safeWarranty === 'Yes' ? `${safeWarrantyDuration} years` : 'No Warranty'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* DESCRIPTION BOX */}
                            <div className="w-full mt-4 border rounded-md">
                                <h1 className="px-4 py-2 text-base font-medium border-b">Product Description</h1>
                                <div className="p-4">
                                    <p className="text-xs leading-relaxed">{safeDescription}</p>
                                </div>
                            </div>

                            {/* BUTTONS */}
                            <div className="w-full flex flex-col sm:flex-row gap-2 mt-4">
                                {safeStock > 0 && (
                                    <button
                                        onClick={itemInCart ? goToCart : addToCartHandler}
                                        className="p-3 w-full sm:w-1/2 flex items-center justify-center gap-2 rounded-md text-white bg-gradient-to-r from-green-600 to-blue-400 hover:from-green-700 hover:to-blue-500 shadow hover:shadow-lg transition-all duration-200 text-sm"
                                    >
                                        <ShoppingCartIcon sx={{ fontSize: "18px" }} />
                                        {itemInCart ? "GO TO CART" : "ADD TO CART"}
                                    </button>
                                )}

                                <button
                                    onClick={buyNow}
                                    disabled={safeStock < 1}
                                    className={
                                        safeStock < 1
                                            ? "p-3 w-full flex items-center justify-center gap-2 text-white bg-red-600 cursor-not-allowed rounded-md shadow text-sm"
                                            : "p-3 w-full sm:w-1/2 flex items-center justify-center gap-2 text-white bg-green-600 hover:bg-green-700 rounded-md shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm"
                                    }
                                >
                                    <ShoppingBagIcon sx={{ fontSize: "18px" }} />
                                    {safeStock < 1 ? "OUT OF STOCK" : "BUY NOW"}
                                </button>
                            </div>

                            {/* REVIEWS SECTION */}
                            <div className="w-full mt-4 border rounded-md">
                                {(() => {
                                    const visibleReviews = viewAll ? safeReviews : safeReviews.slice(-3);

                                    return visibleReviews.length > 0 ? (
                                        visibleReviews
                                            .slice()
                                            .reverse()
                                            .map((rev, i) => (
                                                <div key={i} className="flex flex-col gap-1 py-4 px-6 border-b">
                                                    <Rating
                                                        name="read-only"
                                                        value={rev.rating || 0}
                                                        readOnly
                                                        size="small"
                                                        precision={0.5}
                                                    />
                                                    <p className="text-sm">{rev.comment || ''}</p>
                                                    <span className="text-xs text-gray-500">by {rev.name || 'Anonymous'}</span>
                                                </div>
                                            ))
                                    ) : (
                                        <div className="py-8 text-center text-gray-500">
                                            <StarIcon sx={{ fontSize: "32px", color: "#d1d5db" }} />
                                            <p className="mt-2">No reviews yet</p>
                                            <p className="text-sm">Be the first to review this product!</p>
                                        </div>
                                    );
                                })()}

                                {/* VIEW MORE BUTTON */}
                                {safeReviews.length > 3 && (
                                    <button
                                        onClick={() => setViewAll(!viewAll)}
                                        className="m-3 px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:shadow-lg hover:bg-blue-700 transition-all duration-200"
                                    >
                                        {viewAll ? "View Less" : "View All Reviews"}
                                    </button>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* DIALOG FOR REVIEW */}
                <Dialog
                    open={open}
                    onClose={handleDialogClose}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>
                        <span className="text-lg font-semibold">Write a Review</span>
                    </DialogTitle>
                    <DialogContent className="py-4">
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rating
                                </label>
                                <Rating
                                    name="product-rating"
                                    value={rating}
                                    precision={0.5}
                                    onChange={(event, newValue) => {
                                        setRating(newValue);
                                    }}
                                    size="large"
                                />
                            </div>
                            <TextField
                                label="Review Comment"
                                multiline
                                rows={4}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                variant="outlined"
                                fullWidth
                                placeholder="Share your experience with this product..."
                            />
                        </div>
                    </DialogContent>
                    <DialogActions className="px-6 py-4">
                        <button
                            onClick={handleDialogClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={reviewSubmitHandler}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Submit Review
                        </button>
                    </DialogActions>
                </Dialog>

                {/* SIMILAR PRODUCTS SECTION */}
                <div className="bg-white py-8">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
                            Similar Products
                        </h2>
                        <ProductSlider />
                    </div>
                </div>

            </main>
        </>
    );
};

export default ProductDetails;
