// 
import { useEffect, useMemo, useState } from "react";
import axios from "../helper/axios";
import { useAuth } from "./useAuth";
import toast from "react-hot-toast";


interface Role {
  role_id: number;
  role_name: string;
  description?: string;
  status?: string;
  enabled: boolean;
}


interface ModuleActionPair {
  module_action_pair_id: number;
  module_id: number;
  module_name: string;
  action_id: number;
  action_name: string;
}


interface RoleMapping {
  role_name: string;
  module_name: string;
  action_name: string;
  status: string;
  assignment_date: string;
}


export const useRoleManagement = (isReadOnly: boolean) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [moduleActionPairs, setModuleActionPairs] = useState<ModuleActionPair[]>([]);
  const [roleMappings, setRoleMappings] = useState<RoleMapping[]>([]);
  const [roleModules, setRoleModules] = useState<Record<number, string[]>>({});
  const [roleActions, setRoleActions] = useState<Record<number, string[]>>({});
  const [selectedRole, setSelectedRole] = useState<{
    id: number;
    type: "module" | "action";
  } | null>(null);
  const [message, setMessage] = useState("");
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentRoles, setCurrentRoles] = useState<Role[]>([]);
  const [toggleLoading, setToggleLoading] = useState<number | null>(null);
  const { authState } = useAuth();


  const getAuthHeaders = () => ({
    Authorization: `Bearer ${authState.token}`,
    Accept: "application/json",
  });


  const fetchRoles = async (
    page: number = currentPage,
    limit: number = itemsPerPage
  ) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `/api/v1/roles?page=${page}&limit=${limit}`,
        { headers: getAuthHeaders() }
      );


      const rolesData = data.data.roles.map((r: any) => ({
        ...r,
        enabled: r.status === "active",
      }));


      setRoles(rolesData);
      setCurrentRoles(rolesData);
      setTotalItems(data.meta.total_items || rolesData.length);
      setTotalPages(
        data.meta.total_pages ||
          Math.ceil((data.meta.total_items || rolesData.length) / limit)
      );
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      setMessage("Failed to fetch roles.");
    } finally {
      setIsLoading(false);
    }
  };


  const fetchModuleActionPairs = async (
    page: number = 1,
    limit: number = 100
  ) => {
    try {
      const { data } = await axios.get(
        `/api/v1/module-action-pair?page=${page}&limit=${limit}`,
        { headers: { Accept: "application/json" } }
      );
      setModuleActionPairs(data.data.module_action_pairs);
    } catch (error) {
      console.error("Failed to fetch module-action pairs:", error);
    }
  };


  const fetchRoleMappings = async (page: number = 1, limit: number = 100) => {
    try {
      const { data } = await axios.get(
        `/api/v1/mapped-module-actions-roles?page=${page}&limit=${limit}&order=asc`,
        { headers: { Accept: "application/json" } }
      );
      setRoleMappings(data.data.modules);
    } catch (error) {
      console.error("Failed to fetch role mappings:", error);
    }
  };


  useEffect(() => {
    fetchRoles(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);


  useEffect(() => {
    fetchModuleActionPairs();
    fetchRoleMappings();
    const interval = setInterval(() => fetchRoleMappings(), 10000);
    return () => clearInterval(interval);
  }, []);


  const moduleOptions = useMemo(() => {
    const seen = new Set();
    return moduleActionPairs
      .filter(
        ({ module_name }) => !seen.has(module_name) && seen.add(module_name)
      )
      .map(({ module_name }) => ({ id: module_name, label: module_name }));
  }, [moduleActionPairs]);


  const getActionOptionsForModules = (selectedModules: string[]) => {
    if (!selectedModules || selectedModules.length === 0) return [];


    const seen = new Set();
    return moduleActionPairs
      .filter(
        ({ module_name, action_name }) =>
          selectedModules.includes(module_name) &&
          !seen.has(action_name) &&
          seen.add(action_name)
      )
      .map(({ action_name }) => ({ id: action_name, label: action_name }));
  };


  const groupedRoleMappings = useMemo(() => {
    return roleMappings.reduce((acc, item) => {
      if (!acc[item.role_name]) acc[item.role_name] = [];
      acc[item.role_name].push(item);
      return acc;
    }, {} as Record<string, RoleMapping[]>);
  }, [roleMappings]);


  const handleToggleChange = async (roleId: number) => {
    const role = roles.find((r) => r.role_id === roleId);
    setToggleLoading(roleId);
   
    if (!role) return;


    const newStatus = role.status === "active" ? "inactive" : "active";


    try {
      await axios.put(
        `/api/v1/roles/${roleId}`,
        {
          role_name: role.role_name,
          description: role.description || "",
          status: newStatus,
        },
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
        }
      );
      setRoles((prev) =>
        prev.map((r) =>
          r.role_id === roleId
            ? { ...r, status: newStatus, enabled: newStatus === "active" }
            : r
        )
      );
      toast.success(`Role "${role.role_name}" is now ${newStatus}`, {
  position: 'top-right',
});
      // setMessage(`Role "${role.role_name}" is now ${newStatus}`);
    } catch (error) {
      console.error("Failed to toggle role status:", error);
      setMessage("Failed to update role status.");
    } finally {
      setToggleLoading(null);
    }
  };


  const handleApply = (
    roleId: number,
    selected: string[],
    type: "module" | "action"
  ) => {
    if (type === "module") {
      setRoleModules((prev) => ({ ...prev, [roleId]: selected }));
      setRoleActions((prev) => ({ ...prev, [roleId]: [] }));
    } else {
      setRoleActions((prev) => ({ ...prev, [roleId]: selected }));
    }
  };


  const validateSingleRoleSelection = (roleId: number) => {
    const role = roles.find((r) => r.role_id === roleId);
    if (!role) return false;


    const mappings = groupedRoleMappings[role.role_name] || [];
    const existingModules = [...new Set(mappings.map((m) => m.module_name))];
    const existingActions = [...new Set(mappings.map((m) => m.action_name))];


    const selectedModules = roleModules[roleId] || [];
    const selectedActions = roleActions[roleId] || [];


    const totalModules = [...new Set([...existingModules, ...selectedModules])];
    const totalActions = [...new Set([...existingActions, ...selectedActions])];


    return (
      totalModules.length > 0 &&
      totalActions.length > 0 &&
      (selectedModules.length > 0 || selectedActions.length > 0)
    );
  };


  const handleSaveSingleAssignment = async (roleId: number) => {
    const role = roles.find((r) => r.role_id === roleId);
    if (!role) return;


    const mappings = groupedRoleMappings[role.role_name] || [];
    const existingModules = [...new Set(mappings.map((m) => m.module_name))];


    const selectedModules = roleModules[roleId] || [];
    const selectedActions = roleActions[roleId] || [];


    const allModules = [...new Set([...existingModules, ...selectedModules])];


    if (!validateSingleRoleSelection(roleId)) {
      setMessage(
        `Please select both modules and actions for: ${role.role_name}`
      );
      return;
    }


    const moduleActionIds = moduleActionPairs
      .filter((pair) => {
        const isSelectedAction = selectedActions.includes(pair.action_name);
        const isValidModule = allModules.includes(pair.module_name);
        return isSelectedAction && isValidModule;
      })
      .map((pair) => pair.module_action_pair_id);


    if (moduleActionIds.length === 0) {
      setMessage("No new assignments to save.");
      return;
    }


    const assignment = {
      role_id: [roleId],
      module_action_pair_ids: moduleActionIds,
      status: "active",
    };


    try {
      setIsLoading(true);
      await axios.post(
        "/api/v1/mapping-module-actions-roles",
        { assignments: [assignment] },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );


      setMessage(`Successfully assigned to role: ${role.role_name}`);


      await fetchRoleMappings();
      setRoleModules((prev) => {
        const newState = { ...prev };
        delete newState[roleId];
        return newState;
      });
      setRoleActions((prev) => {
        const newState = { ...prev };
        delete newState[roleId];
        return newState;
      });
    } catch (error) {
      console.error("Assignment failed:", error);
      setMessage("Assignment failed.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleSaveMasterRoleMapping = async (
    roleId: number,
    modules: string[],
    actions: string[]
  ) => {
    try {
      setIsLoading(true);
     
      // Get module-action pairs for the selected modules and actions
      const moduleActionIds = moduleActionPairs
        .filter((pair) =>
          modules.includes(pair.module_name) &&
          actions.includes(pair.action_name)
        )
        .map((pair) => pair.module_action_pair_id);


      if (moduleActionIds.length === 0) {
        setMessage("No valid module-action combinations found.");
        return false;
      }


      const assignment = {
        role_id: [roleId],
        module_action_pair_ids: moduleActionIds,
        status: "active",
      };


      await axios.post(
        "/api/v1/mapping-module-actions-roles",
        { assignments: [assignment] },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );


      const role = roles.find(r => r.role_id === roleId);
      setMessage(`Successfully created mapping for role: ${role?.role_name}`);
     
      // Refresh mappings
      await fetchRoleMappings();
      return true;
    } catch (error) {
      console.error("Failed to create master role mapping:", error);
      setMessage("Failed to create role mapping.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };


  const handleCreateRole = async (roleData: {
    role_name: string;
    description: string;
    status: string;
  }) => {
    setIsCreatingRole(true);
    try {
      const { data } = await axios.post("/api/v1/roles", roleData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      });


      const newRole = data.data.role;
      setRoles((prev) => [
        ...prev,
        { ...newRole, enabled: newRole.status === "active" },
      ]);
      setMessage(`Role "${roleData.role_name}" created successfully`);
      fetchRoles(currentPage, itemsPerPage);
      return newRole;
    } catch (error: any) {
      console.error("Failed to create role:", error);
      setMessage(
        `Failed to create role: ${
          error?.response?.data?.detail || "Unknown error"
        }`
      );
      throw error;
    } finally {
      setIsCreatingRole(false);
    }
  };


  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };


  const toggleDropdown = (roleId: number, type: "module" | "action") => {
    if (isReadOnly) return;


    if (selectedRole?.id === roleId && selectedRole?.type === type) {
      setSelectedRole(null);
      return;
    }


    if (roleId === -1) {
      setSelectedRole(null);
    } else {
      setSelectedRole({ id: roleId, type });
    }
  };


  const getAvailableModules = (roleId: number) => {
    const role = roles.find((r) => r.role_id === roleId);
    if (!role) return moduleOptions;


    const assignments = groupedRoleMappings[role.role_name] || [];
    const fullyAssignedModules = new Set<string>();


    const moduleActionCounts = moduleActionPairs.reduce((acc, pair) => {
      if (!acc[pair.module_name]) acc[pair.module_name] = 0;
      acc[pair.module_name]++;
      return acc;
    }, {} as Record<string, number>);


    const assignedActionCounts = assignments.reduce((acc, assignment) => {
      if (!acc[assignment.module_name]) acc[assignment.module_name] = 0;
      acc[assignment.module_name]++;
      return acc;
    }, {} as Record<string, number>);


    Object.keys(moduleActionCounts).forEach((moduleName) => {
      const totalActions = moduleActionCounts[moduleName];
      const assignedActions = assignedActionCounts[moduleName] || 0;
      if (assignedActions >= totalActions) {
        fullyAssignedModules.add(moduleName);
      }
    });


    const selectedModules = roleModules[roleId] || [];


    return moduleOptions.filter(
      (module) =>
        !fullyAssignedModules.has(module.id) ||
        selectedModules.includes(module.id)
    );
  };


  const getAvailableActions = (roleId: number) => {
    const role = roles.find((r) => r.role_id === roleId);
    if (!role) return [];


    const selectedModules = roleModules[roleId] || [];
    const assignments = groupedRoleMappings[role.role_name] || [];


    const assignedActions = assignments.map((a) => a.action_name);
    const allActions = getActionOptionsForModules(selectedModules);
    const currentlySelectedActions = roleActions[roleId] || [];


    return allActions.filter(
      (action) =>
        !assignedActions.includes(action.id) ||
        currentlySelectedActions.includes(action.id)
    );
  };


  return {
    roles,
    moduleActionPairs,
    roleMappings,
    message,
    setMessage,
    isCreatingRole,
    isLoading,
    currentPage,
    setCurrentPage: handlePageChange,
    itemsPerPage,
    setItemsPerPage: handleItemsPerPageChange,
    totalItems,
    totalPages,
    currentRoles,
    roleModules,
    roleActions,
    selectedRole,
    setSelectedRole,
    toggleDropdown,
    handleApply,
    handleToggleChange,
    handleSaveSingleAssignment,
    handleSaveMasterRoleMapping,
    handleCreateRole,
    fetchRoles,
    fetchRoleMappings,
    groupedRoleMappings,
    moduleOptions,
    getActionOptionsForModules,
    validateSingleRoleSelection,
    getAvailableModules,
    getAvailableActions,
    setRoles,
    toggleLoading,
  };
};

