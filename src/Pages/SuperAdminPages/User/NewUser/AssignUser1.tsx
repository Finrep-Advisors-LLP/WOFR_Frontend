

// import React, { useEffect, useState } from "react";
// import { ChevronDown, X, User, Check } from "lucide-react";
// import toast from "react-hot-toast";
// import { useAuth } from "../../../../hooks/useAuth";
// import axios from "../../../../helper/axios";
// import { createPortal } from "react-dom";

// interface Role {
//   role_id: number;
//   role_name: string;
//   description: string;
//   status: string;
//   created_by: string;
//   created_at: string;
// }

// interface AssignUserProps {
//   user: any;
//   module?: string;
//   onClose: () => void;
// }

// interface APIResponse {
//   success: boolean;
//   data: {
//     roles: Role[];
//   };
//   meta: null;
// }

// const MultiSelectDropdown = ({
//   label,
//   selectedValues,
//   options,
//   onChange,
//   placeholder,
//   disabled = false,
//   assignedRoles = [],
// }: {
//   label: string;
//   selectedValues: string[];
//   options: { id: string; name: string }[];
//   onChange: (values: string[]) => void;
//   placeholder: string;
//   disabled?: boolean;
//   assignedRoles?: string[];
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const selectedOptions = options.filter(opt => selectedValues.includes(opt.id));
  
//   // Filter out already assigned roles
//   const availableOptions = options.filter(opt => !assignedRoles.includes(opt.id));

//   const handleToggleOption = (optionId: string) => {
//     const newValues = selectedValues.includes(optionId)
//       ? selectedValues.filter(id => id !== optionId)
//       : [...selectedValues, optionId];
//     onChange(newValues);
//   };

//   const getDisplayText = () => {
//     if (selectedOptions.length === 0) return placeholder;
//     if (selectedOptions.length === 1) return selectedOptions[0].name;
//     return `${selectedOptions.length} roles selected`;
//   };

//   return (
//     <div className="space-y-1">
//       <label className="text-sm font-medium text-gray-700">{label}</label>
      
//       {/* Show assigned roles if any */}
//       {assignedRoles.length > 0 && (
//         <div className="mb-2">
//           <div className="text-xs text-gray-500 mb-1">Already Assigned:</div>
//           <div className="flex flex-wrap gap-1">
//             {assignedRoles.map((roleId) => {
//               const role = options.find(opt => opt.id === roleId);
//               return role ? (
//                 <span key={roleId} className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
//                   {role.name}
//                 </span>
//               ) : null;
//             })}
//           </div>
//         </div>
//       )}

//       <div className="relative">
//         <button
//           type="button"
//           onClick={() => !disabled && setIsOpen(!isOpen)}
//           disabled={disabled || availableOptions.length === 0}
//           className={`w-full px-2 py-1.5 text-left bg-white border rounded text-sm ${
//             disabled || availableOptions.length === 0
//               ? "bg-gray-50 border-gray-200 cursor-not-allowed text-gray-400"
//               : isOpen
//               ? "border-blue-500"
//               : "border-gray-300 hover:border-gray-400"
//           }`}
//         >
//           <div className="flex items-center justify-between">
//             <span className={selectedOptions.length > 0 ? "text-gray-900" : "text-gray-500"}>
//               {availableOptions.length === 0 ? "All roles assigned" : getDisplayText()}
//             </span>
//             <ChevronDown className={`h-3 w-3 text-gray-400 ${isOpen ? "rotate-180" : ""}`} />
//           </div>
//         </button>

//         {isOpen && !disabled && availableOptions.length > 0 && (
//           <div className="absolute z-50 w-full mt-1 bg-white border rounded shadow-lg max-h-40 overflow-y-auto">
//             {availableOptions.map((option) => {
//               const isSelected = selectedValues.includes(option.id);
//               return (
//                 <button
//                   key={option.id}
//                   type="button"
//                   onClick={() => handleToggleOption(option.id)}
//                   className="w-full px-2 py-1.5 text-left text-sm hover:bg-gray-100 flex items-center justify-between"
//                 >
//                   <span>{option.name}</span>
//                   {isSelected && <Check className="h-3 w-3 text-blue-600" />}
//                 </button>
//               );
//             })}
//           </div>
//         )}
//       </div>
      
//       {/* Selected roles display */}
//       {selectedOptions.length > 0 && (
//         <div className="mt-1 flex flex-wrap gap-1">
//           {selectedOptions.map((option) => (
//             <span key={option.id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
//               {option.name}
//               <button type="button" onClick={() => handleToggleOption(option.id)} className="hover:bg-blue-200 rounded p-0.5">
//                 <X className="h-2 w-2" />
//               </button>
//             </span>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const AssignUser1: React.FC<AssignUserProps> = ({ user, onClose }) => {
//   const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
//   const [allRoles, setAllRoles] = useState<Role[]>([]);
//   const [assignedRoleIds, setAssignedRoleIds] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const { authState } = useAuth();
//   const token = authState.token;
//   const userType = authState.user_type;

//   // Fetch available roles and assigned roles
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Fetch available roles
//         const rolesResponse = await axios.get<APIResponse>(
//           `api/v1/user-assignment-roles`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               Accept: "application/json",
//             },
//           }
//         );

//         if (rolesResponse.data.success && rolesResponse.data.data.roles) {
//           setAllRoles(rolesResponse.data.data.roles);
//         }

//         // Fetch assigned roles for this user
//         try {
//           const assignedResponse = await axios.get(
//             `/api/v1/assigned-tenant-user-screen`,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//                 Accept: "application/json",
//               },
//             }
//           );

//           const assignments = assignedResponse.data.data.assigned_screen_to_tenant_user || [];
//           const userAssignments = assignments.filter((assignment: any) => 
//             assignment.tenant_user_id === user.tenant_user_id
//           );

//           // Extract unique role IDs that are already assigned to this user
//           const assignedIds = [...new Set(
//             userAssignments.map((assignment: any) => 
//               assignment.screen_data?.role?.role_id?.toString()
//             ).filter(Boolean)
//           )];

// setAssignedRoleIds(assignedIds as string[]);
//         } catch (assignedError) {
//           console.warn("Could not fetch assigned roles:", assignedError);
//           // Continue without assigned roles data
//         }

//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError("Failed to fetch roles data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userType === "super_admin") {
//       fetchData();
//     }
//   }, [userType, token, user.tenant_user_id]);

//   const handleRoleChange = (roleIds: string[]) => {
//     setSelectedRoleIds(roleIds);
//   };

//   const handleSaveAssignments = async () => {
//     if (selectedRoleIds.length === 0) {
//       toast.error("Please select at least one role");
//       return;
//     }

//     try {
//       setSaving(true);
//       setError(null);

//       const payload = {
//         tenant_user_id: user.tenant_user_id,
//         role_id: selectedRoleIds.map(id => parseInt(id)),
//       };

//       await axios.post("api/v1/assign-tenant-user-screen", payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//       });

//       toast.success("User roles assigned successfully!");
//       window.location.reload();
//       onClose();
//     } catch (err: any) {
//       console.error("Error saving assignments:", err);
//       const errorMessage =
//         err.response?.data?.message || 
//         err.response?.data?.detail || 
//         "Failed to assign roles";
//       setError(errorMessage);
//       toast.error(`Error: ${errorMessage}`);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Convert roles to dropdown options format
//   const roleOptions = allRoles.map((role) => ({
//     id: role.role_id.toString(),
//     name: role.role_name,
//   }));

//   if (loading) {
//     return (
//       <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//         <div className="bg-white rounded p-4 shadow-xl flex items-center gap-2">
//           <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
//           <span className="text-gray-700 text-sm">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//         <div className="bg-white rounded p-4 shadow-xl max-w-sm">
//           <div className="text-red-600 mb-3 text-center text-sm">{error}</div>
//           <button onClick={onClose} className="w-full px-3 py-1.5 bg-gray-600 text-white rounded text-sm">
//             Close
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return createPortal(
//     <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-1 sm:p-2">
//       <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden">

//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 flex items-center justify-between">
//           <h2 className="text-sm font-semibold text-white">Assign User Roles</h2>
//           <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
//             <X className="h-4 w-4 text-white" />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="flex-1 overflow-y-auto px-3 py-3 bg-gray-50">
//           {/* User Info Box */}
//           <div className="bg-white rounded border border-dashed border-gray-300 p-2 mb-3">
//             <div className="flex items-center gap-2 mb-1">
//               <User className="h-4 w-4 text-blue-600" />
//               <span className="font-medium text-gray-800 text-sm">{user.name}</span>
//             </div>
//             <div className="text-xs text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-1">
//               <div><span className="font-medium">Email:</span> {user.email}</div>
//               <div><span className="font-medium">ID:</span> {user.tenant_user_id}</div>
//             </div>
//           </div>

//           {/* Role Selector */}
//           <div className="mb-3">
//             <MultiSelectDropdown
//               label="Select Roles to Assign"
//               selectedValues={selectedRoleIds}
//               options={roleOptions}
//               onChange={handleRoleChange}
//               placeholder="Choose roles to assign"
//               assignedRoles={assignedRoleIds}
//             />
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="bg-white px-3 py-2 border-t flex justify-end gap-2">
//           <button
//             className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 text-sm hover:bg-gray-100"
//             onClick={onClose}
//             disabled={saving}
//           >
//             Cancel
//           </button>
//           <button
//             className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
//             onClick={handleSaveAssignments}
//             disabled={saving || selectedRoleIds.length === 0}
//           >
//             {saving ? (
//               <>
//                 <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
//                 Assigning...
//               </>
//             ) : (
//               `Assign ${selectedRoleIds.length} Role${selectedRoleIds.length !== 1 ? 's' : ''}`
//             )}
//           </button>
//         </div>
//       </div>
//     </div>,
//     document.body
//   );
// };

// export default AssignUser1;
import React, { useEffect, useState, useRef } from "react";
import { ChevronDown, X, User, Check } from "lucide-react";
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
  
  // Filter out already assigned roles
  const availableOptions = options.filter(opt => !assignedRoles.includes(opt.id));

  // Calculate dropdown position
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      
      // If there's more space above and not enough space below, position above
      if (spaceBelow < 250 && spaceAbove > spaceBelow) {
        setDropdownPosition('above');
      } else {
        setDropdownPosition('below');
      }
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
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
      
      {/* Show assigned roles if any */}
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

        {/* Simple Dropdown - No Portal */}
        {isOpen && !disabled && availableOptions.length > 0 && (
          <div className={`absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-xl ${
            dropdownPosition === 'above' ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}>
            <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {/* Header for many options */}
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
      
      {/* Selected roles display */}
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

const AssignUser1: React.FC<AssignUserProps> = ({ user, onClose }) => {
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [assignedRoleIds, setAssignedRoleIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authState } = useAuth();
  const token = authState.token;
  const userType = authState.user_type;

  // Fetch available roles and assigned roles
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

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

        // Fetch assigned roles for this user
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

          // Extract unique role IDs that are already assigned to this user
          const assignedIds = [...new Set(
            userAssignments.map((assignment: any) => 
              assignment.screen_data?.role?.role_id?.toString()
            ).filter(Boolean)
          )];

          setAssignedRoleIds(assignedIds as string[]);
        } catch (assignedError) {
          console.warn("Could not fetch assigned roles:", assignedError);
          // Continue without assigned roles data
        }

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch roles data");
      } finally {
        setLoading(false);
      }
    };

    if (userType === "super_admin") {
      fetchData();
    }
  }, [userType, token, user.tenant_user_id]);

  const handleRoleChange = (roleIds: string[]) => {
    setSelectedRoleIds(roleIds);
  };

  const handleSaveAssignments = async () => {
    if (selectedRoleIds.length === 0) {
      toast.error("Please select at least one role");
      return;
    }

    try {
      setSaving(true);
      setError(null);

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

      toast.success("User roles assigned successfully!");
      window.location.reload();
      onClose();
    } catch (err: any) {
      console.error("Error saving assignments:", err);
      const errorMessage =
        err.response?.data?.message || 
        err.response?.data?.detail || 
        "Failed to assign roles";
      setError(errorMessage);
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  // Convert roles to dropdown options format
  const roleOptions = allRoles.map((role) => ({
    id: role.role_id.toString(),
    name: role.role_name,
  }));

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-xl flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
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
          <button onClick={onClose} className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            Close
          </button>
        </div>
      </div>
    );
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[90vh]">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Assign User Roles</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50">
          {/* User Info Box */}
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

          {/* Role Selector */}
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

        {/* Footer */}
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
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
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

export default AssignUser1;