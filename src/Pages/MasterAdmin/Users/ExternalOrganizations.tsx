
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserData } from "../../../types";
import { useAuth } from "../../../context/AuthContext";
import TableHeader from "../../../component/common/ui/Table/TableHeader";
import MultiSelectDropdown from "../../../component/common/ui/MultiSelectDropdown";
import Toggle from "../../../component/common/ui/Toggle";
import Pagination from "../../../component/common/ui/Table/Pagination";
import axios from "../../../helper/axios";
import { roleOptions } from "../../../data/mockData";

interface ExternalOrganizationUserProps {
  isReadOnly: boolean;
  searchTerm?: string;
}

const ExternalOrganizations: React.FC<ExternalOrganizationUserProps> = ({
  isReadOnly,
  searchTerm = "",
}) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading] = useState(false);
  // const [userModuleStatus, setUserModuleStatus] = useState<
  //   Record<number, boolean>
  // >({});
  const [moduleDropdownOptions, setModuleDropdownOptions] = useState<
    { id: string; label: string }[]
  >([]);
  const [, setError] = useState<string | null>(null);
  const [itemsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<{
    id: number;
    type: "role" | "module";
  } | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
    width: number;
    maxHeight: number;
    openUpward: boolean;
  }>({ top: 0, left: 0, width: 400, maxHeight: 500, openUpward: false });
  const { authState } = useAuth();
  const [userSelectedRoles] = useState<Record<number, string[]>>({});
  const [userSelectedModules, setUserSelectedModules] = useState<
    Record<number, string[]>
  >({});
  const [originalUserModules, setOriginalUserModules] = useState<
    Record<number, string[]>
  >({});
  const [isDataLoading, setIsDataLoading] = useState(true);
  const navigate = useNavigate();
  const token = authState.token;
  const dropdownRefs = useRef<Record<number, HTMLButtonElement>>({});
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [lastClickTime, setLastClickTime] = useState<number>(0);

  // SIMPLE POSITIONING - ATTACHED TO BUTTON
  const calculateDropdownPosition = useCallback(
    (buttonElement: HTMLButtonElement) => {
      const buttonRect = buttonElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Simple responsive width
      let dropdownWidth = 280; // Fixed compact width
      if (viewportWidth < 480) {
        dropdownWidth = Math.min(260, viewportWidth - 40);
      }

      // Calculate space
      const spaceBelow = viewportHeight - buttonRect.bottom - 20;
      const spaceAbove = buttonRect.top - 20;

      // Simple height calculation
      let maxHeight = 300; // Compact height
      let openUpward = false;

      if (spaceBelow < 200 && spaceAbove > spaceBelow) {
        openUpward = true;
        maxHeight = Math.min(300, spaceAbove);
      } else {
        maxHeight = Math.min(300, spaceBelow);
      }

      // Position calculation
      let top = openUpward
        ? buttonRect.top - maxHeight - 4
        : buttonRect.bottom + 4;
      let left = buttonRect.left;

      // Keep within viewport
      if (left + dropdownWidth > viewportWidth - 20) {
        left = buttonRect.right - dropdownWidth;
      }
      if (left < 20) {
        left = 20;
      }

      return {
        top: Math.max(20, top),
        left: Math.max(20, left),
        width: dropdownWidth,
        maxHeight,
        openUpward,
      };
    },
    []
  );

  // Close dropdown on any scroll or resize
  useEffect(() => {
    const handleScrollOrResize = () => {
      if (selectedUser) {
        setSelectedUser(null);
      }
    };

    // Listen to scroll events on window and table container
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    const tableContainer = tableContainerRef.current;
    if (tableContainer) {
      tableContainer.addEventListener("scroll", handleScrollOrResize);
    }

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
      if (tableContainer) {
        tableContainer.removeEventListener("scroll", handleScrollOrResize);
      }
    };
  }, [selectedUser]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedUser) {
        const target = event.target as Node;

        // Check if click is on a dropdown button
        const isClickOnDropdownButton = Object.values(
          dropdownRefs.current
        ).some((button) => button && button.contains(target));

        // Check if click is inside the dropdown content
        const dropdownElement = document.querySelector(".dropdown-portal");
        const isClickInsideDropdown =
          dropdownElement && dropdownElement.contains(target);

        // Close dropdown if click is outside button and dropdown content
        if (!isClickOnDropdownButton && !isClickInsideDropdown) {
          setSelectedUser(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedUser]);

  // Fetch all data before rendering UI
  useEffect(() => {
    const fetchAllData = async () => {
      setIsDataLoading(true);
      try {
        // Fetch users, modules, and assignments in parallel
        const [usersResponse, modulesResponse, assignmentsResponse] =
          await Promise.all([
            axios.get("api/users/v1/all-users", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`api/v1/modules`, {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            }),
            axios.get("api/v1/user-role-assignments", {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            }),
          ]);

        // Process users
        const transformedUsers = usersResponse.data
          .filter((user: any) => user.user_type !== "master_admin")
          .map((user: any, index: number) => ({
            id: index + 1,
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            phone_number: user.phone_number,
            user_type: user.user_type,
            is_verified: user.is_verified,
            organization_name: user.organization_name || "--",
            status: user.status,
            created_at: user.created_at,
            enabled: user.status === "active",
          }));

        // Process modules
        const modules = modulesResponse.data.data.modules || [];
        const formattedModules = modules.map((module: any) => ({
          id: String(module.module_id),
          label: module.module_name,
        }));

        // Process assignments
        const assignments = assignmentsResponse.data.data.assignments;
        const userModulesMap: Record<number, string[]> = {};

        transformedUsers.forEach((user: UserData) => {
          const userAssignments = assignments.filter(
            (a: any) => a.user_id === user.user_id
          );
          const moduleIds = userAssignments.map((a: any) =>
            String(a.module_id)
          );
          userModulesMap[user.id] = moduleIds;
        });

        // Set all data at once
        setUsers(transformedUsers);
        setModuleDropdownOptions(formattedModules);
        setUserSelectedModules(userModulesMap);
        setOriginalUserModules(userModulesMap);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data");
      } finally {
        setIsDataLoading(false);
      }
    };

    if (token) {
      fetchAllData();
    }
  }, [token, currentPage, itemsPerPage]);

  // API 4: Assign modules to user
  const handleApplyModules = async (
    userId: number,
    selectedModules: string[]
  ) => {
    if (isReadOnly) return;

    try {
      const originalModules = originalUserModules[userId] || [];
      const newModules = selectedModules.filter(
        (moduleId) => !originalModules.includes(moduleId)
      );

      if (newModules.length > 0) {
        await axios.post(
          "api/v1/assign-user-role-module-actions",
          {
            user_id: users.find((u) => u.id === userId)?.user_id,
            module_ids: newModules.map((id) => Number(id)),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      toast.success("Modules updated successfully!", {
        position: "top-right",
        duration: 2000,
      });

      setUserSelectedModules((prev) => ({
        ...prev,
        [userId]: selectedModules,
      }));

      setOriginalUserModules((prev) => ({
        ...prev,
        [userId]: selectedModules,
      }));

      setSelectedUser(null);
    } catch (error) {
      const errorMessage =
        (error as any)?.response?.data?.detail ||
        "An unexpected error occurred.";
      toast.error(errorMessage, {
        position: "top-right",
        duration: 2000,
      });
    }
  };

  // ADD this new function after handleApplyModules:
  // const handleToggleModuleStatus = async (userId: string, moduleId: string) => {
  //   if (isReadOnly) return;

  //   try {
  //     await axios.patch(
  //       `api/v1/user-role-assignment-toggle?user_id=${userId}&module_id=${moduleId}`,
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           Accept: "application/json",
  //         },
  //       }
  //     );

  //     const key = `${userId}_${moduleId}`;
  //     const currentStatus = userModuleStatus[key];
  //     const newStatus = currentStatus === "active" ? "inactive" : "active";

  //     setUserModuleStatus((prev) => ({
  //       ...prev,
  //       [key]: newStatus,
  //     }));

  //     toast.success("Module status updated successfully!", {
  //       position: "top-right",
  //       duration: 2000,
  //     });
  //   } catch (error) {
  //     const errorMessage =
  //       (error as any)?.response?.data?.detail ||
  //       "Failed to update module status";
  //     toast.error(errorMessage, {
  //       position: "top-right",
  //       duration: 2000,
  //     });
  //   }
  // };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

 
  const handleToggleChange = async (user: UserData) => {
    if (isReadOnly) return;
    try {
      const newStatus = user.status === "active" ? "inactive" : "active";

      await axios.patch(
        `api/v1/user-status?user_id=${user.user_id}`,
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        }
      );

      setUsers(
        users.map((u) =>
          u.user_id === user.user_id ? { ...u, status: newStatus } : u
        )
      );

      toast.success(`User status updated to ${newStatus}`, {
        position: "top-right",
        duration: 2000,
      });
    }  catch (error) {
  const err = error as any; // or as AxiosError if you're confident
  const errorMessage = err.response?.data?.detail || "Failed to update user status";

  toast.error(errorMessage, {
    position: "top-right",
    duration: 2000,
  });
}
  };
  const handleResetModules = (userId: number) => {
    if (isReadOnly) return;
    setUserSelectedModules({
      ...userSelectedModules,
      [userId]: [...(originalUserModules[userId] || [])],
    });
  };

  const handleToNavigate = (user: UserData) => {
    navigate(`userDetails/${user.user_id}`, {
      state: {
        user,
        roles: userSelectedRoles[user.id] || [],
        modules: userSelectedModules[user.id] || [],
      },
    });
  };

  // Enhanced toggle dropdown with double-click detection
  const toggleDropdown = (userId: number, type: "role" | "module") => {
    if (isReadOnly) return;

    const currentTime = Date.now();
    const timeDiff = currentTime - lastClickTime;

    // Double-click detection (within 300ms)
    if (
      timeDiff < 300 &&
      selectedUser?.id === userId &&
      selectedUser?.type === type
    ) {
      setSelectedUser(null);
      setLastClickTime(0);
      return;
    }

    setLastClickTime(currentTime);

    const isCurrentlyOpen =
      selectedUser?.id === userId && selectedUser?.type === type;

    if (isCurrentlyOpen) {
      setSelectedUser(null);
    } else {
      const buttonElement = dropdownRefs.current[userId];
      if (buttonElement) {
        const position = calculateDropdownPosition(buttonElement);
        setDropdownPosition(position);
      }
      setSelectedUser({ id: userId, type });
    }
  };

  const getSelectedText = (userId: number, type: "role" | "module") => {
    const items =
      type === "role" ? userSelectedRoles[userId] : userSelectedModules[userId];
    if (!items?.length)
      return type === "role" ? "Select Roles" : "Select Modules";

    const options = type === "role" ? roleOptions : moduleDropdownOptions;
    const selectedLabels = items
      .map((id) => options.find((opt: { id: string }) => opt.id === id)?.label)
      .filter(Boolean);

    return (
      <span className="flex items-center">
        <span className="inline-flex items-center justify-center min-w-[20px] h-5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-full px-1.5 mr-2 shadow-sm">
          {selectedLabels.length}
        </span>
        <span className="text-gray-700">
          {type === "role" ? "Roles" : "Modules"}
        </span>
      </span>
    );
  };

  // Show loading state until all data is loaded
  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
        <div className="mx-auto space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-12 text-center">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mr-3"></div>
                <span className="text-sm text-gray-600">Loading data...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-50 p-4 lg:p-6">
      <div className="mx-auto space-y-6">
        {/* Table Container with improved scrolling */}
        <div
          ref={tableContainerRef}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Horizontal scroll wrapper */}
          <div className="overflow-x-auto">
            {/* Vertical scroll wrapper */}
            <div className=" overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <TableHeader className=" text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      #
                    </TableHeader>
                    <TableHeader className=" text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Organization
                    </TableHeader>
                    <TableHeader className=" text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      User
                    </TableHeader>
                    <TableHeader className=" text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Email
                    </TableHeader>
                    <TableHeader className=" text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Phone
                    </TableHeader>
                    <TableHeader className=" text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Modules
                    </TableHeader>
                    <TableHeader className=" text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Created
                    </TableHeader>
                    <TableHeader className=" text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Status
                    </TableHeader>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((user, index) => (
                    <tr
                      key={user.user_id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td
                        className="px-4 py-4 text-center text-sm font-medium text-gray-900 cursor-pointer"
                        onClick={() => handleToNavigate(user)}
                      >
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td
                        className="px-6 py-4 cursor-pointer"
                        onClick={() => handleToNavigate(user)}
                      >
                        <div className="text-sm text-gray-700 truncate">
                          {user.organization_name}
                        </div>
                      </td>
                      <td
                        className="px-6 py-4 cursor-pointer"
                        onClick={() => handleToNavigate(user)}
                      >
                        <div className="text-sm text-gray-700 truncate">
                          {user.username}
                        </div>
                      </td>
                      <td
                        className="px-6 py-4 cursor-pointer"
                        onClick={() => handleToNavigate(user)}
                      >
                        <div className="text-sm text-gray-700 truncate">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">
                          {user.phone_number}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <button
                            ref={(el) => {
                              if (el) dropdownRefs.current[user.id] = el;
                            }}
                            onClick={() => toggleDropdown(user.id, "module")}
                            className={`inline-flex justify-between items-center w-full min-w-[160px] px-3 py-2.5 text-sm font-medium bg-white border border-gray-300 rounded-lg shadow-sm transition-all duration-200 ${
                              isReadOnly
                                ? "opacity-70 cursor-not-allowed text-gray-500 bg-gray-50"
                                : "text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 active:bg-gray-100"
                            } ${
                              selectedUser?.id === user.id &&
                              selectedUser?.type === "module"
                                ? "ring-2 ring-blue-500 border-blue-500 bg-blue-50"
                                : ""
                            }`}
                            disabled={isReadOnly}
                          >
                            {userSelectedModules[user.id]?.length > 0 ? (
                              getSelectedText(user.id, "module")
                            ) : (
                              <span className="text-sm text-gray-500">
                                Select Modules
                              </span>
                            )}
                            <ChevronDown
                              size={16}
                              className={`ml-2 transition-transform duration-200 ${
                                selectedUser?.id === user.id &&
                                selectedUser?.type === "module"
                                  ? "transform rotate-180 text-blue-600"
                                  : "text-gray-400"
                              }`}
                            />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-sm text-gray-600">
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="relative inline-block">
                          <Toggle
                            enabled={user.status === "active"}
                            onChange={() => handleToggleChange(user)}
                            className={
                              isReadOnly ? "opacity-50 cursor-not-allowed" : ""
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ))}

                  {currentItems.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          {loading ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600 mr-3"></div>
                              <span className="text-sm">Loading users...</span>
                            </div>
                          ) : (
                            <span className="text-sm">No users found</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* SIMPLE COMPACT DROPDOWN - LIKE YOUR USERDETAIL PAGE */}
      {!isReadOnly && selectedUser && selectedUser.type === "module" && (
        <div
          className="dropdown-portal fixed z-[9999] bg-white rounded-lg shadow-xl border border-gray-300"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            maxHeight: `${dropdownPosition.maxHeight}px`,
          }}
        >
          <MultiSelectDropdown
            title="Select Modules"
            options={moduleDropdownOptions}
            selectedOptions={userSelectedModules[selectedUser.id] || []}
            preSelectedOptions={originalUserModules[selectedUser.id] || []}
            onApply={(selected: string[]) =>
              handleApplyModules(selectedUser.id, selected)
            }
            onReset={() => handleResetModules(selectedUser.id)}
            onClose={() => setSelectedUser(null)}
            maxHeight={dropdownPosition.maxHeight}
          />
        </div>
      )}
    </div>
  );
};

export default ExternalOrganizations;
