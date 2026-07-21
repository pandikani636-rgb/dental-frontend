import { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Card,
    CardContent,
    Typography,
    TablePagination,
    TextField,
    InputAdornment,
    Grid,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    Divider
} from '@mui/material';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import MetaData from '../Layouts/MetaData';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders, clearErrors, deleteOrder } from '../../actions/orderAction';
import { DELETE_ORDER_RESET } from '../../constants/orderConstants';

const OrderTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { error, orders, loading } = useSelector((state) => state.allOrders);
    const { error: deleteError, isDeleted } = useSelector((state) => state.order);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewOrder, setViewOrder] = useState(null);

    const searchParams = new URLSearchParams(location.search);
    const statusFilter = searchParams.get('status');

    useEffect(() => {
        if (error) {
            Swal.fire('Error', error, 'error');
            dispatch(clearErrors());
        }

        if (deleteError) {
            Swal.fire('Error', deleteError, 'error');
            dispatch(clearErrors());
        }

        if (isDeleted) {
            Swal.fire('Success', 'Order Deleted Successfully', 'success');
            navigate('/admin/orders');
            dispatch({ type: DELETE_ORDER_RESET });
        }

        dispatch(getAllOrders());

    }, [dispatch, error, deleteError, isDeleted, navigate]);

    // Filter orders based on search term and status filter
    const displayOrders = orders || [];

    const filteredOrders = displayOrders?.filter(order => {
        const matchesSearch =
            order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.orderItems.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            order.orderStatus.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter ? (statusFilter === "Shipping" ? order.orderStatus === "Shipped" : order.orderStatus === statusFilter) : true;

        return matchesSearch && matchesStatus;
    }) || [];

    const handleEdit = (order) => {
        navigate(`/admin/order/${order._id}`);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This will permanently delete the order.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteOrder(id));
            }
        });
    };

    return (
        <div className="min-h-screen">
            <MetaData title="Admin Orders | Medical Store" />

            <Box sx={{ mb: 3, textAlign: 'center', px: { xs: 2, md: 0 }, p: 2, boxShadow: 2, borderRadius: 2, backgroundColor: 'background.paper' }}>
                <Typography variant="h4" component="h2" className="text-2xl font-bold text-gray-800">Orders</Typography>
                <Typography variant="body1" className="text-gray-600" sx={{ mt: 1 }}>Manage your orders</Typography>
            </Box>

            <Grid container spacing={2} sx={{ alignItems: 'flex-start' }}>
                <Grid item sx={{ display: { xs: 'none', md: 'block' }, width: '10in' }}>
                    <Box sx={{ width: '100%', height: '100%' }} />
                </Grid>

                <Grid item xs={12} md sx={{ flexGrow: 1 }}>
                    <Card className="shadow-lg border-0">
                        <CardContent className="p-6">
                            <Grid container alignItems="center" justifyContent="space-between" spacing={2} className="mb-6">
                                <Grid item>
                                    <Typography variant="body2" className="text-gray-600">Total orders: {orders?.length || 0}</Typography>
                                </Grid>
                                <Grid item>
                                    <TextField
                                        size="small"
                                        placeholder="Search orders..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ minWidth: 250 }}
                                    />
                                </Grid>
                            </Grid>

                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                                    <Typography>Loading Orders...</Typography>
                                </Box>
                            ) : (
                                <TableContainer component={Paper} sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: 2, maxHeight: 400, overflow: 'auto' }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
                                                <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Order ID</TableCell>
                                                <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Product Name</TableCell>
                                                <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Quantity</TableCell>
                                                <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Amount</TableCell>
                                                <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Payment Method</TableCell>
                                                <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Status</TableCell>
                                                <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {filteredOrders?.length > 0 ? (
                                                filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order, index) => (
                                                    <TableRow key={order._id} sx={{ '&:hover': { backgroundColor: '#fbfdff' } }}>
                                                        <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>{page * rowsPerPage + index + 1}</TableCell>
                                                        <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>{order.orderItems.map(item => item.name).join(', ')}</TableCell>
                                                        <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>{order.orderItems.reduce((total, item) => total + item.quantity, 0)}</TableCell>
                                                        <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>₹{order.totalPrice.toLocaleString()}</TableCell>
                                                        <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>
                                                            <span className="text-sm text-gray-700">{order.paymentInfo?.method || 'N/A'}</span>
                                                        </TableCell>
                                                        <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>
                                                            <span className={`text-sm p-1 px-2 font-medium rounded-full ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' : order.orderStatus === 'Shipped' ? 'bg-yellow-100 text-yellow-800' : 'bg-purple-100 text-purple-800'}`}>{order.orderStatus}</span>
                                                        </TableCell>
                                                        <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>
                                                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                                {(order.orderStatus === 'Delivered' || order.orderStatus === 'Cancelled') ? (
                                                                    <IconButton size="small" onClick={() => setViewOrder(order)} aria-label="view">
                                                                        <VisibilityIcon fontSize="small" style={{ color: '#1976d2' }} />
                                                                    </IconButton>
                                                                ) : (
                                                                    <IconButton size="small" onClick={() => handleEdit(order)} aria-label="edit">
                                                                        <EditIcon fontSize="small" style={{ color: '#1976d2' }} />
                                                                    </IconButton>
                                                                )}
                                                                <IconButton size="small" onClick={() => handleDelete(order._id)} aria-label="delete">
                                                                    <DeleteIcon fontSize="small" style={{ color: '#d32f2f' }} />
                                                                </IconButton>
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={7} align="center">No orders found.</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}

                            <TablePagination component="div" count={filteredOrders?.length || 0} page={page} onPageChange={(event, newPage) => setPage(newPage)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(event) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); }} rowsPerPageOptions={[5, 10, 15, 20]} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Dialog open={!!viewOrder} onClose={() => setViewOrder(null)} maxWidth="sm" fullWidth>
                {viewOrder && (
                    <>
                        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography fontWeight="bold">Order Details</Typography>
                            <IconButton size="small" onClick={() => setViewOrder(null)}><CloseIcon /></IconButton>
                        </DialogTitle>
                        <Divider />
                        <DialogContent sx={{ pt: 2 }}>
                            <Typography variant="body2"><strong>Order ID:</strong> {viewOrder._id}</Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}><strong>Status:</strong> <span className={`text-sm p-1 px-2 font-medium rounded-full ${viewOrder.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{viewOrder.orderStatus}</span></Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}><strong>Customer:</strong> {viewOrder.user?.name}</Typography>
                            <Typography variant="body2"><strong>Email:</strong> {viewOrder.user?.email}</Typography>
                            <Typography variant="body2"><strong>Phone:</strong> {viewOrder.shippingInfo?.phoneNo}</Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}><strong>Address:</strong> {viewOrder.shippingInfo?.address}, {viewOrder.shippingInfo?.city}, {viewOrder.shippingInfo?.state} - {viewOrder.shippingInfo?.pincode}</Typography>
                            <Typography variant="body2"><strong>Payment:</strong> {viewOrder.paymentInfo?.method || 'N/A'}</Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>Items:</Typography>
                            {viewOrder.orderItems.map((item, i) => (
                                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                    <img src={item.image} alt={item.name} style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 4 }} />
                                    <Box>
                                        <Typography variant="body2">{item.name}</Typography>
                                        <Typography variant="caption" color="textSecondary">{item.quantity} x ₹{item.price?.toLocaleString()} = ₹{(item.quantity * item.price).toLocaleString()}</Typography>
                                    </Box>
                                </Box>
                            ))}
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="body1" fontWeight="bold" textAlign="right">Total: ₹{viewOrder.totalPrice?.toLocaleString()}</Typography>
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </div>
    );
};

export default OrderTable;
