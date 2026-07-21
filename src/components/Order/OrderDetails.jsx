import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { clearErrors, getOrderDetails } from '../../actions/orderAction';
import Loader from '../Layouts/Loader';
import TrackStepper from './TrackStepper';
import MetaData from '../Layouts/MetaData';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import axios from 'axios';

const OrderDetails = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();

    const { order, error, loading } = useSelector((state) => state.orderDetails);
    const { user } = useSelector((state) => state.user);
    
    const [openModal, setOpenModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
        dispatch(getOrderDetails(params.id));
    }, [dispatch, error, params.id, enqueueSnackbar]);

    const handleCancelOrder = async () => {
        if (!cancelReason.trim()) {
            enqueueSnackbar('Please provide a reason for cancellation', { variant: 'error' });
            return; 
        }

        setSubmitting(true);
        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            };

            const { data } = await axios.post('/api/v1/order/cancel', {
                orderId: params.id,
                productId: order.orderItems[0].product,
                reason: cancelReason
            }, config);

            if (data.success) {
                enqueueSnackbar('Cancel order request submitted successfully', { variant: 'success' });
                setOpenModal(false);
                setCancelReason('');
            }
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || 'Failed to submit cancel request', { variant: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-6 sm:pb-10">
            <MetaData title="Order Details | Sri Chakra India" />

            <main className="w-full max-w-6xl mx-auto pt-20 sm:pt-24 px-3 sm:px-4 md:px-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <button
                        onClick={() => navigate('/orders')}
                        className="flex items-center gap-2 text-gray-600 hover:text-primary-orange transition-colors font-medium bg-white px-3 sm:px-4 py-2 rounded-lg shadow-sm border border-gray-100 text-sm sm:text-base"
                    >
                        <ArrowBackIcon fontSize="small" />
                        {/* <span className="hidden sm:inline">Back to Orders</span> */}
                        <span className="sm:hidden">Back</span>
                    </button>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Order Details</h1>
                </div>
                {loading ? <Loader /> : (
                    <>
                        {order && order.user && order.shippingInfo && (
                            <div className="flex flex-col gap-3 sm:gap-4 max-w-6xl mx-auto">

                                <div className="flex flex-col lg:flex-row bg-white shadow rounded-sm min-w-full">
                                    <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r">
                                        <div className="flex flex-col gap-2 sm:gap-3 my-4 sm:my-6 md:my-8 mx-4 sm:mx-6 md:mx-10">
                                            <h3 className="font-medium text-base sm:text-lg">Delivery Address</h3>
                                            <h4 className="font-medium text-sm sm:text-base">{order.user.name}</h4>
                                            <div className="text-xs sm:text-sm space-y-1">
                                                <p><strong>Address:</strong> {order.shippingInfo.address}</p>
                                                <p><strong>Landmark:</strong> {order.shippingInfo.landmark || <span className="italic text-gray-400">Not Specified</span>}</p>
                                                <p><strong>Location:</strong> {`${order.shippingInfo.city}, ${order.shippingInfo.district || ''}, ${order.shippingInfo.state} - ${order.shippingInfo.pincode}`}</p>
                                            </div>
                                            <div className="flex gap-2 text-xs sm:text-sm">
                                                <p className="font-medium">Email</p>
                                                <p className="break-all">{order.user.email}</p>
                                            </div>
                                            <div className="flex gap-2 text-xs sm:text-sm">
                                                <p className="font-medium">Phone Number</p>
                                                <p>{order.shippingInfo.phoneNo}</p>
                                            </div>
                                            {order.orderStatus === "Shipped" || order.orderStatus === "Delivered" ? (
                                                <p className="mt-4 text-gray-600 italic text-sm">
                                                    Order is {order.orderStatus}, Cancel not available
                                                </p>
                                            ) : (
                                                <button
                                                    onClick={() => setOpenModal(true)}
                                                    className="mt-4 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition-colors"
                                                >
                                                    Cancel Order
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-1/2">
                                        <div className="flex flex-col gap-2 sm:gap-3 my-4 sm:my-6 md:my-8 mx-4 sm:mx-6 md:mx-10">
                                            <h3 className="font-medium text-base sm:text-lg mb-1 sm:mb-2">Order Items</h3>
                                            {order.orderItems && order.orderItems.map((item) => {
                                                const { _id, image, name, price, quantity, gst, delivery_charge, discount } = item;
                                                const basePrice = price * quantity;
                                                const gstAmount = basePrice * (gst || 0) / 100;
                                                const priceWithGst = basePrice + gstAmount;
                                                const discountAmount = priceWithGst * (quantity > 1 ? (discount || 0) : 0) / 100;
                                                const itemTotal = (priceWithGst - discountAmount) + delivery_charge;

                                                return (
                                                    <div className="flex flex-col sm:flex-row w-full gap-3 sm:gap-4 pb-3 sm:pb-4 border-b last:border-b-0" key={_id}>
                                                        <div className="w-full sm:w-20 md:w-24 h-16 sm:h-16 md:h-20 flex-shrink-0 mx-auto sm:mx-0">
                                                            <img draggable="false" className="h-full w-full object-contain" src={image} alt={name} />
                                                        </div>
                                                        <div className="flex flex-col gap-1 flex-grow overflow-hidden">
                                                            <p className="text-xs sm:text-sm font-medium line-clamp-2">{name}</p>
                                                            <div className="flex flex-col gap-1">
                                                                <div className="text-xs text-gray-500">
                                                                    <p>Quantity: {quantity}</p>
                                                                    <p>Price: ₹{priceWithGst.toLocaleString()}</p>
                                                                    {quantity > 1 && discount > 0 && <p>Discount ({discount}%): -₹{discountAmount.toLocaleString()}</p>}
                                                                    <p>Delivery: ₹{delivery_charge.toLocaleString()}</p>
                                                                </div>
                                                                <div className="text-xs sm:text-sm font-bold text-gray-800">
                                                                    Total: ₹{itemTotal.toLocaleString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Status Stepper - Shown ONCE for the entire order */}
                                <div className="flex flex-col min-w-full shadow rounded-sm bg-white px-2 sm:px-4 py-6 sm:py-8 relative">
                                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-primary-orange/10 px-2 sm:px-3 py-1 rounded-full border border-primary-orange">
                                        <p className="text-primary-orange text-xs sm:text-sm font-bold uppercase">{order.orderStatus}</p>
                                    </div>
                                    <h3 className="font-medium text-center text-base sm:text-lg mb-3 sm:mb-4">Tracking</h3>
                                    <TrackStepper
                                        orderOn={order.createdAt}
                                        shippedAt={order.shippedAt}
                                        deliveredAt={order.deliveredAt}
                                        activeStep={
                                            order.orderStatus === "Delivered" ? 2 : order.orderStatus === "Shipped" ? 1 : 0
                                        }
                                    />
                                </div>


                                {/* Order Summary Footer */}
                                {/* <div className="flex justify-end p-4 bg-white shadow rounded-sm">
                                    <div className="flex items-center gap-4">
                                        <span className="text-gray-600">Total Order Amount:</span>
                                        <span className="text-2xl font-bold text-primary-orange">₹{order.totalPrice.toLocaleString()}</span>
                                {/* Order Summary */}
                                <div className="bg-white shadow rounded-sm p-4 sm:p-6">
                                    <h3 className="font-medium text-base sm:text-lg mb-3">Order Summary</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Items Total:</span>
                                            <span>₹{(() => {
                                                return order.orderItems.reduce((total, item) => {
                                                    const basePrice = item.price * item.quantity;
                                                    const gstAmount = basePrice * (item.gst || 0) / 100;
                                                    const priceWithGst = basePrice + gstAmount;
                                                    const discountAmount = priceWithGst * (item.quantity > 1 ? (item.discount || 0) : 0) / 100;
                                                    return total + (priceWithGst - discountAmount) + item.delivery_charge;
                                                }, 0).toLocaleString();
                                            })()}</span>
                                        </div>
                                        <div className="border-t pt-2 flex justify-between items-center">
                                            <span className="font-semibold text-base sm:text-lg">Total Amount:</span>
                                            <span className="text-xl sm:text-2xl font-bold text-primary-orange">₹{(() => {
                                                const itemsTotal = order.orderItems.reduce((total, item) => {
                                                    const basePrice = item.price * item.quantity;
                                                    const gstAmount = basePrice * (item.gst || 0) / 100;
                                                    const priceWithGst = basePrice + gstAmount;
                                                    const discountAmount = priceWithGst * (item.quantity > 1 ? (item.discount || 0) : 0) / 100;
                                                    return total + (priceWithGst - discountAmount) + item.delivery_charge;
                                                }, 0);
                                                return (itemsTotal + (order.shippingPrice || 0)).toLocaleString();
                                            })()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Cancel Order Modal */}
                <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Cancel Order</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Reason for Cancellation"
                            multiline
                            rows={4}
                            variant="outlined"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            required
                            sx={{ mt: 2 }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenModal(false)} disabled={submitting}>
                            Close
                        </Button>
                        <Button 
                            onClick={handleCancelOrder} 
                            variant="contained" 
                            color="error"
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </main>
        </div>
    );
};

export default OrderDetails;
