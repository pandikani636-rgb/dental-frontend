import { useState } from "react";
import { TextField, MenuItem, Radio, RadioGroup, FormControlLabel, Grid, Button } from "@mui/material";

const Step1BasicInfo = ({ onSubmit, roles }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    role: "",
    password: "",
    cpassword: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value) error = "Name is required";
        else if (!/^[a-zA-Z\s'-]+$/.test(value)) error = "Enter a correct Name";
        break;
      case "email":
        if (!value) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/.test(value)) error = "Enter a correct Email";
        break;
      case "phone":
        if (!value) error = "Phone number is required";
        else if (!/^[0-9]{10}$/.test(value)) error = "Phone number must be 10 digits";
        break;
      case "address":
        if (!value) error = "Address is required";
        break;
      case "gender":
        if (!value) error = "Gender is required";
        break;
      case "role":
        if (!value) error = "Role is required";
        break;
      case "password":
        if (!value) error = "Password is required";
        else if (!/^(?=(?:.*[A-Z]){1,2})(?=(?:.*[a-z]){1,2})(?=(?:.*\d){1,2})(?=(?:.*[@$!%*?&]){1,2})[A-Za-z\d@$!%*?&]{8,}$/.test(value))
          error = "Password needs uppercase, lowercase, special char, numbers";
        break;
      case "cpassword":
        if (!value) error = "Confirm password is required";
        else if (formData.password !== value) error = "Passwords do not match";
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fieldsToValidate = ["name", "email", "phone", "address", "gender", "role", "password", "cpassword"];
    const temp = {};
    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) temp[field] = error;
    });
    setErrors(temp);
    if (Object.keys(temp).length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-center mb-2 text-green-600">Basic Information</h2>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Full Name" name="name" value={formData.name} onChange={handleChange} onBlur={handleBlur}
            error={touched.name && Boolean(errors.name)} helperText={touched.name ? errors.name : ""} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur}
            error={touched.email && Boolean(errors.email)} helperText={touched.email ? errors.email : ""} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Phone" name="phone" value={formData.phone} onChange={handleChange} onBlur={handleBlur}
            error={touched.phone && Boolean(errors.phone)} helperText={touched.phone ? errors.phone : ""} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} onBlur={handleBlur}
            error={touched.address && Boolean(errors.address)} helperText={touched.address ? errors.address : ""} />
        </Grid>
      </Grid>

      <div>
        <p className="text-sm font-medium mb-1">Gender</p>
        <RadioGroup row name="gender" value={formData.gender} onChange={handleChange} onBlur={handleBlur}>
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="female" control={<Radio />} label="Female" />
          <FormControlLabel value="transgender" control={<Radio />} label="Transgender" />
          <FormControlLabel value="others" control={<Radio />} label="Others" />
        </RadioGroup>
        {touched.gender && errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
      </div>

      <TextField fullWidth select label="Role" name="role" value={formData.role} onChange={handleChange} onBlur={handleBlur}
        error={touched.role && Boolean(errors.role)} helperText={touched.role ? errors.role : ""}>
        {roles.map((r) => (
          <MenuItem key={r._id} value={r.name === "Admin" ? "admin" : r.name.toUpperCase()}>{r.name}</MenuItem>
        ))}
      </TextField>

      <TextField fullWidth type="password" label="Password" name="password" value={formData.password} onChange={handleChange} onBlur={handleBlur}
        error={touched.password && Boolean(errors.password)} helperText={touched.password ? errors.password : ""} />

      <TextField fullWidth type="password" label="Confirm Password" name="cpassword" value={formData.cpassword} onChange={handleChange} onBlur={handleBlur}
        error={touched.cpassword && Boolean(errors.cpassword)} helperText={touched.cpassword ? errors.cpassword : ""} />

      <Button type="submit" fullWidth variant="contained" sx={{ bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' }, py: 2 }}>
        Continue to OTP Verification
      </Button>
    </form>
  );
};

export default Step1BasicInfo;
