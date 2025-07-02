

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { PlusCircle, X, Edit2 } from "lucide-react";
import React from "react";
import { UseSuperAdminRoles } from "../../../hooks/useSuperAdminRoles";
import CreateRoleForm from "../../MasterAdmin/Roles/CreateRoleForm";
import Modal from "../../../component/common/ui/Modal";
import { Badge } from "../../../component/common/ui/Badge";
import ResponsiveDropdown from "../../../component/common/ui/ResponsiveDropdown";
import TableHeader from "../../../component/common/ui/Table/TableHeader";
import Pagination from "../../../component/common/ui/Table/Pagination";

const SuperRoleManagement: React.FC<{ isReadOnly: boolean }> = ({
  isReadOnly,
}) => {
  const {
    superAdminRoleMappings,
    message,
    setMessage,
    isCreatingRole,
    isLoading,
    MasterAdminRoleMappings,
    availableSuperAdminRoles,
    handleCreateRole,
    handleCreateSuperAdminRoleMapping,
    moduleOptions,
    getActionOptionsForModules,
    getSubActionOptionsForModulesAndActions,
    
    // Master Admin pagination
    masterAdminPaginationParams,
    masterAdminPaginationMeta,
    updateMasterAdminPaginationParams,
    
    // Super Admin pagination
    superAdminPaginationParams,
    superAdminPaginationMeta,
    updateSuperAdminPaginationParams,
  } = UseSuperAdminRoles();

  // Form state
  const [selectedSuperAdminRole, setSelectedSuperAdminRole] = useState("");
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [selectedActions, setSelectedActions] = useState("");
  const [selectedSubActions, setSelectedSubActions] = useState<string[]>([]);

  // Edit state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState<any>(null);
  const [editSelectedModules, setEditSelectedModules] = useState<string[]>([]);
  const [editSelectedActions, setEditSelectedActions] = useState("");
  const [editSelectedSubActions, setEditSelectedSubActions] = useState<string[]>([]);
  const [isEditInitialized, setIsEditInitialized] = useState(false);

  // UI state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [expandedDropdown, setExpandedDropdown] = useState<{
    id: string;
    type: string;
  } | null>(null);

  // Refs
  const masterTableContainerRef = useRef<HTMLDivElement>(null);
  const superTableContainerRef = useRef<HTMLDivElement>(null);

  // Memoized computed values with enhanced filtering
  const availableActions = useMemo(
    () => getActionOptionsForModules(selectedModules),
    [getActionOptionsForModules, selectedModules]
  );

  const availableSubActions = useMemo(() => {
    const currentRoleId = selectedSuperAdminRole ? parseInt(selectedSuperAdminRole) : undefined;
    return getSubActionOptionsForModulesAndActions(
      selectedModules, 
      selectedActions, 
      currentRoleId
    );
  }, [getSubActionOptionsForModulesAndActions, selectedModules, selectedActions, selectedSuperAdminRole]);

  // Edit form available options
  const editAvailableActions = useMemo(
    () => getActionOptionsForModules(editSelectedModules),
    [getActionOptionsForModules, editSelectedModules]
  );

  const editAvailableSubActions = useMemo(() => {
    const currentRoleId = editingMapping?.super_admin_role_id;
    return getSubActionOptionsForModulesAndActions(
      editSelectedModules, 
      editSelectedActions, 
      currentRoleId
    );
  }, [getSubActionOptionsForModulesAndActions, editSelectedModules, editSelectedActions, editingMapping]);

  // Enhanced data processing with better grouping
  const masterAdminFlattenedData = useMemo(() => {
    const grouped = new Map<string, any>();
    console.log("MasterAdminRoleMappings", MasterAdminRoleMappings);
    
    MasterAdminRoleMappings?.forEach((moduleMapping: any) => {
      const roleData = moduleMapping?.module_data;

      if (roleData && typeof roleData === 'object' && roleData.role_id) {
        const groupKey = `${roleData.role_id}-${moduleMapping.module_name}`;

        if (!grouped.has(groupKey)) {
          grouped.set(groupKey, {
            role_id: roleData.role_id,
            role_name: roleData.role_name,
            status: roleData.status,
            assignment_date: moduleMapping.assignment_date,
            module_name: moduleMapping.module_name,
            actions: [],
          });
        }

        const existingGroup = grouped.get(groupKey)!;
        
        if (roleData.actions && Array.isArray(roleData.actions)) {
          roleData.actions.forEach((action: any) => {
            existingGroup.actions.push({
              action_id: action.action_id,
              action_name: action.action_name,
              sub_actions: Array.isArray(action.all_sub_actions) ? action.all_sub_actions : [],
            });
          });
        }
      }
    });

    return Array.from(grouped.values());
  }, [MasterAdminRoleMappings]);

  const superAdminFlattenedData = useMemo(() => {
    const grouped = new Map<string, any>();

    superAdminRoleMappings?.forEach((mapping) => {
      const groupKey = `${mapping.super_admin_role_name}-${mapping.module_name}`;

      if (!grouped.has(groupKey)) {
        grouped.set(groupKey, {
          mapping_id: mapping.mapping_id,
          super_admin_role_name: mapping.super_admin_role_name,
          super_admin_role_id: mapping.super_admin_role_id,
          module_name: mapping.module_name,
          module_id: mapping.module_id,
          actions: [],
        });
      }

      const existingGroup = grouped.get(groupKey)!;

      let existingAction = existingGroup.actions.find(
        (action: any) => action.action_name === mapping.action_name
      );

      if (!existingAction) {
        existingAction = {
          action_id: mapping.action_id,
          action_name: mapping.action_name,
          sub_actions: [],
        };
        existingGroup.actions.push(existingAction);
      }

      mapping.sub_actions.forEach((subAction) => {
        if (
          !existingAction.sub_actions.find(
            (sa: any) => sa.sub_action_id === subAction.sub_action_id
          )
        ) {
          existingAction.sub_actions.push({
            ...subAction,
            parent_action: mapping.action_name,
          });
        }
      });
    });

    return Array.from(grouped.values());
  }, [superAdminRoleMappings]);

  const resetForm = useCallback(() => {
    setSelectedSuperAdminRole("");
    setSelectedModules([]);
    setSelectedActions("");
    setSelectedSubActions([]);
  }, []);

  const resetEditForm = useCallback(() => {
    setEditSelectedModules([]);
    setEditSelectedActions("");
    setEditSelectedSubActions([]);
    setEditingMapping(null);
    setIsEditInitialized(false);
  }, []);

  // Handle edit button click with proper initialization
  const handleEditClick = useCallback((rowData: any) => {
    setEditingMapping(rowData);
    setEditModalOpen(true);
    
    // Initialize edit form data after a brief delay to ensure modal is open
    setTimeout(() => {
      setEditSelectedModules([rowData.module_name]);
      setIsEditInitialized(true);
      
      // Set actions and sub-actions after modules are set
      setTimeout(() => {
        if (rowData.actions.length > 0) {
          setEditSelectedActions(rowData.actions[0].action_name);
          
          // Set sub-actions after actions are set
          setTimeout(() => {
            setEditSelectedSubActions(
              rowData.actions[0].sub_actions.map((sa: any) => sa.sub_action_name)
            );
          }, 100);
        }
      }, 100);
    }, 50);
  }, []);

  const submitPermission = useCallback(async () => {
    if (
      !selectedSuperAdminRole ||
      selectedModules.length === 0 ||
      !selectedActions
    ) {
      setMessage("Please select super admin role, modules, and actions");
      return;
    }

    const superAdminRoleId = parseInt(selectedSuperAdminRole);

    const success = await handleCreateSuperAdminRoleMapping(
      superAdminRoleId,
      selectedModules,
      selectedActions,
      selectedSubActions
    );

    if (success) {
      resetForm();
    }
  }, [
    selectedSuperAdminRole,
    selectedModules,
    selectedActions,
    selectedSubActions,
    handleCreateSuperAdminRoleMapping,
    resetForm,
    setMessage,
  ]);

  // Submit edit form - using same POST endpoint as creation
  const submitEditPermission = useCallback(async () => {
    if (
      !editingMapping ||
      editSelectedModules.length === 0 ||
      !editSelectedActions
    ) {
      setMessage("Please select modules and actions");
      return;
    }

    // Use the same POST endpoint for updates
    const success = await handleCreateSuperAdminRoleMapping(
      editingMapping.super_admin_role_id,
      editSelectedModules,
      editSelectedActions,
      editSelectedSubActions
    );

    if (success) {
      setEditModalOpen(false);
      resetEditForm();
    }
  }, [
    editingMapping,
    editSelectedModules,
    editSelectedActions,
    editSelectedSubActions,
    handleCreateSuperAdminRoleMapping,
    resetEditForm,
    setMessage,
  ]);

  // Enhanced dropdown toggle with proper attachment
  // const toggleDropdown = useCallback(
  //   (id: number | string, type: "actions" | "subactions") => {
  //     const dropdownId = `${id}`;
  //     const newExpandedDropdown = expandedDropdown?.id === dropdownId && expandedDropdown?.type === type
  //       ? null
  //       : { id: dropdownId, type };
      
  //     setExpandedDropdown(newExpandedDropdown);
  //   },
  //   [expandedDropdown]
  // );

  // Pagination handlers
  const handleMasterAdminPageChange = useCallback((page: number) => {
    updateMasterAdminPaginationParams({ page });
  }, [updateMasterAdminPaginationParams]);

  const handleSuperAdminPageChange = useCallback((page: number) => {
    updateSuperAdminPaginationParams({ page });
  }, [updateSuperAdminPaginationParams]);

  // Enhanced effects with better cleanup - ONLY for main form, not edit form
  useEffect(() => {
    setSelectedActions("");
    setSelectedSubActions([]);
  }, [selectedModules]);

  useEffect(() => {
    setSelectedSubActions([]);
  }, [selectedActions]);

  // Separate effects for edit form with initialization check
  useEffect(() => {
    if (isEditInitialized && editModalOpen) {
      // Only clear if this is a user-initiated change, not initialization
      const timer = setTimeout(() => {
        setEditSelectedActions("");
        setEditSelectedSubActions([]);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [editSelectedModules, isEditInitialized, editModalOpen]);

  useEffect(() => {
    if (isEditInitialized && editModalOpen && editSelectedActions) {
      // Only clear if this is a user-initiated change, not initialization
      const timer = setTimeout(() => {
        setEditSelectedSubActions([]);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [editSelectedActions, isEditInitialized, editModalOpen]);

  // Message auto-clear
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message, setMessage]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      if (expandedDropdown) {
        setExpandedDropdown(null);
      }
    };

    const handleScroll = () => {
      if (expandedDropdown) {
        setExpandedDropdown(null);
      }
    };

    if (expandedDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [expandedDropdown]);

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      <div className="mx-auto space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1"></div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none font-medium"
                disabled={isReadOnly}
              >
                <PlusCircle size={18} className="mr-2 flex-shrink-0" />
                <span className="whitespace-nowrap">Create Role</span>
              </button>
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`mt-4 p-4 rounded-lg border-l-4 ${
                message.includes("Failed") || message.includes("failed")
                  ? "bg-red-50 text-red-700 border-red-400"
                  : "bg-green-50 text-green-700 border-green-400"
              }`}
            >
              <div className="flex items-start">
                <div className="flex-1 text-sm font-medium">{message}</div>
                <button
                  onClick={() => setMessage("")}
                  className="ml-2 text-current opacity-70 hover:opacity-100"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Enhanced Form Section with Responsive Dropdowns */}
          <div className="mt-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
              {/* Super Admin Role Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Super Admin Role
                  <span className="text-xs text-gray-500 font-normal ml-2">
                    ({availableSuperAdminRoles.length} available)
                  </span>
                </label>
                <ResponsiveDropdown
                  options={availableSuperAdminRoles.map(role => ({
                    id: role.role_id.toString(),
                    label: role.role_name,
                    value: role.role_id
                  }))}
                  selectedValue={selectedSuperAdminRole}
                  onSelect={(value) => setSelectedSuperAdminRole(Array.isArray(value) ? value[0] : value)}
                  placeholder="Choose Super Admin Role..."
                  disabled={isReadOnly || isLoading}
                  className="w-full"
                />
                {selectedSuperAdminRole && (
                  <div className="mt-2">
                    <Badge variant="blue" size="sm">
                      ✓{" "}
                      {
                        availableSuperAdminRoles.find(
                          (r) => r.role_id.toString() === selectedSuperAdminRole
                        )?.role_name
                      }
                    </Badge>
                  </div>
                )}
              </div>

              {/* Module Multi-Select Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select Modules
                  <span className="text-xs text-gray-500 font-normal ml-2">
                    ({moduleOptions.length} available)
                  </span>
                </label>
                <ResponsiveDropdown
                  options={moduleOptions.map(module => ({
                    id: module.id,
                    label: module.label,
                    value: module.module_id
                  }))}
                  selectedValue={selectedModules}
                  onSelect={(value) => setSelectedModules(Array.isArray(value) ? value : [value])}
                  placeholder="Choose Modules..."
                  multiple={true}
                  disabled={!selectedSuperAdminRole || isReadOnly || isLoading}
                  className="w-full"
                  searchable={true}
                  renderSelected={(count, options) => 
                    count === 0 ? "Choose Modules..." :
                    count === 1 ? options[0].label : 
                    `${count} modules selected`
                  }
                />
                {selectedModules.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedModules.slice(0, 3).map((moduleName, index) => (
                      <Badge key={index} variant="blue" size="sm">
                        {moduleName}
                      </Badge>
                    ))}
                    {selectedModules.length > 3 && (
                      <Badge variant="blue" size="sm">
                        +{selectedModules.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Action Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select Action
                  <span className="text-xs text-gray-500 font-normal ml-2">
                    ({availableActions.length} available)
                  </span>
                </label>
                <ResponsiveDropdown
                  options={availableActions.map(action => ({
                    id: action.id,
                    label: action.label,
                    value: action.action_id
                  }))}
                  selectedValue={selectedActions}
                  onSelect={(value) => setSelectedActions(Array.isArray(value) ? value[0] : value)}
                  placeholder="Choose Action..."
                  disabled={selectedModules.length === 0 || isReadOnly || isLoading}
                  className="w-full"
                />
                {selectedActions && (
                  <div className="mt-2">
                    <Badge variant="green" size="sm">
                      {selectedActions}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Sub-Action Multi-Select Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select Sub Actions
                  <span className="text-xs text-gray-500 font-normal ml-2">
                    ({availableSubActions.length} unassigned)
                  </span>
                </label>
                <ResponsiveDropdown
                  options={availableSubActions.map(subAction => ({
                    id: subAction.id,
                    label: subAction.label,
                    value: subAction.sub_action_id
                  }))}
                  selectedValue={selectedSubActions}
                  onSelect={(value) => setSelectedSubActions(Array.isArray(value) ? value : [value])}
                  placeholder="Choose Sub Actions..."
                  multiple={true}
                  disabled={!selectedActions || isReadOnly || isLoading}
                  className="w-full"
                  searchable={true}
                  renderSelected={(count, options) => 
                    count === 0 ? "Choose Sub Actions..." :
                    count === 1 ? options[0].label.split(' (')[0] : 
                    `${count} sub actions selected`
                  }
                />
                {selectedSubActions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedSubActions
                      .slice(0, 2)
                      .map((subActionName, index) => (
                        <Badge key={index} variant="orange" size="sm">
                          {subActionName}
                        </Badge>
                      ))}
                    {selectedSubActions.length > 2 && (
                      <Badge variant="orange" size="sm">
                        +{selectedSubActions.length - 2} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Section */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1" />
              <button
                onClick={resetForm}
                className="px-5 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Reset Form
              </button>
              <button
                onClick={submitPermission}
                disabled={
                  !selectedSuperAdminRole ||
                  selectedModules.length === 0 ||
                  !selectedActions ||
                  isReadOnly ||
                  isLoading
                }
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg font-medium"
              >
                {isLoading ? "Creating Mapping..." : "Create Role Mapping"}
              </button>
            </div>
          </div>
        </div>

        {/* Master Admin Role Permissions Table */}
        <div 
          ref={masterTableContainerRef}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="px-4 lg:px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-900">
              Default Master roles available for assignment
            </h3>
          </div>

          <div className="overflow-x-auto">
            <div className="max-h-[70vh] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <TableHeader className="w-12 sm:w-16 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      #
                    </TableHeader>
                    <TableHeader className="min-w-[120px] sm:min-w-[140px] text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Role
                    </TableHeader>
                    <TableHeader className="min-w-[120px] sm:min-w-[140px] text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Module
                    </TableHeader>
                    <TableHeader className="min-w-[140px] sm:min-w-[180px] text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Actions
                    </TableHeader>
                    <TableHeader className="min-w-[140px] sm:min-w-[180px] text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Sub Actions
                    </TableHeader>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {masterAdminFlattenedData.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 sm:px-6 py-8 sm:py-12 text-center">
                        <div className="text-gray-500">
                          <span className="text-sm">
                            No modules have been assigned to your Account. Please contact the Master User for access.
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    masterAdminFlattenedData.map((roleData: any, index) => (
                      <tr
                        key={`master-${roleData.role_id}-${roleData.module_name}-${index}`}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-center text-sm font-medium text-gray-900">
                          {(masterAdminPaginationParams.page - 1) * masterAdminPaginationParams.limit + index + 1}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div className="text-sm font-semibold text-gray-900 truncate">
                            {roleData.role_name}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div className="text-sm font-semibold text-gray-900 truncate">
                            {roleData.module_name}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div className="relative">
                            <select className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                              <option value="">Actions ({roleData.actions.length})</option>
                              {roleData.actions.map((action: any, actionIdx: number) => (
                                <option key={actionIdx} value={action.action_name}>
                                  {action.action_name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div className="relative">
                            <select className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                              <option value="">Sub Actions ({roleData.actions.reduce((total: number, action: any) => total + action.sub_actions.length, 0)})</option>
                              {roleData.actions.map((action: any, actionIdx: number) => 
                                action.sub_actions.map((subAction: any, subIdx: number) => (
                                  <option key={`${actionIdx}-${subIdx}`} value={subAction.sub_action_name}>
                                    {action.action_name} → {subAction.sub_action_name}
                                  </option>
                                ))
                              )}
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Master Admin Pagination */}
          <Pagination
            currentPage={masterAdminPaginationMeta.page}
            totalPages={masterAdminPaginationMeta.total_pages}
            totalItems={masterAdminPaginationMeta.total_items}
            itemsPerPage={masterAdminPaginationMeta.limit}
            onPageChange={handleMasterAdminPageChange}
          />
        </div>

        {/* Super Admin Role Permissions Table */}
        <div 
          ref={superTableContainerRef}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="px-4 lg:px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-900">
              Custom role mappings
            </h3>
          </div>

          <div className="overflow-x-auto">
            <div className="max-h-[70vh] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <TableHeader className="w-12 sm:w-16 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      #
                    </TableHeader>
                    <TableHeader className="min-w-[120px] sm:min-w-[140px] text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Super Admin Role
                    </TableHeader>
                    <TableHeader className="min-w-[120px] sm:min-w-[140px] text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Module
                    </TableHeader>
                    <TableHeader className="min-w-[140px] sm:min-w-[180px] text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Actions
                    </TableHeader>
                    <TableHeader className="min-w-[140px] sm:min-w-[180px] text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Sub Actions
                    </TableHeader>
                    <TableHeader className="w-24 sm:w-32 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Actions
                    </TableHeader>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {superAdminFlattenedData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 sm:px-6 py-8 sm:py-12 text-center">
                        <div className="text-gray-500">
                          <span className="text-sm">
                            No role permissions assigned yet. Use the form above to assign permissions to roles.
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    superAdminFlattenedData.map((roleData: any, index) => (
                      <tr
                        key={`super-${roleData.super_admin_role_name}-${roleData.module_name}-${index}`}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-center text-sm font-medium text-gray-900">
                          {(superAdminPaginationParams.page - 1) * superAdminPaginationParams.limit + index + 1}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div className="text-sm font-semibold text-gray-900 truncate">
                            {roleData.super_admin_role_name}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div className="text-sm font-semibold text-gray-900 truncate">
                            {roleData.module_name}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div className="relative">
                            <select className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                              <option value="">Actions ({roleData.actions.length})</option>
                              {roleData.actions.map((action: any, actionIdx: number) => (
                                <option key={actionIdx} value={action.action_name}>
                                  {action.action_name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div className="relative">
                            <select className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                              <option value="">Sub Actions ({roleData.actions.reduce((total: number, action: any) => total + action.sub_actions.length, 0)})</option>
                              {roleData.actions.map((action: any, actionIdx: number) => 
                                action.sub_actions.map((subAction: any, subIdx: number) => (
                                  <option key={`${actionIdx}-${subIdx}`} value={subAction.sub_action_name}>
                                    {action.action_name} → {subAction.sub_action_name}
                                  </option>
                                ))
                              )}
                            </select>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                          <button
                            onClick={() => handleEditClick(roleData)}
                            disabled={isReadOnly}
                            className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg bg-[#008F98] text-white hover:bg-[#007a82] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-150 shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                            title="Edit mapping"
                          >
                            <Edit2 size={16} className="mr-1" />
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Super Admin Pagination */}
          <Pagination
            currentPage={superAdminPaginationMeta.page}
            totalPages={superAdminPaginationMeta.total_pages}
            totalItems={superAdminPaginationMeta.total_items}
            itemsPerPage={superAdminPaginationMeta.limit}
            onPageChange={handleSuperAdminPageChange}
          />
        </div>

        {/* Create Role Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Role"
          size="md"
        >
          <CreateRoleForm
            onSubmit={handleCreateRole}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={isCreatingRole}
            title="Create New Role"
            submitButtonText="Create Role"
          />
        </Modal>

        {/* Edit Role Mapping Modal */}
        <Modal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            resetEditForm();
          }}
          title="Edit Role Mapping"
          size="lg"
        >
          <div className="space-y-6">
            {editingMapping && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Editing mapping for:
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="blue" size="sm">
                    {editingMapping.super_admin_role_name}
                  </Badge>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Edit Module Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select Module
                </label>
                <ResponsiveDropdown
                  key={`edit-modules-${editModalOpen}-${isEditInitialized}`}
                  options={moduleOptions.map(module => ({
                    id: module.id,
                    label: module.label,
                    value: module.module_id
                  }))}
                  selectedValue={editSelectedModules}
                  onSelect={(value) => {
                    setEditSelectedModules(Array.isArray(value) ? value : [value]);
                    // Clear actions and sub-actions when modules change
                    setEditSelectedActions("");
                    setEditSelectedSubActions([]);
                  }}
                  placeholder="Choose Module..."
                  multiple={true}
                  disabled={isLoading}
                  className="w-full"
                  searchable={true}
                />
                {editSelectedModules.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {editSelectedModules.map((moduleName, index) => (
                      <Badge key={index} variant="blue" size="sm">
                        {moduleName}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Edit Action Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select Action
                </label>
                <ResponsiveDropdown
                  key={`edit-actions-${editSelectedModules.join(',')}-${isEditInitialized}`}
                  options={editAvailableActions.map(action => ({
                    id: action.id,
                    label: action.label,
                    value: action.action_id
                  }))}
                  selectedValue={editSelectedActions}
                  onSelect={(value) => {
                    setEditSelectedActions(Array.isArray(value) ? value[0] : value);
                    // Clear sub-actions when action changes
                    setEditSelectedSubActions([]);
                  }}
                  placeholder="Choose Action..."
                  disabled={editSelectedModules.length === 0 || isLoading}
                  className="w-full"
                />
                {editSelectedActions && (
                  <div className="mt-2">
                    <Badge variant="green" size="sm">
                      {editSelectedActions}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Edit Sub-Action Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select Sub Actions
                </label>
                <ResponsiveDropdown
                  key={`edit-subactions-${editSelectedActions}-${isEditInitialized}`}
                  options={editAvailableSubActions.map(subAction => ({
                    id: subAction.id,
                    label: subAction.label,
                    value: subAction.sub_action_id
                  }))}
                  selectedValue={editSelectedSubActions}
                  onSelect={(value) => setEditSelectedSubActions(Array.isArray(value) ? value : [value])}
                  placeholder="Choose Sub Actions..."
                  multiple={true}
                  disabled={!editSelectedActions || isLoading}
                  className="w-full"
                  searchable={true}
                />
                {editSelectedSubActions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {editSelectedSubActions
                      .slice(0, 2)
                      .map((subActionName, index) => (
                        <Badge key={index} variant="orange" size="sm">
                          {subActionName}
                        </Badge>
                      ))}
                    {editSelectedSubActions.length > 2 && (
                      <Badge variant="orange" size="sm">
                        +{editSelectedSubActions.length - 2} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Edit Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  resetEditForm();
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={submitEditPermission}
                disabled={
                  !editingMapping ||
                  editSelectedModules.length === 0 ||
                  !editSelectedActions ||
                  isLoading
                }
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg font-medium"
              >
                {isLoading ? "Updating..." : "Update Mapping"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default SuperRoleManagement;








