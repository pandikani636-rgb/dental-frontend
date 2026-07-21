import { useState } from "react";
import { TextField, Button, Grid } from "@mui/material";

const Step3AdditionalInfo = ({ onSubmit, role }) => {
  const [formData, setFormData] = useState({
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

  const validateField = (name, value) => {
    let error = "";
    if (role === "DOCTOR") {
      switch (name) {
        case "clinicname":
          if (!value) error = "Clinic name is required";
          else if (!/^[a-zA-Z\s'-]+$/.test(value)) error = "Enter a correct Name";
          break;
        case "clinicid":
          if (!value) error = "Clinic ID is required";
          else if (!/^[A-Z0-9]{3,10}$/.test(value)) error = "Clinic ID must be 3-10 alphanumeric characters";
          break;
        case "qualification":
          if (!value) error = "Qualification is required";
          break;
        case "specialization":
          if (!value) error = "Specialization is required";
          break;
        case "registrationNumber":
          if (!value) error = "Registration number is required";
          break;
        case "medicalCouncilName":
          if (!value) error = "Medical council is required";
          break;
        case "yearsOfExperience":
          if (!value) error = "Experience is required";
          else if (!/^[0-9]+$/.test(value) || parseInt(value) < 0 || parseInt(value) > 50)
            error = "Experience must be a number between 0-50 years";
          break;
      }
    } else if (role === "STUDENT") {
      switch (name) {
        case "collegeName":
          if (!value) error = "College name is required";
          break;
        case "collegeId":
          if (!value) error = "College ID is required";
          break;
      }
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
    let fieldsToValidate = [];
    
    if (role === "DOCTOR") {
      fieldsToValidate = ["clinicname", "clinicid", "qualification", "specialization", "registrationNumber", "medicalCouncilName", "yearsOfExperience"];
    } else if (role === "STUDENT") {
      fieldsToValidate = ["collegeName", "collegeId"];
    }

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

  if (role === "CUSTOMER" || role === "admin") {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold text-green-600">Registration Complete!</h2>
        <p className="text-gray-600">Click below to complete your registration</p>
        <Button
          onClick={() => onSubmit({})}
          fullWidth
          variant="contained"
          sx={{ bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' }, py: 2 }}
        >
          Complete Registration
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-center mb-2 text-green-600">
        {role === "DOCTOR" ? "Professional Information" : "Student Information"}
      </h2>

      {role === "DOCTOR" && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Clinic Name" name="clinicname" value={formData.clinicname} onChange={handleChange} onBlur={handleBlur}
              error={touched.clinicname && Boolean(errors.clinicname)} helperText={touched.clinicname ? errors.clinicname : ""} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Clinic ID" name="clinicid" value={formData.clinicid} onChange={handleChange} onBlur={handleBlur}
              error={touched.clinicid && Boolean(errors.clinicid)} helperText={touched.clinicid ? errors.clinicid : ""} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Qualification" name="qualification" value={formData.qualification} onChange={handleChange} onBlur={handleBlur}
              error={touched.qualification && Boolean(errors.qualification)} helperText={touched.qualification ? errors.qualification : ""} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} onBlur={handleBlur}
              error={touched.specialization && Boolean(errors.specialization)} helperText={touched.specialization ? errors.specialization : ""} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Registration Number" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} onBlur={handleBlur}
              error={touched.registrationNumber && Boolean(errors.registrationNumber)} helperText={touched.registrationNumber ? errors.registrationNumber : ""} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Medical Council" name="medicalCouncilName" value={formData.medicalCouncilName} onChange={handleChange} onBlur={handleBlur}
              error={touched.medicalCouncilName && Boolean(errors.medicalCouncilName)} helperText={touched.medicalCouncilName ? errors.medicalCouncilName : ""} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth type="number" label="Experience (Years)" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} onBlur={handleBlur}
              error={touched.yearsOfExperience && Boolean(errors.yearsOfExperience)} helperText={touched.yearsOfExperience ? errors.yearsOfExperience : ""} />
          </Grid>
        </Grid>
      )}

      {role === "STUDENT" && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="College Name" name="collegeName" value={formData.collegeName} onChange={handleChange} onBlur={handleBlur}
              error={touched.collegeName && Boolean(errors.collegeName)} helperText={touched.collegeName ? errors.collegeName : ""} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="College ID" name="collegeId" value={formData.collegeId} onChange={handleChange} onBlur={handleBlur}
              error={touched.collegeId && Boolean(errors.collegeId)} helperText={touched.collegeId ? errors.collegeId : ""} />
          </Grid>
        </Grid>
      )}

      <Button type="submit" fullWidth variant="contained" sx={{ bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' }, py: 2 }}>
        Complete Registration
      </Button>
    </form>
  );
};

export default Step3AdditionalInfo;
