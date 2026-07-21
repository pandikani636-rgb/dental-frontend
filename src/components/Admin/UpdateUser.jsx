import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
    Card,
    CardContent,
    TextField,
    MenuItem,
    Button,
    Box,
    Grid,
    FormControlLabel,
    Radio,
    RadioGroup
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MetaData from '../Layouts/MetaData';
import Swal from 'sweetalert2'




const UpdateUser = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { id } = useParams();

    const [userForm, setUserForm] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        gender: 'male',
        role: 'user',
        phone: '+91 9876543210',
        address: '123 Main Street, City, State - 12345'
    });

    const roles = ["user", "admin"];

    // -----------------------------------------
    // Handle Submit
    // -----------------------------------------
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!userForm.name.trim()) {
            enqueueSnackbar("User name is required", { variant: "error" });
            return;
        }

        if (!userForm.email.trim()) {
            enqueueSnackbar("Email is required", { variant: "error" });
            return;
        }

        // Simulate API call
        // enqueueSnackbar("User profile updated successfully!", { variant: "success" });

        Swal.fire({
            title: "Success!",
            text: "User updated successfully!",
            icon: "success",
            timer:2000,
        });
        navigate("/admin/users");
    };

    const handleCancel = () => {
        navigate('/admin/users');
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <MetaData title="Admin: Edit Profile | Medical Store" />

            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={handleCancel}
                        className="text-gray-600 hover:text-gray-800"
                    >
                    </Button>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 text-center">
                        Edit Profile
                    </h2>
                </div>
            </div>

            {/* Edit Profile Form */}
            <Card className="shadow-lg border-0 max-w-4xl mx-auto">
                <CardContent className="p-6">
                    <Box component="form" onSubmit={handleSubmit} className="space-y-6">
                        <Grid container spacing={3}>
                            {/* Full Name */}
                            <Grid item xs={12} md={6}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={userForm.name}
                                    onChange={(e) =>
                                        setUserForm({ ...userForm, name: e.target.value })
                                    }
                                    placeholder="Enter full name"
                                />
                            </Grid>

                            {/* Email */}
                            <Grid item xs={12} md={6}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <TextField
                                    fullWidth
                                    type="email"
                                    variant="outlined"
                                    value={userForm.email}
                                    onChange={(e) =>
                                        setUserForm({ ...userForm, email: e.target.value })
                                    }
                                    placeholder="Enter email address"
                                />
                            </Grid>

                            {/* Phone */}
                            <Grid item xs={12} md={6}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={userForm.phone}
                                    onChange={(e) =>
                                        setUserForm({ ...userForm, phone: e.target.value })
                                    }
                                    placeholder="Enter phone number"
                                />
                            </Grid>

                            {/* Role */}
                            <Grid item xs={12} md={6}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Role *
                                </label>
                                <TextField
                                    fullWidth
                                    select
                                    variant="outlined"
                                    value={userForm.role}
                                    onChange={(e) =>
                                        setUserForm({ ...userForm, role: e.target.value })
                                    }
                                >
                                    {roles.map((role) => (
                                        <MenuItem key={role} value={role}>
                                            {role.charAt(0).toUpperCase() + role.slice(1)}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            {/* Gender */}
                            <Grid item xs={12}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Gender *
                                </label>
                                <RadioGroup
                                    row
                                    value={userForm.gender}
                                    onChange={(e) => setUserForm({ ...userForm, gender: e.target.value })}
                                >
                                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                                </RadioGroup>
                            </Grid>
                        </Grid>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address
                            </label>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                value={userForm.address}
                                onChange={(e) =>
                                    setUserForm({ ...userForm, address: e.target.value })
                                }
                                placeholder="Enter address"
                            />
                        </div>

                        {/* Buttons */}
                        <Box className="flex justify-end gap-2 pt-4">
                            <Button
                                variant="outlined"
                                onClick={handleCancel}
                                sx={{ minWidth: '200px' }}
                            >
                                CANCEL
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                className="bg-blue-600 hover:bg-blue-700"
                                sx={{ minWidth: '200px' }}
                            >
                                UPDATE PROFILE
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
};

export default UpdateUser;
