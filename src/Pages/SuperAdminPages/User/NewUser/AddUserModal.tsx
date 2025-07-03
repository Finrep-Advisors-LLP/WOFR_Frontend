
import { User, Mail, UserPlus, X, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import axios from "../../../../helper/axios";
import toast from "react-hot-toast";

interface UserData {
  name: string;
  email: string;
  nameError?: string;
  emailError?: string;
}

type AddMultipleUsersModalProps = {
  onClose: () => void;
  onSave?: (users: UserData[]) => void;
  modules?: any[];
};

const AddUserModal: React.FC<AddMultipleUsersModalProps> = ({ onClose }) => {
  const { authState } = useAuth();
  const [users, setUsers] = useState<UserData[]>([
    { name: "", email: "", nameError: "", emailError: "" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>("");

  // Enhanced validation functions
  const validateEmail = (email: string): string => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim()) return "Email is required";
    if (email.length > 100) return "Email must be less than 100 characters";
    if (!re.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validateUserName = (name: string): string => {
    if (!name.trim()) return "User name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    if (name.length > 20) return "Name must be less than 50 characters";
   if (!/^[a-zA-Z\s]+$/.test(name)) return "Name should contain only letters and spaces";
return "";

  };

  // Check for duplicate emails within the form
  const checkDuplicateEmails = (): boolean => {
    const emails = users.map(user => user.email.toLowerCase().trim()).filter(email => email);
    const uniqueEmails = new Set(emails);
    return emails.length !== uniqueEmails.size;
  };

  // Add new user row
  const addUserRow = () => {
    if (users.length >= 20) {
      setApiError("Maximum 20 users allowed per form submission");
      return;
    }
    setUsers([...users, { name: "", email: "", nameError: "", emailError: "" }]);
    setApiError("");
  };

  // Remove user row
  const removeUserRow = (index: number) => {
    if (users.length > 1) {
      setUsers(users.filter((_, i) => i !== index));
      setApiError("");
    }
  };

  // Update user data
  const updateUser = (index: number, field: keyof UserData, value: string) => {
    const newUsers = [...users];
    newUsers[index] = { ...newUsers[index], [field]: value };
    
    // Clear errors when user starts typing
    if (field === 'name') {
      newUsers[index].nameError = validateUserName(value);
    } else if (field === 'email') {
      newUsers[index].emailError = validateEmail(value);
    }
    
    setUsers(newUsers);
    setApiError("");
  };

  // Enhanced validation for all users
  const validateAllUsers = (): boolean => {
    // Check for duplicate emails
    if (checkDuplicateEmails()) {
      setApiError("Duplicate email addresses found in the form");
      return false;
    }

    const newUsers = users.map(user => ({
      ...user,
      nameError: validateUserName(user.name),
      emailError: validateEmail(user.email)
    }));
    
    setUsers(newUsers);
    
    const hasErrors = newUsers.some(user => user.nameError || user.emailError);
    if (hasErrors) {
      setApiError("Please fix all validation errors before submitting");
    }
    
    return !hasErrors;
  };

  // Enhanced API call with better error handling
  const createMultipleUsers = async () => {
    if (!validateAllUsers()) return;

    setIsLoading(true);
    setApiError("");
    
    try {
      const token = authState.token;
      const userData = users.map(user => ({
        name: user.name.trim(),
        email: user.email.toLowerCase().trim()
      }));

      await axios.post(
        "api/v1/tenant-user",
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

       toast.success(`${users.length} user(s) created successfully!`, {
        // id: loadingToastId,
        duration: 2000,
      });

      onClose();
      
      // Reload after a short delay to allow toast to be seen
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error("Error creating users:", error);
      
      // Enhanced error handling from API response
      let errorMessage = 'Error creating users. Please try again.';
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = users.every(user => 
    user.name && user.email && !user.nameError && !user.emailError
  ) && !checkDuplicateEmails();

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-1 sm:p-2">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        
        {/* Compact Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-3 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-white" />
              <div>
                <h2 className="text-sm font-bold text-white">Add Multiple Users</h2>
                <p className="text-blue-100 text-xs">Create up to 20 accounts</p>
              </div>
            </div>
            <button onClick={onClose} disabled={isLoading} className="p-1 hover:bg-white/20 rounded">
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-3 max-h-[70vh] overflow-y-auto">
          {/* API Error Display */}
          {apiError && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded">
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="text-sm text-red-700 flex-1">{apiError}</div>
                <button onClick={() => setApiError("")} className="text-red-500">
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {users.map((user, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-700">User {index + 1}</h3>
                  {users.length > 1 && (
                    <button onClick={() => removeUserRow(index)} className="p-1 text-red-500 hover:bg-red-100 rounded">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {/* Name Field */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-1 text-xs font-medium text-gray-700">
                      <User className="h-3 w-3 text-blue-600" />
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={user.name}
                      onChange={(e) => updateUser(index, 'name', e.target.value)}
                      onBlur={() => {
                        const error = validateUserName(user.name);
                        updateUser(index, 'nameError', error);
                      }}
                      className={`w-full px-2 py-1.5 border rounded text-sm ${
                        user.nameError 
                          ? "border-red-300 bg-red-50" 
                          : "border-gray-300"
                      }`}
                    />
                    {user.nameError && (
                      <p className="text-xs text-red-600">{user.nameError}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-1 text-xs font-medium text-gray-700">
                      <Mail className="h-3 w-3 text-blue-600" />
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="user@company.com"
                      value={user.email}
                      onChange={(e) => updateUser(index, 'email', e.target.value)}
                      onBlur={() => {
                        const error = validateEmail(user.email);
                        updateUser(index, 'emailError', error);
                      }}
                      className={`w-full px-2 py-1.5 border rounded text-sm ${
                        user.emailError 
                          ? "border-red-300 bg-red-50" 
                          : "border-gray-300"
                      }`}
                    />
                    {user.emailError && (
                      <p className="text-xs text-red-600">{user.emailError}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add User Button */}
          <button
            onClick={addUserRow}
            disabled={users.length >= 20}
            className="mt-3 w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add User {users.length >= 20 && "(Max 20)"}
          </button>
        </div>

        {/* Action Footer */}
        <div className="bg-gray-50 px-3 py-2 border-t flex gap-2 justify-end">
          <button
            className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-100"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
            onClick={createMultipleUsers}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                Creating...
              </>
            ) : (
              <>
                <UserPlus className="h-3 w-3" />
                Create {users.length}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;