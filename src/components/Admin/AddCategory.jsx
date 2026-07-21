import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { showAlert } from '../../utils/sweetAlert';
// import Swal from 'sweetalert2'
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

import {
    Card,
    CardContent,
    TextField,
    MenuItem,
    Button,
    Box,
    Grid
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useDispatch, useSelector } from "react-redux";
import { createCategory, clearErrors } from "../../actions/categoryAction";
import { NEW_CATEGORY_RESET } from "../../constants/categoryConstants";

const AddCategory = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, error, success } = useSelector((state) => state.newCategory);

    const [categoryForm, setCategoryForm] = useState({
        name: '',
        type: '',
        description: '',
        subCategories: []
    });

    const [subCatInput, setSubCatInput] = useState('');

    const [validation, setValidation] = useState({});

    const NAME_MIN = 2;
    const NAME_MAX = 100;
    const DESC_MAX = 500;

    const handleFieldChange = (field) => (e) => {
        const val = e.target.value;
        setCategoryForm((prev) => ({ ...prev, [field]: val }));
        setValidation((prev) => {
            if (!prev || !prev[field]) return prev;
            const copy = { ...prev };
            delete copy[field];
            return copy;
        });
    };

    const categoryTypes = ["Prescription", "Non-Prescription"];

    // -----------------------------------------
    // Validate Fields
    // -----------------------------------------
    const validateForm = () => {
        let errors = {};

        const nameTrim = categoryForm.name ? categoryForm.name.trim() : '';
        if (!nameTrim) {
            errors.name = 'Category name is required';
        } else if (nameTrim.length < NAME_MIN || nameTrim.length > NAME_MAX) {
            errors.name = `Name must be between ${NAME_MIN} and ${NAME_MAX} characters`;
        } else {
            // must start with a letter, allow letters, numbers and spaces afterwards
            const namePattern = /^[A-Za-z][A-Za-z0-9-\s]*$/;
            if (!namePattern.test(nameTrim)) {
                errors.name = 'Name must start with a letter and contain only letters, numbers and spaces';
            }
        }

        if (!categoryForm.type || !categoryForm.type.trim()) {
            errors.type = 'Category type is required';
        }

        if (categoryForm.description && categoryForm.description.length > DESC_MAX) {
            errors.description = `Description too long (max ${DESC_MAX} chars)`;
        }

        setValidation(errors);
        return Object.keys(errors).length === 0;
    };

    // -----------------------------------------
    // Handle Submit
    // -----------------------------------------
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const formData = {
            name: categoryForm.name.trim(),
            type: categoryForm.type.trim(),
            description: categoryForm.description ? categoryForm.description.trim() : '',
            subCategories: categoryForm.subCategories
        };

        dispatch(createCategory(formData));
    };

    // -----------------------------------------
    // Handle API Responses
    // -----------------------------------------
    useEffect(() => {
        if (error) {
            // showAlert(error, 'error');

            Swal.fire({
                title: "Failed!",
                text: "Something went wrong!",
                icon: "error",
                timer: 2000,
                showConfirmButton: false

            });
            dispatch(clearErrors());
        }

        if (success) {
            // showAlert('Category added successfully!', 'success');

            Swal.fire({
                title: "Success!",
                text: "Category added successfully!",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });
            navigate("/admin/categories");
            dispatch({ type: NEW_CATEGORY_RESET });
        }
    }, [error, success, dispatch, navigate]);


    const handleCancel = () => {
        navigate('/admin/categories');
    };

    return (
        <div className="min-h-screen w-full flex justify-center items-center">
            <Card
                sx={{
                    width: "850px",
                    borderRadius: "14px",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
                }}
            >
                <h2 className="text-2xl font-bold text-gray-800 text-center mt-6 mb-2">
                    Add New Category
                </h2>

                <CardContent sx={{ padding: "28px 40px" }}>
                    <Box component="form" onSubmit={handleSubmit}>

                        {/* Form Fields */}
                        <Grid container spacing={3}>

                            {/* Category Name */}
                            <Grid item xs={12} md={6}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category Name *
                                </label>

                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Enter category name"
                                    value={categoryForm.name}
                                    onChange={handleFieldChange('name')}
                                    error={Boolean(validation.name)}
                                    helperText={validation.name}
                                />
                            </Grid>

                            {/* Category Type */}
                            <Grid item xs={12} md={6}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category Type *
                                </label>

                                <TextField
                                    fullWidth
                                    select
                                    variant="outlined"
                                    value={categoryForm.type}
                                    onChange={handleFieldChange('type')}
                                    error={Boolean(validation.type)}
                                    helperText={validation.type}
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
                            </Grid>

                        </Grid>

                        {/* Description */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>

                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="Enter category description"
                                value={categoryForm.description}
                                onChange={handleFieldChange('description')}
                                error={Boolean(validation.description)}
                                helperText={validation.description}
                            />
                        </div>

                        {/* Sub Categories */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sub Categories
                            </label>
                            <div className="flex gap-2 mb-2">
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Enter sub category name"
                                    value={subCatInput}
                                    onChange={(e) => setSubCatInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const val = subCatInput.trim();
                                            if (val && !categoryForm.subCategories.includes(val)) {
                                                setCategoryForm(prev => ({ ...prev, subCategories: [...prev.subCategories, val] }));
                                                setSubCatInput('');
                                            }
                                        }
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        const val = subCatInput.trim();
                                        if (val && !categoryForm.subCategories.includes(val)) {
                                            setCategoryForm(prev => ({ ...prev, subCategories: [...prev.subCategories, val] }));
                                            setSubCatInput('');
                                        }
                                    }}
                                    sx={{ minWidth: '80px' }}
                                >
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {categoryForm.subCategories.map((sub, i) => (
                                    <span key={i} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                        {sub}
                                        <button
                                            type="button"
                                            onClick={() => setCategoryForm(prev => ({ ...prev, subCategories: prev.subCategories.filter((_, idx) => idx !== i) }))}
                                            className="ml-1 text-blue-600 hover:text-red-500 font-bold"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Buttons */}
                        <Box className="flex justify-end gap-4 mt-6">

                            <Button
                                variant="outlined"
                                disabled={loading}
                                onClick={handleCancel}
                                sx={{ minWidth: "150px" }}
                            >
                                CANCEL
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700"
                                sx={{ minWidth: "150px" }}
                            >
                                {loading ? "Adding..." : "ADD CATEGORY"}
                            </Button>

                        </Box>

                    </Box>
                </CardContent>
            </Card>
        </div>

    );
};

export default AddCategory;
