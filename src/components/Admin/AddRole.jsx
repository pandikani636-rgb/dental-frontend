import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
    Card,
    CardContent,
    TextField,
    Button,
    Box,
    Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useDispatch, useSelector } from 'react-redux';
import { createRole, clearErrors } from '../../actions/rolesActions';
import { NEW_ROLE_RESET } from '../../constants/rolesConstants';
import Swal from 'sweetalert2'



const AddRole = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const { loading, error, success } = useSelector((state) => state.newRole || {});

    const [roleForm, setRoleForm] = useState({ name: '' });
    const [validation, setValidation] = useState({});

    // -----------------------------------------
    // Validate Fields
    // -----------------------------------------
    const validateForm = () => {
        let errors = {};
        const trimmedName = roleForm.name.trim();

        // Regex: Starts with one Capital letter, followed by lowercase letters or spaces.
        // No numbers or special characters allowed.
        const rolePattern = /^[A-Z][a-z\s]*$/;

        if (!trimmedName) {
            errors.name = "Role name is required";
        } else if (!rolePattern.test(trimmedName)) {
            errors.name = "Role name must start with a Capital letter and contain only lowercase letters (no numbers/special chars)";
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

        dispatch(createRole({ name: roleForm.name }));
    };

    // -----------------------------------------
    // Handle API Responses
    // -----------------------------------------
    useEffect(() => {
        if (error) {
            // alert(error, { variant: "error" });

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
            Swal.fire({
                title: "Success!",
                text: "Role added successfully!",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });
            navigate("/admin/roles");
            dispatch({ type: NEW_ROLE_RESET });
        }
    }, [error, success, dispatch, enqueueSnackbar, navigate]);

    const handleCancel = () => navigate("/admin/roles");

    return (
        <div className="min-h-screen w-full flex justify-center items-center p-6 bg-gray-50">
            <Card
                sx={{
                    width: "500px",
                    borderRadius: "14px",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
                }}
            >


                <h2 className="text-2xl font-bold text-gray-800 text-center mt-4 mb-4">
                    Add New Role
                </h2>

                <CardContent sx={{ padding: "28px 40px" }}>
                    <Box component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {/* Role Name */}
                            <Grid item xs={12}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Role Name *
                                </label>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Enter role name"
                                    value={roleForm.name}
                                    onChange={(e) =>
                                        setRoleForm({ name: e.target.value })
                                    }
                                    error={Boolean(validation.name)}
                                    helperText={validation.name}
                                />
                            </Grid>
                        </Grid>

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
                                {loading ? "Adding..." : "ADD ROLE"}
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddRole;
