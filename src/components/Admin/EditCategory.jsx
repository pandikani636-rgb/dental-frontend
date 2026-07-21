import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
    Card,
    CardContent,
    TextField,
    MenuItem,
    Button,
    Box,
    Grid,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch, useSelector } from "react-redux";
import {
    getCategoryDetails,
    updateCategory,
} from "../../actions/categoryAction";
import { UPDATE_CATEGORY_RESET } from "../../constants/categoryConstants";

import Swal from 'sweetalert2'

const EditCategory = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { id } = useParams();

    const [categoryForm, setCategoryForm] = useState({
        name: "",
        type: "",
        description: "",
        subCategories: []
    });

    const [subCatInput, setSubCatInput] = useState('');

    const categoryTypes = ["Prescription", "Non-Prescription"];
    const { loading, category, error } = useSelector(
        (state) => state.categoryDetails
    );
    const { isUpdated, error: updateError } = useSelector(
        (state) => state.updateCategory
    );

    useEffect(() => {
        dispatch(getCategoryDetails(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (category) {
            setCategoryForm({
                name: category.name || "",
                type: category.type || "",
                description: category.description || "",
                subCategories: category.subCategories || []
            });
        }
    }, [category]);

    useEffect(() => {
        if (error) alert(error, { variant: "error" });
        if (updateError) {
            //  enqueueSnackbar(updateError, { variant: "error" });

            
        }
        if (isUpdated) {
            // alert("Category updated successfully!", { variant: "success" });

            Swal.fire({
                title: "Success!",
                text: "Category updated successfully!",
                icon: "success",
                timer: 2000,
            });
            dispatch({ type: UPDATE_CATEGORY_RESET });
            navigate("/admin/categories");
        }
    }, [error, updateError, isUpdated, dispatch, navigate, enqueueSnackbar]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateCategory(id, categoryForm));
    };

    const handleCancel = () => navigate("/admin/categories");

    return (
        <div className="min-h-screen w-full flex justify-center items-center ">
            <Card sx={{
                width: "850px",
                borderRadius: "14px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
            }}>
                <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-center mb-6">
                        Edit Category
                    </h2>

                    <Box component="form" onSubmit={handleSubmit} className="space-y-4">
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>

                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category Name *
                                </label>

                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    // label="Category Name *"
                                    value={categoryForm.name}
                                    onChange={(e) =>
                                        setCategoryForm({ ...categoryForm, name: e.target.value })
                                    }
                                    placeholder="Enter category name"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>

                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category Type *
                                </label>
                                <TextField
                                    fullWidth
                                    select
                                    variant="outlined"
                                    // label="Category Type *"
                                    value={categoryForm.type}
                                    onChange={(e) =>
                                        setCategoryForm({ ...categoryForm, type: e.target.value })
                                    }
                                >
                                    <MenuItem value="">
                                        <em>Select category type</em>
                                    </MenuItem>
                                    {categoryTypes.map((type) => (
                                        <MenuItem key={type} value={type}>{type}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>

                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>

                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            value={categoryForm.description}
                            onChange={(e) =>
                                setCategoryForm({ ...categoryForm, description: e.target.value })
                            }
                            placeholder="Enter category description"
                        />

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
                                    type="button"
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

                        <Box className="flex justify-end gap-2 mt-4">
                            <Button
                                variant="outlined"
                                onClick={handleCancel}
                                disabled={loading}
                                sx={{ minWidth: '120px' }}
                            >
                                CANCEL
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                className="bg-blue-600 hover:bg-blue-700"
                                disabled={loading}
                                sx={{ minWidth: '140px' }}
                            >
                                {loading ? "Updating..." : "UPDATE CATEGORY"}
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditCategory;
