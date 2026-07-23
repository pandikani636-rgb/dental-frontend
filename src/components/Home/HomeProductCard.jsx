import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../actions/wishlistAction';
import { addItemsToCart } from '../../actions/cartAction';
import { useSnackbar } from 'notistack';
import Swal from 'sweetalert2';
import { useState, useEffect, useRef } from 'react';
import { backendUrl } from '../../utils/config';

const HomeProductCard = ({
  _id,
  name,
  images,
  video,
  video_url,
  media_type,
  seller,
  ratings,
  numOfReviews,
  price,
  gst,
  cuttedPrice,
  stock,
  discount,
  delivery_charge
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const videoRef = useRef(null);
  const iframeRef = useRef(null);

  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.user);
  const itemInWishlist = wishlistItems.some((i) => i.product === _id);

  // Calculate final price with GST
  const calculatePriceWithGST = () => {
    if (gst && gst > 0) {
      return price + (price * gst / 100);
    }
    return price;
  };

  const finalPrice = calculatePriceWithGST();

  // Get the correct image URL - always use first image
  const getImageUrl = () => {
    if (images && images.length > 0 && images[0]) {
      const image = images[0];
      // Check if it's already a full URL
      if (image.url && image.url.startsWith('http')) {
        return image.url;
      }
      // Handle relative paths
      if (image.url && image.url.includes('uploads')) {
        return `${backendUrl}/${image.url.replace(/\\/g, '/').replace(/^\//, '')}`;
      }
      // Fallback to public_id if available
      if (image.public_id) {
        return `/${image.public_id}`;
      }
    }
    return '/default.png';
  };

  // Get video URL
  const getVideoUrl = () => {
    if (video?.url) {
      if (video.url.startsWith('http') || video.url.startsWith('/')) {
        return video.url;
      }
      return `/${video.url.replace(/\\/g, '/')}`;
    }
    return video_url || '';
  };

  // Get media URL for the main display
  const getMediaUrl = () => {
    // If media_type is "images" or we should show image for "both"
    if (media_type === "images" || (media_type === "both" && images && images.length > 0)) {
      return getImageUrl();
    }
    
    // If media_type is "videoFile" or "videoUrl"
    if (media_type === "videoFile" || media_type === "videoUrl") {
      return getVideoUrl();
    }
    
    return '/default.png';
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

  const isYouTubeOrVimeo = video_url && (video_url.includes('youtube') || video_url.includes('youtu.be') || video_url.includes('vimeo'));

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
  };

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
    
    const buyNowItem = {
      product: _id,
      name: name,
      seller: seller,
      price: price,
      gst: gst,
      cuttedPrice: cuttedPrice,
      image: getMediaUrl(),
      stock: stock,
      quantity: 1,
      discount: discount || 0,
      delivery_charge: delivery_charge || 0
    };
    localStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
    navigate('/shipping');
  };

  const toggleWishlist = () => {
    if (itemInWishlist) {
      dispatch(removeFromWishlist(_id));
      enqueueSnackbar("Remove From Wishlist", { variant: "success" });
    } else {
      dispatch(addToWishlist(_id));
      enqueueSnackbar("Added To Wishlist", { variant: "success" });
    }
  };

  useEffect(() => {
    if (videoRef.current && (media_type === "videoFile" || media_type === "videoUrl")) {
      videoRef.current.play().catch(() => {});
    }
  }, [media_type]);

  return (
    <div className="flex flex-col relative hover:shadow-lg rounded-lg border border-gray-200 bg-white transition-all duration-300 h-[280px] sm:h-[320px] p-3 sm:p-4">
      {/* Discount badge - updated to match ProductCard */}
      {discount > 0 && (
        <div className="absolute top-1 left-1 bg-gradient-to-r from-green-600 to-blue-400 text-white px-2 py-0.5 rounded-full text-xs font-bold z-10 shadow-lg">
          {discount}% OFF
        </div>
      )}
      
      <Link to={`/product/${_id}`} className="flex flex-col items-center text-center group w-full">
        <div className="w-32 h-32 sm:w-40 sm:h-40 mb-2 sm:mb-3 relative bg-gray-50 rounded-lg overflow-hidden p-2">
          {media_type === "images" && images && images.length > 0 && !imageError ? (
            <>
              <img
                draggable="false"
                className={`w-full h-full object-contain ${stock === 0 ? 'opacity-50' : ''}`}
                src={getImageUrl()}
                alt={name || 'Product'}
                onError={() => setImageError(true)}
                loading="lazy"
              />
              {stock === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-red-600 text-white px-3 py-1 rounded-md font-bold text-xs shadow-lg">SOLD OUT</span>
                </div>
              )}
            </>
          ) : media_type === "videoUrl" && video_url && isYouTubeOrVimeo ? (
            <div className="relative w-full h-full">
              <iframe
                ref={iframeRef}
                src={getEmbedUrl(video_url)}
                className="absolute top-0 left-0 w-full h-full border-0"
                title={name}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
              <div className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white p-1 rounded-full z-10">
                <VideoLibraryIcon sx={{ fontSize: "10px" }} />
              </div>
            </div>
          ) : (media_type === "videoUrl" || media_type === "videoFile") && !videoError ? (
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
          ) : media_type === "both" && images && images.length > 0 ? (
            <div className="relative w-full h-full">
              {!imageError ? (
                <>
                  <img
                    draggable="false"
                    className={`w-full h-full object-contain ${stock === 0 ? 'opacity-50' : ''}`}
                    src={getImageUrl()}
                    alt={name || 'Product'}
                    onError={() => setImageError(true)}
                    loading="lazy"
                  />
                  {stock === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-red-600 text-white px-3 py-1 rounded-md font-bold text-xs shadow-lg">SOLD OUT</span>
                    </div>
                  )}
                  {/* Video indicator for "both" type */}
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
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span className="text-[10px] text-gray-500">No preview</span>
            </div>
          )}
        </div>
        <h2 className="text-xs sm:text-sm group-hover:text-primary-blue text-center font-medium px-1 w-full whitespace-nowrap overflow-hidden text-ellipsis">
          {name}
        </h2>
      </Link>

      <div className="flex flex-col gap-1 items-center w-full flex-grow">
        <div className="flex items-center gap-1 text-sm font-medium justify-center w-full">
          <span className="text-sm sm:text-base font-bold">₹{finalPrice?.toLocaleString() || '0'}</span>
        </div>

        {stock > 0 && stock <= 5 && (
          <div className="w-full text-center font-medium text-xs text-orange-600">
            Only {stock} left!
          </div>
        )}
        {stock === 0 && (
          <div className="w-full text-center font-medium text-xs text-red-600">
            Out of Stock
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 w-full mt-auto">
        <button
          onClick={addToCartHandler}
          disabled={stock < 1}
          className={`w-full py-1.5 px-2 rounded-md font-medium transition-all duration-300 flex items-center justify-center gap-1 text-xs h-8 ${
            stock < 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' : 'bg-gradient-to-r from-green-600 to-blue-400 text-white hover:from-green-700 hover:to-blue-500 hover:shadow-lg'
          }`}
        >
          <ShoppingCartIcon sx={{ fontSize: "12px" }} />
          <span>ADD TO CART</span>
        </button>

        <button
          onClick={buyNowHandler}
          disabled={stock < 1}
          className={`w-full py-1.5 px-2 rounded-md font-medium transition-all duration-300 flex items-center justify-center gap-1 text-xs h-8 ${
            stock < 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-105'
          }`}
        >
          <FlashOnIcon sx={{ fontSize: "12px" }} className="animate-pulse" />
          <span>BUY NOW</span>
        </button>
      </div>

      <span 
        onClick={toggleWishlist} 
        className={`${itemInWishlist ? "text-red-500" : "hover:text-red-500 text-gray-300"} absolute top-2 right-2 cursor-pointer transition-colors duration-300 p-1`}
      >
        <FavoriteIcon sx={{ fontSize: "14px" }} />
      </span>
    </div>
  );
};

export default HomeProductCard;