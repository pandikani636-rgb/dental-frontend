import React, { useState, useEffect } from "react";
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
    DialogActions,
    Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import MetaData from "../Layouts/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { getAdminContactus, deleteContactus } from "../../actions/contactusAction";
import { CLEAR_ERRORS, DELETE_CONTACTUS_RESET } from "../../constants/contactusConstants";
import Swal from 'sweetalert2'

const ContactTable = () => {
    const dispatch = useDispatch();

    const { contacts, loading } = useSelector((state) => state.contacts);
    const { isDeleted, error } = useSelector((state) => state.deleteContact);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState('');

    // Filter contacts based on search term - Safe Version
    const filteredContacts = contacts?.filter(contact => {
        if (!contact) return false;
        const name = contact.name ? contact.name.toLowerCase() : '';
        const email = contact.email ? contact.email.toLowerCase() : '';
        const phone = contact.phone ? contact.phone.toString() : '';
        const message = contact.message ? contact.message.toLowerCase() : '';
        const term = searchTerm.toLowerCase();

        return name.includes(term) || email.includes(term) || phone.includes(term) || message.includes(term);
    }) || [];

    // 🟢 Get contacts on page load (Admin Route)
    useEffect(() => {
        dispatch(getAdminContactus());
    }, [dispatch]);

    // 🟢 After delete
    useEffect(() => {
        if (isDeleted) {
            Swal.fire({
                title: "Success!",
                text: "Contact Deleted Successfully!",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });

            dispatch({ type: DELETE_CONTACTUS_RESET });
            dispatch(getAdminContactus());
        }

        if (error) {
            alert(error);
            dispatch({ type: CLEAR_ERRORS });
        }
    }, [dispatch, isDeleted, error]);
    

    const handleDelete = (id) => {
        const isConfirmed = window.confirm('Are you sure? This will permanently delete the contact submission.');

        if (isConfirmed) {
            dispatch(deleteContactus(id));
        }
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleViewMessage = (message) => {
        setSelectedMessage(message);
        setOpenDialog(true);
    };

    return (
        <div className="min-h-screen">
            <MetaData title="Admin Contacts | Medical Store" />
            <Box sx={{ mb: 3, textAlign: 'center', px: { xs: 2, md: 0 }, p: 2, boxShadow: 2, borderRadius: 2, backgroundColor: 'background.paper' }}>
                <Typography variant="h4" component="h2" className="text-2xl font-bold text-gray-800">Contact Submissions</Typography>
                <Typography variant="body1" className="text-gray-600" sx={{ mt: 1 }}>View customer contact inquiries</Typography>
            </Box>

            <Grid container spacing={2} sx={{ alignItems: 'flex-start' }}>
                <Grid item sx={{ display: { xs: 'none', md: 'block' }, width: '10in' }}>
                    <Box sx={{ width: '100%', height: '100%' }} />
                </Grid>

                <Grid item xs={12} md sx={{ flexGrow: 1 }}>
                    <Card className="shadow-lg border-0 max-w-6xl mx-auto w-full">
                        <CardContent className="p-6">
                            <Grid container alignItems="center" justifyContent="space-between" spacing={2} className="mb-6">
                                <Grid item>
                                    <Typography variant="body2" className="text-gray-600">Total submissions: {filteredContacts.length}</Typography>
                                </Grid>
                                <Grid item>
                                    <TextField
                                        size="small"
                                        placeholder="Search contacts..."
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
                                <h3 className="text-center text-gray-500">Loading...</h3>
                            ) : (
                                <>
                                    <TableContainer component={Paper} sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: 2 }}>
                                        <Table sx={{ minWidth: 1200 }}>
                                            <TableHead>
                                                <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
                                                    <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>S.No</TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Name</TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Email</TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Phone</TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Message</TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Actions</TableCell>
                                                </TableRow>
                                            </TableHead>

                                            <TableBody>
                                                {filteredContacts.length > 0 ? (
                                                    filteredContacts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                                                        <TableRow key={item._id} sx={{ '&:hover': { backgroundColor: '#fbfdff' } }}>
                                                            <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>{page * rowsPerPage + index + 1}</TableCell>
                                                            <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>{item.name || '-'}</TableCell>
                                                            <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>{item.email || '-'}</TableCell>
                                                            <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>{item.phone || '-'}</TableCell>
                                                            <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px', maxWidth: 400, cursor: 'pointer' }} onClick={() => handleViewMessage(item.message)} title="Click to view full message">
                                                                {(item.message || '').substring(0, 60)}...
                                                            </TableCell>
                                                            <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>
                                                                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                                    <IconButton size="small" onClick={() => handleDelete(item._id)} aria-label="delete">
                                                                        <DeleteIcon fontSize="small" style={{ color: '#d32f2f' }} />
                                                                    </IconButton>
                                                                </Box>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>No contacts found</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    <TablePagination component="div" count={filteredContacts.length} page={page} onPageChange={handlePageChange} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleRowsPerPageChange} rowsPerPageOptions={[5, 10, 25, 50]} />
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Full Message</DialogTitle>
                <DialogContent>
                    <Typography sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {selectedMessage || 'No message'}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ContactTable;
