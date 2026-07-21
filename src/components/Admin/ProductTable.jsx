import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Button,
    Card,
    CardContent,
    Typography,
    TablePagination,
    CircularProgress,
    Grid,
    Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import MetaData from "../Layouts/MetaData";
import {
    getAdminProducts,
    deleteProduct,
} from "../../actions/productAction";

const ProductTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);
    // ⬇️ Load products from Redux
    const { loading, products = [], error } = useSelector(
        (state) => state.products
    );

    // const { isDeleted } = useSelector((state) => state.product);

    // Filter products based on search term - FIXED VERSION
    const filteredProducts = Array.isArray(products) ? products.filter(product => {
        if (!product) return false;

        const searchLower = searchTerm.toLowerCase();
        const productName = product.name ? product.name.toLowerCase() : '';
        const productCategory = product.category ?
            (typeof product.category === 'string' ?
                product.category.toLowerCase() :
                (product.category.name ? product.category.name.toLowerCase() : ''))
            : '';

        return productName.includes(searchLower) ||
            productCategory.includes(searchLower);
    }) : [];

    // ⬇️ Load admin products on page load
    useEffect(() => {
        dispatch(getAdminProducts());
    }, [dispatch]);

    // ⬇️ Handle delete success
    // useEffect(() => {
    //     if (isDeleted) {
    //         Swal.fire({
    //             title: "Success!",
    //             text: "Product deleted successfully!",
    //             icon: "success",
    //             timer: 2000
    //         });

    //         dispatch(getAdminProducts());
    //     }
    // }, [isDeleted, dispatch]);

    const handleEdit = (product) => {
        // Navigate directly to edit page without modal
        navigate(`/admin/product/${product._id}`);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This will permanently delete the product.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No'
        }).then(async (result) => {
            if (result.isConfirmed) {
                setDeleteLoading(true);
                Swal.fire({
                    title: 'Deleting...',
                    html: '<div style="display: flex; justify-content: center; align-items: center;"><div class="spinner-border" role="status"></div></div>',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                
                try {
                    await dispatch(deleteProduct(id));
                    setDeleteLoading(false);
                    Swal.fire({
                        title: "Success!",
                        text: "Product deleted successfully!",
                        icon: "success",
                        timer: 2000
                    });
                    dispatch(getAdminProducts());
                } catch (error) {
                    setDeleteLoading(false);
                    Swal.fire({
                        title: "Error!",
                        text: "Failed to delete product.",
                        icon: "error",
                        timer: 2000
                    });
                }
            }
        });
    };

    if (loading) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-600 text-center mt-10 text-xl">
                {error}
            </div>
        );
    }

    // Calculate price with GST
    const calculateFinalPrice = (price, gst) => {
        const basePrice = Number(price) || 0;
        const gstRate = Number(gst) || 0;

        if (gstRate > 0) {
            const finalPrice = basePrice + (basePrice * gstRate / 100);
            return Math.round(finalPrice * 100) / 100; // Round to 2 decimal places
        }
        return basePrice;
    };

    return (
        <div className="min-h-screen p-6">
            <MetaData title="Admin Products | Medical Store" />
            <Box sx={{ mb: 3, textAlign: 'center', px: { xs: 2, md: 0 }, p: 2, boxShadow: 2, borderRadius: 2, backgroundColor: 'background.paper' }}>
                <Typography variant="h4" component="h2" className="text-2xl font-bold text-gray-800">Products</Typography>
                <Typography variant="body1" className="text-gray-600" sx={{ mt: 1 }}>Manage your products</Typography>
            </Box>

            <Grid container spacing={2} sx={{ alignItems: 'flex-start' }}>
                <Grid item sx={{ display: { xs: 'none', md: 'block' }, width: '10in' }}>
                    <Box sx={{ width: '100%', height: '100%' }} />
                </Grid>

                <Grid item xs={12} md sx={{ flexGrow: 1 }}>
                    <Card className="shadow-lg border-0" sx={{ mx: 'auto', width: { xs: '100%', md: 'auto' } }}>
                        <CardContent className="p-6">
                            <Grid container alignItems="center" justifyContent="space-between" spacing={2} className="mb-6">
                                <Grid item>
                                    <Typography variant="body2" className="text-gray-600">Total products: {products?.length || 0}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: <SearchIcon sx={{ color: 'gray', mr: 1 }} />
                                        }}
                                    />
                                </Grid>
                                <Grid item>
                                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/admin/new_product")} className="bg-blue-600 hover:bg-blue-700 shadow-lg" sx={{ mr: 1 }}>ADD NEW PRODUCT</Button>
                                </Grid>
                            </Grid>

                            <TableContainer component={Paper} sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: 2, maxHeight: 450, overflowY: 'auto' }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>S.No</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Name</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Category</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Sub Category</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Stock</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Price</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>GST (%)</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Final Price</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Delivery Charge</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Status</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Return Policy</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Return Duration</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Warranty</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Warranty Duration</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {products?.length ? (
                                            filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product, index) => (
                                                <TableRow key={product._id} sx={{ '&:hover': { backgroundColor: '#fbfdff' } }}>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>{(page * rowsPerPage) + index + 1}</TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>{product.name}</TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>{product.category?.name || product.category}</TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>{product.subCategory || '-'}</TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>
                                                        {product.stock < 10 ? (
                                                            <span className="font-medium text-red-700 bg-red-200 px-2 py-1 rounded-full">{product.stock}</span>
                                                        ) : (product.stock)}
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>₹{product.price.toLocaleString()}</TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>{product.gst ? `${product.gst}%` : '-'}</TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>
                                                        <span className="font-semibold text-green-700">₹{calculateFinalPrice(product.price, product.gst).toLocaleString()}</span>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>{product.delivery_charge ? `₹${product.delivery_charge}` : '-'}</TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>
                                                        <span className={`px-2 py-1 rounded-full text-xs ${product.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{product.status}</span>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>
                                                        <span className={`px-2 py-1 rounded-full text-xs ${product.return_policy === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{product.return_policy || 'No'}</span>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>{product.return_duration || '-'}</TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>
                                                        <span className={`px-2 py-1 rounded-full text-xs ${product.warranty === 'Yes' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{product.warranty || 'No'}</span>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>{product.warranty_duration || '-'}</TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>
                                                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                            <IconButton size="small" onClick={() => handleEdit(product)} aria-label="edit">
                                                                <EditIcon fontSize="small" style={{ color: '#1976d2' }} />
                                                            </IconButton>

                                                            <IconButton size="small" onClick={() => handleDelete(product._id)} aria-label="delete">
                                                                <DeleteIcon fontSize="small" style={{ color: '#d32f2f' }} />
                                                            </IconButton>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={15} align="center">No products found.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <TablePagination component="div" count={filteredProducts?.length || 0} page={page} onPageChange={(e, newPage) => setPage(newPage)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} rowsPerPageOptions={[5, 10, 20, 50]} />

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default ProductTable;