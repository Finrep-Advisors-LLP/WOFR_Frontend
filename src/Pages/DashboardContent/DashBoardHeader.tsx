import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { ChevronRight, Menu, LogOut, Key, Eye, EyeOff, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import axios from "../../helper/axios";

interface HeaderProps {
  toggleSidebar?: () => void;
  sidebarVisible?: boolean;
}

const PAGE_INFO = {
  "/dashboard/modules": {
    title: "Module Management",
    description: "Manage your application modules and their settings.",
  },
  "/dashboard/users": {
    title: "User Management",
    description:
      "View and manage your organization's users and their access rights.",
  },
  "/dashboard/new": {
    title: "Our User Management",
    description:
      "View and manage your organization's users and their access rights.",
  },
  "/dashboard/roles": {
    title: "Our role Management",
    description:
      "View and manage your organization's users and their access rights.",
  },
  "/dashboard/financial": {
    title: "Financial Dashboard",
    description: "View financial reports and analytics.",
  },
  "/dashboard/role-management": {
    title: "Role Management",
    description: "View and manage your roles and their permissions.",
  },
  "/dashboard/Lease": {
    title: "Lease Management",
    description: "View and manage your roles and their permissions.",
  },
  "/dashboard/module": {
    title: "Module Management",
    description: "Manage your application modules and their settings.",
  },
  "dashboard/users": {
    title: "User Management",
    description:
      "View and manage your organization's users and their access rights.",
  },
  "/dashboard/role-mangement": {
    title: "Role Management",
    description: "View and manage your roles and their permissions.",
  },
  "/dashboard/org-form": {
    title: "Organization Management",
    description: "View and manage your Organization's settings.",
  },
  "/dashboard/Entity": {
    title: "Entity Management",
    description: "View and manage your Entity's settings.",
  },
  "/dashboard/Lessor": {
    title: "Lessor Management",
    description: "View and manage your Lessor's settings.",
  },
  "/dashboard/Asset": {
    title: "Asset Management",
    description: "View and manage your Asset's settings.",
  },
  "/dashboard/GL": {
    title: "GL Management",
    description: "View and manage your GL's settings.",
  },
  "/dashboard/department": {
    title: "Department Management",
    description: "View and manage your department's settings.",
  },
  "/dashboard/Currency": {
    title: "Currency Management",
    description: "View and manage your Currency's settings.",
  },
};

export const DashboardHeader = ({
  toggleSidebar,
  sidebarVisible = true,
}: HeaderProps) => {
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [, setIsTablet] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { authState, logout } = useAuth();

  const checkScreenSize = useCallback(() => {
    const width = window.innerWidth;
    setIsMobile(width < 768);
    setIsTablet(width >= 768 && width < 1024);
  }, []);

  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [checkScreenSize]);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const target = event.target as Element;
      if (isProfileOpen && !target.closest("[data-profile]")) {
        setIsProfileOpen(false);
      }
    },
    [isProfileOpen]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const userData = localStorage.getItem("userData");
  const parsedUserData = userData ? JSON.parse(userData) : null;

  const { pageTitle, pageDescription } = useMemo(() => {
    if (location.pathname === "/dashboard/overview") {
      return {
        pageTitle: `Welcome!!!`,
        pageDescription:
          "Here's what's happening with your enterprise dashboard today.",
      };
    }

    const pathInfo = PAGE_INFO[location.pathname as keyof typeof PAGE_INFO];
    if (pathInfo) {
      return {
        pageTitle: pathInfo.title,
        pageDescription: pathInfo.description,
      };
    }

    if (location.pathname.startsWith("/users/")) {
      return {
        pageTitle: "User Profile",
        pageDescription: "",
      };
    }

    return {
      pageTitle: "Dashboard",
      pageDescription: "",
    };
  }, [location.pathname, authState]);

  const toggleProfile = useCallback(() => {
    setIsProfileOpen((prev) => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setIsProfileOpen(false);
  }, [logout]);

  const validatePassword = useCallback((password: string) => {
    const errors: string[] = [];
    
    if (!password) {
      errors.push("Password is required");
    } else {
      if (password.length < 8) {
        errors.push("Password must be at least 8 characters long");
      }
      if (password.length > 12) {
        errors.push("Password must not exceed 12 characters");
      }
      if (!/(?=.*[a-z])/.test(password)) {
        errors.push("Password must contain at least one lowercase letter");
      }
      if (!/(?=.*[A-Z])/.test(password)) {
        errors.push("Password must contain at least one uppercase letter");
      }
      if (!/(?=.*\d)/.test(password)) {
        errors.push("Password must contain at least one number");
      }
      if (!/(?=.*[@$!%*?&])/.test(password)) {
        errors.push("Password must contain at least one special character (@$!%*?&)");
      }
    }
    
    return errors;
  }, []);

  const handlePasswordChange = useCallback((value: string) => {
    setNewPassword(value);
    const errors = validatePassword(value);
    setPasswordErrors(errors);
    
    // Also validate confirm password if it exists
    if (confirmPassword) {
      setConfirmPasswordError(
        value !== confirmPassword ? "Passwords do not match" : ""
      );
    }
  }, [validatePassword, confirmPassword]);

  const handleConfirmPasswordChange = useCallback((value: string) => {
    setConfirmPassword(value);
    setConfirmPasswordError(
      value !== newPassword ? "Passwords do not match" : ""
    );
  }, [newPassword]);

  const openPasswordModal = useCallback(() => {
    setIsPasswordModalOpen(true);
    setIsProfileOpen(false);
  }, []);

  const closePasswordModal = useCallback(() => {
    setIsPasswordModalOpen(false);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordErrors([]);
    setConfirmPasswordError("");
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  }, []);

  const handlePasswordSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validatePassword(newPassword);
    if (errors.length > 0 || confirmPasswordError) {
      return;
    }

    setIsChangingPassword(true);
    
    try {
      const authToken = authState?.token;
      if (!authToken) {
        throw new Error("No authentication token found");
      }

      const response = await axios.put(
        `api/auth/v1/update_password`,
        {},
        {
          params: {
            new_password: newPassword,
            confirm_password: confirmPassword,
          },
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Password changed successfully!");
        closePasswordModal();
      }
    } catch (error:any) {
      console.error("Error changing password:", error);
      
   
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.detail || 
                           `HTTP error! status: ${error.response?.status}`;
        alert(`Failed to change password: ${errorMessage}`);
      
    } finally {
      setIsChangingPassword(false);
    }
  }, [newPassword, confirmPassword, confirmPasswordError, validatePassword, closePasswordModal, authState?.token]);

  const isTenantUser = 
    authState?.user_type === "tenant_user" || 
    parsedUserData?.user_type === "tenant_user" ||
    authState?.user_type === "Tenant User" || 
    parsedUserData?.user_type === "Tenant User" ||
    (authState?.user_type && authState.user_type.toLowerCase().includes("tenant")) ||
    (parsedUserData?.user_type && parsedUserData.user_type.toLowerCase().includes("tenant"));

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="px-2 sm:px-4 lg:px-6 xl:px-8 py-2 sm:py-3 lg:py-4 flex items-center justify-between min-h-[56px] sm:min-h-[64px] lg:min-h-[72px]">
          {/* Left Section */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 min-w-0 flex-1">
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-1.5 sm:p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 flex-shrink-0"
                aria-label="Toggle sidebar"
              >
                {sidebarVisible ? <Menu size={18} /> : <ChevronRight size={18} />}
              </button>
            )}

            <div className="min-w-0 flex-1">
              <h1 className="font-semibold text-gray-900 text-sm sm:text-base md:text-lg xl:text-xl 2xl:text-2xl truncate leading-tight">
                {pageTitle}
              </h1>
              {pageDescription && (
                <p className="text-xs sm:text-sm lg:text-base  text-gray-600 mt-0.5 sm:mt-1 truncate hidden sm:block leading-relaxed">
                  {pageDescription}
                </p>
              )}
            </div>
          </div>

          {/* Right Section - Profile Only */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 xl:space-x-5 flex-shrink-0">
            {/* User Profile Section */}
            <div className="relative" data-profile>
              <div className="flex items-center space-x-1.5 sm:space-x-2 lg:space-x-3">
                {authState?.user_type && (
                  <span
                    className={`text-xs lg:text-sm xl:text-base font-medium px-1.5 sm:px-2 lg:px-3 py-0.5 sm:py-1 rounded-full whitespace-nowrap ${
                      authState.user_type === "Super Admin" ||
                      authState.user_type === "super_admin"
                        ? "bg-red-100 text-red-700"
                        : authState.user_type === "Master Admin" ||
                          authState.user_type === "master_admin"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {isMobile && authState.user_type.length > 10
                      ? authState.user_type.substring(0, 8) + "..."
                      : authState.user_type
                          .replace("_", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                )}
                <button
                  onClick={toggleProfile}
                  className="flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full transition-all duration-200 hover:scale-105"
                  aria-label="User profile"
                  aria-expanded={isProfileOpen}
                >
                  <img
                    src="https://i.pravatar.cc/40?img=68"
                    alt="User profile"
                    className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 rounded-full border-2 border-gray-200 shadow-sm"
                    width="40"
                    height="40"
                    loading="lazy"
                  />
                </button>
              </div>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 lg:w-96 max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-fadeIn">
                  {/* Profile Header */}
                  <div className="px-3 sm:px-4 py-3 sm:py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                    <div className="flex items-center space-x-3">
                      <img
                        src="https://i.pravatar.cc/40?img=68"
                        alt="User profile"
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                          {authState?.username || "User Profile"}
                        </h3>

                        {authState?.email && (
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {authState.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* User Information from AuthState */}
                  <div className="px-3 sm:px-4 py-3 border-b border-gray-200">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                      Account Information
                    </h4>
                    <div className="space-y-1.5 sm:space-y-2">
                      {parsedUserData?.user_id && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">User ID:</span>
                          <span className="text-xs sm:text-sm font-medium text-gray-900 truncate ml-2">
                            {parsedUserData.user_id}
                          </span>
                        </div>
                      )}
                      {parsedUserData?.username && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Username:</span>
                          <span className="text-xs sm:text-sm font-medium text-gray-900 truncate ml-2">
                            {parsedUserData.username}
                          </span>
                        </div>
                      )}
                      {parsedUserData?.email && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Email:</span>
                          <span className="text-xs sm:text-sm font-medium text-gray-900 truncate ml-2">
                            {parsedUserData.email}
                          </span>
                        </div>
                      )}
                      {parsedUserData?.user_type && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Role:</span>
                          <span className="text-xs sm:text-sm font-medium text-gray-900 truncate ml-2">
                            {parsedUserData.user_type
                              .replace("_", " ")
                              .replace(/\b\w/g, (l: any) => l.toUpperCase())}
                          </span>
                        </div>
                      )}
                      {parsedUserData?.tenant_id && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            Tenant ID:
                          </span>
                          <span className="text-xs sm:text-sm font-medium text-gray-900 truncate ml-2">
                            {parsedUserData.tenant_id}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Profile Actions */}
                  <div className="py-2">
                    {isTenantUser && (
                      <button
                        onClick={openPasswordModal}
                        className="flex items-center w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-blue-600 hover:bg-blue-50 transition-colors duration-150"
                      >
                        <Key size={16} className="mr-2 sm:mr-3 text-blue-500" />
                        Change Password
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                    >
                      <LogOut size={16} className="mr-2 sm:mr-3 text-red-500" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30 p-4">
  <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
    <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Change Password
              </h3>
              <button
                onClick={closePasswordModal}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="p-4 sm:p-6">
              <div className="space-y-4">
                {/* New Password Field */}
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="new-password"
                      value={newPassword}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {passwordErrors.length > 0 && (
                    <div className="mt-1 text-xs text-red-600">
                      {passwordErrors.map((error, index) => (
                        <div key={index}>• {error}</div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {confirmPasswordError && (
                    <div className="mt-1 text-xs text-red-600">
                      {confirmPasswordError}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordErrors.length > 0 || confirmPasswordError !== "" || !newPassword || !confirmPassword || isChangingPassword}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isChangingPassword ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};