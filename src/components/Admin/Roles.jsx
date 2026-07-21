import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showAlert } from '../../utils/sweetAlert';
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

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

import { useDispatch, useSelector } from "react-redux";
import { getAllRoles, deleteRole } from "../../actions/rolesActions";
import { DELETE_ROLE_RESET } from "../../constants/rolesConstants";
import Swal from 'sweetalert2'

const Roles = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    // Redux states
    const { roles, loading, error } = useSelector((state) => state.roles);
    const { isDeleted, error: deleteError } = useSelector((state) => state.deleteRole);

    // Filter roles based on search term
    const filteredRoles = roles?.filter(role =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    useEffect(() => {
        if (error) {
            showAlert(error, 'error');
        }

        if (deleteError) {
            showAlert(deleteError, 'error');
        }

        if (isDeleted) {
            Swal.fire({
                title: 'Success!',
                text: 'Role deleted successfully!',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            dispatch({ type: DELETE_ROLE_RESET });
            dispatch(getAllRoles());
        }

        dispatch(getAllRoles());
    }, [dispatch, error, deleteError, isDeleted]);

    const handleEdit = (role) => {
        navigate(`/admin/role/${role._id}`);
    };

    const handleDelete = (id) => {
        const isConfirmed = window.confirm('Are you sure? This will permanently delete the role.');

        if (isConfirmed) {
            dispatch(deleteRole(id));
        }
    };

    return (
        <div className="min-h-screen" >
            <Box sx={{ mb: 3, textAlign: 'center', px: { xs: 2, md: 0 }, p: 2, boxShadow: 2, borderRadius: 2, backgroundColor: 'background.paper' }}>
                <Typography variant="h4" component="h2" className="text-2xl font-bold text-gray-800">Roles</Typography>
                <Typography variant="body1" className="text-gray-600" sx={{ mt: 1 }}>Manage your admin roles</Typography>
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
                                    <Typography variant="body2" className="text-gray-600">Total Roles: {roles?.length || 0}</Typography>
                                </Grid>

                                <Grid item>
                                    <TextField
                                        size="small"
                                        placeholder="Search roles..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ minWidth: 250, mr: 2 }}
                                    />
                                </Grid>

                                <Grid item>
                                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/admin/role/new')} className="bg-blue-600 hover:bg-blue-700 shadow-lg">ADD NEW ROLE</Button>
                                </Grid>
                            </Grid>

                            <TableContainer component={Paper} sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: 2 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>S.No</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Role Name</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={3} align="center">Loading roles...</TableCell>
                                            </TableRow>
                                        ) : filteredRoles?.length > 0 ? (
                                            filteredRoles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((role, index) => (
                                                <TableRow key={role._id} sx={{ '&:hover': { backgroundColor: '#fbfdff' } }}>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>{page * rowsPerPage + index + 1}</TableCell>
                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>{role.name}</TableCell>

                                                    <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>
                                                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                            <IconButton size="small" onClick={() => handleEdit(role)} aria-label="edit"><EditIcon fontSize="small" style={{ color: '#1976d2' }} /></IconButton>
                                                            <IconButton size="small" onClick={() => handleDelete(role._id)} aria-label="delete"><DeleteIcon fontSize="small" style={{ color: '#d32f2f' }} /></IconButton>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={3} align="center">No roles found.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <TablePagination component="div" count={filteredRoles?.length || 0} page={page} onPageChange={(event, newPage) => setPage(newPage)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(event) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); }} rowsPerPageOptions={[5, 10, 25, 50]} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default Roles;
