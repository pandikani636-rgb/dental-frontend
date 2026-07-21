import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Card,
    CardContent,
    Typography,
    TablePagination,
    TextField,
    InputAdornment,
    Grid,
    Box,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import Loader from '../Layouts/Loader';
import MetaData from '../Layouts/MetaData';

const CancelOrders = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [cancelOrders, setCancelOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchCancelOrders = async () => {
            try {
                const config = { withCredentials: true };
                const { data } = await axios.get('/api/v1/admin/cancelorders', config);
                
                if (data.success) {
                    setCancelOrders(data.cancelOrders);
                }
            } catch (error) {
                enqueueSnackbar(error.response?.data?.message || 'Failed to fetch cancel orders', { variant: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchCancelOrders();
    }, [enqueueSnackbar]);

    const filteredOrders = cancelOrders.filter(order => {
        if (!searchTerm) return true;
        return (
            order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedOrder(null);
    };

    return (
        <div className="min-h-screen">
            <MetaData title="Cancel Orders | Admin" />
            
            <Box sx={{ mb: 3, textAlign: 'center', px: { xs: 2, md: 0 }, p: 2, boxShadow: 2, borderRadius: 2, backgroundColor: 'background.paper' }}>
                <Typography variant="h4" component="h2" className="text-2xl font-bold text-gray-800">Cancel Order Requests</Typography>
                <Typography variant="body1" className="text-gray-600" sx={{ mt: 1 }}>Manage customer cancellation requests</Typography>
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
                                    <Typography variant="body2" className="text-gray-600 mb-4">Total requests: {filteredOrders.length}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        size="small"
                                        placeholder="Search cancel orders..."
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

                            <TableContainer component={Paper} sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: 2 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>S.No</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>User Name</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Email</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Product</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Reason</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Submitted Time</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={7} align="center">Loading cancel orders...</TableCell>
                                            </TableRow>
                                        ) : filteredOrders.length > 0 ? (
                                            filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order, index) => (
                                                <TableRow key={order._id} sx={{ '&:hover': { backgroundColor: '#fbfdff' } }}>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>{page * rowsPerPage + index + 1}</TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>{order.userName || 'N/A'}</TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>{order.userId?.email || 'N/A'}</TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>{order.productName || 'N/A'}</TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px', maxWidth: '300px' }}>
                                                        <div className="text-sm text-gray-700 line-clamp-2">{order.reason}</div>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>
                                                        {new Date(order.createdAt).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>
                                                        <IconButton size="small" onClick={() => handleViewDetails(order)} aria-label="view">
                                                            <VisibilityIcon fontSize="small" style={{ color: '#1976d2' }} />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} align="center">No cancel order requests found.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <TablePagination 
                                component="div" 
                                count={filteredOrders.length} 
                                page={page} 
                                onPageChange={(event, newPage) => setPage(newPage)} 
                                rowsPerPage={rowsPerPage} 
                                onRowsPerPageChange={(event) => { 
                                    setRowsPerPage(parseInt(event.target.value, 10)); 
                                    setPage(0); 
                                }} 
                                rowsPerPageOptions={[5, 10, 25, 50]} 
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Detail View Modal */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f3f4f6' }}>
                    <Typography variant="h6" component="div" fontWeight="bold">Cancel Order Details</Typography>
                    <IconButton onClick={handleCloseModal} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    {selectedOrder && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box>
                                <Typography variant="subtitle2" color="textSecondary" fontWeight="bold">Order ID</Typography>
                                <Typography variant="body1">{selectedOrder.orderId}</Typography>
                            </Box>
                            <Divider />
                            <Box>
                                <Typography variant="subtitle2" color="textSecondary" fontWeight="bold">Customer Name</Typography>
                                <Typography variant="body1">{selectedOrder.userName}</Typography>
                            </Box>
                            <Divider />
                            <Box>
                                <Typography variant="subtitle2" color="textSecondary" fontWeight="bold">Customer Email</Typography>
                                <Typography variant="body1">{selectedOrder.userId?.email || 'N/A'}</Typography>
                            </Box>
                            <Divider />
                            <Box>
                                <Typography variant="subtitle2" color="textSecondary" fontWeight="bold">Product Name</Typography>
                                <Typography variant="body1">{selectedOrder.productName}</Typography>
                            </Box>
                            <Divider />
                            <Box>
                                <Typography variant="subtitle2" color="textSecondary" fontWeight="bold">Cancellation Reason</Typography>
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                    {selectedOrder.reason}
                                </Typography>
                            </Box>
                            <Divider />
                            <Box>
                                <Typography variant="subtitle2" color="textSecondary" fontWeight="bold">Submitted Time</Typography>
                                <Typography variant="body1">{new Date(selectedOrder.createdAt).toLocaleString()}</Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseModal} variant="contained" color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CancelOrders;
