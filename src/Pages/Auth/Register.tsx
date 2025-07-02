



import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import backgroundImages from "../../../public/background";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import OTPVerificationPopup from "./OtpVerificationPopup";
import { useRegister } from "../../hooks/useRegistration";


interface RegistrationProps {
  email?: string;
}


const ErrorMessage = ({ message }: { message?: string }) =>
  message ? <p className="mt-1 text-xs text-red-500">{message}</p> : null;


const Registration: React.FC<RegistrationProps> = () => {
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
 
  const {
    isVerifyingEmail,
    isEmailVerified,
    isOtpVerified,
    isOtpModalVisible,
    isPasswordVisible,
    isConfirmPasswordVisible,
    emailError,
    registrationError,
    hasLeftOtpUnverified,
    form,
    setValue,
    verifyEmail,
    handleRegistrationSubmit,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    setIsOtpModalVisible,
    setIsOtpVerified,
    clearEmailError,
    clearRegistrationError,
    handleOtpModalClose,
    isSubmitting,
  } = useRegister();


  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = form;


  // Optimized background image preloading
  useEffect(() => {
    const img = new Image();
    img.onload = () => setBackgroundLoaded(true);
    img.onerror = () => setBackgroundLoaded(true); // Still show content even if image fails
    img.src = "/background/landingHeroImage.png";
   
    // Preload immediately without waiting
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = '/background/landingHeroImage.png';
    document.head.appendChild(link);
   
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);


  useEffect(() => {
    register("phoneNumber", {
      required: "Phone number is required",
      pattern: {
        value: /^[+]?[0-9]{10,15}$/,
        message: "Please enter a valid phone number",
      },
    });
  }, [register]);


  useEffect(() => {
    if (registrationError) {
      const timer = setTimeout(() => {
        clearRegistrationError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [registrationError, clearRegistrationError]);


  const renderInput = (
    id: string,
    label: string,
    required: boolean,
    placeholder: string,
    error?: string,
    rest: any = {}
  ) => (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1.5 lg:mb-2"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        placeholder={placeholder}
        className={`w-full px-3 py-2.5 lg:py-3 bg-gray-200 border ${
          error ? "border-red-500" : "border-gray-200"
        } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 text-sm lg:text-base`}
        {...rest}
      />
      <ErrorMessage message={error} />
    </div>
  );


  const renderPasswordField = (
    id: "password" | "confirmPassword",
    label: string,
    isVisible: boolean,
    toggleVisibility: () => void,
    error?: string,
    validation?: any
  ) => (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1.5 lg:mb-2"
      >
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <input
          type={isVisible ? "text" : "password"}
          id={id}
          placeholder="******"
          className={`w-full px-3 py-2.5 lg:py-3 pr-10 bg-gray-200 border ${
            error ? "border-red-500" : "border-gray-200"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 text-sm lg:text-base`}
          {...register(id, validation)}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
          onClick={toggleVisibility}
          aria-label={isVisible ? `Hide ${id}` : `Show ${id}`}
        >
          {isVisible ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      <ErrorMessage message={error} />
    </div>
  );


  return (
    <>
      <div
        className={`py-3 sm:py-4 md:py-6 lg:py-8 xl:py-10 flex items-center justify-center px-2 sm:px-4 transition-opacity duration-300 ${
          backgroundLoaded ? 'opacity-100' : 'opacity-90'
        }`}
        style={{
          backgroundImage: backgroundLoaded ? 'url("/background/landingHeroImage.png")' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 sm:gap-6 lg:gap-8 xl:gap-10 2xl:gap-30 w-full max-w-7xl px-2 sm:px-4 lg:px-4 py-3 sm:py-4 md:py-6 lg:py-8">
          {/* Left Section */}
          <div className="flex-1 flex flex-col items-center lg:items-start space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 mb-4 lg:mb-0 w-full">
            <div className="w-full flex justify-center lg:justify-start">
              <img
                src={backgroundImages.companyLogo}
                alt="Logo"
                className="w-24 sm:w-28 md:w-32 lg:w-36 xl:w-40 2xl:w-44 mb-2 md:mb-3 lg:mb-4"
                loading="eager"
              />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl  text-white font-bold text-center lg:text-left leading-tight">
              Secure Your Financial
              <br />
              Future Today
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-white leading-relaxed max-w-xl text-center lg:text-left">
              Access your portfolio, track investments, and manage your wealth
              with our advanced financial platform.
            </p>
          </div>


          {/* Right Section - Optimized sizing for all screens */}
          <div className="flex-1 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-2xl p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8 border border-gray-100">
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-3xl font-semibold text-gray-800 text-center mb-3 sm:mb-4 lg:mb-5 xl:mb-6">
                Register Your Account
              </h2>


              {registrationError && (
                <div className="mb-3 lg:mb-4 px-2.5 lg:px-3 py-2 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center">
                  <p className="text-xs lg:text-sm text-red-600">{registrationError}</p>
                  <button
                    onClick={clearRegistrationError}
                    className="text-xs text-red-500 underline hover:text-red-700 ml-3 lg:ml-4 whitespace-nowrap transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              )}


              <form
                onSubmit={handleSubmit(handleRegistrationSubmit)}
                className="space-y-3 sm:space-y-4 lg:space-y-5"
                noValidate
              >
                {/* Email Verification Section */}
                <div className="relative">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1.5 lg:mb-2"
                  >
                    Email ID <span className="text-red-500">*</span>
                  </label>
                 
                  {/* Status Banners - Compact for better spacing */}
                  {!isEmailVerified && !isOtpVerified && hasLeftOtpUnverified && (
                    <div className="mb-2.5 lg:mb-3 p-2 lg:p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-xs lg:text-sm text-amber-700 font-medium mb-0.5 lg:mb-1">
                        ⏳ OTP Verification Pending
                      </p>
                      <p className="text-xs text-amber-600">
                        An OTP has been sent to your email. Please check your inbox (or spam folder) and enter the OTP to complete your email verification.
                      </p>
                    </div>
                  )}
                 
                  {isEmailVerified && isOtpVerified && (
                    <div className="mb-2.5 lg:mb-3 p-2 lg:p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs lg:text-sm text-green-700 font-medium">
                        ✅ Email Successfully Verified
                      </p>
                    </div>
                  )}


                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                    <input
                      type="email"
                      id="email"
                      placeholder="example@gmail.com"
                      disabled={isEmailVerified}
                      className={`w-full px-3 py-2.5 lg:py-3 bg-gray-200 border ${
                        emailError ? "border-red-500" : "border-gray-200"
                      } ${
                        isEmailVerified
                          ? "rounded-t-md sm:rounded-l-md sm:rounded-tr-none"
                          : "rounded-t-md sm:rounded-l-md sm:rounded-tr-none"
                      } focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 text-sm lg:text-base ${
                        isEmailVerified ? "bg-green-50 text-green-800" : ""
                      }`}
                      {...register("email", {
                        onChange: clearEmailError,
                      })}
                    />
                    <button
                      type="button"
                      onClick={verifyEmail}
                      disabled={isVerifyingEmail || isEmailVerified}
                      className={`px-3 lg:px-4 py-2 sm:py-0 sm:w-2/5 w-full text-xs lg:text-sm font-semibold text-white ${
                        isEmailVerified
                          ? "bg-green-600 hover:bg-green-700"
                          : isVerifyingEmail
                          ? "bg-gray-500"
                          : "bg-teal-600 hover:bg-teal-700"
                      } ${
                        isEmailVerified
                          ? "rounded-b-md sm:rounded-r-md sm:rounded-bl-none"
                          : "rounded-b-md sm:rounded-r-md sm:rounded-bl-none"
                      } transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        isEmailVerified ? "focus:ring-green-500" : "focus:ring-teal-500"
                      } disabled:cursor-not-allowed`}
                    >
                      {isVerifyingEmail
                        ? "Verifying..."
                        : isEmailVerified
                        ? "✓ Verified"
                        : "Verify Email"}
                    </button>
                  </div>
                 
                  {emailError && (
                    <p className="text-red-500 text-xs lg:text-sm mt-1.5 lg:mt-2 bg-red-50 border border-red-200 rounded-md p-2">
                      {emailError}
                    </p>
                  )}
                </div>


                {/* Name */}
                {renderInput(
                  "name",
                  "Name",
                  true,
                  "Enter your full name",
                  errors.name?.message,
                  {
                    ...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters long",
                      },
                    }),
                  }
                )}


                {/* Phone and Organization Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                  {/* Phone Number */}
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700 mb-1.5 lg:mb-2"
                    >
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full">
                      <PhoneInput
                        country="in"
                        value={getValues("phoneNumber")}
                        placeholder="Phone number"
                        onChange={(phone) => setValue("phoneNumber", phone)}
                        inputProps={{
                          name: "phoneNumber",
                          required: true,
                          className: `w-full !h-[42px] lg:!h-[48px] !px-3 !py-2 !bg-gray-200 !border ${
                            errors.phoneNumber
                              ? "!border-red-500"
                              : "!border-gray-200"
                          } !rounded-md focus:!outline-none focus:!ring-2 focus:!ring-teal-500 transition-all duration-200 !text-sm lg:!text-base`,
                        }}
                        containerClass="w-full"
                        inputStyle={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: "#E5E7EB",
                          fontSize: "14px",
                        }}
                        buttonStyle={{
                          backgroundColor: "#E5E7EB",
                          border: errors.phoneNumber
                            ? "1px solid #EF4444"
                            : "1px solid #E5E7EB",
                          borderRadius: "0.375rem 0 0 0.375rem",
                          height: "42px",
                        }}
                        dropdownStyle={{
                          borderRadius: "0.375rem",
                        }}
                      />
                    </div>
                    <ErrorMessage message={errors.phoneNumber?.message} />
                  </div>


                  {/* Organization */}
                  {renderInput(
                    "organization",
                    "Organization",
                    false,
                    "Company/Organization name",
                    "",
                    {
                      ...register("organization"),
                    }
                  )}
                </div>


                {/* Password Fields Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                  {/* Password */}
                  {renderPasswordField(
                    "password",
                    "Password",
                    isPasswordVisible,
                    togglePasswordVisibility,
                    errors.password?.message,
                    {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters long",
                      },
                      maxLength: {
                        value: 20,
                        message: "Password must not exceed 20 characters",
                      },
                      pattern: {
                        value:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                        message:
                          "Password must contain uppercase, lowercase, number, and special character",
                      },
                    }
                  )}


                  {/* Confirm Password */}
                  {renderPasswordField(
                    "confirmPassword",
                    "Confirm Password",
                    isConfirmPasswordVisible,
                    toggleConfirmPasswordVisibility,
                    errors.confirmPassword?.message,
                    {
                      required: "Please confirm your password",
                      validate: (value: string) =>
                        value === getValues("password") ||
                        "Passwords do not match",
                    }
                  )}
                </div>


                {/* Submit Button */}
                <div className="pt-3 sm:pt-4 lg:pt-6">
                  <button
                    type="submit"
                    className={`w-full sm:w-4/5 lg:w-3/4 xl:w-2/3 2xl:w-1/2 mx-auto block  ${
                      isEmailVerified && isOtpVerified
                        ? "bg-teal-600 hover:bg-teal-700 shadow-lg hover:shadow-xl lg:text-xl"
                        : "bg-gray-400 cursor-not-allowed lg:text-base"
                    } text-white font-semibold py-2.5 sm:py-3 lg:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                    disabled={!isEmailVerified || !isOtpVerified || isSubmitting}
                  >
                    {isSubmitting ? "Signing Up" : isEmailVerified && isOtpVerified
                      ? "Sign Up"
                      : "Email Verification Required"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>


      {/* Enhanced OTP Verification Modal */}
      <OTPVerificationPopup
        isOpen={isOtpModalVisible}
        onClose={handleOtpModalClose}
        email={getValues("email")}
        hasLeftUnverified={hasLeftOtpUnverified}
        onVerify={() => {
          setIsOtpVerified(true);
          setIsOtpModalVisible(false);
        }}
      />
    </>
  );
};


export default Registration;

