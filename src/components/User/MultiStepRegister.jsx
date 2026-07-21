import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { 
  registerUser, 
  verifyOTP, 
  storeRegistrationData, 
  setRegistrationStep,
  clearRegistrationData,
  clearErrors 
} from "../../actions/userAction";
import { getAllRoles } from "../../actions/rolesActions";
import Step1BasicInfo from "./Steps/Step1BasicInfo";
import Step2OTPVerification from "./Steps/Step2OTPVerification";
import Step3AdditionalInfo from "./Steps/Step3AdditionalInfo";
import BackdropLoader from "../Layouts/BackdropLoader";
import MetaData from "../Layouts/MetaData";

const MultiStepRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, registrationSuccess } = useSelector((state) => state.user);
  const { step, data, otpVerified } = useSelector((state) => state.registration);
  const { roles = [] } = useSelector((state) => state.roles || {});

  useEffect(() => {
    dispatch(getAllRoles());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        title: "Error!",
        text: error,
        icon: "error",
      });
      dispatch(clearErrors());
    }

    if (registrationSuccess) {
      Swal.fire({
        title: "Success!",
        text: "Account created successfully! Please login to continue.",
        icon: "success",
        timer: 2000,
      }).then(() => {
        dispatch(clearRegistrationData());
        navigate("/login");
      });
    }
  }, [error, registrationSuccess, dispatch, navigate]);

  const handleStep1Submit = (formData) => {
    dispatch(storeRegistrationData(formData));
    dispatch(setRegistrationStep(2));
  };

  const handleOTPVerify = (otp) => {
    dispatch(verifyOTP(data.email, otp));
  };

  const handleStep3Submit = (additionalData) => {
    const finalData = { ...data, ...additionalData };
    dispatch(registerUser(finalData));
  };

  return (
    <>
      <MetaData title="Register" />
      {loading && <BackdropLoader />}

      <div className="min-h-[calc(100vh-80px)] flex justify-center items-start bg-gradient-to-br from-green-50 via-white to-blue-50 px-4 mt-20">
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg border border-green-100">
          {/* Step Indicator */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${step >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium">Basic Info</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center ${step >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium">OTP Verify</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center ${step >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
                  3
                </div>
                <span className="ml-2 text-sm font-medium">Complete</span>
              </div>
            </div>
          </div>

          {/* Step Content */}
          {step === 1 && <Step1BasicInfo onSubmit={handleStep1Submit} roles={roles} />}
          {step === 2 && <Step2OTPVerification email={data.email} onVerify={handleOTPVerify} />}
          {step === 3 && <Step3AdditionalInfo onSubmit={handleStep3Submit} role={data.role} />}
        </div>
      </div>
    </>
  );
};

export default MultiStepRegister;
