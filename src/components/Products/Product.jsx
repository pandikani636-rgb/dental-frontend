import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { Link, useNavigate } from 'react-router-dom';
import { getDiscount } from '../../utils/functions';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../actions/wishlistAction';
import { addItemsToCart } from '../../actions/cartAction';
import { useSnackbar } from 'notistack';
import Swal from 'sweetalert2';
import { useState, useEffect, useRef } from 'react';

const Product = ({ _id, name, images, video, video_url, media_type, seller, ratings, numOfReviews, price, gst, cuttedPrice, stock, discount, delivery_charge }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [imageError, setImageError] = useState(false);
    const [firstImage, setFirstImage] = useState(null);
    const [hasMedia, setHasMedia] = useState(false);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [videoLoadError, setVideoLoadError] = useState(false);
    const videoRef = useRef(null);
    const playAttemptRef = useRef(null);

    // Calculate price with GST
    const calculatePriceWithGST = () => {
        if (gst && gst > 0) {
            return price + (price * gst / 100);
        }
        return price;
    };

    const finalPrice = calculatePriceWithGST();

    const { wishlistItems } = useSelector((state) => state.wishlist);
    const { isAuthenticated } = useSelector((state) => state.user);

    const itemInWishlist = wishlistItems.some((i) => i.product === _id);

    useEffect(() => {
        // Check for available media based on media_type
        const checkMedia = () => {
            if (media_type === "images" && images && images.length > 0) {
                const validImage = images.find(img => img && img.url);
                if (validImage) {
                    setFirstImage(validImage);
                    setHasMedia(true);
                    return;
                }
            } else if (media_type === "videoFile" && video && video.url) {
                setHasMedia(true);
                return;
            } else if (media_type === "videoUrl" && video_url) {
                setHasMedia(true);
                return;
            }
            
            setHasMedia(false);
            setFirstImage(null);
        };

        checkMedia();
    }, [images, video, video_url, media_type]);

    useEffect(() => {
        // Start video autoplay when component mounts (for video files only)
        const startVideoAutoplay = () => {
            if (media_type === "videoFile" && video && video.url && videoRef.current && !videoLoadError) {
                // Clear any previous play attempts
                if (playAttemptRef.current) {
                    clearTimeout(playAttemptRef.current);
                }

                // Attempt to play video
                playAttemptRef.current = setTimeout(() => {
                    if (videoRef.current) {
                        const playPromise = videoRef.current.play();

                        if (playPromise !== undefined) {
                            playPromise
                                .then(() => {
                                    setIsVideoPlaying(true);
                                })
                                .catch(error => {
                                    // Try alternative approach - set volume to 0 and try again
                                    if (videoRef.current) {
                                        videoRef.current.volume = 0;
                                        videoRef.current.muted = true;

                                        videoRef.current.play()
                                            .then(() => {
                                                setIsVideoPlaying(true);
                                            })
                                            .catch(err => {
                                                setVideoLoadError(true);
                                            });
                                    }
                                });
                        }
                    }
                }, 300);
            }
        };

        startVideoAutoplay();

        return () => {
            if (playAttemptRef.current) {
                clearTimeout(playAttemptRef.current);
            }
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
                setIsVideoPlaying(false);
            }
        };
    }, [media_type, video, videoLoadError, _id]);

    // Handle visibility changes for the video
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (media_type === "videoFile" && video && video.url && videoRef.current) {
                if (document.hidden) {
                    if (isVideoPlaying) {
                        videoRef.current.pause();
                        setIsVideoPlaying(false);
                    }
                } else {
                    if (!isVideoPlaying && !videoLoadError) {
                        videoRef.current.play()
                            .then(() => {
                                setIsVideoPlaying(true);
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
    }, [media_type, video, isVideoPlaying, videoLoadError]);

    const addToWishlistHandler = () => {
        if (itemInWishlist) {
            dispatch(removeFromWishlist(_id));
            enqueueSnackbar("Remove From Wishlist", { variant: "success" });
        } else {
            dispatch(addToWishlist(_id));
            enqueueSnackbar("Added To Wishlist", { variant: "success" });
        }
    }

    const addToCartHandler = () => {
        if (!isAuthenticated) {
            enqueueSnackbar("Please login to add items to cart", { variant: "warning" });
            navigate('/login');
            return;
        }
        if (stock < 1) {
            enqueueSnackbar("Product Out of Stock", { variant: "error" });
            return;
        }
        dispatch(addItemsToCart(_id, 1));
        Swal.fire({
            title: "Success!",
            text: "Product added to cart!",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
        });
    }

    const buyNowHandler = () => {
        if (!isAuthenticated) {
            enqueueSnackbar("Please login to buy products", { variant: "warning" });
            navigate('/login');
            return;
        }
        if (stock < 1) {
            enqueueSnackbar("Product Out of Stock", { variant: "error" });
            return;
        }
        
        // Get safe image URL
        const getImageUrl = () => {
            if (images && images.length > 0) {
                const firstImg = images[0];
                if (firstImg && firstImg.url) {
                    return firstImg.url;
                }
            }
            return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect width="150" height="150" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E';
        };
        
        const buyNowItem = {
            product: _id,
            name: name,
            seller: seller,
            price: price,
            gst: gst,
            cuttedPrice: cuttedPrice,
            image: getImageUrl(),
            stock: stock,
            quantity: 1,
            discount: discount || 0,
            delivery_charge: delivery_charge || 0
        };
        localStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
        navigate('/shipping');
    }
    const handleImageError = () => {
        setImageError(true);
    };

    const handleVideoError = () => {
        setVideoLoadError(true);
        if (videoRef.current) {
            videoRef.current.controls = false;
        }
    };

    const handleVideoPlay = () => {
        setIsVideoPlaying(true);
    };

    const handleVideoPause = () => {
        setIsVideoPlaying(false);
    };

    const handleVideoEnded = () => {
        // Restart video immediately when it ends (for infinity loop)
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play()
                .then(() => {
                    setIsVideoPlaying(true);
                })
                .catch(error => {
                    console.log("Video replay failed:", error);
                    setIsVideoPlaying(false);
                });
        }
    };

    const retryVideoPlay = () => {
        if (videoRef.current && video && video.url) {
            setVideoLoadError(false);
            videoRef.current.load();

            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.play()
                        .then(() => {
                            setIsVideoPlaying(true);
                            setVideoLoadError(false);
                        })
                        .catch(error => {
                            setVideoLoadError(true);
                        });
                }
            }, 500);
        }
    };

    // Helper functions for video URL handling
    const getVideoType = (url) => {
        try {
            const parsedUrl = new URL(url);
            const hostname = parsedUrl.hostname.toLowerCase();
            
            if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
                return "youtube";
            } else if (hostname.includes('vimeo.com')) {
                return "vimeo";
            } else {
                return "direct";
            }
        } catch {
            return "direct";
        }
    };

    const getEmbedUrl = (url) => {
        try {
            const parsedUrl = new URL(url);
            
            if (parsedUrl.hostname.includes('youtube.com')) {
                const videoId = parsedUrl.searchParams.get('v');
                if (videoId) {
                    return `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=1&controls=1`;
                }
                const shortsMatch = url.match(/youtube\.com\/shorts\/([^/?]+)/);
                if (shortsMatch) {
                    return `https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=0&mute=1&controls=1`;
                }
            }
            
            if (parsedUrl.hostname.includes('youtu.be')) {
                const videoId = parsedUrl.pathname.slice(1);
                return `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=1&controls=1`;
            }
            
            if (parsedUrl.hostname.includes('vimeo.com')) {
                const pathParts = parsedUrl.pathname.split('/');
                const videoId = pathParts[pathParts.length - 1];
                if (videoId && !isNaN(videoId)) {
                    return `https://player.vimeo.com/video/${videoId}?autoplay=0&muted=1`;
                }
            }
            
            return url;
        } catch {
            return url;
        }
    };

    const renderNoMedia = () => {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded">
                <div className="text-center">
                    <div className="text-gray-400 mb-2">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <span className="text-xs text-gray-500">No preview available</span>
                </div>
            </div>
        );
    };

    const renderMediaPreview = () => {
        // Case 1: Images
        if (media_type === "images" && firstImage && firstImage.url && !imageError) {
            return (
                <img
                    draggable="false"
                    className="w-full h-full object-contain high-dpi-image"
                    src={firstImage.url}
                    alt={name}
                    onError={handleImageError}
                />
            );
        }

        // Case 2: Video File
        if (media_type === "videoFile" && video && video.url) {
            return (
                <div className="relative w-full h-full bg-gray-100 rounded overflow-hidden">
                    <video
                        ref={videoRef}
                        className="w-full h-full object-contain"
                        muted
                        playsInline
                        loop
                        preload="auto"
                        onPlay={handleVideoPlay}
                        onPause={handleVideoPause}
                        onEnded={handleVideoEnded}
                        onError={handleVideoError}
                        controls={false}
                        autoPlay
                    >
                        <source src={video.url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white p-1.5 rounded-full z-10">
                        <VideoLibraryIcon sx={{ fontSize: "14px" }} />
                    </div>

                    {!isVideoPlaying && !videoLoadError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-30">
                            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {videoLoadError && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-80">
                            <div className="text-white mb-2">
                                <VideoLibraryIcon sx={{ fontSize: "32px" }} />
                            </div>
                            <span className="text-xs text-gray-300 mb-3">Video failed to load</span>
                            <button
                                onClick={retryVideoPlay}
                                className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        // Case 3: Video URL
        if (media_type === "videoUrl" && video_url) {
            const videoType = getVideoType(video_url);
            
            return (
                <div className="relative w-full h-full bg-gray-100 rounded overflow-hidden">
                    {videoType === "youtube" || videoType === "vimeo" ? (
                        <div className="relative w-full h-full">
                            <iframe
                                src={getEmbedUrl(video_url)}
                                title="Product video"
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white p-1.5 rounded-full z-10">
                                <VideoLibraryIcon sx={{ fontSize: "14px" }} />
                            </div>
                        </div>
                    ) : (
                        <div className="relative w-full h-full">
                            <video
                                className="w-full h-full object-contain"
                                controls
                                preload="metadata"
                            >
                                <source src={video_url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white p-1.5 rounded-full z-10">
                                <VideoLibraryIcon sx={{ fontSize: "14px" }} />
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        // Case 4: No valid media
        return renderNoMedia();
    };


    return (
        <div className="flex flex-col relative hover:shadow-lg rounded-lg border border-gray-200 bg-white transition-all duration-300 h-[320px] sm:h-[340px] md:h-[360px] p-2 sm:p-3 overflow-hidden">
            {/* Discount Badge */}
            {discount > 0 && (
                <div className="absolute top-2 left-2 bg-gradient-to-r from-green-600 to-blue-400 text-white px-2 py-1 rounded-full text-xs font-bold z-10 shadow-lg">
                    {discount}% OFF
                </div>
            )}




            {/* Wishlist Badge */}
            <span onClick={addToWishlistHandler} className={`${itemInWishlist ? "text-red-500" : "hover:text-red-500 text-gray-300"} absolute top-2 right-2 cursor-pointer transition-colors duration-300 p-1 z-10`}>
                <FavoriteIcon sx={{ fontSize: "16px" }} />
            </span>

            {/* Image & Product Title */}
            <Link to={`/product/${_id}`} className="flex flex-col items-center text-center group w-full flex-shrink-0">
                <div className="w-full h-28 sm:h-32 md:h-36 mb-1 sm:mb-2 relative bg-gray-100 rounded overflow-hidden">
                    {renderMediaPreview()}
                </div>
                <h2 className="text-xs sm:text-sm group-hover:text-primary-blue text-center font-medium px-1 w-full truncate h-4 sm:h-5 mb-1 sm:mb-2">{name}</h2>
            </Link>

            {/* Product Details - Fixed at bottom */}
            <div className="flex flex-col gap-1 sm:gap-2 w-full mt-auto mb-5">
                {/* Price */}
                <div className="flex items-center justify-center w-full">
                    <span className="text-sm sm:text-base font-bold">₹{finalPrice.toLocaleString()}</span>
                </div>

                {/* Delivery Charge & Stock */}
                <div className="text-center">
                    {delivery_charge > 0 && (
                        <div className="text-xs text-gray-600 mb-1">
                            {/* + ₹{delivery_charge} delivery */}
                        </div>
                    )}
                    <div className="text-xs font-medium mb-1 sm:mb-2" style={{ color: '#f97316' }}>
                        Only {stock} left!
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-1 sm:gap-1.5 w-full">
                    <button
                        onClick={addToCartHandler}
                        disabled={stock < 1}
                        className={`w-full py-1.5 sm:py-2 px-2 sm:px-3 rounded-md font-medium transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 text-xs ${stock < 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                            : 'bg-gradient-to-r from-green-600 to-blue-400 text-white hover:from-green-700 hover:to-blue-500 hover:shadow-lg'
                            }`}
                    >
                        <ShoppingCartIcon sx={{ fontSize: "12px" }} />
                        <span>ADD TO CART</span>
                    </button>

                    <button
                        onClick={buyNowHandler}
                        disabled={stock < 1}
                        className={`w-full py-1.5 sm:py-2 px-2 sm:px-3 rounded-md font-medium transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 text-xs ${stock < 1
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-105'
                            }`}
                    >
                        <FlashOnIcon sx={{ fontSize: "12px" }} className="animate-pulse" />
                        <span>BUY NOW</span>
                    </button>
                </div>
            </div>
        </div>
    );
};


export default Product;