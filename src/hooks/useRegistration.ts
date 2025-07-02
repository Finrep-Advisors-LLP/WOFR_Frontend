

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, UseFormReturn } from "react-hook-form";
import Swal from "sweetalert2";
import apiClient from "../helper/axios";


interface RegistrationFormData {
  email: string;
  name: string;
  phoneNumber: string;
  organization: string;
  password: string;
  confirmPassword: string;
}


interface UseRegisterReturn {
  isVerifyingEmail: boolean;
  isEmailVerified: boolean;
  isOtpVerified: boolean;
  isOtpModalVisible: boolean;
  isPasswordVisible: boolean;
  isConfirmPasswordVisible: boolean;
  emailError: string;
  registrationError: string;
  hasLeftOtpUnverified: boolean;
  form: UseFormReturn<RegistrationFormData>;
  setValue: UseFormReturn<RegistrationFormData>["setValue"];
  verifyEmail: () => Promise<void>;
  submitRegistration: () => Promise<void>;
  onSubmit: (data: RegistrationFormData) => void;
  handleRegistrationSubmit: () => void;
  togglePasswordVisibility: () => void;
  toggleConfirmPasswordVisibility: () => void;
  displayNotification: (
    type: "success" | "error" | "warning" | "info",
    message: string
  ) => void;
  setIsOtpModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOtpVerified: React.Dispatch<React.SetStateAction<boolean>>;
  clearEmailError: () => void;
  clearRegistrationError: () => void;
  handleOtpModalClose: () => void;
  isSubmitting: boolean;
}


export const useRegister = (): UseRegisterReturn => {
  const navigate = useNavigate();


  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [registrationError, setRegistrationError] = useState("");
  const [hasLeftOtpUnverified, setHasLeftOtpUnverified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const form = useForm<RegistrationFormData>({
    defaultValues: {
      email: "",
      name: "",
      phoneNumber: "",
      organization: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });


  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });


  const displayNotification = (
    type: "success" | "error" | "warning" | "info",
    message: string
  ) => {
    Toast.fire({ icon: type, title: message });
  };


  const clearEmailError = () => setEmailError("");
  const clearRegistrationError = () => setRegistrationError("");


  const verifyEmail = async () => {
    const email = form.getValues("email");
    setEmailError("");


    if (!email) {
      setEmailError("Email is required");
      return;
    }


    setIsVerifyingEmail(true);


    try {
      const response = await apiClient.post(
        `/api/auth/v1/pre-register/email-verification?email=${encodeURIComponent(email)}`,
        null,
        { headers: { accept: "application/json" } }
      );


      setIsEmailVerified(true);
      setIsOtpModalVisible(true);
      setHasLeftOtpUnverified(false);
      displayNotification("success", response.data.msg || "OTP sent to your email");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Failed to send OTP";
      setEmailError(errorMessage);
    } finally {
      setIsVerifyingEmail(false);
    }
  };


  const handleOtpModalClose = () => {
    if (!isOtpVerified) {
      setHasLeftOtpUnverified(true);
      setIsEmailVerified(false);
    }
    setIsOtpModalVisible(false);
  };


  const submitRegistration = async () => {
    const formData = form.getValues();
    setRegistrationError("");


    const { email, name, phoneNumber, password, confirmPassword, organization } = formData;


    if (!email || !name || !phoneNumber || !password) {
      setIsSubmitting(false);
      setRegistrationError("Please fill all required fields");
      return;
    }


    try {
      const phoneWithCode = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`;


      const formDataUrlEncoded = new URLSearchParams();
      formDataUrlEncoded.append("user_name", name);
      formDataUrlEncoded.append("user_email", email);
      formDataUrlEncoded.append("phone", phoneWithCode);
      formDataUrlEncoded.append("organization_name", organization || "");
      formDataUrlEncoded.append("user_password", password);
      formDataUrlEncoded.append("confirm_password", confirmPassword);


      await apiClient.post(
        "/api/auth/v1/register",
        formDataUrlEncoded.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            accept: "application/json",
          },
        }
      );
      
      displayNotification("success", "Registration successful! You can now log in.");
      setTimeout(() => navigate("/login"), 1000)
      setIsSubmitting(false);
      
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Registration failed";
      setRegistrationError(errorMessage);
    }
  };


  const onSubmit = () => {
    if (!isEmailVerified) {
      setIsSubmitting(false);
      setRegistrationError("Please verify your email first");
      return;
    }


    if (!isOtpVerified) {
      setIsSubmitting(false);
      setRegistrationError("Please verify OTP first");
      return;
    }


    submitRegistration();
  };


  const handleRegistrationSubmit = () => {
    setIsSubmitting(true);
    form.handleSubmit(onSubmit)();
  };


  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setIsConfirmPasswordVisible((prev) => !prev);


  return {
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
    setValue: form.setValue,
    verifyEmail,
    submitRegistration,
    onSubmit,
    handleRegistrationSubmit,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    displayNotification,
    setIsOtpModalVisible,
    setIsOtpVerified,
    clearEmailError,
    clearRegistrationError,
    handleOtpModalClose,
    isSubmitting,
  };
};


