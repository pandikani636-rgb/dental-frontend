import { useState } from "react";
import { TextField, Button } from "@mui/material";

const Step2OTPVerification = ({ email, onVerify }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    onVerify(otp);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-center mb-2 text-green-600">Verify OTP</h2>
      <p className="text-center text-gray-600 mb-4">
        We've sent a verification code to <strong>{email}</strong>
      </p>

      <TextField
        fullWidth
        label="Enter OTP"
        name="otp"
        value={otp}
        onChange={(e) => {
          setOtp(e.target.value);
          setError("");
        }}
        error={Boolean(error)}
        helperText={error}
        inputProps={{ maxLength: 6 }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{
          bgcolor: '#16a34a',
          '&:hover': { bgcolor: '#15803d' },
          py: 2,
        }}
      >
        Verify OTP
      </Button>
    </form>
  );
};

export default Step2OTPVerification;
