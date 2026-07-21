import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    MenuItem // Added MenuItem
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

import { useDispatch, useSelector } from 'react-redux';
import {
    getCategories,
    deleteCategory,
    clearErrors
} from '../../actions/categoryAction';
import { updateCategory } from '../../actions/categoryAction';

// Validation constants
const NAME_MIN = 2;
const NAME_MAX = 100;
const DESC_MAX = 500;
const categoryTypes = ["Prescription", "Non-Prescription"];

const Categories = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    const { loading, categories = [], error } = useSelector((state) => state.categories || {});
    const { error: deleteError, isDeleted } = useSelector((state) => state.deleteCategory || {});
    const { error: updateError, isUpdated } = useSelector((state) => state.updateCategory || {});

    // Edit modal state
    const [editOpen, setEditOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        name: '',
        type: '',
        description: '',
        subCategories: []
    });
    const [formErrors, setFormErrors] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [subCatInput, setSubCatInput] = useState('');

    // Filter categories based on search term
    const filteredCategories = categories?.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    useEffect(() => {
        if (error) {
            Swal.fire({
                title: 'Failed!',
                text: error || 'Something went wrong!',
                icon: 'error',
                timer: 2000,
                showConfirmButton: false
            });
            dispatch(clearErrors());
        }

        if (deleteError) {
            Swal.fire({
                title: 'Failed!',
                text: deleteError || 'Something went wrong!',
                icon: 'error',
                timer: 2000,
                showConfirmButton: false
            });
            dispatch(clearErrors());
        }

        if (isDeleted) {
            Swal.fire({
                title: 'Success!',
                text: 'Category deleted successfully!',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            dispatch({ type: 'DELETE_CATEGORY_RESET' });
            dispatch(getCategories());
        }

        if (updateError) {
            Swal.fire({
                title: 'Failed!',
                text: updateError || 'Unable to update category!',
                icon: 'error',
                timer: 2000,
                showConfirmButton: false
            });
            dispatch(clearErrors());
        }

        if (isUpdated) {
            Swal.fire({
                title: 'Success!',
                text: 'Category updated successfully!',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
            setEditOpen(false);
            setFormErrors({});
            setEditingId(null);
            dispatch({ type: 'UPDATE_CATEGORY_RESET' });
            dispatch(getCategories());
        }

        // Initial fetch
        dispatch(getCategories());
    }, [dispatch, error, deleteError, isDeleted, updateError, isUpdated]);

    // Open modal for editing
    const handleEdit = useCallback((category) => {
        setEditingId(category._id);
        setFormValues({
            name: category.name || '',
            type: category.type || '',
            description: category.description || '',
            subCategories: category.subCategories || []
        });
        setSubCatInput('');
        setFormErrors({});
        setEditOpen(true);
    }, []);

    const handleEditChange = (field) => (e) => {
        const value = e.target.value;
        setFormValues((prev) => ({ ...prev, [field]: value }));

        // Clear error for this field when user starts typing
        if (formErrors[field]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    // Comprehensive validation like AddCategory
    const validateForm = () => {
        let errors = {};

        // Name validation
        const nameTrim = formValues.name ? formValues.name.trim() : '';
        if (!nameTrim) {
            errors.name = 'Category name is required';
        } else if (nameTrim.length < NAME_MIN || nameTrim.length > NAME_MAX) {
            errors.name = `Name must be between ${NAME_MIN} and ${NAME_MAX} characters`;
        } else {
            // Must start with a letter, allow letters, numbers and spaces afterwards
            const namePattern = /^[A-Za-z][A-Za-z0-9-\s]*$/;
            if (!namePattern.test(nameTrim)) {
                errors.name = 'Name must start with a letter and contain only letters, numbers and spaces';
            }
        }

        // Type validation
        if (!formValues.type || !formValues.type.trim()) {
            errors.type = 'Category type is required';
        }

        // Description validation
        if (formValues.description && formValues.description.length > DESC_MAX) {
            errors.description = `Description too long (max ${DESC_MAX} chars)`;
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleEditSave = () => {
        if (!validateForm()) return;

        const payload = {
            name: formValues.name ? formValues.name.trim() : '',
            type: formValues.type ? formValues.type.trim() : '',
            description: formValues.description ? formValues.description.trim() : '',
            subCategories: formValues.subCategories
        };

        dispatch(updateCategory(editingId, payload));
    };

    const handleEditCancel = () => {
        setEditOpen(false);
        setFormErrors({});
        setSubCatInput('');
        setFormValues({ name: '', type: '', description: '', subCategories: [] });
    };

    const handleDelete = useCallback((id) => {
        const isConfirmed = window.confirm('Are you sure? This will permanently delete the category.');
        
        if (isConfirmed) {
            dispatch(deleteCategory(id));
        }
    }, [dispatch]);
    

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (

        <>
        <div className="min-h-screen">
            <Box sx={{
                mb: 3,
                textAlign: 'center',
                px: { xs: 2, md: 0 },
                p: 2,
                boxShadow: 2,
                borderRadius: 2,
                backgroundColor: 'background.paper'
            }}>
                <Typography variant="h4" component="h2" className="text-2xl font-bold text-gray-800">
                    Categories
                </Typography>
                <Typography variant="body1" className="text-gray-600" sx={{ mt: 1 }}>
                    Manage your product categories
                </Typography>
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
                                    <Typography variant="body2" className="text-gray-600">
                                        Total categories: {categories.length}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Search categories..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: <SearchIcon sx={{ color: 'gray', mr: 1 }} />
                                        }}
                                    />
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={() => navigate('/admin/categories/new')}
                                        className="bg-blue-600 hover:bg-blue-700 shadow-lg"
                                    >
                                        ADD NEW CATEGORY
                                    </Button>
                                </Grid>
                            </Grid>

                            <TableContainer component={Paper} sx={{
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                borderRadius: 2,
                                mb: 2
                            }}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>ID</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Category Name</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Type</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Sub Categories</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Description</TableCell>
                                            <TableCell align="center" sx={{ border: '1px solid #e5e7eb', fontWeight: 600 }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center">
                                                    Loading categories...
                                                </TableCell>
                                            </TableRow>
                                        ) : filteredCategories.length > 0 ? (
                                            filteredCategories
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((category) => (
                                                    <TableRow key={category._id} sx={{ '&:hover': { backgroundColor: '#fbfdff' } }}>
                                                        <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>{category.categoryId}</TableCell>
                                                        <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>{category.name}</TableCell>
                                                        <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>{category.type}</TableCell>
                                                        <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>
                                                            {category.subCategories && category.subCategories.length > 0 ? (
                                                                <div className="flex flex-wrap gap-1 justify-center">
                                                                    {category.subCategories.map((sub, i) => (
                                                                        <span key={i} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">{sub}</span>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-400 text-xs">—</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell align="center" sx={{
                                                            border: '1px solid #eef2f6',
                                                            padding: '12px',
                                                            maxWidth: 240,
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis'
                                                        }}>
                                                            {category.description}
                                                        </TableCell>
                                                        <TableCell align="center" sx={{ border: '1px solid #eef2f6', padding: '12px' }}>
                                                            <IconButton
                                                                onClick={() => handleEdit(category)}
                                                                aria-label="edit"
                                                                size="small"
                                                            >
                                                                <EditIcon style={{ color: '#1976d2' }} />
                                                            </IconButton>
                                                            <IconButton
                                                                onClick={() => handleDelete(category._id)}
                                                                aria-label="delete"
                                                                size="small"
                                                            >
                                                                <DeleteIcon style={{ color: '#d32f2f' }} />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                        ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={6} align="center">
                                                            {searchTerm ? 'No categories match your search.' : 'No categories found.'}
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* Edit dialog with comprehensive validation */}
                            <Dialog open={editOpen} onClose={handleEditCancel} fullWidth maxWidth="sm">
                                <DialogTitle sx={{ pb: 1 }}>
                                    <Typography variant="h6" component="div">
                                        Edit Category
                                    </Typography>
                                </DialogTitle>
                                <DialogContent>
                                    <Box component="form" noValidate sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2,
                                        mt: 1,
                                        pt: 1
                                    }}>
                                        {/* Category Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Category Name *
                                            </label>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                placeholder="Enter category name"
                                                value={formValues.name}
                                                onChange={handleEditChange('name')}
                                                error={Boolean(formErrors.name)}
                                                helperText={formErrors.name}
                                                required
                                            />
                                        </div>

                                        {/* Category Type */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Category Type *
                                            </label>
                                            <TextField
                                                fullWidth
                                                select
                                                variant="outlined"
                                                value={formValues.type}
                                                onChange={handleEditChange('type')}
                                                error={Boolean(formErrors.type)}
                                                helperText={formErrors.type}
                                                required
                                            >
                                                <MenuItem value="">
                                                    <em>Select category type</em>
                                                </MenuItem>
                                                {categoryTypes.map((type) => (
                                                    <MenuItem key={type} value={type}>
                                                        {type}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Description
                                            </label>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={3}
                                                placeholder="Enter category description"
                                                value={formValues.description}
                                                onChange={handleEditChange('description')}
                                                error={Boolean(formErrors.description)}
                                                helperText={formErrors.description}
                                            />
                                        </div>

                                        {/* Sub Categories */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Sub Categories
                                            </label>
                                            <div className="flex gap-2 mb-2">
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    placeholder="Enter sub category name"
                                                    value={subCatInput}
                                                    onChange={(e) => setSubCatInput(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            const val = subCatInput.trim();
                                                            if (val && !formValues.subCategories.includes(val)) {
                                                                setFormValues(prev => ({ ...prev, subCategories: [...prev.subCategories, val] }));
                                                                setSubCatInput('');
                                                            }
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => {
                                                        const val = subCatInput.trim();
                                                        if (val && !formValues.subCategories.includes(val)) {
                                                            setFormValues(prev => ({ ...prev, subCategories: [...prev.subCategories, val] }));
                                                            setSubCatInput('');
                                                        }
                                                    }}
                                                    sx={{ minWidth: '70px' }}
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {formValues.subCategories.map((sub, i) => (
                                                    <span key={i} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                                        {sub}
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormValues(prev => ({ ...prev, subCategories: prev.subCategories.filter((_, idx) => idx !== i) }))}
                                                            className="ml-1 text-blue-600 hover:text-red-500 font-bold"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </Box>
                                </DialogContent>
                                <DialogActions sx={{ px: 3, pb: 2 }}>
                                    <Button
                                        onClick={handleEditCancel}
                                        variant="outlined"
                                        sx={{ minWidth: '100px' }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={handleEditSave}
                                        className="bg-blue-600 hover:bg-blue-700"
                                        sx={{ minWidth: '100px' }}
                                    >
                                        Save Changes
                                    </Button>
                                </DialogActions>
                            </Dialog>

                            <TablePagination
                                component="div"
                                count={filteredCategories.length}
                                page={page}
                                onPageChange={handlePageChange}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleRowsPerPageChange}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                labelRowsPerPage="Rows per page:"
                                sx={{ borderTop: '1px solid #e5e7eb' }}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    </>
    );
};

export default Categories;