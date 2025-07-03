

import { useEffect, useMemo, useState, useCallback } from "react";
import axios from "../helper/axios";
import { useAuth } from "./useAuth";

interface Role {
  role_id: number;
  role_name: string;
  description?: string;
  status?: string;
  enabled: boolean;
  source?: "superadmin" | "assigned";
}

interface SubAction {
  sub_action_id: number;
  sub_action_name: string;
}

interface Action {
  action_id: number;
  action_name: string;
  sub_actions: SubAction[];
}

interface ModuleWithActions {
  module_id: number;
  module_name: string;
  actions: Action[];
  roles: Role[];
}

interface SuperAdminRoleMapping {
  mapping_id: number;
  super_admin_role_id: number;
  super_admin_role_name: string;
  role_id: number;
  role_name: string;
  module_id: number;
  module_name: string;
  action_id: number;
  action_name: string;
  sub_actions: SubAction[];
  created_at: string;
}

interface MasterAdminRoleMapping {
  module_data: any;
  assignment_date: any;
  status: any;
  mapping_id: number;
  role_id: number;
  role_name: string;
  module_id: number;
  module_name: string;
  action_id: number;
  action_name: string;
  sub_actions: SubAction[];
  created_at: string;
}

interface SuperAdminRoleMappingsResponse {
  success: boolean;
  data: SuperAdminRoleMapping[];
  total: number;
  meta?: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
}

interface AssignedSubAction {
  sub_action_id: number;
  sub_action_name: string;
}

interface AssignedAction {
  screen_id: number;
  action_id: number;
  action_name: string;
  all_sub_actions: AssignedSubAction[];
}

interface AssignedModuleRole {
  role_id: number;
  role_name: string;
  status: string;
  actions: AssignedAction[];
}

interface AssignedModule {
  user_id: string;
  tenant_id: string | null;
  tenant_name: string | null;
  module_id: number;
  module_name: string;
  assigned_by: number;
  assignment_date: string;
  total_screen: number;
  module_data: AssignedModuleRole[];
}

interface AssignedUserRoleModuleActionsResponse {
  success: boolean;
  data: {
    assignments: AssignedModule[];
  };
  meta: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
}

interface SuperAdminRoleMappingPayload {
  superadmin_role_id: number;
  mappings: {
    module_id: number;
    action_id: number;
    sub_action_ids: number[];
  }[];
}

interface PaginationParams {
  page: number;
  limit: number;
  sort_by?: string;
  order?: 'asc' | 'desc';
}

interface PaginationMeta {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
}

export const UseSuperAdminRoles = () => {
  // State management
  const [superAdminRoles, setSuperAdminRoles] = useState<Role[]>([]);
  const [superAdminRoleMappings, setSuperAdminRoleMappings] = useState<SuperAdminRoleMapping[]>([]);
  const [MasterAdminRoleMappings, setMasterAdminRoleMappings] = useState<MasterAdminRoleMapping[]>([]);
  const [groupedModuleActions, setGroupedModuleActions] = useState<ModuleWithActions[]>([]);
  const [message, setMessage] = useState("");
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Separate pagination for each table - both set to 10 items per page
  const [masterAdminPaginationParams, setMasterAdminPaginationParams] = useState<PaginationParams>({
    page: 1,
    limit: 10,
    sort_by: 'assignment_date',
    order: 'asc'
  });

  const [superAdminPaginationParams, setSuperAdminPaginationParams] = useState<PaginationParams>({
    page: 1,
    limit: 10,
    sort_by: 'role_id',
    order: 'asc'
  });

  // Pagination metadata
  const [masterAdminPaginationMeta, setMasterAdminPaginationMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total_items: 0,
    total_pages: 0
  });

  const [superAdminPaginationMeta, setSuperAdminPaginationMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total_items: 0,
    total_pages: 0
  });

  const { authState } = useAuth();

  // Memoized auth headers to prevent recreation on every render
  const getAuthHeaders = useCallback(() => {
    const token = authState.token;
    return {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };
  }, [authState.token]);

  // Helper function to build query string from pagination params
  const buildQueryString = useCallback((params: PaginationParams) => {
    const queryParams = new URLSearchParams();
    queryParams.append('page', params.page.toString());
    queryParams.append('limit', params.limit.toString());
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.order) queryParams.append('order', params.order);
    return queryParams.toString();
  }, []);

  // Update pagination parameters
  const updateMasterAdminPaginationParams = useCallback((newParams: Partial<PaginationParams>) => {
    setMasterAdminPaginationParams(prev => ({ ...prev, ...newParams }));
  }, []);

  const updateSuperAdminPaginationParams = useCallback((newParams: Partial<PaginationParams>) => {
    setSuperAdminPaginationParams(prev => ({ ...prev, ...newParams }));
  }, []);

  // Optimized API calls with better error handling and dynamic pagination
//   const fetchSuperAdminRoles = useCallback(async (params?: Partial<PaginationParams>) => {
//     try {
//       const queryParams = params ? { ...superAdminPaginationParams, ...params } : superAdminPaginationParams;
//       const queryString = buildQueryString(queryParams);
     
//       const { data } = await axios.get(
//         `/api/v1/superadmin/roles?${queryString}`,
//         {
//           headers: getAuthHeaders(),
//         }
//       );
// console.log(data);

//       const rolesData = data.data.roles.map((r: any) => ({
//         ...r,
//         enabled: r.status === "active",
//         source: "superadmin" as const,
//       }));

//       setSuperAdminRoles(rolesData);
//       console.log(rolesData);
      
//     } catch (error) {
//       console.error("Failed to fetch super admin roles:", error);
//       setMessage("Failed to fetch super admin roles.");
//     }
//   }, [getAuthHeaders, superAdminPaginationParams, buildQueryString]);

const fetchSuperAdminRoles = useCallback(async (params?: Partial<PaginationParams>) => {
  try {
    const queryParams = params ? { ...superAdminPaginationParams, ...params } : superAdminPaginationParams;
    const queryString = buildQueryString(queryParams);

    const { data } = await axios.get(
      `/api/v1/superadmin/roles?${queryString}`,
      {
        headers: getAuthHeaders(),
      }
    );

    // Check if the response structure is correct
    if (!data || !data.data || !data.data.roles) {
      console.error('Invalid response structure:', data);
      setMessage("Invalid response structure from API");
      return;
    }

    const rolesData = data.data.roles.map((r: any) => ({
      ...r,
      enabled: r.status === "active",
      source: "superadmin" as const,
    }));

    setSuperAdminRoles(rolesData);

    // Update pagination metadata if available
    if (data.meta) {
      setSuperAdminPaginationMeta(data.meta);
    }
    
  } catch (error: any) {
    console.error("Failed to fetch super admin roles:", error);
    
    // Enhanced error logging for 422 errors
    if (error.response?.status === 422) {
      console.error('422 Error Details:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        config: {
          url: error.config?.url,
          params: error.config?.params,
          headers: error.config?.headers
        }
      });
      
      // Log the exact error message from the API
      const errorMessage = error.response.data?.detail || 
                          error.response.data?.message || 
                          'Invalid request parameters';
      
      console.error('API Error Message:', errorMessage);
      setMessage(`API Error: ${errorMessage}`);
    } else {
      setMessage("Failed to fetch super admin roles.");
    }
  }
}, [getAuthHeaders, superAdminPaginationParams, buildQueryString]);


  const fetchSuperAdminRoleMappings = useCallback(async (params?: Partial<PaginationParams>) => {
    try {
      const queryParams = params ? { ...superAdminPaginationParams, ...params } : superAdminPaginationParams;
      const queryString = buildQueryString(queryParams);
     
      const { data }: { data: SuperAdminRoleMappingsResponse } =
        await axios.get(`/api/v1/super-admin-role-mappings?${queryString}`, {
          headers: getAuthHeaders(),
        });
console.log(data , "fetchSuperAdminRoleMappings");

      setSuperAdminRoleMappings(data.data);
      
      // Update pagination metadata for super admin table
      if (data.meta) {
        setSuperAdminPaginationMeta(data.meta);
      } else {
        // Fallback if meta not provided
        setSuperAdminPaginationMeta({
          page: queryParams.page,
          limit: queryParams.limit,
          total_items: data.total || data.data.length,
          total_pages: Math.ceil((data.total || data.data.length) / queryParams.limit)
        });
      }
    } catch (error) {
      console.error("Failed to fetch super admin role mappings:", error);
      setMessage("Failed to fetch super admin role mappings.");
    }
  }, [getAuthHeaders, superAdminPaginationParams, buildQueryString]);

  const fetchAssignedRoles = useCallback(async (params?: Partial<PaginationParams>) => {
    try {
      const queryParams = params ? { ...masterAdminPaginationParams, ...params } : masterAdminPaginationParams;
     
      const { data }: { data: AssignedUserRoleModuleActionsResponse } =
        await axios.get(
          `/api/v1/assigned-user-role-module-actions?page=${queryParams.page}&limit=${queryParams.limit}&sort_by=assignment_date&order=asc`,
          {
            headers: getAuthHeaders(),
          }
        );

      const transformedModules: ModuleWithActions[] = [];
     console.log("fetchAssignedRoles", data);
     
      setMasterAdminRoleMappings(data.data.assignments.flatMap((assignment: AssignedModule) =>
        assignment.module_data.map((roleData: AssignedModuleRole) => ({
          module_data: roleData,
          assignment_date: assignment.assignment_date,
          status: roleData.status,
          mapping_id: 0,
          role_id: roleData.role_id,
          role_name: roleData.role_name,
          module_id: assignment.module_id,
          module_name: assignment.module_name,
          action_id: roleData.actions[0]?.action_id || 0,
          action_name: roleData.actions[0]?.action_name || '',
          sub_actions: roleData.actions[0]?.all_sub_actions || [],
          created_at: assignment.assignment_date
        }))
      ));

      // Update pagination metadata for master admin table
      setMasterAdminPaginationMeta(data.meta);
     
      data.data.assignments.forEach((assignment: AssignedModule) => {
        const moduleActions: Action[] = [];
        const moduleRoles: Role[] = [];

        assignment.module_data.forEach((roleData: AssignedModuleRole) => {
          const role: Role = {
            role_id: roleData.role_id,
            role_name: roleData.role_name,
            enabled: roleData.status === "active",
            source: "assigned" as const,
          };

          moduleRoles.push(role);

          roleData.actions.forEach((actionData: AssignedAction) => {
            const existingAction = moduleActions.find(
              (a) => a.action_id === actionData.action_id
            );

            if (!existingAction) {
              const action: Action = {
                action_id: actionData.action_id,
                action_name: actionData.action_name,
                sub_actions: actionData.all_sub_actions.map((subAction) => ({
                  sub_action_id: subAction.sub_action_id,
                  sub_action_name: subAction.sub_action_name,
                })),
              };
              moduleActions.push(action);
            } else {
              actionData.all_sub_actions.forEach((subAction) => {
                if (
                  !existingAction.sub_actions.find(
                    (sa) => sa.sub_action_id === subAction.sub_action_id
                  )
                ) {
                  existingAction.sub_actions.push({
                    sub_action_id: subAction.sub_action_id,
                    sub_action_name: subAction.sub_action_name,
                  });
                }
              });
            }
          });
        });

        const module: ModuleWithActions = {
          module_id: assignment.module_id,
          module_name: assignment.module_name,
          actions: moduleActions,
          roles: moduleRoles,
        };

        transformedModules.push(module);
      });

      setGroupedModuleActions(transformedModules);
    } catch (error) {
      console.error("Failed to fetch assigned user role module actions:", error);
      setMessage("Failed to fetch assigned user role module actions.");
    }
  }, [getAuthHeaders, masterAdminPaginationParams]);

  // Memoized computed values for better performance
  const availableSuperAdminRoles = useMemo(() => {
    return superAdminRoles
      .filter(role => role.enabled)
      .sort((a, b) => a.role_name.localeCompare(b.role_name));
  }, [superAdminRoles]);

  const moduleOptions = useMemo(() => {
    const uniqueModules = new Map<
      string,
      { id: string; label: string; module_id: number }
    >();

    // Get modules from super admin mappings
    superAdminRoleMappings.forEach((mapping) => {
      if (!uniqueModules.has(mapping.module_name)) {
        uniqueModules.set(mapping.module_name, {
          id: mapping.module_name,
          label: mapping.module_name,
          module_id: mapping.module_id,
        });
      }
    });

    // Also get from grouped module actions
    groupedModuleActions.forEach((module) => {
      if (!uniqueModules.has(module.module_name)) {
        uniqueModules.set(module.module_name, {
          id: module.module_name,
          label: module.module_name,
          module_id: module.module_id,
        });
      }
    });

    return Array.from(uniqueModules.values()).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }, [superAdminRoleMappings, groupedModuleActions]);

  // Get assigned sub-actions for a specific role-module-action combination
  const getAssignedSubActionsForRoleModuleAction = useCallback((
    roleId: number,
    moduleName: string,
    actionName: string
  ) => {
    const assignedSubActions = new Set<number>();
   
    superAdminRoleMappings.forEach((mapping) => {
      if (
        mapping.super_admin_role_id === roleId &&
        mapping.module_name === moduleName &&
        mapping.action_name === actionName
      ) {
        mapping.sub_actions.forEach((subAction) => {
          assignedSubActions.add(subAction.sub_action_id);
        });
      }
    });
   
    return assignedSubActions;
  }, [superAdminRoleMappings]);

  // Optimized action options with memoization
  const getActionOptionsForModules = useCallback((selectedModules: string[]) => {
    if (!selectedModules || selectedModules.length === 0) return [];

    const actions: { id: string; label: string; action_id: number }[] = [];
    const seen = new Set<string>();

    superAdminRoleMappings.forEach((mapping) => {
      if (
        selectedModules.includes(mapping.module_name) &&
        !seen.has(mapping.action_name)
      ) {
        seen.add(mapping.action_name);
        actions.push({
          id: mapping.action_name,
          label: mapping.action_name,
          action_id: mapping.action_id,
        });
      }
    });

    groupedModuleActions.forEach((module) => {
      if (selectedModules.includes(module.module_name)) {
        module.actions.forEach((action) => {
          if (!seen.has(action.action_name)) {
            seen.add(action.action_name);
            actions.push({
              id: action.action_name,
              label: action.action_name,
              action_id: action.action_id,
            });
          }
        });
      }
    });

    return actions.sort((a, b) => a.label.localeCompare(b.label));
  }, [superAdminRoleMappings, groupedModuleActions]);

  // Enhanced sub-action options with smart filtering for unassigned sub-actions
  const getSubActionOptionsForModulesAndActions = useCallback((
    selectedModules: string[],
    selectedAction: string,
    currentRoleId?: number
  ) => {
    if (!selectedModules || selectedModules.length === 0 || !selectedAction)
      return [];
 
    const subActions: {
      id: string;
      label: string;
      sub_action_id: number;
      parent_action: string;
    }[] = [];
    const seen = new Set<string>();
 
    // Get assigned sub-actions for the current role to filter them out
    const assignedSubActionIds = currentRoleId
      ? getAssignedSubActionsForRoleModuleAction(currentRoleId, selectedModules[0], selectedAction)
      : new Set<number>();

    // Collect all sub-actions for the selected modules and action
    superAdminRoleMappings.forEach((mapping) => {
      if (
        selectedModules.includes(mapping.module_name) &&
        selectedAction === mapping.action_name
      ) {
        mapping.sub_actions.forEach((subAction) => {
          const uniqueKey = `${subAction.sub_action_name}`;
          // Only include unassigned sub-actions
          if (!seen.has(uniqueKey) && !assignedSubActionIds.has(subAction.sub_action_id)) {
            seen.add(uniqueKey);
            subActions.push({
              id: subAction.sub_action_name,
              label: `${subAction.sub_action_name} (${mapping.action_name})`,
              sub_action_id: subAction.sub_action_id,
              parent_action: mapping.action_name,
            });
          }
        });
      }
    });
 
    // Also get from grouped module actions
    groupedModuleActions.forEach((module) => {
      if (selectedModules.includes(module.module_name)) {
        module.actions.forEach((action) => {
          if (selectedAction === action.action_name) {
            action.sub_actions.forEach((subAction) => {
              const uniqueKey = `${subAction.sub_action_name}`;
              // Only include unassigned sub-actions
              if (!seen.has(uniqueKey) && !assignedSubActionIds.has(subAction.sub_action_id)) {
                seen.add(uniqueKey);
                subActions.push({
                  id: subAction.sub_action_name,
                  label: `${subAction.sub_action_name} (${action.action_name})`,
                  sub_action_id: subAction.sub_action_id,
                  parent_action: action.action_name,
                });
              }
            });
          }
        });
      }
    });
 
    return subActions.sort((a, b) => a.label.localeCompare(b.label));
  }, [superAdminRoleMappings, groupedModuleActions, getAssignedSubActionsForRoleModuleAction]);

  // Updated role mapping creation with the new API structure
  const handleCreateSuperAdminRoleMapping = useCallback(async (
    superAdminRoleId: number,
    selectedModules: string[],
    selectedActions: string,
    selectedSubActions: string[]
  ) => {
    if (
      !superAdminRoleId ||
      selectedModules.length === 0 ||
      !selectedActions
    ) {
      setMessage("Please select super admin role, modules, and actions");
      return false;
    }

    try {
      setIsLoading(true);
      const moduleIds = moduleOptions
        .filter((module) => selectedModules.includes(module.id))
        .map((module) => module.module_id);

      const actionId = getActionOptionsForModules(selectedModules).find(
        (action) => action.id === selectedActions
      )?.action_id;

      if (!actionId) {
        setMessage("Invalid action selected");
        return false;
      }

      const subActionIds: number[] = [];
      if (selectedSubActions.length > 0) {
        const availableSubActions = getSubActionOptionsForModulesAndActions(
          selectedModules,
          selectedActions,
          superAdminRoleId
        );
        selectedSubActions.forEach((subActionName) => {
          const subAction = availableSubActions.find(
            (sa) => sa.id === subActionName
          );
          if (subAction) {
            subActionIds.push(subAction.sub_action_id);
          }
        });
      }

      const mappings = moduleIds.map((moduleId) => ({
        module_id: moduleId,
        action_id: actionId,
        sub_action_ids: subActionIds,
      }));

      const payload: SuperAdminRoleMappingPayload = {
        superadmin_role_id: superAdminRoleId,
        mappings: mappings,
      };

      await axios.post("/api/v1/super-admin-role-mappings", payload, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      });

      const superAdminRoleName =
        superAdminRoles.find((r) => r.role_id === superAdminRoleId)
          ?.role_name || superAdminRoleId.toString();

      setMessage(
        `Successfully created super admin role mapping for: ${superAdminRoleName}`
      );

      await fetchSuperAdminRoleMappings();

      return true;
    } catch (error: any) {
      console.error("Failed to create super admin role mapping:", error);
      const errorMessage = error?.response?.data?.detail ||
                          error?.response?.data?.message ||
                          error?.message ||
                          "Unknown error";                          
      setMessage(`Failed to create super admin role mapping: ${errorMessage}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [
    moduleOptions,
    getActionOptionsForModules,
    getSubActionOptionsForModulesAndActions,
    getAuthHeaders,
    superAdminRoles,
    fetchSuperAdminRoleMappings
  ]);

  // Update role mapping function
  const handleUpdateSuperAdminRoleMapping = useCallback(async (
    mappingId: number,
    superAdminRoleId: number,
    selectedModules: string[],
    selectedActions: string,
    selectedSubActions: string[]
  ) => {
    if (
      !mappingId ||
      !superAdminRoleId ||
      selectedModules.length === 0 ||
      !selectedActions
    ) {
      setMessage("Please select modules and actions");
      return false;
    }

    try {
      setIsLoading(true);
      const moduleIds = moduleOptions
        .filter((module) => selectedModules.includes(module.id))
        .map((module) => module.module_id);

      const actionId = getActionOptionsForModules(selectedModules).find(
        (action) => action.id === selectedActions
      )?.action_id;

      if (!actionId) {
        setMessage("Invalid action selected");
        return false;
      }

      const subActionIds: number[] = [];
      if (selectedSubActions.length > 0) {
        const availableSubActions = getSubActionOptionsForModulesAndActions(
          selectedModules,
          selectedActions,
          superAdminRoleId
        );
        selectedSubActions.forEach((subActionName) => {
          const subAction = availableSubActions.find(
            (sa) => sa.id === subActionName
          );
          if (subAction) {
            subActionIds.push(subAction.sub_action_id);
          }
        });
      }

      const mappings = moduleIds.map((moduleId) => ({
        module_id: moduleId,
        action_id: actionId,
        sub_action_ids: subActionIds,
      }));

      const payload: SuperAdminRoleMappingPayload = {
        superadmin_role_id: superAdminRoleId,
        mappings: mappings,
      };

      await axios.put(`/api/v1/super-admin-role-mappings?super_admin_role_mappings_id=${mappingId}`, payload, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      });

      const superAdminRoleName =
        superAdminRoles.find((r) => r.role_id === superAdminRoleId)
          ?.role_name || superAdminRoleId.toString();

      setMessage(
        `Successfully updated super admin role mapping for: ${superAdminRoleName}`
      );

      await fetchSuperAdminRoleMappings();

      return true;
    } catch (error: any) {
      console.error("Failed to update super admin role mapping:", error);
      const errorMessage = error?.response?.data?.detail ||
                          error?.response?.data?.message ||
                          error?.message ||
                          "Unknown error";                          
      setMessage(`Failed to update super admin role mapping: ${errorMessage}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [
    moduleOptions,
    getActionOptionsForModules,
    getSubActionOptionsForModulesAndActions,
    getAuthHeaders,
    superAdminRoles,
    fetchSuperAdminRoleMappings
  ]);

  const handleCreateRole = useCallback(
    async (roleData: { role_name: string; description: string; status: string }) => {
      if (!roleData.role_name.trim()) {
        setMessage("Role name is required");
        return;
      }
 
      setIsCreatingRole(true);
      try {
        const { data } = await axios.post("api/v1/superadmin/roles", roleData, {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
        });
 
        const newRole = data.data.role;
 
        setSuperAdminRoles((prev) => [
          ...prev,
          {
            ...newRole,
            enabled: newRole.status === "active",
            source: "superadmin" as const,
          },
        ]);
        setMessage(`Role "${roleData.role_name}" created successfully`);
 
        await fetchSuperAdminRoles();
      } catch (error: any) {
        console.error(error);
        const errorMessage =
          error?.response?.data?.detail ||
          "Unknown error";
 
        setMessage(`Failed : ${errorMessage}`);
      } finally {
        setIsCreatingRole(false);
      }
    },
    [getAuthHeaders, fetchSuperAdminRoles]
  );

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchSuperAdminRoles(),
          fetchSuperAdminRoleMappings(),
          fetchAssignedRoles(),
        ]);
      } catch (error) {
        console.error("Failed to initialize data:", error);
        setMessage("Failed to load initial data. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [fetchSuperAdminRoles, fetchSuperAdminRoleMappings, fetchAssignedRoles]);

  // Refetch data when pagination parameters change
  useEffect(() => {
    fetchAssignedRoles();
  }, [masterAdminPaginationParams]);

  useEffect(() => {
    fetchSuperAdminRoleMappings();
  }, [superAdminPaginationParams]);

  return {
    superAdminRoleMappings,
    message,
    setMessage,
    isCreatingRole,
    isLoading,
    availableSuperAdminRoles,
    handleCreateRole,
    handleCreateSuperAdminRoleMapping,
    handleUpdateSuperAdminRoleMapping,
    moduleOptions,
    MasterAdminRoleMappings,
    groupedModuleActions,
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
    
    // Fetch functions
    fetchSuperAdminRoles,
    fetchSuperAdminRoleMappings,
    fetchAssignedRoles,
    getAssignedSubActionsForRoleModuleAction,
  };
};





