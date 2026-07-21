import { useEffect, useState } from "react";
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
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import MetaData from "../Layouts/MetaData";
import axios from "axios";

const HomeOffer = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [homeOffers, setHomeOffers] = useState([]);

    useEffect(() => {
        fetchHomeOffers();
    }, []);

    const fetchHomeOffers = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get("/api/v1/homeoffers");
            setHomeOffers(data.homeOffers);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This will permanently delete the home offer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/api/v1/admin/homeoffer/${id}`);
                    Swal.fire({
                        title: "Success!",
                        text: "Home offer deleted successfully!",
                        icon: "success",
                        timer: 2000
                    });
                    fetchHomeOffers();
                } catch (error) {
                    Swal.fire({
                        title: "Error!",
                        text: "Failed to delete home offer.",
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

    return (
        <div className="min-h-screen p-6">
            <MetaData title="Admin Home Offers | Medical Store" />
            <Box sx={{ mb: 3, textAlign: 'center', px: { xs: 2, md: 0 }, p: 2, boxShadow: 2, borderRadius: 2, backgroundColor: 'background.paper' }}>
                <Typography variant="h4" component="h2" className="text-2xl font-bold text-gray-800">Home Offers</Typography>
                <Typography variant="body1" className="text-gray-600" sx={{ mt: 1 }}>Manage your home page offers</Typography>
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
                                    <Typography variant="body2" className="text-gray-600">Total offers: {homeOffers?.length || 0}</Typography>
                                </Grid>
                                <Grid item>
                                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/admin/homeoffer/add")} className="bg-blue-600 hover:bg-blue-700 shadow-lg">ADD HOME OFFER</Button>
                                </Grid>
                            </Grid>

                            <TableContainer component={Paper} sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: 2, maxHeight: 450, overflowY: 'auto' }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>S.No</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Name</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Image</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Status</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {homeOffers?.length ? (
                                            homeOffers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((offer, index) => (
                                                <TableRow key={offer._id} sx={{ '&:hover': { backgroundColor: '#fbfdff' } }}>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>{(page * rowsPerPage) + index + 1}</TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>{offer.name}</TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>
                                                        <img src={offer.image?.url} alt={offer.name} style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>
                                                        <span className={`px-2 py-1 rounded-full text-xs ${offer.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                            {offer.isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>
                                                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                            <IconButton size="small" onClick={() => navigate(`/admin/homeoffer/edit/${offer._id}`)} aria-label="edit">
                                                                <EditIcon fontSize="small" style={{ color: '#1976d2' }} />
                                                            </IconButton>
                                                            <IconButton size="small" onClick={() => handleDelete(offer._id)} aria-label="delete">
                                                                <DeleteIcon fontSize="small" style={{ color: '#d32f2f' }} />
                                                            </IconButton>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center">No home offers found.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <TablePagination component="div" count={homeOffers?.length || 0} page={page} onPageChange={(e, newPage) => setPage(newPage)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} rowsPerPageOptions={[5, 10, 20]} />

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default HomeOffer;
