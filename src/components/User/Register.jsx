import { useEffect, useState } from "react";
import {
  TextField,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  Grid,
  CircularProgress,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, registerUser, clearRegistrationSuccess } from "../../actions/userAction";
import { getAllRoles } from "../../actions/rolesActions";
import BackdropLoader from "../Layouts/BackdropLoader";
import MetaData from "../Layouts/MetaData";
import Swal from "sweetalert2";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading,
    isAuthenticated,
    error,
    registrationSuccess,
    message
  } = useSelector((state) => state.user);

  const { roles = [], loading: roleLoading } = useSelector(
    (state) => state.roles || {}
  );

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Fetch roles
  useEffect(() => {
    dispatch(getAllRoles());
  }, [dispatch]);

  // Clear registration state on component mount
  useEffect(() => {
    return () => {
      dispatch(clearRegistrationSuccess());
    };
  }, [dispatch]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Validate individual field
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        } else if (!/^[a-zA-Z\s'-]+$/.test(value)) {
          error = "Enter a valid name (letters, spaces, hyphens, and apostrophes only)";
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
        } else if (!/(?=.*[A-Z])/.test(value)) {
          error = "Password must contain at least one uppercase letter";
        } else if (!/(?=.*[a-z])/.test(value)) {
          error = "Password must contain at least one lowercase letter";
        } else if (!/(?=.*\d)/.test(value)) {
          error = "Password must contain at least one number";
        } else if (!/(?=.*[@$!%*?&])/.test(value)) {
          error = "Password must contain at least one special character (@$!%*?&)";
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
        if (formData.role === "DOCTOR") {
          if (!value.trim()) {
            error = "Clinic name is required";
          }
        }
        break;

      case "clinicid":
        if (formData.role === "DOCTOR") {
          if (!value.trim()) {
            error = "Clinic ID is required";
          }
        }
        break;

      case "qualification":
        if (formData.role === "DOCTOR") {
          if (!value.trim()) {
            error = "Qualification is required";
          }
        }
        break;

      case "specialization":
        if (formData.role === "DOCTOR") {
          if (!value.trim()) {
            error = "Specialization is required";
          }
        }
        break;

      case "registrationNumber":
        if (formData.role === "DOCTOR") {
          if (!value.trim()) {
            error = "Registration number is required";
          }
        }
        break;

      case "medicalCouncilName":
        if (formData.role === "DOCTOR") {
          if (!value.trim()) {
            error = "Medical council name is required";
          }
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
        if (formData.role === "STUDENT") {
          if (!value.trim()) {
            error = "College name is required";
          }
        }
        break;

      case "collegeId":
        if (formData.role === "STUDENT") {
          if (!value.trim()) {
            error = "College ID is required";
          }
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

    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));

    // Validate the changed field
    const error = validateField(name, name === "yearsOfExperience" ? value.replace(/\D/g, '') : value);

    // Special handling for password confirmation
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

    // Validate all required fields
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

    // Mark all fields as touched for UI feedback
    const allTouched = {};
    fieldsToValidate.forEach(field => {
      allTouched[field] = true;
    });
    setTouched(prev => ({ ...prev, ...allTouched }));

    return Object.keys(temp).length === 0;
  };

  const scrollToFirstError = (errorsObj) => {
    // If specific errors provided, use those keys, otherwise find from DOM
    const firstErrorField = Object.keys(errorsObj)[0];
    if (firstErrorField) {
      const element = document.getElementsByName(firstErrorField)[0];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);

      // Get current errors to scroll
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

      scrollToFirstError(temp);

      Swal.fire({
        title: "Validation Error!",
        text: "Please fix the errors in the form",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      gender: formData.gender,
      role: formData.role,
      password: formData.password,
      cpassword: formData.cpassword,
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

    console.log("FINAL PAYLOAD =>", payload);

    dispatch(registerUser(payload));
    setIsSubmitting(false);
  };

  useEffect(() => {
    // Revalidate cpassword when password changes
    if (touched.cpassword && formData.cpassword) {
      const error = validateField("cpassword", formData.cpassword);
      setErrors(prev => ({ ...prev, cpassword: error }));
    }
  }, [formData.password, formData.cpassword, touched.cpassword]);

  // Handle errors and registration success
  useEffect(() => {
    if (error) {
      if (error === "Phone Number already registered") {
        setErrors(prev => ({ ...prev, phone: "Phone number already registered" }));
        setTouched(prev => ({ ...prev, phone: true }));
        setIsSubmitting(false);
        dispatch(clearErrors());

        // Scroll to phone field
        setTimeout(() => {
          scrollToFirstError({ phone: true });
        }, 100);
      } else {
        Swal.fire({
          title: "Registration Failed!",
          text: error,
          icon: "error",
          timer: 4000,
        }).then(() => {
          dispatch(clearErrors());
          setIsSubmitting(false);
        });
      }
    }

    // Handle registration success
    if (registrationSuccess) {
      Swal.fire({
        title: "Success!",
        text: message || "Account created successfully! Please login to continue.",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      }).then(() => {
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

        // Reset validation states
        setErrors({});
        setTouched({});
        setIsSubmitting(false);

        // Clear registration success state
        dispatch(clearRegistrationSuccess());

        // Navigate to login page
        navigate("/login");
      });
    }
  }, [error, registrationSuccess, message, dispatch, navigate]);

  // Close success alert
  const handleCloseAlert = () => {
    setShowSuccessAlert(false);
  };

  return (
    <>
      <MetaData title="Register" />
      {loading && <BackdropLoader />}

      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          {message || "Registration successful!"}
        </Alert>
      </Snackbar>

      <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-4 px-2 sm:py-12 sm:px-4">
        <div className="w-full max-w-6xl mx-auto mt-24">
          {/* Mobile Header */}
          <div className="sm:hidden text-center mb-6 pt-16">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-600 to-blue-400 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <span className="text-3xl">🏥</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h1>
            <p className="text-gray-600">Start your journey today</p>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              {/* Desktop Sidebar */}
              <div className="hidden sm:flex flex-col justify-center items-center w-full sm:w-2/5 relative overflow-hidden bg-gradient-to-br from-green-600 to-blue-400 min-h-[600px]">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative z-10 text-center p-8">
                  <div className="mb-8">
                    <div className="w-32 h-32 mx-auto bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30 shadow-2xl">
                      <span className="text-6xl animate-pulse">🏥</span>
                    </div>
                  </div>
                  <h1 className="font-bold text-white text-3xl mb-4 drop-shadow-lg">Join Us</h1>
                  <p className="text-white text-lg opacity-90">Create your account and manage your dental needs</p>
                </div>
              </div>

              {/* Form Section */}
              <div className="flex-1 p-4 sm:p-8 lg:p-12">
                <div className="max-w-2xl mx-auto">
                  <form
                    onSubmit={handleRegister}
                    className="space-y-4 sm:space-y-6"
                    noValidate
                  >
          <h2 className="text-2xl font-bold text-center mb-4 text-green-700">
            Create Account
          </h2>

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
                disabled={isSubmitting || loading}
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
                disabled={isSubmitting || loading}
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
                disabled={isSubmitting || loading}
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
                disabled={isSubmitting || loading}
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
              disabled={isSubmitting || loading}
            >
              <FormControlLabel
                value="male"
                control={<Radio />}
                label="Male"
              />
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
              {/* <FormControlLabel
                value="transgender"
                control={<Radio />}
                label="Transgender"
              /> */}
              <FormControlLabel
                value="others"
                control={<Radio />}
                label="Others"
              />
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
            disabled={isSubmitting || loading || roleLoading}
            required
          >
            <MenuItem value="">Select Role</MenuItem>
            {roleLoading ? (
              <MenuItem disabled>Loading roles...</MenuItem>
            ) : (
              roles
              .filter(r => r.name !== "Admin")
              .map((r) => (
                <MenuItem
                  key={r._id}
                  value={r.name.toUpperCase()}
                >
                  {r.name}
                </MenuItem>
              ))
            )}
          </TextField>

          {/* Doctor Section */}
          {formData.role === "DOCTOR" && (
            <div className="border-t pt-4 space-y-4">
              <h3 className="font-semibold text-gray-800 text-lg">
                Professional Information
              </h3>

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
                    disabled={isSubmitting || loading}
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
                    disabled={isSubmitting || loading}
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
                    disabled={isSubmitting || loading}
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
                    disabled={isSubmitting || loading}
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
                    disabled={isSubmitting || loading}
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
                    disabled={isSubmitting || loading}
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
                    disabled={isSubmitting || loading}
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
              <h3 className="font-semibold text-gray-800 text-lg">
                Student Information
              </h3>

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
                    disabled={isSubmitting || loading}
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
                    disabled={isSubmitting || loading}
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
                disabled={isSubmitting || loading}
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
                disabled={isSubmitting || loading}
                required
              />
            </Grid>
          </Grid>

          <div className="pt-4">
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting || loading}
              sx={{
                background: 'linear-gradient(135deg, #16a34a 0%, #3b82f6 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #15803d 0%, #2563eb 100%)',
                },
                '&:disabled': {
                  background: '#cccccc',
                  color: '#666666',
                },
                py: 2,
                fontSize: '1.1rem',
                fontWeight: '600',
                textTransform: 'none',
                borderRadius: '10px',
                transition: 'all 0.3s ease',
              }}
            >
              {isSubmitting || loading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                'Create Account'
              )}
            </Button>
          </div>

          <p className="text-center text-gray-600 text-sm pt-2">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-600 hover:text-green-800 font-medium transition-colors duration-200"
              style={{ pointerEvents: (isSubmitting || loading) ? 'none' : 'auto' }}
            >
              Login here
            </Link>
          </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
      </main>
    </>
  );
};

export default Register;