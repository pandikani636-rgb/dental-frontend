import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import Swal from 'sweetalert2';
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
    TextField,
    InputAdornment,
    Grid,
    Box
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

import { useDispatch, useSelector } from "react-redux";
import { clearErrors, deleteUser, getAllUsers } from '../../actions/userAction';
import { DELETE_USER_RESET } from '../../constants/userConstants';

const UserTable = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    const { users, usersLoading, usersError, isDeleted, error: deleteError } = useSelector((state) => state.user);

    // Filter users based on search term - ensure user is not null/undefined
    const filteredUsers = users?.filter(user => {
        // First check if user exists and has required properties
        if (!user || !user._id) {
            return false;
        }

        // If no search term, include all valid users
        if (!searchTerm) {
            return true;
        }

        // Search in user properties with null checks
        return (
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.gender?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }) || [];

    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch]);

    // Refresh users when component becomes visible (e.g., after navigation)
    useEffect(() => {
        const handleFocus = () => {
            dispatch(getAllUsers());
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [dispatch]);

    // Refresh users when navigating to this page
    useEffect(() => {
        dispatch(getAllUsers());
    }, [location.pathname, dispatch]);

    useEffect(() => {
        if (usersError) {
            enqueueSnackbar(usersError, { variant: "error" });
            dispatch(clearErrors());
        }

        if (deleteError) {
            enqueueSnackbar(deleteError, { variant: "error" });
            dispatch(clearErrors());
        }

        if (isDeleted) {
            enqueueSnackbar("User deleted successfully!", { variant: "success" });
            dispatch({ type: DELETE_USER_RESET });
            dispatch(getAllUsers());
        }
    }, [dispatch, usersError, deleteError, isDeleted, enqueueSnackbar]);



    const handleDelete = (id) => {
        if (!id) {
            enqueueSnackbar("Invalid user ID", { variant: "error" });
            return;
        }

        const userConfirmed = window.confirm('Are you sure you want to permanently delete this user?');
        if (userConfirmed) {
            dispatch(deleteUser(id));
        }
    };

    return (
        <div className="min-h-screen">
            <Box sx={{ mb: 3, textAlign: 'center', px: { xs: 2, md: 0 }, p: 2, boxShadow: 2, borderRadius: 2, backgroundColor: 'background.paper' }}>
                <Typography variant="h4" component="h2" className="text-2xl font-bold text-gray-800">Users</Typography>
                <Typography variant="body1" className="text-gray-600" sx={{ mt: 1 }}>Manage your admin users</Typography>
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
                                    <Typography variant="body2" className="text-gray-600 mb-4">Total users: {filteredUsers?.length || 0}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        size="small"
                                        placeholder="Search users..."
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
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={() => navigate('/admin/users/new')}
                                        className="bg-blue-600 hover:bg-blue-700 shadow-lg"
                                    >
                                        ADD NEW USER
                                    </Button>
                                </Grid>
                            </Grid>

                            <TableContainer component={Paper} sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: 2 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>S.No</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Name</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Email</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Phone Number</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Gender</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Role</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {usersLoading ? (
                                            <TableRow>
                                                <TableCell colSpan={7} align="center">Loading users...</TableCell>
                                            </TableRow>
                                        ) : filteredUsers?.length > 0 ? (
                                            filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                                                <TableRow key={user._id || `user-${index}`} sx={{ '&:hover': { backgroundColor: '#fbfdff' } }}>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>{page * rowsPerPage + index + 1}</TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>{user?.name || 'N/A'}</TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>{user?.email || 'N/A'}</TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>{user.phone || 'N/A'}</TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>{user?.gender?.toUpperCase() || 'N/A'}</TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>
                                                        <span className={`text-sm p-1 px-2 font-medium rounded-full capitalize ${user?.role?.toLowerCase() === 'admin' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>{user?.role || 'N/A'}</span>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>
                                                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                            <IconButton size="small" onClick={() => navigate(`/admin/users/edit/${user?._id}`)} aria-label="edit" disabled={!user?._id}>
                                                                <EditIcon fontSize="small" style={{ color: '#1976d2' }} />
                                                            </IconButton>
                                                            <IconButton size="small" onClick={() => handleDelete(user?._id)} aria-label="delete" disabled={!user?._id}>
                                                                <DeleteIcon fontSize="small" style={{ color: '#d32f2f' }} />
                                                            </IconButton>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} align="center">No users found.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <TablePagination component="div" count={filteredUsers?.length || 0} page={page} onPageChange={(event, newPage) => setPage(newPage)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(event) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); }} rowsPerPageOptions={[5, 10, 25, 50]} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div >
    );
};

export default UserTable;
