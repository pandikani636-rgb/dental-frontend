import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
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
    TextField,
    TablePagination
} from '@mui/material';
import Rating from '@mui/material/Rating';
import DeleteIcon from '@mui/icons-material/Delete';
import { clearErrors, deleteReview, getAllReviews } from '../../actions/productAction';
import { DELETE_REVIEW_RESET } from '../../constants/productConstants';
import MetaData from '../Layouts/MetaData';
import BackdropLoader from '../Layouts/BackdropLoader';

const ReviewsTable = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [productId, setProductId] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { reviews, error } = useSelector((state) => state.reviews);
    const { loading, isDeleted, error: deleteError } = useSelector((state) => state.review);

    useEffect(() => {
        if (productId.length === 24) {
            dispatch(getAllReviews(productId));
        }
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
        if (deleteError) {
            enqueueSnackbar(deleteError, { variant: "error" });
            dispatch(clearErrors());
        }
        if (isDeleted) {
            enqueueSnackbar("Review Deleted Successfully", { variant: "success" });
            dispatch({ type: DELETE_REVIEW_RESET });
        }
    }, [dispatch, error, deleteError, isDeleted, productId, enqueueSnackbar]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            dispatch(deleteReview(id, productId));
        }
    };

    return (
        <div className="min-h-screen">
            <MetaData title="Admin Reviews | Medical Store" />
            {loading && <BackdropLoader />}
            
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 text-center">Reviews</h2>
                <p className="text-gray-600 text-center">Manage product reviews</p>
            </div>

            <Card className="shadow-lg border-0" style={{ marginLeft: '60px' }}>
                <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <Typography variant="body2" className="text-gray-600">
                            Total reviews: {reviews?.length || 0}
                        </Typography>
                        
                        <TextField
                            placeholder="Enter Product ID"
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            variant="outlined"
                            size="small"
                            sx={{ minWidth: '200px' }}
                        />
                    </div>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead className="bg-gray-100">
                                <TableRow>
                                    <TableCell align="center">Review ID</TableCell>
                                    <TableCell align="center">User</TableCell>
                                    <TableCell align="center">Rating</TableCell>
                                    <TableCell align="center">Comment</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            Loading reviews...
                                        </TableCell>
                                    </TableRow>
                                ) : reviews?.length > 0 ? (
                                    reviews
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((review) => (
                                            <TableRow key={review._id}>
                                                <TableCell align="center">{review._id}</TableCell>
                                                <TableCell align="center">{review.name}</TableCell>
                                                <TableCell align="center">
                                                    <Rating readOnly value={review.rating} size="small" precision={0.5} />
                                                </TableCell>
                                                <TableCell align="center">{review.comment}</TableCell>
                                                <TableCell align="center">
                                                    <IconButton onClick={() => handleDelete(review._id)}>
                                                        <DeleteIcon style={{ color: "#d32f2f" }} />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            {productId ? "No reviews found for this product." : "Enter a Product ID to view reviews."}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    
                    <TablePagination
                        component="div"
                        count={reviews?.length || 0}
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
        </div>
    );
};

export default ReviewsTable;