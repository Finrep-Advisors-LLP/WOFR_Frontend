import React, { useEffect, useState, useRef } from "react";
// import { ChevronDown } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import axios from "../../../helper/axios";
import TableHeader from "../../../component/common/ui/Table/TableHeader";
import Pagination from "../../../component/common/ui/Table/Pagination";
import AssignUser1 from "./NewUser/AssignUser1";

interface UserManagementProps {
  isReadOnly: boolean;
  searchTerm?: string;
  onUserSelect?: (userId: string) => void;
}

interface AssignedRole {
  tenant_user_id: any;
  assignment_date: string;
  screen_data: {
    role: any;
    module_action_pair: {
      action: {
        action_name: string;
      };
      module: {
        module_name: string;
      };
      role: {
        role_name: string;
      };
      screen_id: number;
      sub_action: any;
    };
    tenant_id: string;
    tenant_name: string;
    tenant_user_id: string;
    tenant_user_name: string;
    tenant_user_role_mapping_id: number;
    updated_at: string;
  };
}

const SuperUserManagement: React.FC<UserManagementProps> = ({
  searchTerm = "",
  onUserSelect,
}) => {
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itemsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [assignedRoles, setAssignedRoles] = useState<AssignedRole[]>([]);
  const [expandedDropdown, setExpandedDropdown] = useState<{
    id: string;
    type: string;
  } | null>(null);

  // Refs for smart positioning
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRefs = useRef<Record<string, HTMLButtonElement>>({});
  const [dropdownPosition] = useState<{
    top?: number;
    bottom?: number;
    left: number;
    openUpward: boolean;
  }>({ left: 0, openUpward: false });

  const { authState } = useAuth();
  const token = authState.token;
  const userType = authState.user_type;
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);

  type User = {
    name: string;
    email: string;
    tenant_user_id?: string;
    tenant_name?: string;
    created_at?: string;
  };
  const [newUsers, setNewUsers] = useState<User[]>([]);

  // Configure axios defaults
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  axios.defaults.headers.common["accept"] = "application/json";

  // Calculate smart dropdown position
  // const calculateDropdownPosition = useCallback((buttonElement: HTMLButtonElement) => {
  //   const buttonRect = buttonElement.getBoundingClientRect();
  //   const tableContainer = tableContainerRef.current;
    
  //   if (!tableContainer) return { left: 0, openUpward: false };
    
  //   const containerRect = tableContainer.getBoundingClientRect();
  //   const dropdownHeight = 300; // Reduced dropdown height
  //   const spaceBelow = containerRect.bottom - buttonRect.bottom;
  //   const spaceAbove = buttonRect.top - containerRect.top;
    
  //   // Calculate position relative to the table container
  //   const relativeLeft = Math.max(0, Math.min(
  //     buttonRect.left - containerRect.left,
  //     containerRect.width - 280 // Ensure dropdown doesn't overflow
  //   ));
    
  //   // Determine if dropdown should open upward
  //   const shouldOpenUpward = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight;
    
  //   if (shouldOpenUpward) {
  //     return {
  //       bottom: containerRect.bottom - buttonRect.top + 8,
  //       left: relativeLeft,
  //       openUpward: true,
  //     };
  //   } else {
  //     return {
  //       top: buttonRect.bottom - containerRect.top + 8,
  //       left: relativeLeft,
  //       openUpward: false,
  //     };
  //   }
  // }, []);

  // Close dropdown on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (expandedDropdown) {
        setExpandedDropdown(null);
      }
    };

    const tableContainer = tableContainerRef.current;
    if (tableContainer) {
      tableContainer.addEventListener('scroll', handleScroll);
      return () => tableContainer.removeEventListener('scroll', handleScroll);
    }
  }, [expandedDropdown]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (expandedDropdown && tableContainerRef.current) {
        const target = event.target as Node;
        
        // Check if click is on a dropdown button
        const isClickOnDropdownButton = Object.values(dropdownRefs.current).some(
          button => button && button.contains(target)
        );
        
        // Check if click is inside the dropdown content
        const dropdownElement = document.querySelector('.dropdown-content');
        const isClickInsideDropdown = dropdownElement && dropdownElement.contains(target);
        
        // Close dropdown if click is outside button and dropdown content
        if (!isClickOnDropdownButton && !isClickInsideDropdown) {
          setExpandedDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expandedDropdown]);

  // Fetch user data with search and pagination
  const fetchUserData = async (page: number = 1, search: string = "") => {
    try {
      setLoading(true);
      setError(null);

      let url = `api/v1/tenant-user?page=${page}&limit=${itemsPerPage}&sort_by=created_at&sort_order=asc`;

      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const usersData = response.data?.data?.tenant_users || [];
      const totalCount = response.data?.meta?.total_items || 0;

      setNewUsers(usersData);
      setTotalUsers(totalCount);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to fetch users");
      setNewUsers([]);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on component mount and when page or search term changes
  useEffect(() => {
    if (userType === "super_admin" && token) {
      // Reset to first page when search term changes
      if (searchTerm) {
        setCurrentPage(1);
        fetchUserData(1, searchTerm);
      } else {
        fetchUserData(currentPage);
      }
    }
  }, [currentPage, userType, token, searchTerm]);

  // Fetch assigned roles
  useEffect(() => {
    const fetchAssignedRoles = async () => {
      try {
        const response = await axios.get(
          `/api/v1/assigned-tenant-user-screen`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const assignments = response.data.data.assigned_screen_to_tenant_user;
        setAssignedRoles(assignments || []);
      } catch (error) {
        console.error("Error fetching assigned roles:", error);
      }
    };

    if (token) {
      fetchAssignedRoles();
    }
  }, [token]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Fixed function to get assigned roles for a specific user
  const getUserAssignedRoles = (userTenantId: string) => {
    return assignedRoles.filter((role) => {
      const roleUserId = role.tenant_user_id;
      return roleUserId === userTenantId;
    });
  };

  // Enhanced toggle dropdown function with smart positioning
  // const toggleDropdown = useCallback((
  //   userId: string,
  //   type: "roles"
  // ) => {
  //   const isCurrentlyOpen = expandedDropdown?.id === userId && expandedDropdown?.type === type;
    
  //   if (isCurrentlyOpen) {
  //     setExpandedDropdown(null);
  //   } else {
  //     const buttonKey = `${userId}-${type}`;
  //     const buttonElement = dropdownRefs.current[buttonKey];
      
  //     if (buttonElement) {
  //       const position = calculateDropdownPosition(buttonElement);
  //       setDropdownPosition(position);
  //     }
      
  //     setExpandedDropdown({ id: userId, type });
  //   }
  // }, [expandedDropdown, calculateDropdownPosition]);

  // Enhanced function to format assigned data with dropdowns
  // const formatAssignedRolesDropdown = (userRoles: AssignedRole[], userId: string) => {
  //   if (userRoles.length === 0) {
  //     return (
  //       <button className="inline-flex justify-between items-center w-full min-w-[140px] px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg shadow-sm text-gray-500 cursor-default">
  //         <span className="text-sm">No roles assigned</span>
  //       </button>
  //     );
  //   }

  //   // Extract unique role names
  //   const uniqueRoles = [...new Set(
  //     userRoles.map((role) => role.screen_data?.role?.role_name || "N/A")
  //   )];

  //   const buttonKey = `${userId}-roles`;

  //   return (
  //     <div className="relative">
  //       <button
  //         ref={(el) => {
  //           if (el) dropdownRefs.current[buttonKey] = el;
  //         }}
  //         onClick={() => toggleDropdown(userId, "roles")}
  //         className="inline-flex justify-between items-center w-full min-w-[140px] px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150"
  //       >
  //         <span className="flex items-center">
  //           <span className="text-xs font-medium mr-2 px-2 py-1 rounded-full bg-blue-100 text-blue-800">
  //             {uniqueRoles.length}
  //           </span>
  //           <span className="text-sm">Roles</span>
  //         </span>
  //         <ChevronDown
  //           size={16}
  //           className={`ml-2 transition-transform duration-200 ${
  //             expandedDropdown?.id === userId && expandedDropdown?.type === "roles"
  //               ? "transform rotate-180"
  //               : ""
  //           }`}
  //         />
  //       </button>
  //     </div>
  //   );
  // };

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalUsers / itemsPerPage));
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      <div className="mx-auto space-y-4 sm:space-y-6">
        {/* Table Container */}
        <div 
          ref={tableContainerRef}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative"
        >
          <div className="overflow-x-auto">
            <div className="max-h-[70vh] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <TableHeader className="w-12 sm:w-16 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      #
                    </TableHeader>
                    <TableHeader className="min-w-[120px] sm:min-w-[140px] text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      User Name
                    </TableHeader>
                    <TableHeader className="min-w-[160px] sm:min-w-[200px] text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Email
                    </TableHeader>
                    {/* <TableHeader className="min-w-[140px] sm:min-w-[180px] text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Assigned Roles
                    </TableHeader> */}
                    <TableHeader className="w-24 sm:w-32 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Actions
                    </TableHeader>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {newUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 sm:px-6 py-8 sm:py-12 text-center">
                        <div className="text-gray-500">
                          {loading ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-gray-300 border-t-gray-600 mr-3"></div>
                              <span className="text-sm">Loading users...</span>
                            </div>
                          ) : error ? (
                            <span className="text-sm">No user found yet</span>
                          ) : (
                            <span className="text-sm">
                              {searchTerm
                                ? "No users found matching your search."
                                : "No users found."}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    newUsers.map((user1, index) => {
                      // const userRoles = getUserAssignedRoles(user1.tenant_user_id || "");
                      // const userId = user1.tenant_user_id || index.toString();

                      return (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                        >
                          <td className="px-3 sm:px-4 py-3 sm:py-4 text-center text-sm font-medium text-gray-900">
                            {indexOfFirstItem + index + 1}
                          </td>
                          <td 
                            className="px-3 sm:px-6 py-3 sm:py-4"   
                            onClick={() => {
                              if (onUserSelect && user1.tenant_user_id) {
                                onUserSelect(user1.tenant_user_id);
                              }
                            }}
                          >
                            <div className="text-sm font-semibold text-gray-900 truncate">
                              {user1.name}
                            </div>
                          </td>
                          <td 
                            className="px-3 sm:px-6 py-3 sm:py-4"   
                            onClick={() => {
                              if (onUserSelect && user1.tenant_user_id) {
                                onUserSelect(user1.tenant_user_id);
                              }
                            }}
                          >
                            <div className="text-sm text-gray-600 break-all max-w-[150px] sm:max-w-xs">
                              {user1.email}
                            </div>
                          </td>
                          {/* <td className="px-3 sm:px-6 py-3 sm:py-4">
                            {formatAssignedRolesDropdown(userRoles, userId)}
                          </td> */}
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                            <button
                              className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg bg-[#008F98] text-white hover:bg-[#007a82] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-150 shadow-sm"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click when button is clicked
                                setSelectedUser(user1);
                                setShowAssignmentForm(true);
                              }}
                            >
                              Assign
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Component */}
          {totalUsers > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalUsers}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          )}

          {/* Smart positioned dropdown */}
          {expandedDropdown && (
            <div 
              className="dropdown-content absolute z-50 w-72 sm:w-80 bg-white rounded-lg shadow-2xl border border-gray-200 animate-fadeIn"
              style={{
                top: dropdownPosition.openUpward ? 'auto' : dropdownPosition.top,
                bottom: dropdownPosition.openUpward ? dropdownPosition.bottom : 'auto',
                left: dropdownPosition.left,
                maxWidth: 'calc(100vw - 2rem)',
              }}
            >
              <div className="p-3 sm:p-4 border-b border-gray-100">
                <span className="text-sm font-semibold text-gray-900">
                  Assigned Roles ({(() => {
                    const userId = expandedDropdown.id;
                    const userRoles = getUserAssignedRoles(userId);
                    const uniqueRoles = [...new Set(
                      userRoles.map((role) => role.screen_data?.role?.role_name || "N/A")
                    )];
                    return uniqueRoles.length;
                  })()})
                </span>
              </div>
              <div className="p-2 max-h-48 sm:max-h-60 overflow-y-auto">
                {(() => {
                  const userId = expandedDropdown.id;
                  const userRoles = getUserAssignedRoles(userId);
                  const uniqueRoles = [...new Set(
                    userRoles.map((role) => role.screen_data?.role?.role_name || "N/A")
                  )];

                  return uniqueRoles.length > 0 ? (
                    uniqueRoles.map((roleName, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-2 sm:p-3 rounded-md hover:bg-gray-50"
                      >
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-gray-700">{roleName}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-sm text-gray-500 text-center">
                      No roles assigned
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>

      {showAssignmentForm && selectedUser && (
        <AssignUser1
          user={selectedUser}
          onClose={() => {
            setShowAssignmentForm(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

export default SuperUserManagement;