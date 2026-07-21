import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import {
    Card,
    CardContent,
    TextField,
    MenuItem,
    Button,
    Box,
    Grid,
    Typography,
    Divider,
    IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MetaData from '../Layouts/MetaData';
import Swal from 'sweetalert2';
import Loader from '../Layouts/Loader';
import { getOrderDetails, updateOrder, clearErrors } from '../../actions/orderAction';
import { getOrderStatuses } from '../../actions/orderStatusAction';
import { UPDATE_ORDER_RESET } from '../../constants/orderConstants';

const UpdateOrder = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { id } = useParams();

    const { error, order, loading } = useSelector((state) => state.orderDetails);
    const { error: updateError, isUpdated, loading: updateLoading } = useSelector((state) => state.order);
    const { orderStatuses } = useSelector((state) => state.orderStatuses);

    const [status, setStatus] = useState("");
    const [landmark, setLandmark] = useState("");

    useEffect(() => {
        if (id) {
            dispatch(getOrderDetails(id));
        }
        if (orderStatuses && orderStatuses.length === 0) {
            dispatch(getOrderStatuses());
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (order && order._id === id) {
            setStatus(order.orderStatus);
            setLandmark(order.shippingInfo.landmark || "");
        }

        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }

        if (updateError) {
            enqueueSnackbar(updateError, { variant: "error" });
            dispatch(clearErrors());
        }

        if (isUpdated) {
            Swal.fire({
                title: "Success!",
                text: "Order Updated Successfully!",
                icon: "success",
                timer: 2000,
            });
            dispatch({ type: UPDATE_ORDER_RESET });
            navigate("/admin/orders");
        }
    }, [dispatch, error, id, isUpdated, order, updateError, enqueueSnackbar, navigate, orderStatuses]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!status) {
            enqueueSnackbar("Please select a status", { variant: "error" });
            return;
        }

        dispatch(updateOrder(id, { status, landmark }));
    };

    if (loading) return <Loader />;
    if (!order || order._id !== id) return <div className="p-10 text-center">Order not found</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <MetaData title={`Update Order - Admin`} />

            <Box className="flex items-center gap-4 mb-6">
                <IconButton onClick={() => navigate('/admin/orders')} size="small">
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5" component="h1" fontWeight="bold">Update Order Status</Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Order Information Card */}
                <Grid item xs={12} md={8}>
                    <Card className="shadow-lg border-0">
                        <CardContent className="p-6">
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>Order ID: {order._id}</Typography>
                                <Typography variant="h6" sx={{
                                    px: 2, py: 0.5, borderRadius: 5,
                                    bgcolor: order.orderStatus === "Delivered" ? "success.light" : "warning.light",
                                    color: order.orderStatus === "Delivered" ? "success.dark" : "warning.dark",
                                    fontSize: '0.9rem', fontWeight: 'bold'
                                }}>
                                    {order.orderStatus}
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 3 }} />

                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold', mb: 1 }}>CUSTOMER DETAILS</Typography>
                                    <Typography variant="body1"><strong>Name:</strong> {order.user && order.user.name}</Typography>
                                    <Typography variant="body1"><strong>Email:</strong> {order.user && order.user.email}</Typography>
                                    <Typography variant="body1"><strong>Phone:</strong> {order.shippingInfo.phoneNo}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold', mb: 1 }}>SHIPPING ADDRESS</Typography>
                                    <Typography variant="body1" sx={{ mt: 1 }}>
                                        <strong>Address:</strong> {order.shippingInfo.address}<br />
                                        <strong>Landmark:</strong> {order.shippingInfo.landmark || <span style={{ color: 'red', fontStyle: 'italic' }}>Not Provided</span>}<br />
                                        <strong>Location:</strong> {`${order.shippingInfo.city}, ${order.shippingInfo.district || ''}, ${order.shippingInfo.state} - ${order.shippingInfo.pincode}`}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold', mt: 4, mb: 2 }}>ORDERED ITEMS</Typography>
                            <Box className="space-y-4">
                                {order.orderItems.map((item, index) => (
                                    <Box key={index} className="flex items-center gap-4 p-3 border rounded-lg bg-white hover:shadow-sm">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-contain rounded" />
                                        <div className="flex-1">
                                            <Typography variant="body2" className="font-semibold">{item.name}</Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {item.quantity} x ₹{(item.price +(item.price * item.gst / 100)).toLocaleString()} = <b>₹{(item.quantity * (item.price + (item.price * item.gst / 100))).toLocaleString()}</b>
                                            </Typography>
                                        </div>
                                    </Box>
                                ))}
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                                    <Typography variant="h6" className="font-bold">Total: ₹{order.totalPrice.toLocaleString()}</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Status Update Section */}
                <Grid item xs={12} md={4}>
                    <Card className="shadow-lg border-0">
                        <CardContent className="p-6">
                            <Typography variant="h6" className="font-bold mb-6">Update Status</Typography>
                            <Divider className="mb-6" />

                            <form onSubmit={handleSubmit} className="space-y-6 mt-5">
                                <TextField
                                    select
                                    fullWidth
                                    label="Order Status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    disabled={order.orderStatus === "Delivered" || order.orderStatus === "Cancelled"}
                                >
                                    {orderStatuses && orderStatuses.length > 0 ? (
                                        orderStatuses
                                            .filter((os) => order.orderStatus === 'Shipped' ? !['Processing', 'Cancelled'].includes(os.name) : true)
                                            .map((os) => (
                                                <MenuItem key={os._id} value={os.name}>{os.name}</MenuItem>
                                            ))
                                    ) : (
                                        [
                                            <MenuItem key="Processing" value="Processing" sx={{ display: order.orderStatus === 'Shipped' ? 'none' : 'flex' }}>Processing</MenuItem>,
                                            <MenuItem key="Shipped" value="Shipped">Shipped</MenuItem>,
                                            <MenuItem key="Delivered" value="Delivered">Delivered</MenuItem>,
                                            <MenuItem key="Cancelled" value="Cancelled" sx={{ display: order.orderStatus === 'Shipped' ? 'none' : 'flex' }}>Cancelled</MenuItem>
                                        ]
                                    )}
                                </TextField>

                                <TextField
                                    fullWidth
                                    label="Update Landmark"
                                    placeholder="Add landmark details"
                                    value={landmark}
                                    onChange={(e) => setLandmark(e.target.value)}
                                    variant="outlined"
                                    className="mt-4"
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    disabled={updateLoading || order.orderStatus === "Delivered" || order.orderStatus === "Cancelled"}
                                    className="py-3 font-bold"
                                >
                                    {updateLoading ? 'UPDATING...' : 'UPDATE STATUS'}
                                </Button>

                                {(order.orderStatus === "Delivered" || order.orderStatus === "Cancelled") && (
                                    <Typography variant="caption" color={order.orderStatus === "Delivered" ? "success.main" : "error.main"} textAlign="center" display="block" className="mt-2 italic">
                                        {order.orderStatus === "Delivered" ? "This order has been delivered and is now locked." : "This order has been cancelled and is now locked."}
                                    </Typography>
                                )}
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default UpdateOrder;
