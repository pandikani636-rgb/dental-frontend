import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { clearErrors, getProducts } from '../../actions/productAction';
import { getCategories } from '../../actions/categoryAction';
import { addToWishlist, removeFromWishlist } from '../../actions/wishlistAction';
import { addItemsToCart } from '../../actions/cartAction';
import Loader from '../Layouts/Loader';
import Pagination from '@mui/material/Pagination';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { useSnackbar } from 'notistack';
import MetaData from '../Layouts/MetaData';
import Swal from 'sweetalert2';
import { Height } from '@mui/icons-material';

const ProductCard = ({ _id, name, images, video, video_url, media_type, seller, ratings, numOfReviews, price, cuttedPrice, stock, discount, delivery_charge, gst }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const videoRef = useRef(null);
  const iframeRef = useRef(null);
  const { isAuthenticated } = useSelector((state) => state.user);

  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const itemInWishlist = wishlistItems.some((i) => i.product === _id);

  // Get the correct image URL - always use first image
  const getImageUrl = () => {
    if (images && images.length > 0 && images[0]) {
      const image = images[0];
      // Check if it's already a full URL
      if (image.url && (image.url.startsWith('http') || image.url.startsWith('/'))) {
        return image.url;
      }
      // Handle relative paths
      if (image.url && image.url.includes('uploads')) {
        return `/${image.url.replace(/\\/g, '/')}`;
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
    if (!isAuthenticated) return navigate('/login');
    if (stock < 1) return enqueueSnackbar("Product Out of Stock", { variant: "error" });
    dispatch(addItemsToCart(_id, 1));
    Swal.fire({ title: "Success!", text: "Product added to cart!", icon: "success", timer: 1500 , showConfirmButton: false });
  };

  const buyNowHandler = () => {
    if (stock < 1) return enqueueSnackbar("Product Out of Stock", { variant: "error" });
    localStorage.setItem('buyNowItem', JSON.stringify({
      product: _id, 
      name, 
      seller, 
      price, 
      gst,
      cuttedPrice, 
      stock, 
      quantity: 1,
      image: getMediaUrl(), 
      discount: discount || 0, 
      delivery_charge: delivery_charge || 0
    }));
    navigate('/shipping');
  };

  const toggleWishlist = () => {
    dispatch(itemInWishlist ? removeFromWishlist(_id) : addToWishlist(_id));
    enqueueSnackbar(itemInWishlist ? "Removed From Wishlist" : "Added To Wishlist", { variant: "success" });
  };

  useEffect(() => {
    if (videoRef.current && (media_type === "videoFile" || media_type === "videoUrl")) {
      videoRef.current.play().catch(() => {});
    }
  }, [media_type]);

  return (
    <div className="flex flex-col relative hover:shadow-lg rounded-lg border border-gray-200 bg-white transition-all duration-300 h-[280px] sm:h-[320px] p-3 sm:p-4" style={{height:'340px'}}>
      {/* Discount badge - updated to match image */}
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
          <span className="text-sm sm:text-base font-bold">₹{(price + (price * gst / 100)).toLocaleString() || '0'}</span>
          {cuttedPrice && cuttedPrice > price && (
            <span className="text-xs text-gray-500 line-through">₹{cuttedPrice.toLocaleString()}</span>
          )}
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

const Products = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const location = useLocation();

  const [price, setPrice] = useState([0, 50000000]);
  const [category, setCategory] = useState(location.search ? decodeURIComponent(location.search.split("=")[1]) : "");
  const [subCategory, setSubCategory] = useState("");
  const [expandedCategory, setExpandedCategory] = useState("");
  const [ratings, setRatings] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryToggle, setCategoryToggle] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [onMobile, setOnMobile] = useState(window.innerWidth < 768);

  const { products, loading, error, resultPerPage, filteredProductsCount } = useSelector(state => state.products);
  const { categories: adminCategories } = useSelector(state => state.categories);
  const keyword = params.keyword;

  const clearFilters = () => {
    setPrice([0, 50000000]);
    setCategory("");
    setSubCategory("");
    setExpandedCategory("");
    setRatings(0);
    setMobileFiltersOpen(false);
  };

  const handleCategoryClick = (catName) => {
    if (category === catName) {
      setCategory("");
      setSubCategory("");
      setExpandedCategory("");
    } else {
      setCategory(catName);
      setSubCategory("");
      setExpandedCategory(catName);
    }
  };

  useEffect(() => {
    const checkMobile = () => setOnMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    dispatch(getProducts(keyword, category, price, ratings, currentPage, subCategory));
  }, [dispatch, keyword, category, subCategory, price, ratings, currentPage, error, enqueueSnackbar]);

  return (
    <>
      <MetaData title="All Medicines | MedStore" />

      <div className="px-8 sm:px-8" style={{paddingTop: '70px', marginLeft: onMobile ? '0px' : '300px'}}>
        <div className="flex justify-between items-center justify-end">
          <button onClick={() => dispatch(getProducts(keyword, category, price, ratings, currentPage, subCategory))} className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
            Refresh Products
          </button>
        </div>
      </div>

      <main className="w-full sm:mt-16 pb-6 bg-gradient-to-br from-green-50 via-white to-blue-50 mb-10" style={{marginTop: '10px'}}>
        <div className="sm:hidden px-4 mb-4">
          <button className="w-full bg-white border border-gray-300 rounded-lg p-3 flex items-center justify-between" onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}>
            <span className="font-medium">Filters</span>
            <span className="text-sm text-gray-500">({(category ? 1 : 0) + (ratings > 0 ? 1 : 0)} active)</span>
          </button>
        </div>

        {mobileFiltersOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 sm:hidden">
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">✕</button>
              </div>
              <div className="p-4 space-y-6">
                <div>
                  <h4 className="font-medium mb-2">CATEGORY</h4>
                  <div className="space-y-1">
                    {adminCategories?.map((el, i) => (
                      <div key={i}>
                        <div
                          className={`flex items-center justify-between cursor-pointer px-2 py-1 rounded hover:bg-gray-100 ${category === el.name ? 'text-blue-600 font-semibold' : ''}`}
                          onClick={() => handleCategoryClick(el.name)}
                        >
                          <span className="text-sm">{el.name}</span>
                          {el.subCategories?.length > 0 && (
                            <span className="text-gray-400 text-xs">{expandedCategory === el.name ? '▲' : '▼'}</span>
                          )}
                        </div>
                        {expandedCategory === el.name && el.subCategories?.length > 0 && (
                          <div className="ml-4 mt-1 space-y-1">
                            {el.subCategories.map((sub, j) => (
                              <div
                                key={j}
                                className={`text-sm cursor-pointer px-2 py-1 rounded hover:bg-blue-50 ${subCategory === sub ? 'text-blue-600 font-semibold bg-blue-50' : 'text-gray-600'}`}
                                onClick={() => setSubCategory(subCategory === sub ? "" : sub)}
                              >
                                • {sub}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={clearFilters} className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-400 hover:from-green-700 hover:to-blue-500 text-white rounded-lg font-medium transition-all duration-300">
                  Apply & Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 px-4 lg:px-8 items-stretch">
          <aside className="hidden lg:flex flex-col w-1/5">
            <div className="bg-white rounded-lg shadow p-4 space-y-6 h-full">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="font-semibold text-sm uppercase">Filters</h3>
                <button className="text-green-600 hover:text-blue-600 text-xs font-medium transition-colors duration-300" onClick={clearFilters}>Clear All</button>
              </div>
              <div>
                <div className="flex justify-between cursor-pointer py-2 items-center" onClick={() => setCategoryToggle(!categoryToggle)}>
                  <h4 className="font-medium text-xs uppercase">Category</h4>
                  {categoryToggle ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                </div>
                {categoryToggle && (
                  <div className="space-y-1">
                    {adminCategories?.map((el, i) => (
                      <div key={i}>
                        <div
                          className={`flex items-center justify-between cursor-pointer px-2 py-1 rounded hover:bg-gray-100 ${category === el.name ? 'text-blue-600 font-semibold' : ''}`}
                          onClick={() => handleCategoryClick(el.name)}
                        >
                          <span className="text-sm">{el.name}</span>
                          {el.subCategories?.length > 0 && (
                            <span className="text-gray-400 text-xs">{expandedCategory === el.name ? '▲' : '▼'}</span>
                          )}
                        </div>
                        {expandedCategory === el.name && el.subCategories?.length > 0 && (
                          <div className="ml-4 mt-1 space-y-1">
                            {el.subCategories.map((sub, j) => (
                              <div
                                key={j}
                                className={`text-sm cursor-pointer px-2 py-1 rounded hover:bg-blue-50 ${subCategory === sub ? 'text-blue-600 font-semibold bg-blue-50' : 'text-gray-600'}`}
                                onClick={() => setSubCategory(subCategory === sub ? "" : sub)}
                              >
                                • {sub}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>

          <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pl-4">
            {loading ? <Loader /> : products?.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center gap-4 p-6 bg-white rounded-lg shadow">
                <img draggable="false" className="w-1/2 h-32 object-contain" src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/error-no-search-results_2353c5.png" alt="No results" />
                <h1 className="font-semibold text-center text-gray-900">Sorry, no results found!</h1>
                <p className="text-center text-gray-500">Please check the spelling or try another medicine</p>
              </div>
            ) : (
              products.map((product) => <ProductCard key={product._id} {...product} />)
            )}

            {filteredProductsCount > resultPerPage && (
              <div className="col-span-full flex justify-center mt-4">
                <Pagination count={Math.ceil(filteredProductsCount / resultPerPage)} page={currentPage} onChange={(e, val) => setCurrentPage(val)} color="primary" size={onMobile ? "small" : "medium"} />
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default Products;
