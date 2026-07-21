import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createUser, clearErrors, clearRegistrationSuccess } from '../../actions/userAction';
import { getAllRoles } from '../../actions/rolesActions';
import MetaData from '../Layouts/MetaData';
import Swal from 'sweetalert2';

const AddUser = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, error, registrationSuccess } = useSelector((state) => state.user);
    const { roles = [], loading: roleLoading } = useSelector((state) => state.roles || {});

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        gender: "",
        role: "",
        password: "",
        cpassword: "",
        clinicname: "",
        clinicid: "",
        qualification: "",
        specialization: "",
        registrationNumber: "",
        medicalCouncilName: "",
        yearsOfExperience: "",
        collegeName: "",
        collegeId: "",
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Fetch roles on component mount
    useEffect(() => {
        dispatch(getAllRoles());
    }, [dispatch]);

    // Handle API responses
    useEffect(() => {
        if (error) {
            Swal.fire({
                title: "Failed!",
                text: error,
                icon: "error",
                timer: 2000,
                showConfirmButton: false
            });
            dispatch(clearErrors());
        }

        if (registrationSuccess) {
            Swal.fire({
                title: "Success!",
                text: "User added successfully!",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });
            // Reset form
            setFormData({
                name: "",
                email: "",
                phone: "",
                address: "",
                gender: "",
                role: "",
                password: "",
                cpassword: "",
                clinicname: "",
                clinicid: "",
                qualification: "",
                specialization: "",
                registrationNumber: "",
                medicalCouncilName: "",
                yearsOfExperience: "",
                collegeName: "",
                collegeId: "",
            });
            setErrors({});
            setTouched({});
            dispatch(clearRegistrationSuccess());
            navigate("/admin/users");
        }
    }, [error, registrationSuccess, dispatch, navigate]);

    // Validate individual field
    const validateField = (name, value) => {
        let error = "";

        switch (name) {
            case "name":
                if (!value.trim()) {
                    error = "Name is required";
                } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                    error = "Enter a valid name (letters, spaces only)";
                }
                break;

            case "email":
                if (!value.trim()) {
                    error = "Email is required";
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
                    error = "Enter a valid email address";
                }
                break;

            case "phone":
                if (!value.trim()) {
                    error = "Phone number is required";
                } else if (!/^[0-9]{10}$/.test(value)) {
                    error = "Phone number must be exactly 10 digits";
                }
                break;

            case "address":
                if (!value.trim()) {
                    error = "Address is required";
                }
                break;

            case "gender":
                if (!value) {
                    error = "Gender is required";
                }
                break;

            case "role":
                if (!value) {
                    error = "Role is required";
                }
                break;

            case "password":
                if (!value) {
                    error = "Password is required";
                } else if (value.length < 8) {
                    error = "Password must be at least 8 characters";
                }
                break;

            case "cpassword":
                if (!value) {
                    error = "Confirm password is required";
                } else if (value !== formData.password) {
                    error = "Passwords do not match";
                }
                break;

            case "clinicname":
                if (formData.role === "DOCTOR" && !value.trim()) {
                    error = "Clinic name is required";
                }
                break;

            case "clinicid":
                if (formData.role === "DOCTOR" && !value.trim()) {
                    error = "Clinic ID is required";
                }
                break;

            case "qualification":
                if (formData.role === "DOCTOR" && !value.trim()) {
                    error = "Qualification is required";
                }
                break;

            case "specialization":
                if (formData.role === "DOCTOR" && !value.trim()) {
                    error = "Specialization is required";
                }
                break;

            case "registrationNumber":
                if (formData.role === "DOCTOR" && !value.trim()) {
                    error = "Registration number is required";
                }
                break;

            case "medicalCouncilName":
                if (formData.role === "DOCTOR" && !value.trim()) {
                    error = "Medical council name is required";
                }
                break;

            case "yearsOfExperience":
                if (formData.role === "DOCTOR") {
                    if (!value) {
                        error = "Experience is required";
                    } else if (!/^\d+$/.test(value) || parseInt(value) < 0 || parseInt(value) > 50) {
                        error = "Experience must be between 0-50 years";
                    }
                }
                break;

            case "collegeName":
                if (formData.role === "STUDENT" && !value.trim()) {
                    error = "College name is required";
                }
                break;

            case "collegeId":
                if (formData.role === "STUDENT" && !value.trim()) {
                    error = "College ID is required";
                }
                break;
        }

        return error;
    };

    const handleDataChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({ 
            ...prev, 
            [name]: name === "yearsOfExperience" ? value.replace(/\D/g, '') : value 
        }));

        setTouched(prev => ({ ...prev, [name]: true }));

        const error = validateField(name, name === "yearsOfExperience" ? value.replace(/\D/g, '') : value);

        if (name === "password") {
            setErrors(prev => ({
                ...prev,
                [name]: error,
                cpassword: formData.cpassword ? validateField("cpassword", formData.cpassword) : prev.cpassword
            }));
        } else {
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));

        const error = validateField(name, formData[name]);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const validateForm = () => {
        const temp = {};

        const fieldsToValidate = [
            "name", "email", "phone", "address", "gender", "role", "password", "cpassword"
        ];

        if (formData.role === "DOCTOR") {
            fieldsToValidate.push(
                "clinicname", "clinicid", "qualification", "specialization",
                "registrationNumber", "medicalCouncilName", "yearsOfExperience"
            );
        }

        if (formData.role === "STUDENT") {
            fieldsToValidate.push("collegeName", "collegeId");
        }

        fieldsToValidate.forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) {
                temp[field] = error;
            }
        });

        setErrors(temp);
        
        const allTouched = {};
        fieldsToValidate.forEach(field => {
            allTouched[field] = true;
        });
        setTouched(prev => ({ ...prev, ...allTouched }));

        return Object.keys(temp).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            Swal.fire({
                title: "Validation Error!",
                text: "Please fix the errors in the form",
                icon: "error",
                timer: 1500,
                showConfirmButton: false,
            });
            return;
        }

        // Create simplified payload matching your MongoDB schema
        const payload = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            address: formData.address.trim(),
            gender: formData.gender,
            role: formData.role === "ADMIN" ? "admin" : formData.role, // Convert ADMIN to lowercase
            password: formData.password,
        };

        // Doctor specific fields
        if (formData.role === "DOCTOR") {
            payload.clinicname = formData.clinicname.trim();
            payload.clinicid = formData.clinicid.trim();
            payload.qualification = formData.qualification.trim();
            payload.specialization = formData.specialization.trim();
            payload.registrationNumber = formData.registrationNumber.trim();
            payload.medicalCouncilName = formData.medicalCouncilName.trim();
            payload.yearsOfExperience = parseInt(formData.yearsOfExperience) || 0;
        }

        // Student specific fields
        if (formData.role === "STUDENT") {
            payload.collegeName = formData.collegeName.trim();
            payload.collegeId = formData.collegeId.trim();
        }

        dispatch(createUser(payload));
    };

    return (
        <>
            <MetaData title="Add User | Admin" />

            <div className="flex justify-between items-center">
                <h1 className="text-lg font-medium uppercase">Add New User</h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col bg-white rounded-lg shadow p-6">
                <div className="flex flex-col gap-4">
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleDataChange}
                                onBlur={handleBlur}
                                error={touched.name && Boolean(errors.name)}
                                helperText={touched.name && errors.name}
                                disabled={loading}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleDataChange}
                                onBlur={handleBlur}
                                error={touched.email && Boolean(errors.email)}
                                helperText={touched.email && errors.email}
                                disabled={loading}
                                required
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleDataChange}
                                onBlur={handleBlur}
                                error={touched.phone && Boolean(errors.phone)}
                                helperText={touched.phone && errors.phone}
                                disabled={loading}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={handleDataChange}
                                onBlur={handleBlur}
                                error={touched.address && Boolean(errors.address)}
                                helperText={touched.address && errors.address}
                                disabled={loading}
                                required
                            />
                        </Grid>
                    </Grid>

                    {/* Gender */}
                    <div>
                        <p className="text-sm font-medium mb-1 text-gray-700">Gender *</p>
                        <RadioGroup
                            row
                            name="gender"
                            value={formData.gender}
                            onChange={handleDataChange}
                            onBlur={handleBlur}
                            disabled={loading}
                        >
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                            <FormControlLabel value="others" control={<Radio />} label="Others" />
                        </RadioGroup>
                        {touched.gender && errors.gender && (
                            <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                        )}
                    </div>

                    <TextField
                        fullWidth
                        select
                        label="Role"
                        name="role"
                        value={formData.role}
                        onChange={handleDataChange}
                        onBlur={handleBlur}
                        error={touched.role && Boolean(errors.role)}
                        helperText={touched.role && errors.role}
                        disabled={loading || roleLoading}
                        required
                    >
                        <MenuItem value="">Select Role</MenuItem>
                        {roleLoading ? (
                            <MenuItem disabled>Loading roles...</MenuItem>
                        ) : (
                            roles
                            .map((r) => (
                                <MenuItem key={r._id} value={r.name.toUpperCase()}>
                                    {r.name}
                                </MenuItem>
                            ))
                        )}
                    </TextField>

                    {/* Doctor Section */}
                    {formData.role === "DOCTOR" && (
                        <div className="border-t pt-4 space-y-4">
                            <h3 className="font-semibold text-gray-800 text-lg">Professional Information</h3>

                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Clinic Name"
                                        name="clinicname"
                                        value={formData.clinicname}
                                        onChange={handleDataChange}
                                        onBlur={handleBlur}
                                        error={touched.clinicname && Boolean(errors.clinicname)}
                                        helperText={touched.clinicname && errors.clinicname}
                                        disabled={loading}
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Clinic ID"
                                        name="clinicid"
                                        value={formData.clinicid}
                                        onChange={handleDataChange}
                                        onBlur={handleBlur}
                                        error={touched.clinicid && Boolean(errors.clinicid)}
                                        helperText={touched.clinicid && errors.clinicid}
                                        disabled={loading}
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Qualification"
                                        name="qualification"
                                        value={formData.qualification}
                                        onChange={handleDataChange}
                                        onBlur={handleBlur}
                                        error={touched.qualification && Boolean(errors.qualification)}
                                        helperText={touched.qualification && errors.qualification}
                                        disabled={loading}
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Specialization"
                                        name="specialization"
                                        value={formData.specialization}
                                        onChange={handleDataChange}
                                        onBlur={handleBlur}
                                        error={touched.specialization && Boolean(errors.specialization)}
                                        helperText={touched.specialization && errors.specialization}
                                        disabled={loading}
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Registration Number"
                                        name="registrationNumber"
                                        value={formData.registrationNumber}
                                        onChange={handleDataChange}
                                        onBlur={handleBlur}
                                        error={touched.registrationNumber && Boolean(errors.registrationNumber)}
                                        helperText={touched.registrationNumber && errors.registrationNumber}
                                        disabled={loading}
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Medical Council"
                                        name="medicalCouncilName"
                                        value={formData.medicalCouncilName}
                                        onChange={handleDataChange}
                                        onBlur={handleBlur}
                                        error={touched.medicalCouncilName && Boolean(errors.medicalCouncilName)}
                                        helperText={touched.medicalCouncilName && errors.medicalCouncilName}
                                        disabled={loading}
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Years of Experience"
                                        name="yearsOfExperience"
                                        type="number"
                                        value={formData.yearsOfExperience}
                                        onChange={handleDataChange}
                                        onBlur={handleBlur}
                                        error={touched.yearsOfExperience && Boolean(errors.yearsOfExperience)}
                                        helperText={touched.yearsOfExperience && errors.yearsOfExperience}
                                        disabled={loading}
                                        inputProps={{ min: 0, max: 50 }}
                                        required
                                    />
                                </Grid>
                            </Grid>
                        </div>
                    )}

                    {/* Student Section */}
                    {formData.role === "STUDENT" && (
                        <div className="border-t pt-4 space-y-4">
                            <h3 className="font-semibold text-gray-800 text-lg">Student Information</h3>

                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="College Name"
                                        name="collegeName"
                                        value={formData.collegeName}
                                        onChange={handleDataChange}
                                        onBlur={handleBlur}
                                        error={touched.collegeName && Boolean(errors.collegeName)}
                                        helperText={touched.collegeName && errors.collegeName}
                                        disabled={loading}
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="College ID"
                                        name="collegeId"
                                        value={formData.collegeId}
                                        onChange={handleDataChange}
                                        onBlur={handleBlur}
                                        error={touched.collegeId && Boolean(errors.collegeId)}
                                        helperText={touched.collegeId && errors.collegeId}
                                        disabled={loading}
                                        required
                                    />
                                </Grid>
                            </Grid>
                        </div>
                    )}

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="password"
                                label="Password"
                                name="password"
                                value={formData.password}
                                onChange={handleDataChange}
                                onBlur={handleBlur}
                                error={touched.password && Boolean(errors.password)}
                                helperText={touched.password && errors.password}
                                disabled={loading}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="password"
                                label="Confirm Password"
                                name="cpassword"
                                value={formData.cpassword}
                                onChange={handleDataChange}
                                onBlur={handleBlur}
                                error={touched.cpassword && Boolean(errors.cpassword)}
                                helperText={touched.cpassword && errors.cpassword}
                                disabled={loading}
                                required
                            />
                        </Grid>
                    </Grid>

                    <div className="flex gap-4 mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary-blue text-white py-2 px-6 rounded shadow hover:shadow-lg font-medium disabled:bg-gray-400"
                        >
                            {loading ? "Adding User..." : "Add User"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/admin/users")}
                            disabled={loading}
                            className="bg-gray-500 text-white py-2 px-6 rounded shadow hover:shadow-lg font-medium disabled:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default AddUser;