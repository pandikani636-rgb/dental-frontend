import { getDiscount } from '../../../utils/functions';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../../actions/wishlistAction';
import { addItemsToCart } from '../../../actions/cartAction';
import { useSnackbar } from 'notistack';

const backendUrl = process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL.replace(/\/$/, '') : 'https://dental-backend-ten.vercel.app';

const Product = (props) => {

    const { _id, name, images, ratings, numOfReviews, price, cuttedPrice, stock, gst } = props;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const { wishlistItems } = useSelector((state) => state.wishlist);
    const { isAuthenticated } = useSelector((state) => state.user);

    const itemInWishlist = wishlistItems.some((i) => i.product === _id);

    const addToWishlistHandler = () => {
        if (itemInWishlist) {
            dispatch(removeFromWishlist(_id));
            enqueueSnackbar("Remove From Wishlist", { variant: "success" });
        } else {
            dispatch(addToWishlist({ product: _id, name, price, images, stock }));
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
        enqueueSnackbar("Product Added To Cart", { variant: "success" });
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
        dispatch(addItemsToCart(_id, 1));
        navigate('/cart');
    }

    return (
        <div className="flex flex-col items-center gap-3 px-3 py-3 relative bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 mx-2">
            {/* <!-- image & product title --> */}
            <Link to={`/product/${_id}`} className="flex flex-col items-center text-center group">
                <div className="w-36 h-36 mb-2">
                    <img 
                        draggable="false" 
                        className="w-full h-full object-contain" 
                        src={images && images.length > 0 && images[0] && images[0].url 
                            ? (images[0].url.startsWith('http') ? images[0].url : `${backendUrl}/admin/product/${images[0].url}`) 
                            : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect width="150" height="150" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E'
                        } 
                        alt={name} 
                        onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect width="150" height="150" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E';
                            e.target.onerror = null;
                        }}
                    />
                </div>
                <h2 className="text-sm group-hover:text-primary-blue font-medium leading-tight">{name.length > 40 ? `${name.substring(0, 40)}...` : name}</h2>
            </Link>
            {/* <!-- image & product title --> */}

            {/* <!-- product description --> */}
            <div className="flex flex-col gap-2 items-center w-full">
                {/* <!-- rating badge --> */}
                {/* <span className="text-sm text-gray-500 font-medium flex gap-2 items-center">
                    <span className="text-xs px-1.5 py-0.5 bg-primary-green rounded-sm text-white flex items-center gap-0.5">{ratings.toFixed(1)} <StarIcon sx={{ fontSize: "14px" }} /></span>
                    <span>({numOfReviews.toLocaleString()})</span>
                </span> */}
                {/* <!-- rating badge --> */}

                {/* <!-- price container --> */}
                <div className="flex items-center gap-1.5 text-md font-medium">
                    <span className="font-bold">₹{(price + (price * gst / 100)).toLocaleString()}</span>
                </div>
                {/* <!-- price container --> */}

                {/* <!-- action buttons --> */}
                <div className="flex flex-col gap-2 w-full mt-2">
                    <button
                        onClick={addToCartHandler}
                        disabled={stock < 1}
                        className={`w-full py-2 px-3 rounded-md font-medium text-xs transition-all duration-300 flex items-center justify-center gap-1 ${stock < 1
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-green-600 to-blue-400 hover:from-green-700 hover:to-blue-500 text-white hover:shadow-md hover:scale-105'
                            }`}
                    >
                        <ShoppingCartIcon sx={{ fontSize: "14px" }} />
                        ADD TO CART
                    </button>

                    <button
                        onClick={buyNowHandler}
                        disabled={stock < 1}
                        className={`w-full py-2 px-3 rounded-md font-medium text-xs transition-all duration-300 flex items-center justify-center gap-1 ${stock < 1
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-md'
                            }`}
                    >
                        <FlashOnIcon sx={{ fontSize: "14px" }} />
                        BUY NOW
                    </button>
                </div>
                {/* <!-- action buttons --> */}
            </div>
            {/* <!-- product description --> */}

            {/* <!-- wishlist badge --> */}
            <span onClick={addToWishlistHandler} className={`${itemInWishlist ? "text-red-500" : "hover:text-red-500 text-gray-300"} absolute top-3 right-3 cursor-pointer transition-colors duration-300`}><FavoriteIcon sx={{ fontSize: "16px" }} /></span>
            {/* <!-- wishlist badge --> */}

        </div>
    );
};

export default Product;
