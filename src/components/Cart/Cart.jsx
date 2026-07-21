import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import MetaData from '../Layouts/MetaData';
import CartItem from './CartItem';
import EmptyCart from './EmptyCart';
import PriceSidebar from './PriceSidebar';
import SaveForLaterItem from './SaveForLaterItem';

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems } = useSelector((state) => state.cart);
    const { saveForLaterItems } = useSelector((state) => state.saveForLater);
    const [validationErrors, setValidationErrors] = useState({});
    const { enqueueSnackbar } = useSnackbar();

    const handleValidationChange = (productId, error) => {
        setValidationErrors(prev => ({
            ...prev,
            [productId]: error
        }));
    };

    const hasValidationErrors = () => {
        return Object.values(validationErrors).some(error => error !== '');
    };

    const placeOrderHandler = () => {
        if (hasValidationErrors()) {
            enqueueSnackbar('Please fix quantity errors before placing order', { variant: 'error' });
            return;
        }
        navigate('/shipping');
    };

    const continueShoppingHandler = () => {
        navigate('/products');
    };

    return (
        <>
            <MetaData title="Medicine Cart | MedStore" />
            <main className="min-h-screen bg-gray-50 pt-20 sm:pt-24 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back to Home Link */}
                    {/* <div className="mb-4">
                        <Link 
                            to="/" 
                            className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-medium"
                        >
                            &lt;&lt; Back to Home
                        </Link>
                    </div> */}
                    
                    {/* Page Header */}
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
                        <p className="text-sm sm:text-base text-gray-600">Review your items and proceed to checkout</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                        {/* Left Column - Cart Items */}
                        <div className="flex-1">
                            {/* Cart Items Card */}
                            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4 sm:mb-6">
                                <div className="px-4 sm:px-6 py-3 sm:py-4" style={{backgroundColor: '#D6F4ED'}}>
                                    <h2 className="font-semibold text-lg sm:text-xl text-gray-800 flex items-center gap-2 sm:gap-3">
                                        
                                        My Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                                    </h2>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {cartItems.length === 0 ? (
                                        <EmptyCart />
                                    ) : (
                                        cartItems.map((item) => (
                                            <CartItem {...item} inCart={true} key={item.product} onValidationChange={handleValidationChange} />
                                        ))
                                    )}
                                </div>

                                {/* Action Buttons */}
                                {cartItems.length > 0 && (
                                    <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-200">
                                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                            <button 
                                                onClick={placeOrderHandler}
                                                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold text-base sm:text-lg shadow-md hover:shadow-lg transition-all duration-200 text-center"
                                            >
                                                Place Order
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Saved For Later Section */}
                            {saveForLaterItems.length > 0 && (
                                <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 sm:px-6 py-3 sm:py-4">
                                        <h2 className="font-semibold text-lg sm:text-xl text-white flex items-center gap-2 sm:gap-3">
                                            <span className="text-2xl">💾</span>
                                            Saved For Later ({saveForLaterItems.length} {saveForLaterItems.length === 1 ? 'item' : 'items'})
                                        </h2>
                                    </div>
                                    
                                    <div className="divide-y divide-gray-100">
                                        {saveForLaterItems.map((item) => (
                                            <SaveForLaterItem {...item} key={item.product} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Price Sidebar */}
                        {cartItems.length > 0 && (
                            <div className="w-full lg:w-96">
                                <PriceSidebar cartItems={cartItems} />
                            </div>
                        )}
                    </div>

                    {/* Continue Shopping Button for Empty Cart */}
                    {cartItems.length === 0 && (
                        <div className="text-center mt-6 sm:mt-8">
                            <button 
                                onClick={continueShoppingHandler}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 sm:px-8 rounded-lg font-semibold text-base sm:text-lg transition-colors duration-200"
                            >
                                ← Continue Shopping
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default Cart;