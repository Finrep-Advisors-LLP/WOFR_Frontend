// import { useState, useRef, useEffect, useCallback } from "react";
// import apiClient from "../helper/axios";
// import { notify } from "../helper/notify"; 

// interface UseOtpReturn {
//   otpDigits: string[];
//   remainingTime: number;
//   canResendOtp: boolean;
//   otpInputRefs: React.RefObject<HTMLInputElement | null>[];
//   handleOtpChange: (index: number, value: string) => void;
//   handleOtpKeyDown: (
//     index: number,
//     e: React.KeyboardEvent<HTMLInputElement>
//   ) => void;
//   handleOtpResend: (email: string) => Promise<void>;
//   submitOtpVerification: (
//     email: string,
//     onVerifySuccess: (otpValue: string) => void
//   ) => Promise<void>;
//   displayNotification: (
//     type: "success" | "error" | "warning" | "info",
//     message: string
//   ) => void;
// }

// export const useOTP = (isModalOpen: boolean): UseOtpReturn => {
//   const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", ""]);
//   const [remainingTime, setRemainingTime] = useState<number>(60);
//   const [canResendOtp, setCanResendOtp] = useState<boolean>(false);

//   const otpInputRefs = [
//     useRef<HTMLInputElement>(null),
//     useRef<HTMLInputElement>(null),
//     useRef<HTMLInputElement>(null),
//     useRef<HTMLInputElement>(null),
//   ];

//   const displayNotification = useCallback(
//     (
//       type: "success" | "error" | "warning" | "info",
//       message: string
//     ): void => {
//       notify(type, message); // ✅ call centralized toast
//     },
//     []
//   );

//   useEffect(() => {
//     if (isModalOpen) {
//       setOtpDigits(["", "", "", ""]);
//       setRemainingTime(60);
//       setCanResendOtp(false);
//     }
//   }, [isModalOpen]);

//   useEffect(() => {
//     if (!isModalOpen) return;

//     const countdownTimer = setInterval(() => {
//       setRemainingTime((prevTime) => {
//         if (prevTime <= 1) {
//           setCanResendOtp(true);
//           clearInterval(countdownTimer);
//           return 0;
//         }
//         return prevTime - 1;
//       });
//     }, 1000);

//     return () => clearInterval(countdownTimer);
//   }, [isModalOpen]);

//   const handleOtpChange = useCallback(
//     (index: number, value: string): void => {
//       if (value && !/^[0-9]$/.test(value)) return;

//       setOtpDigits((prev) => {
//         const updated = [...prev];
//         updated[index] = value;
//         return updated;
//       });

//       if (value !== "" && index < 3) {
//         otpInputRefs[index + 1]?.current?.focus();
//       }
//     },
//     [otpInputRefs]
//   );

//   const handleOtpKeyDown = useCallback(
//     (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
//       if (e.key === "Backspace" && otpDigits[index] === "" && index > 0) {
//         otpInputRefs[index - 1]?.current?.focus();
//       }
//     },
//     [otpDigits, otpInputRefs]
//   );

//   const handleOtpResend = useCallback(
//     async (email: string): Promise<void> => {
//       if (!canResendOtp) return;

//       try {
//         await apiClient.post(
//           `/api/auth/v1/pre-register/email-verification?email=${encodeURIComponent(
//             email
//           )}`,
//           null,
//           {
//             headers: { accept: "application/json" },
//           }
//         );

//         notify("success", "OTP resent successfully");
//         setRemainingTime(60);
//         setCanResendOtp(false);
//         setOtpDigits(["", "", "", ""]);
//       } catch (error: any) {
//         notify(
//           "error",
//           error?.response?.data?.detail || "Failed to resend OTP"
//         );
//       }
//     },
//     [canResendOtp]
//   );

//   const submitOtpVerification = useCallback(
//     async (
//       email: string,
//       onVerifySuccess: (otpValue: string) => void
//     ): Promise<void> => {
//       const otpValue = otpDigits.join("");

//       if (otpValue.length < 4) {
//         notify("error", "Please enter all 4 digits of the OTP");
//         return;
//       }

//       try {
//         const response = await apiClient.post(
//           "/api/auth/v1/pre-register/verify-otp",
//           {
//             email,
//             otp_code: otpValue,
//           },
//           {
//             headers: {
//               Accept: "application/json",
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (response.status === 200) {
//           notify("success", "Email has been successfully verified.");
//           onVerifySuccess(otpValue);
//         }
//       } catch (error: any) {
//         notify(
//           "error",
//           error?.response?.data?.detail || "Something went wrong. Try again."
//         );
//       }
//     },
//     [otpDigits]
//   );

//   return {
//     otpDigits,
//     remainingTime,
//     canResendOtp,
//     otpInputRefs,
//     handleOtpChange,
//     handleOtpKeyDown,
//     handleOtpResend,
//     submitOtpVerification,
//     displayNotification,
//   };
// };

// import { useState, useRef, useEffect, useCallback } from "react";
// import apiClient from "../helper/axios";
// import { notify } from "../helper/notify";


// interface UseOtpReturn {
//   otpDigits: string[];
//   remainingTime: number;
//   canResendOtp: boolean;
//   otpInputRefs: React.RefObject<HTMLInputElement | null>[];
//   handleOtpChange: (index: number, value: string) => void;
//   handleOtpKeyDown: (
//     index: number,
//     e: React.KeyboardEvent<HTMLInputElement>
//   ) => void;
//   handleOtpResend: (email: string) => Promise<void>;
//   submitOtpVerification: (
//     email: string,
//     onVerifySuccess: (otpValue: string) => void
//   ) => Promise<void>;
//   displayNotification: (
//     type: "success" | "error" | "warning" | "info",
//     message: string
//   ) => void;
// }


// export const useOTP = (
//   isModalOpen: boolean,
//   hasLeftUnverified: boolean = false
// ): UseOtpReturn => {
//   const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", ""]);
//   const [remainingTime, setRemainingTime] = useState<number>(60);
//   const [canResendOtp, setCanResendOtp] = useState<boolean>(false);
//   const [hasAutoResent, setHasAutoResent] = useState<boolean>(false);


//   const otpInputRefs = [
//     useRef<HTMLInputElement>(null),
//     useRef<HTMLInputElement>(null),
//     useRef<HTMLInputElement>(null),
//     useRef<HTMLInputElement>(null),
//   ];


//   const displayNotification = useCallback(
//     (
//       type: "success" | "error" | "warning" | "info",
//       message: string
//     ): void => {
//       notify(type, message);
//     },
//     []
//   );


//   // Reset OTP state when modal opens
//   useEffect(() => {
//     if (isModalOpen) {
//       setOtpDigits(["", "", "", ""]);
//       setRemainingTime(60);
//       setCanResendOtp(false);
//     }
//   }, [isModalOpen]);


//   // Auto-resend OTP if user left without verifying and came back
//   useEffect(() => {
//     if (isModalOpen && hasLeftUnverified && !hasAutoResent) {
//       setHasAutoResent(true);
//       displayNotification("info", "Resending OTP automatically...");
//     }
//   }, [isModalOpen, hasLeftUnverified, hasAutoResent, displayNotification]);


//   // Countdown timer
//   useEffect(() => {
//     if (!isModalOpen) return;


//     const countdownTimer = setInterval(() => {
//       setRemainingTime((prevTime) => {
//         if (prevTime <= 1) {
//           setCanResendOtp(true);
//           clearInterval(countdownTimer);
//           return 0;
//         }
//         return prevTime - 1;
//       });
//     }, 1000);


//     return () => clearInterval(countdownTimer);
//   }, [isModalOpen]);


//   const handleOtpChange = useCallback(
//     (index: number, value: string): void => {
//       if (value && !/^[0-9]$/.test(value)) return;


//       setOtpDigits((prev) => {
//         const updated = [...prev];
//         updated[index] = value;
//         return updated;
//       });


//       if (value !== "" && index < 3) {
//         otpInputRefs[index + 1]?.current?.focus();
//       }
//     },
//     [otpInputRefs]
//   );


//   const handleOtpKeyDown = useCallback(
//     (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
//       if (e.key === "Backspace" && otpDigits[index] === "" && index > 0) {
//         otpInputRefs[index - 1]?.current?.focus();
//       }
//     },
//     [otpDigits, otpInputRefs]
//   );


//   const handleOtpResend = useCallback(
//     async (email: string): Promise<void> => {
//       if (!canResendOtp && !hasLeftUnverified) return;


//       try {
//         await apiClient.post(
//           `/api/auth/v1/pre-register/email-verification?email=${encodeURIComponent(
//             email
//           )}`,
//           null,
//           {
//             headers: { accept: "application/json" },
//           }
//         );


//         notify("success", "OTP resent successfully");
//         setRemainingTime(60);
//         setCanResendOtp(false);
//         setOtpDigits(["", "", "", ""]);
//         setHasAutoResent(false);
       
//         // Focus first input after resend
//         setTimeout(() => {
//           otpInputRefs[0]?.current?.focus();
//         }, 100);
//       } catch (error: any) {
//         notify(
//           "error",
//           error?.response?.data?.detail || "Failed to resend OTP"
//         );
//       }
//     },
//     [canResendOtp, hasLeftUnverified, otpInputRefs]
//   );


//   const submitOtpVerification = useCallback(
//     async (
//       email: string,
//       onVerifySuccess: (otpValue: string) => void
//     ): Promise<void> => {
//       const otpValue = otpDigits.join("");


//       if (otpValue.length < 4) {
//         notify("error", "Please enter all 4 digits of the OTP");
//         return;
//       }


//       try {
//         const response = await apiClient.post(
//           "/api/auth/v1/pre-register/verify-otp",
//           {
//             email,
//             otp_code: otpValue,
//           },
//           {
//             headers: {
//               Accept: "application/json",
//               "Content-Type": "application/json",
//             },
//           }
//         );


//         if (response.status === 200) {
//           // notify("success", "Email has been successfully verified.");
//           onVerifySuccess(otpValue);
//         }
//       } catch (error: any) {
//         notify(
//           "error",
//           error?.response?.data?.detail || "Something went wrong. Try again."
//         );
//         // Clear OTP on error and focus first input
//         setOtpDigits(["", "", "", ""]);
//         setTimeout(() => {
//           otpInputRefs[0]?.current?.focus();
//         }, 100);
//       }
//     },
//     [otpDigits, otpInputRefs]
//   );


//   return {
//     otpDigits,
//     remainingTime,
//     canResendOtp,
//     otpInputRefs,
//     handleOtpChange,
//     handleOtpKeyDown,
//     handleOtpResend,
//     submitOtpVerification,
//     displayNotification,
//   };
// };


import { useState, useRef, useEffect, useCallback } from "react";
import apiClient from "../helper/axios";
import { notify } from "../helper/notify";

interface UseOtpReturn {
  otpDigits: string[];
  remainingTime: number;
  canResendOtp: boolean;
  isVerifying: boolean; // Add loading state
  isResending: boolean; // Add resending state
  otpInputRefs: React.RefObject<HTMLInputElement | null>[];
  handleOtpChange: (index: number, value: string) => void;
  handleOtpKeyDown: (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => void;
  handleOtpResend: (email: string) => Promise<void>;
  submitOtpVerification: (
    email: string,
    onVerifySuccess: (otpValue: string) => void
  ) => Promise<void>;
  displayNotification: (
    type: "success" | "error" | "warning" | "info",
    message: string
  ) => void;
}

export const useOTP = (
  isModalOpen: boolean,
  hasLeftUnverified: boolean = false
): UseOtpReturn => {
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", ""]);
  const [remainingTime, setRemainingTime] = useState<number>(60);
  const [canResendOtp, setCanResendOtp] = useState<boolean>(false);
  const [hasAutoResent, setHasAutoResent] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false); // Add loading state
  const [isResending, setIsResending] = useState<boolean>(false); // Add resending state

  const otpInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const displayNotification = useCallback(
    (
      type: "success" | "error" | "warning" | "info",
      message: string
    ): void => {
      notify(type, message);
    },
    []
  );

  // Reset OTP state when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setOtpDigits(["", "", "", ""]);
      setRemainingTime(60);
      setCanResendOtp(false);
      setIsVerifying(false); 
      setIsResending(false); 
    }
  }, [isModalOpen]);

  // Auto-resend OTP if user left without verifying and came back
  useEffect(() => {
    if (isModalOpen && hasLeftUnverified && !hasAutoResent) {
      setHasAutoResent(true);
      displayNotification("info", "Resending OTP automatically...");
    }
  }, [isModalOpen, hasLeftUnverified, hasAutoResent, displayNotification]);

  // Countdown timer
  useEffect(() => {
    if (!isModalOpen) return;

    const countdownTimer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          setCanResendOtp(true);
          clearInterval(countdownTimer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, [isModalOpen]);

  const handleOtpChange = useCallback(
    (index: number, value: string): void => {
      if (value && !/^[0-9]$/.test(value)) return;
      if (isVerifying) return; 

      setOtpDigits((prev) => {
        const updated = [...prev];
        updated[index] = value;
        return updated;
      });

      if (value !== "" && index < 3) {
        otpInputRefs[index + 1]?.current?.focus();
      }
    },
    [otpInputRefs, isVerifying]
  );

  const handleOtpKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (isVerifying) return; // Prevent changes during verification
      
      if (e.key === "Backspace" && otpDigits[index] === "" && index > 0) {
        otpInputRefs[index - 1]?.current?.focus();
      }
    },
    [otpDigits, otpInputRefs, isVerifying]
  );

  const handleOtpResend = useCallback(
    async (email: string): Promise<void> => {
      if ((!canResendOtp && !hasLeftUnverified) || isResending) return;

      setIsResending(true); 
      
      try {
        await apiClient.post(
          `/api/auth/v1/pre-register/email-verification?email=${encodeURIComponent(
            email
          )}`,
          null,
          {
            headers: { accept: "application/json" },
          }
        );

        notify("success", "OTP resent successfully");
        setRemainingTime(60);
        setCanResendOtp(false);
        setOtpDigits(["", "", "", ""]);
        setHasAutoResent(false);
        
        // Focus first input after resend
        setTimeout(() => {
          otpInputRefs[0]?.current?.focus();
        }, 100);
      } catch (error: any) {
        notify(
          "error",
          error?.response?.data?.detail || "Failed to resend OTP"
        );
      } finally {
        setIsResending(false); 
      }
    },
    [canResendOtp, hasLeftUnverified, otpInputRefs, isResending]
  );

  const submitOtpVerification = useCallback(
    async (
      email: string,
      onVerifySuccess: (otpValue: string) => void
    ): Promise<void> => {
      const otpValue = otpDigits.join("");

      if (otpValue.length < 4) {
        notify("error", "Please enter all 4 digits of the OTP");
        return;
      }

      if (isVerifying) return; // Prevent multiple submissions

      setIsVerifying(true); // Set loading state

      try {
        const response = await apiClient.post(
          "/api/auth/v1/pre-register/verify-otp",
          {
            email,
            otp_code: otpValue,
          },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          // notify("success", "Email has been successfully verified.");
          onVerifySuccess(otpValue);
        }
      } catch (error: any) {
        notify(
          "error",
          error?.response?.data?.detail || "Something went wrong. Try again."
        );
        // Clear OTP on error and focus first input
        setOtpDigits(["", "", "", ""]);
        setTimeout(() => {
          otpInputRefs[0]?.current?.focus();
        }, 100);
      } finally {
        setIsVerifying(false); 
      }
    },
    [otpDigits, otpInputRefs, isVerifying]
  );

  return {
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
    displayNotification,
  };
};