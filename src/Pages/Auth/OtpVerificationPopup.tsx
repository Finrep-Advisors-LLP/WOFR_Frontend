// import React, { memo } from "react";
// import backgroundImages from "../../../public/background";
// import { useOTP } from "../../hooks/useOtp";

// interface OTPVerificationModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   email: string;
//   onVerify: (otp: string) => void;
// }

// const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({
//   isOpen,
//   onClose,
//   email,
//   onVerify,
// }) => {
//   const {
//     otpDigits,
//     remainingTime,
//     canResendOtp,
//     otpInputRefs,
//     handleOtpChange,
//     handleOtpKeyDown,
//     handleOtpResend,
//     submitOtpVerification,
//   } = useOTP(isOpen);

//   if (!isOpen) return null;

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     submitOtpVerification(email, onVerify);
//   };

//   const handleResend = () => handleOtpResend(email);

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 backdrop-blur-sm bg-black/10">
//       <div className="relative w-full max-w-md p-4 sm:p-6 bg-white rounded-lg shadow-xl">
//         <CloseButton onClose={onClose} />
//         <ModalHeader email={email} />
//         <OTPForm
//           otpDigits={otpDigits}
//           otpInputRefs={otpInputRefs}
//           handleOtpChange={handleOtpChange}
//           handleOtpKeyDown={handleOtpKeyDown}
//           handleSubmit={handleSubmit}
//         />
//         <ResendOTPSection
//           canResendOtp={canResendOtp}
//           remainingTime={remainingTime}
//           handleResend={handleResend}
//         />
//       </div>
//     </div>
//   );
// };

// const CloseButton = memo(({ onClose }: { onClose: () => void }) => (
//   <button
//     onClick={onClose}
//     aria-label="Close"
//     className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600"
//   >
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       className="h-5 w-5 sm:h-6 sm:w-6"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M6 18L18 6M6 6l12 12"
//       />
//     </svg>
//   </button>
// ));

// const ModalHeader = memo(({ email }: { email: string }) => (
//   <div className="flex flex-col items-center mb-4 sm:mb-6">
//     <div className="mb-3 sm:mb-4 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
//       <img
//         src={backgroundImages.otpVerification}
//         alt="Email verification"
//         className="w-16 h-16 sm:w-20 sm:h-20"
//       />
//     </div>
//     <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">
//       Email Verification
//     </h2>
//     <p className="mt-1 sm:mt-2 text-sm sm:text-base text-[#AAADB2] text-center">
//       We have sent a verification code to
//     </p>
//     <p className="text-sm sm:text-base font-medium text-gray-800">{email}</p>
//   </div>
// ));

// interface OTPFormProps {
//   otpDigits: string[];
//   otpInputRefs: React.RefObject<HTMLInputElement | null>[];
//   handleOtpChange: (index: number, value: string) => void;
//   handleOtpKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
//   handleSubmit: (e: React.FormEvent) => void;
// }

// const OTPForm = memo(
//   ({
//     otpDigits,
//     otpInputRefs,
//     handleOtpChange,
//     handleOtpKeyDown,
//     handleSubmit,
//   }: OTPFormProps) => (
//     <form onSubmit={handleSubmit}>
//       <div className="flex justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
//         {otpDigits.map((digit, index) => (
//           <input
//             key={index}
//             ref={otpInputRefs[index]}
//             type="text"
//             inputMode="numeric"
//             pattern="[0-9]*"
//             maxLength={1}
//             value={digit}
//             onChange={(e) => handleOtpChange(index, e.target.value)}
//             onKeyDown={(e) => handleOtpKeyDown(index, e)}
//             aria-label={`OTP digit ${index + 1}`}
//             className="w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
//           />
//         ))}
//       </div>
//       <button
//         type="submit"
//         className="w-full sm:w-1/2 block mx-auto bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-xl sm:rounded-2xl focus:outline-none transition duration-300 text-base sm:text-lg mb-3 sm:mb-4"
//       >
//         Submit
//       </button>
//     </form>
//   )
// );

// interface ResendOTPSectionProps {
//   canResendOtp: boolean;
//   remainingTime: number;
//   handleResend: () => void;
// }

// const ResendOTPSection = memo(
//   ({ canResendOtp, remainingTime, handleResend }: ResendOTPSectionProps) => (
//     <div className="text-center">
//       <button
//         onClick={handleResend}
//         disabled={!canResendOtp}
//         className={`text-[#3474fd] font-bold text-sm sm:text-base ${
//           !canResendOtp ? "opacity-50 cursor-not-allowed" : ""
//         }`}
//       >
//         Resend OTP
//       </button>
//       {!canResendOtp && (
//         <p className="mt-1 text-xs sm:text-sm text-gray-500">
//           Resend available in {remainingTime} seconds
//         </p>
//       )}
//     </div>
//   )
// );

// export default memo(OTPVerificationModal);

// import React, { memo, useEffect } from "react";
// import backgroundImages from "../../../public/background";
// import { useOTP } from "../../hooks/useOtp";


// interface OTPVerificationModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   email: string;
//   onVerify: (otp: string) => void;
//   hasLeftUnverified?: boolean;
// }


// const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({
//   isOpen,
//   onClose,
//   email,
//   onVerify,
//   hasLeftUnverified = false,
// }) => {
//   const {
//     otpDigits,
//     remainingTime,
//     canResendOtp,
//     otpInputRefs,
//     handleOtpChange,
//     handleOtpKeyDown,
//     handleOtpResend,
//     submitOtpVerification,
//   } = useOTP(isOpen, hasLeftUnverified);


//   // Auto-submit when all 4 digits are entered
//   useEffect(() => {
//     const otpValue = otpDigits.join("");
//     if (otpValue.length === 4) {
//       const timer = setTimeout(() => {
//         submitOtpVerification(email, onVerify);
//       }, 500); // Small delay for better UX
     
//       return () => clearTimeout(timer);
//     }
//   }, [otpDigits, email, onVerify, submitOtpVerification]);


//   // Auto-resend if user left unverified
//   useEffect(() => {
//     if (isOpen && hasLeftUnverified) {
//       const timer = setTimeout(() => {
//         handleOtpResend(email);
//       }, 1000);
     
//       return () => clearTimeout(timer);
//     }
//   }, [isOpen, hasLeftUnverified, email, handleOtpResend]);


//   if (!isOpen) return null;


//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     submitOtpVerification(email, onVerify);
//   };


//   const handleResend = () => handleOtpResend(email);


//   const handleOtpInputChange = (index: number, value: string) => {
//     handleOtpChange(index, value);
//   };


//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 backdrop-blur-sm bg-black/20">
//       {/* Responsive modal container - Mobile full width, Desktop constrained */}
//       <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-lg 2xl:max-w-xl p-4 sm:p-5 md:p-6 lg:p-7 xl:p-6 2xl:p-7 bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-100">
//         <CloseButton onClose={onClose} />
//         <ModalHeader email={email} hasLeftUnverified={hasLeftUnverified} />
//         <OTPForm
//           otpDigits={otpDigits}
//           otpInputRefs={otpInputRefs}
//           handleOtpChange={handleOtpInputChange}
//           handleOtpKeyDown={handleOtpKeyDown}
//           handleSubmit={handleSubmit}
//         />
//         <ResendOTPSection
//           canResendOtp={canResendOtp}
//           remainingTime={remainingTime}
//           handleResend={handleResend}
//           hasLeftUnverified={hasLeftUnverified}
//         />
//       </div>
//     </div>
//   );
// };


// const CloseButton = memo(({ onClose }: { onClose: () => void }) => (
//   <button
//     onClick={onClose}
//     aria-label="Close"
//     type="button"
//     className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 md:top-4 md:right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
//   >
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6"
//       fill="none"
//       viewBox="0 0 24 24"
//       stroke="currentColor"
//       strokeWidth={2}
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M6 18L18 6M6 6l12 12"
//       />
//     </svg>
//   </button>
// ));


// const ModalHeader = memo(({
//   email,
//   hasLeftUnverified
// }: {
//   email: string;
//   hasLeftUnverified: boolean;
// }) => (
//   <div className="flex flex-col items-center mb-4 sm:mb-5 md:mb-6 lg:mb-5 xl:mb-6">
//     {/* Icon - Responsive sizing */}
//     <div className="mb-2.5 sm:mb-3 md:mb-4 lg:mb-3 xl:mb-4 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-14 lg:h-14 xl:w-16 xl:h-16 flex items-center justify-center">
//       <img
//         src={backgroundImages.otpVerification}
//         alt="Email verification"
//         className="w-full h-full object-contain"
//       />
//     </div>
   
//     {/* Title - Responsive text sizing */}
//     <h2 className="text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl font-bold text-gray-800 text-center mb-1.5 sm:mb-2">
//       Email Verification
//     </h2>
   
//     {/* Auto-resend notification - Compact */}
//     {hasLeftUnverified && (
//       <div className="mb-2.5 sm:mb-3 p-2 sm:p-2.5 bg-blue-50 border border-blue-200 rounded-lg max-w-full">
//         <p className="text-xs sm:text-sm text-blue-700 text-center font-medium">
//           📧 Auto-resending OTP since verification was incomplete
//         </p>
//       </div>
//     )}
   
//     {/* Description text - Responsive and compact */}
//     <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm md:text-base lg:text-sm xl:text-base text-[#AAADB2] text-center leading-relaxed">
//       We have sent a 4-digit verification code to
//     </p>
//     <p className="text-sm sm:text-base md:text-lg lg:text-base xl:text-lg font-semibold text-gray-800 break-all text-center px-2 mt-0.5">
//       {email}
//     </p>
 
//   </div>
// ));


// interface OTPFormProps {
//   otpDigits: string[];
//   otpInputRefs: React.RefObject<HTMLInputElement | null>[];
//   handleOtpChange: (index: number, value: string) => void;
//   handleOtpKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
//   handleSubmit: (e: React.FormEvent) => void;
// }


// const OTPForm = memo(
//   ({
//     otpDigits,
//     otpInputRefs,
//     handleOtpChange,
//     handleOtpKeyDown,
//     handleSubmit,
//   }: OTPFormProps) => (
//     <form onSubmit={handleSubmit}>
//       {/* OTP Input boxes - Responsive sizing */}
//       <div className="flex justify-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-2.5 xl:gap-3 mb-4 sm:mb-5 md:mb-6 lg:mb-5 xl:mb-6">
//         {otpDigits.map((digit, index) => (
//           <input
//             key={index}
//             ref={otpInputRefs[index]}
//             type="text"
//             inputMode="numeric"
//             pattern="[0-9]*"
//             maxLength={1}
//             value={digit}
//             onChange={(e) => handleOtpChange(index, e.target.value)}
//             onKeyDown={(e) => handleOtpKeyDown(index, e)}
//             onPaste={(e) => {
//               e.preventDefault();
//               const pastedData = e.clipboardData.getData('text');
//               if (/^\d{4}$/.test(pastedData)) {
//                 pastedData.split('').forEach((digit, idx) => {
//                   if (idx < 4) {
//                     handleOtpChange(idx, digit);
//                   }
//                 });
//               }
//             }}
//             aria-label={`OTP digit ${index + 1}`}
//             className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-12 lg:h-12 xl:w-14 xl:h-14 text-center text-sm sm:text-base md:text-lg lg:text-base xl:text-lg font-bold border-2 border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-gray-50 hover:bg-white hover:border-gray-400"
//           />
//         ))}
//       </div>
     
//       {/* Submit button - Responsive sizing */}
//       <div className="text-center">
//         <button
//           type="submit"
//           className="w-full sm:w-4/5 md:w-3/4 lg:w-4/5 xl:w-3/4 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 sm:py-3 md:py-3.5 lg:py-3 xl:py-3.5 px-4 sm:px-5 md:px-6 lg:px-5 xl:px-6 rounded-lg sm:rounded-xl lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300 text-sm sm:text-base md:text-lg lg:text-base xl:text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
//           disabled={otpDigits.join("").length < 4}
//         >
//           Verify OTP
//         </button>
//       </div>
//     </form>
//   )
// );


// interface ResendOTPSectionProps {
//   canResendOtp: boolean;
//   remainingTime: number;
//   handleResend: () => void;
//   hasLeftUnverified: boolean;
// }


// const ResendOTPSection = memo(
//   ({ canResendOtp, remainingTime, handleResend, hasLeftUnverified }: ResendOTPSectionProps) => (
//     <div className="text-center mt-3 sm:mt-4 md:mt-5 lg:mt-4 xl:mt-5">
//       {/* Resend button and timer - Responsive layout */}
//       <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-2 xl:gap-3">
//         <button
//           onClick={handleResend}
//           disabled={!canResendOtp && !hasLeftUnverified}
//           type="button"
//           className={`text-teal-600 hover:text-teal-700 font-semibold text-sm sm:text-base md:text-lg lg:text-base xl:text-lg transition-colors underline hover:no-underline ${
//             (!canResendOtp && !hasLeftUnverified) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
//           }`}
//         >
//           Resend OTP
//         </button>
       
//         {!canResendOtp && !hasLeftUnverified && (
//           <div className="flex items-center gap-1 sm:gap-1.5">
//             <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-500 rounded-full animate-pulse"></div>
//             <p className="text-xs sm:text-sm md:text-sm lg:text-xs xl:text-sm text-gray-500">
//               Available in {remainingTime}s
//             </p>
//           </div>
//         )}
//       </div>
     
   
//     </div>
//   )
// );


// export default memo(OTPVerificationModal);

import React, { memo, useEffect, useRef, useCallback } from "react";
import backgroundImages from "../../../public/background";
import { useOTP } from "../../hooks/useOtp";

interface OTPVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerify: (otp: string) => void;
  hasLeftUnverified?: boolean;
}

const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({
  isOpen,
  onClose,
  email,
  onVerify,
  hasLeftUnverified = false,
}) => {
  const {
    otpDigits,
    remainingTime,
    canResendOtp,
    isVerifying,
    isResending,
    otpInputRefs,
    handleOtpChange,
    handleOtpKeyDown,
    handleOtpResend,
    submitOtpVerification,
  } = useOTP(isOpen, hasLeftUnverified);

  // Use ref to track if auto-submit has been triggered for current OTP
  const hasAutoSubmittedRef = useRef<string>("");
const autoSubmitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Memoize the submit function to prevent recreation
  const memoizedSubmitOtp = useCallback(() => {
    submitOtpVerification(email, onVerify);
  }, [email, onVerify, submitOtpVerification]);

  // Auto-submit when all 4 digits are entered (FIXED VERSION)
  useEffect(() => {
    const otpValue = otpDigits.join("");
    
    // Clear any existing timer
    if (autoSubmitTimerRef.current) {
      clearTimeout(autoSubmitTimerRef.current);
      autoSubmitTimerRef.current = null;
    }

    // Only auto-submit if:
    // 1. OTP is complete (4 digits)
    // 2. Not currently verifying
    // 3. Haven't already auto-submitted this exact OTP value
    if (
      otpValue.length === 4 && 
      !isVerifying && 
      hasAutoSubmittedRef.current !== otpValue
    ) {
      // Mark this OTP as submitted
      hasAutoSubmittedRef.current = otpValue;
      
      autoSubmitTimerRef.current = setTimeout(() => {
        memoizedSubmitOtp();
        autoSubmitTimerRef.current = null;
      }, 500);
    }

    // Cleanup function
    return () => {
      if (autoSubmitTimerRef.current) {
        clearTimeout(autoSubmitTimerRef.current);
        autoSubmitTimerRef.current = null;
      }
    };
  }, [otpDigits, isVerifying, memoizedSubmitOtp]);

  // Reset auto-submit tracking when modal opens/closes or OTP is cleared
  useEffect(() => {
    if (!isOpen || otpDigits.every(digit => digit === "")) {
      hasAutoSubmittedRef.current = "";
      if (autoSubmitTimerRef.current) {
        clearTimeout(autoSubmitTimerRef.current);
        autoSubmitTimerRef.current = null;
      }
    }
  }, [isOpen, otpDigits]);

  // Auto-resend if user left unverified
  useEffect(() => {
    if (isOpen && hasLeftUnverified && !isResending) {
      const timer = setTimeout(() => {
        handleOtpResend(email);
      }, 1000);
     
      return () => clearTimeout(timer);
    }
  }, [isOpen, hasLeftUnverified, email, handleOtpResend, isResending]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerifying) {
      // Reset auto-submit tracking for manual submissions
      hasAutoSubmittedRef.current = "";
      submitOtpVerification(email, onVerify);
    }
  };

  const handleResend = () => {
    if (!isResending) {
      // Reset auto-submit tracking when resending
      hasAutoSubmittedRef.current = "";
      handleOtpResend(email);
    }
  };

  const handleOtpInputChange = (index: number, value: string) => {
    // If user manually changes OTP, reset auto-submit tracking
    if (hasAutoSubmittedRef.current) {
      hasAutoSubmittedRef.current = "";
    }
    handleOtpChange(index, value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 backdrop-blur-sm bg-black/20">
      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-lg 2xl:max-w-xl p-4 sm:p-5 md:p-6 lg:p-7 xl:p-6 2xl:p-7 bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-100">
        <CloseButton onClose={onClose} isDisabled={isVerifying || isResending} />
        <ModalHeader email={email} hasLeftUnverified={hasLeftUnverified} />
        <OTPForm
          otpDigits={otpDigits}
          otpInputRefs={otpInputRefs}
          handleOtpChange={handleOtpInputChange}
          handleOtpKeyDown={handleOtpKeyDown}
          handleSubmit={handleSubmit}
          isVerifying={isVerifying}
        />
        <ResendOTPSection
          canResendOtp={canResendOtp}
          remainingTime={remainingTime}
          handleResend={handleResend}
          hasLeftUnverified={hasLeftUnverified}
          isResending={isResending}
        />
      </div>
    </div>
  );
};

const CloseButton = memo(({ onClose, isDisabled }: { onClose: () => void; isDisabled: boolean }) => (
  <button
    onClick={onClose}
    disabled={isDisabled}
    aria-label="Close"
    type="button"
    className={`absolute top-2.5 right-2.5 sm:top-3 sm:right-3 md:top-4 md:right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 ${
      isDisabled ? 'opacity-50 cursor-not-allowed' : ''
    }`}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>
));

const ModalHeader = memo(({
  email,
  hasLeftUnverified
}: {
  email: string;
  hasLeftUnverified: boolean;
}) => (
  <div className="flex flex-col items-center mb-4 sm:mb-5 md:mb-6 lg:mb-5 xl:mb-6">
    <div className="mb-2.5 sm:mb-3 md:mb-4 lg:mb-3 xl:mb-4 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-14 lg:h-14 xl:w-16 xl:h-16 flex items-center justify-center">
      <img
        src={backgroundImages.otpVerification}
        alt="Email verification"
        className="w-full h-full object-contain"
      />
    </div>
   
    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl font-bold text-gray-800 text-center mb-1.5 sm:mb-2">
      Email Verification
    </h2>
   
    {hasLeftUnverified && (
      <div className="mb-2.5 sm:mb-3 p-2 sm:p-2.5 bg-blue-50 border border-blue-200 rounded-lg max-w-full">
        <p className="text-xs sm:text-sm text-blue-700 text-center font-medium">
          📧 Auto-resending OTP since verification was incomplete
        </p>
      </div>
    )}
   
    <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm md:text-base lg:text-sm xl:text-base text-[#AAADB2] text-center leading-relaxed">
      We have sent a 4-digit verification code to
    </p>
    <p className="text-sm sm:text-base md:text-lg lg:text-base xl:text-lg font-semibold text-gray-800 break-all text-center px-2 mt-0.5">
      {email}
    </p>
  </div>
));

interface OTPFormProps {
  otpDigits: string[];
  otpInputRefs: React.RefObject<HTMLInputElement | null>[];
  handleOtpChange: (index: number, value: string) => void;
  handleOtpKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isVerifying: boolean;
}

const OTPForm = memo(
  ({
    otpDigits,
    otpInputRefs,
    handleOtpChange,
    handleOtpKeyDown,
    handleSubmit,
    isVerifying,
  }: OTPFormProps) => (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-2.5 xl:gap-3 mb-4 sm:mb-5 md:mb-6 lg:mb-5 xl:mb-6">
        {otpDigits.map((digit, index) => (
          <input
            key={index}
            ref={otpInputRefs[index]}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            disabled={isVerifying}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(index, e)}
            onPaste={(e) => {
              if (isVerifying) return;
              e.preventDefault();
              const pastedData = e.clipboardData.getData('text');
              if (/^\d{4}$/.test(pastedData)) {
                pastedData.split('').forEach((digit, idx) => {
                  if (idx < 4) {
                    handleOtpChange(idx, digit);
                  }
                });
              }
            }}
            aria-label={`OTP digit ${index + 1}`}
            className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-12 lg:h-12 xl:w-14 xl:h-14 text-center text-sm sm:text-base md:text-lg lg:text-base xl:text-lg font-bold border-2 border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-gray-50 hover:bg-white hover:border-gray-400 ${
              isVerifying ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
        ))}
      </div>
     
   <div className="flex justify-center">
  <button
    type="submit"
    disabled={otpDigits.join("").length < 4 || isVerifying}
    className="w-full sm:w-4/5 md:w-3/4 lg:w-4/5 xl:w-3/4 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 sm:py-3 md:py-3.5 lg:py-3 xl:py-3.5 px-4 sm:px-5 md:px-6 lg:px-5 xl:px-6 rounded-lg sm:rounded-xl lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300 text-sm sm:text-base md:text-lg lg:text-base xl:text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
  >
    {isVerifying ? (
      <>
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        Verifying...
      </>
    ) : (
      'Verify OTP'
    )}
  </button>
</div>

    </form>
  )
);

interface ResendOTPSectionProps {
  canResendOtp: boolean;
  remainingTime: number;
  handleResend: () => void;
  hasLeftUnverified: boolean;
  isResending: boolean;
}

const ResendOTPSection = memo(
  ({ canResendOtp, remainingTime, handleResend, hasLeftUnverified, isResending }: ResendOTPSectionProps) => (
    <div className="text-center mt-3 sm:mt-4 md:mt-5 lg:mt-4 xl:mt-5">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-2 xl:gap-3">
        <button
          onClick={handleResend}
          disabled={(!canResendOtp && !hasLeftUnverified) || isResending}
          type="button"
          className={`text-teal-600 hover:text-teal-700 font-semibold text-sm sm:text-base md:text-lg lg:text-base xl:text-lg transition-colors underline hover:no-underline flex items-center gap-2 ${
            ((!canResendOtp && !hasLeftUnverified) || isResending) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {isResending ? (
            <>
              <div className="w-3 h-3 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
              Resending...
            </>
          ) : (
            'Resend OTP'
          )}
        </button>
       
        {!canResendOtp && !hasLeftUnverified && !isResending && (
          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-500 rounded-full animate-pulse"></div>
            <p className="text-xs sm:text-sm md:text-sm lg:text-xs xl:text-sm text-gray-500">
              Available in {remainingTime}s
            </p>
          </div>
        )}
      </div>
    </div>
  )
);

export default memo(OTPVerificationModal);