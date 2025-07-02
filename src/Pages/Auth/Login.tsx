

import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import backgroundImages from "../../../public/background";
import { useLogin } from "../../hooks/useLogin";
import { useAuth } from "../../hooks/useAuth";


const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { authState } = useAuth();
  // const [ setBackgroundLoaded] = useState(false);


  const {
    isPasswordVisible,
    otpDigits,
    isOtpDelivered,
    isOtpProcessing,
    isOtpVerifying,
    // isGoogleAuthenticating,
    isResetModalVisible,
    resetEmailAddress,
    isPasswordResetProcessing,
    togglePasswordVisibility,
    handleOtpDigitChange,
    requestOtpCode,
    submitOtpVerification,
    resendOtpCode,
    // initiateGoogleAuth,
    handleGoogleAuthCallback,
    openResetPasswordModal,
    closeResetModal,
    handleModalOutsideClick,
    requestPasswordReset,
    setResetEmailAddress,
  } = useLogin();


  const {
    register,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });


  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate("/dashboard");
    }
  }, [authState.isAuthenticated, navigate]);


  // Optimized background image preloading (same as registration)
  useEffect(() => {
    const img = new Image();
    // img.onload = () => setBackgroundLoaded(true);
    // img.onerror = () => setBackgroundLoaded(true);
    img.src = "/background/landingHeroImage.png";

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


  // Login method configuration from admin settings
  const loginMethodFromAdmin: "password" | "otp" | "both" = "both" as "password" | "otp" | "both";


  const isPasswordAuthEnabled =
    loginMethodFromAdmin === "password" || loginMethodFromAdmin === "both";

  const isOtpAuthEnabled =
    loginMethodFromAdmin === "otp" || loginMethodFromAdmin === "both";


  // Auto-submit OTP when all 4 digits are entered
  useEffect(() => {
    const otpValue = otpDigits.join("");
    if (otpValue.length === 4 && isOtpDelivered && !isOtpVerifying) {
      const timer = setTimeout(() => {
        
        submitOtpVerification(getValues("email"), otpValue);
      }, 500); // Small delay for better UX

      return () => clearTimeout(timer);
    }
  }, [otpDigits, isOtpDelivered, submitOtpVerification, getValues]);


  // Handle Google OAuth callback
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const state = searchParams.get("state");


    if (code && !error) {
      handleGoogleAuthCallback(code, state);
    } else if (error) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location, handleGoogleAuthCallback]);


  // Handle modal escape key and body overflow
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isResetModalVisible) {
        closeResetModal();
      }
    };


    document.addEventListener("keydown", handleEscapeKey);


    if (isResetModalVisible) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }


    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.classList.remove("overflow-hidden");
    };
  }, [isResetModalVisible, closeResetModal]);


  return (
    <>
      <div
        className={` py-3 sm:py-4 md:py-6 lg:py-8 xl:py-10 flex items-center justify-center px-2 sm:px-4 transition-opacity duration-300`}
        style={{
          backgroundImage: 'url("/background/landingHeroImage.png")',
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 sm:gap-6 lg:gap-8 xl:gap-10 2xl:gap-30 w-full max-w-7xl px-2 sm:px-4 lg:px-2 py-3 sm:py-4 md:py-6 lg:py-8">
          {/* Left Section - Branding (matches registration) */}
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


          {/* Right Section - Login Form (responsive sizing) */}
          <div className="flex-1 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-2xl p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8 border border-gray-100">
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-3xl font-semibold text-gray-800 text-center mb-2 sm:mb-2 lg:mb-3 xl:mb-4">
                Log in to your Account
              </h2>


              <form className="space-y-2 sm:space-y-3 lg:space-y-4">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1.5 lg:mb-2"
                  >
                    Email ID
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="example@gmail.com"
                    className={`w-full px-3 py-2.5 lg:py-3 bg-gray-200 border ${errors.email ? "border-red-500" : "border-gray-200"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 text-sm lg:text-base`}
                    {...register("email", {
                      required: "Email is required",
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs lg:text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>


                {/* Password */}
                {isPasswordAuthEnabled && (
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1.5 lg:mb-2"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        id="password"
                        placeholder="••••••"
                        className={`w-full px-3 py-2.5 lg:py-3 pr-10 bg-gray-200 border ${errors.password ? "border-red-500" : "border-gray-200"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 text-sm lg:text-base`}
                        {...register("password", {
                          required: isPasswordAuthEnabled
                            ? "Password is required"
                            : false,
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                        onClick={togglePasswordVisibility}
                        aria-label={
                          isPasswordVisible ? "Hide password" : "Show password"
                        }
                      >
                        {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs lg:text-sm mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                )}
                {/* Forgot password */}
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={openResetPasswordModal}
                    className="text-xs lg:text-sm text-teal-600 hover:text-teal-500 font-medium transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                {/* OTP Authentication */}
                {isOtpAuthEnabled && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        requestOtpCode(
                          getValues("email"),
                          isPasswordAuthEnabled ? getValues("password") : undefined
                        )
                      }
                      disabled={isOtpProcessing}
                      className="w-3/4 mx-auto block bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 lg:py-3 px-4 rounded-md focus:outline-none disabled:bg-teal-400 transition-all duration-200 text-sm lg:text-base shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                      {isOtpProcessing ? "Sending..." : "Generate OTP for Verification"}
                    </button>
                    {/* OTP Input Section - Enhanced responsive design */}
                    <div className=" flex flex-col items-center text-center">
                      {/* <p className="text-xs lg:text-sm text-gray-600 ">
                        {isOtpDelivered
                          ? "We've sent a verification code to your email"
                          : "Generate OTP to verify your account"}
                      </p> */}

                      {/* OTP Input boxes - Responsive sizing */}
                      <div className="flex items-center justify-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-2.5 xl:gap-3 ">
                        {otpDigits.map((value, index) => (
                          <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={value}
                            onChange={(e) =>
                              handleOtpDigitChange(index, e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Backspace" && !value && index > 0) {
                                const prevInput = document.getElementById(`otp-${index - 1}`);
                                prevInput?.focus();
                              }
                            }}
                            onPaste={(e) => {
                              e.preventDefault();
                              const pastedData = e.clipboardData.getData('text');
                              if (/^\d{4}$/.test(pastedData)) {
                                pastedData.split('').forEach((digit, idx) => {
                                  if (idx < 4) {
                                    handleOtpDigitChange(idx, digit);
                                  }
                                });
                              }
                            }}
                            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-12 lg:h-12 xl:w-14 xl:h-14 text-center text-sm sm:text-base md:text-lg lg:text-base xl:text-lg font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-gray-50 hover:bg-white hover:border-gray-400"
                            disabled={!isOtpDelivered || isOtpVerifying}
                            aria-label={`OTP digit ${index + 1}`}
                          />
                        ))}
                      </div>



                      {/* Resend OTP */}
                      {isOtpDelivered && (
                        <button
                          type="button"
                          onClick={() =>
                            resendOtpCode(
                              getValues("email"),
                              isPasswordAuthEnabled
                                ? getValues("password")
                                : undefined
                            )
                          }
                          disabled={isOtpProcessing}
                          className="text-xs lg:text-sm text-teal-600 hover:text-teal-700 font-semibold p-1 transition-colors underline hover:no-underline disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isOtpProcessing ? "Sending..." : "Resend OTP"}
                        </button>
                      )}
                    </div>
                  </>
                )}


                {/* Login Button - Enhanced styling */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    submitOtpVerification(
                      getValues("email"),
                      otpDigits.join("")
                    );
                  }}
                  disabled={!isOtpDelivered || isOtpVerifying || otpDigits.join("").length < 4}
                  className="w-full sm:w-3/5 lg:w-3/4 xl:w-2/3 2xl:w-1/2 mx-auto block bg-teal-600 hover:bg-teal-700 text-white font-semibold py-1.5 sm:py-3 lg:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isOtpVerifying ? "Verifying..." : "Login"}
                </button>


                {/* Sign up link */}
                <p className="text-center text-xs lg:text-sm text-gray-600 mt-3 lg:mt-4">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-teal-600 hover:text-teal-500 font-medium transition-colors"
                  >
                    Sign up
                  </Link>
                </p>


                {/* Google Login - Commented but optimized */}
                {/* <div className="mt-4 sm:mt-6">
                  <button
                    type="button"
                    onClick={initiateGoogleAuth}
                    disabled={isGoogleAuthenticating}
                    className="w-full sm:max-w-xs mx-auto flex items-center justify-center gap-2 border border-black hover:bg-gray-100 text-black font-medium py-2 sm:py-3 px-4 rounded-md focus:outline-none transition-colors"
                  >
                    <img src="/icons/google.png" alt="Google" className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{isGoogleAuthenticating ? "Connecting..." : "Sign in with Google"}</span>
                  </button>
                </div> */}
              </form>
            </div>
          </div>
        </div>
      </div>


      {/* Password Reset Modal - Enhanced responsive design */}
      {isResetModalVisible && (
        <div
          className="fixed bg-black/40 backdrop-blur-sm inset-0 z-50 overflow-auto flex items-center justify-center p-3 sm:p-4 md:p-6"
          onClick={handleModalOutsideClick}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="bg-white rounded-lg sm:rounded-xl shadow-2xl max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg w-full overflow-hidden border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 sm:px-5 md:px-6 py-3 sm:py-4 border-b border-gray-200">
              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-900">
                Reset Password
              </h3>
            </div>


            <form onSubmit={(e) => requestPasswordReset(e, resetEmailAddress)}>
              <div className="px-4 sm:px-5 md:px-6 py-4 sm:py-5">
                <p className="text-xs sm:text-sm md:text-base text-gray-500 mb-3 sm:mb-4 leading-relaxed">
                  Enter your email address and we'll send you a link to reset
                  your password.
                </p>
                <div>
                  <label
                    htmlFor="resetEmailAddress"
                    className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1.5 sm:mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="resetEmailAddress"
                    value={resetEmailAddress}
                    onChange={(e) => setResetEmailAddress(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full px-3 py-2.5 sm:py-3 bg-gray-200 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 text-sm md:text-base"
                    required
                    autoFocus
                  />
                </div>
              </div>


              <div className="px-4 sm:px-5 md:px-6 py-3 sm:py-4 bg-gray-50 flex flex-row-reverse gap-2 sm:gap-3">
                <button
                  type="submit"
                  disabled={isPasswordResetProcessing}
                  className="inline-flex justify-center px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm md:text-base bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isPasswordResetProcessing ? "Sending..." : "Send Reset Link"}
                </button>
                <button
                  type="button"
                  onClick={closeResetModal}
                  className="inline-flex justify-center px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm md:text-base bg-white text-gray-700 font-medium rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};


export default Login;

