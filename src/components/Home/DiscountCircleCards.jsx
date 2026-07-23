import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../actions/productAction';
import { clearErrors } from '../../actions/productAction';
import { useSnackbar } from 'notistack';
import { useEffect, useState, useRef } from 'react';
import { backendUrl } from '../../utils/config';

const ProductMedia = ({ product }) => {
    const videoRef = useRef(null);
    const iframeRef = useRef(null);
    const [imageError, setImageError] = useState(false);
    const [videoError, setVideoError] = useState(false);

    const getImageUrl = () => {
        if (product.images && product.images.length > 0 && product.images[0]) {
            const image = product.images[0];
            if (image.url && image.url.startsWith('http')) {
                return image.url;
            }
            if (image.url && image.url.includes('uploads')) {
                return `${backendUrl}/${image.url.replace(/\\/g, '/').replace(/^\//, '')}`;
            }
            if (image.public_id) {
                return `/${image.public_id}`;
            }
        }
        return '/default.png';
    };

    const getVideoUrl = () => {
        if (product.video?.url) {
            if (product.video.url.startsWith('http') || product.video.url.startsWith('/')) {
                return product.video.url;
            }
            return `/${product.video.url.replace(/\\/g, '/')}`;
        }
        return product.video_url || '';
    };

    const getEmbedUrl = (url) => {
        if (!url) return '';
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
            return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0` : url;
        }
        if (url.includes('vimeo.com')) {
            const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
            return videoId ? `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1&background=1` : url;
        }
        return url;
    };

    const isYouTubeOrVimeo = product.video_url && (product.video_url.includes('youtube') || product.video_url.includes('youtu.be') || product.video_url.includes('vimeo'));

    useEffect(() => {
        if (videoRef.current && (product.media_type === "videoFile" || product.media_type === "videoUrl")) {
            videoRef.current.play().catch(() => { });
        }
    }, [product.media_type]);

    if (product.media_type === "images" && product.images && product.images.length > 0 && !imageError) {
        return (
            <>
                <img
                    draggable="false"
                    className={`w-full h-full object-contain ${product.stock === 0 ? 'opacity-50' : ''}`}
                    src={getImageUrl()}
                    alt={product.name || 'Product'}
                    onError={() => setImageError(true)}
                    loading="lazy"
                />
                {product.stock === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-2 py-1 rounded-md font-bold text-[10px] shadow-lg">SOLD OUT</span>
                    </div>
                )}
            </>
        );
    }

    if (product.media_type === "videoUrl" && product.video_url && isYouTubeOrVimeo) {
        return (
            <div className="relative w-full h-full">
                <iframe
                    ref={iframeRef}
                    src={getEmbedUrl(product.video_url)}
                    className="absolute top-0 left-0 w-full h-full border-0"
                    title={product.name}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                />
                <div className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white p-1 rounded-full z-10">
                    <VideoLibraryIcon sx={{ fontSize: "10px" }} />
                </div>
            </div>
        );
    }

    if ((product.media_type === "videoUrl" || product.media_type === "videoFile") && !videoError) {
        return (
            <div className="relative w-full h-full">
                <video
                    ref={videoRef}
                    className="w-full h-full object-contain"
                    muted
                    playsInline
                    loop
                    autoPlay
                    onError={() => setVideoError(true)}
                >
                    <source src={getVideoUrl()} type="video/mp4" />
                </video>
                <div className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white p-1 rounded-full z-10">
                    <VideoLibraryIcon sx={{ fontSize: "10px" }} />
                </div>
            </div>
        );
    }

    if (product.media_type === "both" && product.images && product.images.length > 0) {
        return (
            <div className="relative w-full h-full">
                {!imageError ? (
                    <>
                        <img
                            draggable="false"
                            className={`w-full h-full object-contain ${product.stock === 0 ? 'opacity-50' : ''}`}
                            src={getImageUrl()}
                            alt={product.name || 'Product'}
                            onError={() => setImageError(true)}
                            loading="lazy"
                        />
                        {product.stock === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="bg-red-600 text-white px-2 py-1 rounded-md font-bold text-[10px] shadow-lg">SOLD OUT</span>
                            </div>
                        )}
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white p-1 rounded-full z-10">
                            <VideoLibraryIcon sx={{ fontSize: "10px" }} />
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span className="text-[10px] text-gray-500">No preview</span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span className="text-[10px] text-gray-500">No preview</span>
        </div>
    );
};

const DiscountCircleCards = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [scrollPosition, setScrollPosition] = useState(0);

    const { products, error } = useSelector(state => state.products);

    useEffect(() => {
        dispatch(getProducts("", "", [0, 50000000], 0, 1));
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
    }, [dispatch, error, enqueueSnackbar]);

    const discountProducts = products?.filter(product => product.discount > 0) || [];

    useEffect(() => {
        if (discountProducts.length === 0) return;

        const interval = setInterval(() => {
            setScrollPosition(prev => {
                const itemWidth = 136;
                const totalWidth = itemWidth * discountProducts.length;
                return prev >= totalWidth ? 0 : prev + 1;
            });
        }, 30);

        return () => clearInterval(interval);
    }, [discountProducts.length]);

    if (discountProducts.length === 0) return null;

    return (
        <div className="overflow-hidden mt-2.5">
            <div
                className="flex gap-4 sm:gap-6 px-4"
                style={{
                    transform: `translateX(-${scrollPosition}px)`,
                }}
            >
                {[...discountProducts, ...discountProducts].map((product, index) => (
                    <Link
                        key={`${product._id}-${index}`}
                        to={`/product/${product._id}`}
                        className="flex flex-col items-center group flex-shrink-0"
                    >
                        <div className="relative">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-50 rounded-lg overflow-hidden p-2 group-hover:scale-110 transition-transform duration-300">
                                <ProductMedia product={product} />
                            </div>
                            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-dental-600 to-dental-400 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-0.5">
                                <span>{product.discount}%</span>
                                <span>OFF</span>
                            </div>
                        </div>

                        <p className="text-sm text-center mt-1 max-w-24 sm:max-w-28 text-gray-700 group-hover:text-dental-600 transition-colors duration-300">

                            {product.name.length > 12 ? `${product.name.substring(0, 12)}...` : product.name}
                        </p>

                        <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-sm font-bold text-gray-900">
                                ₹{(() => {
                                    if (product.gst && product.gst > 0) {
                                        return (product.price + (product.price * product.gst / 100)).toLocaleString();
                                    }
                                    return product.price ? product.price.toLocaleString() : '0';
                                })()}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default DiscountCircleCards;
