

import React, { useEffect, useState, useRef } from "react";
import { ChevronDown, X, User, Check, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../../../hooks/useAuth";
import axios from "../../../../helper/axios";
import { createPortal } from "react-dom";

interface Role {
  role_id: number;
  role_name: string;
  description: string;
  status: string;
  created_by: string;
  created_at: string;
}

interface AssignUserProps {
  user: any;
  module?: string;
  onClose: () => void;
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

interface APIResponse {
  success: boolean;
  data: {
    roles: Role[];
  };
  meta: null;
}

const MultiSelectDropdown = ({
  label,
  selectedValues,
  options,
  onChange,
  placeholder,
  disabled = false,
  assignedRoles = [],
}: {
  label: string;
  selectedValues: string[];
  options: { id: string; name: string }[];
  onChange: (values: string[]) => void;
  placeholder: string;
  disabled?: boolean;
  assignedRoles?: string[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'below' | 'above'>('below');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const selectedOptions = options.filter(opt => selectedValues.includes(opt.id));
  const availableOptions = options.filter(opt => !assignedRoles.includes(opt.id));

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      
      setDropdownPosition(spaceBelow < 250 && spaceAbove > spaceBelow ? 'above' : 'below');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleToggleOption = (optionId: string) => {
    const newValues = selectedValues.includes(optionId)
      ? selectedValues.filter(id => id !== optionId)
      : [...selectedValues, optionId];
    onChange(newValues);
  };

  const getDisplayText = () => {
    if (selectedOptions.length === 0) return placeholder;
    if (selectedOptions.length === 1) return selectedOptions[0].name;
    return `${selectedOptions.length} roles selected`;
  };

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      
      {assignedRoles.length > 0 && (
        <div className="mb-2">
          <div className="text-xs text-gray-500 mb-1">Already Assigned:</div>
          <div className="flex flex-wrap gap-1">
            {assignedRoles.map((roleId) => {
              const role = options.find(opt => opt.id === roleId);
              return role ? (
                <span key={roleId} className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                  {role.name}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}

      <div className="relative" ref={dropdownRef}>
        <button
          ref={buttonRef}
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled || availableOptions.length === 0}
          className={`w-full px-3 py-2 text-left bg-white border rounded-lg text-sm transition-all duration-200 ${
            disabled || availableOptions.length === 0
              ? "bg-gray-50 border-gray-200 cursor-not-allowed text-gray-400"
              : isOpen
              ? "border-blue-500 ring-2 ring-blue-100"
              : "border-gray-300 hover:border-gray-400 hover:shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={selectedOptions.length > 0 ? "text-gray-900" : "text-gray-500"}>
              {availableOptions.length === 0 ? "All roles assigned" : getDisplayText()}
            </span>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </div>
        </button>

        {isOpen && !disabled && availableOptions.length > 0 && (
          <div className={`absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-xl ${
            dropdownPosition === 'above' ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}>
            <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {availableOptions.length > 5 && (
                <div className="px-3 py-2 border-b border-gray-100 bg-gray-50 sticky top-0">
                  <div className="text-xs text-gray-500 font-medium">
                    {availableOptions.length} available roles
                  </div>
                </div>
              )}
              
              <div className="py-1">
                {availableOptions.map((option) => {
                  const isSelected = selectedValues.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleToggleOption(option.id)}
                      className={`w-full px-3 py-2.5 text-left text-sm hover:bg-blue-50 flex items-center justify-between transition-colors duration-150 ${
                        isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      <span className="flex-1 truncate pr-2 font-medium">{option.name}</span>
                      {isSelected && (
                        <div className="flex-shrink-0">
                          <Check className="h-4 w-4 text-blue-600" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {selectedOptions.length > 0 && (
        <div className="mt-2">
          <div className="text-xs text-gray-500 mb-1">Selected for Assignment:</div>
          <div className="flex flex-wrap gap-1">
            {selectedOptions.map((option) => (
              <span key={option.id} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md border border-blue-200">
                <span className="font-medium">{option.name}</span>
                <button 
                  type="button" 
                  onClick={() => handleToggleOption(option.id)} 
                  className="hover:bg-blue-200 rounded-full p-0.5 transition-colors duration-150"
                  title="Remove role"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const AssignUser: React.FC<AssignUserProps> = ({ user, onClose, onSuccess, onError }) => {
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [assignedRoleIds, setAssignedRoleIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authState } = useAuth();
  const token = authState.token;
  const userType = authState.user_type;

  // Custom toast styles
  const toastStyle = {
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '14px',
    maxWidth: '500px',
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // const loadingToast = toast.loading(
      //   <div className="flex items-center gap-2">
      //     <Loader2 className="h-4 w-4 animate-spin" />
      //     <span>Loading user roles...</span>
      //   </div>,
      //   {
      //     style: toastStyle,
      //     duration: 3000,
      //   }
      // );

      // Fetch available roles
      const rolesResponse = await axios.get<APIResponse>(
        `api/v1/user-assignment-roles`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (rolesResponse.data.success && rolesResponse.data.data.roles) {
        setAllRoles(rolesResponse.data.data.roles);
      }

      // Fetch assigned roles
      try {
        const assignedResponse = await axios.get(
          `/api/v1/assigned-tenant-user-screen`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const assignments = assignedResponse.data.data.assigned_screen_to_tenant_user || [];
        const userAssignments = assignments.filter((assignment: any) => 
          assignment.tenant_user_id === user.tenant_user_id
        );

        const assignedIds = [...new Set(
          userAssignments.map((assignment: any) => 
            assignment.screen_data?.role?.role_id?.toString()
          ).filter(Boolean)
        )];

        setAssignedRoleIds(assignedIds as string[]);

        // toast.success(
        //   <div className="flex items-center gap-2">
        //     <Check className="h-4 w-4 text-green-500" />
        //     <span>Roles loaded successfully!</span>
        //   </div>,
        //   {
        //     id: loadingToast,
        //     style: toastStyle,
        //     duration: 2000
        //   }
        // );
      } catch (assignedError) {
        console.warn("Could not fetch assigned roles:", assignedError);
        // toast.dismiss(loadingToast);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch roles data");
      toast.error(
        <div className="flex items-center gap-2">
          <X className="h-4 w-4 text-red-500" />
          <span>Failed to load roles</span>
        </div>,
        {
          style: toastStyle,
          duration: 4000
        }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userType === "super_admin") {
      fetchData();
    }
  }, [userType, token, user.tenant_user_id]);

  const handleRoleChange = (roleIds: string[]) => {
    setSelectedRoleIds(roleIds);
  };

  const handleSaveAssignments = async () => {
    if (selectedRoleIds.length === 0) {
      toast.error(
        <div className="flex items-center gap-2">
          <X className="h-4 w-4 text-red-500" />
          <span>Please select at least one role</span>
        </div>,
        {
          style: toastStyle,
          duration: 4000
        }
      );
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const savingToast = toast.loading(
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Assigning {selectedRoleIds.length} role(s)...</span>
        </div>,
        {
          style: toastStyle,
        }
      );

      const payload = {
        tenant_user_id: user.tenant_user_id,
        role_id: selectedRoleIds.map(id => parseInt(id)),
      };

      await axios.post("api/v1/assign-tenant-user-screen", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      
    onClose();
      toast.success(
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-500" />
          <span>{selectedRoleIds.length} role(s) assigned successfully!</span>
        </div>,
        {
          id: savingToast,
          style: toastStyle,
          duration: 5000
        }
      );

      if (onSuccess) {
        onSuccess(`${selectedRoleIds.length} role(s) assigned successfully`);
      }

      // Delay closing to allow user to see the success message
      
     setTimeout(() => {
        // onClose();     
      window.location.reload();
      }, 2000);
    } catch (err: any) {
      console.error("Error saving assignments:", err);
      const errorMessage =
        err.response?.data?.message || 
        err.response?.data?.detail || 
        "Failed to assign roles";
      setError(errorMessage);
      
      toast.error(
        <div className="flex items-center gap-2">
          <X className="h-4 w-4 text-red-500" />
          <span>Error: {errorMessage}</span>
        </div>,
        {
          style: toastStyle,
          duration: 5000
        }
      );
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  const roleOptions = allRoles.map((role) => ({
    id: role.role_id.toString(),
    name: role.role_name,
  }));

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-xl flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <span className="text-gray-700">Loading roles...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm">
          <div className="text-red-600 mb-4 text-center">{error}</div>
          <button 
            onClick={onClose} 
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return createPortal(
    // <>
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[90vh]">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Assign User Roles</h2>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            disabled={saving}
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50">
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              <span className="font-medium">User ID:</span> {user.tenant_user_id}
            </div>
          </div>

          <div className="mb-6">
            <MultiSelectDropdown
              label="Select Roles to Assign"
              selectedValues={selectedRoleIds}
              options={roleOptions}
              onChange={handleRoleChange}
              placeholder="Choose roles to assign"
              assignedRoles={assignedRoleIds}
            />
          </div>
        </div>

        <div className="bg-white px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            onClick={handleSaveAssignments}
            disabled={saving || selectedRoleIds.length === 0}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              `Assign ${selectedRoleIds.length} Role${selectedRoleIds.length !== 1 ? 's' : ''}`
            )}
          </button>
        </div>
      </div>
    </div>,
   
  
     document.body
  );
};

export default AssignUser;