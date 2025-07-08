import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Edit,
  X,
  Save,
  Building,
  Shield,
  Settings,
  ChevronDown,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSuperAdminRoles } from "../../../hooks/useSuperAdminRoles";

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  handleCreateRole: (roleData: {
    role_name: string;
    description: string;
    status: string;
  }) => Promise<boolean>;
  isCreatingRole: boolean;
}

interface ModuleMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableRoles: any[];
  moduleOptions: any[];
  getActionOptionsForModules: (modules: string[]) => any[];
  getSubActionOptionsForModulesAndActions: (
    modules: string[],
    action: string,
    roleId?: number
  ) => any[];
  handleCreateMapping: (
    roleId: number,
    modules: string[],
    actions: string,
    subActions: string[]
  ) => Promise<boolean>;
  isLoading: boolean;
}

interface EditMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mapping: any;
  availableRoles: any[];
  moduleOptions: any[];
  getActionOptionsForModules: (modules: string[]) => any[];
  getSubActionOptionsForModulesAndActions: (
    modules: string[],
    action: string,
    roleId?: number
  ) => any[];
  handleUpdateMapping: (
    mappingId: number,
    roleId: number,
    modules: string[],
    actions: string,
    subActions: string[]
  ) => Promise<boolean>;
  isLoading: boolean;
}

const CreateRoleModal: React.FC<CreateRoleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  handleCreateRole,
  isCreatingRole,
}) => {
  const [formData, setFormData] = useState({
    role_name: "",
    description: "",
    status: "active",
  });
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.role_name.trim()) {
      setError("Role name is required");
      return;
    }

    try {
      await handleCreateRole(formData);
      setFormData({ role_name: "", description: "", status: "active" });
      onSuccess();
      onClose();
    } catch (error: any) {
      setError(error.message);
      console.error("Create Role Error:", error);
    }
  };

  const handleClose = () => {
    if (!isCreatingRole) {
      setFormData({ role_name: "", description: "", status: "active" });
      setError("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Shield size={20} className="mr-2 text-indigo-600" />
              Create New Role
            </h2>
            <button
              onClick={handleClose}
              disabled={isCreatingRole}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role Name *
            </label>
            <input
              type="text"
              value={formData.role_name}
              onChange={(e) =>
                setFormData({ ...formData, role_name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter role name"
              disabled={isCreatingRole}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter role description"
              rows={3}
              disabled={isCreatingRole}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isCreatingRole}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isCreatingRole}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreatingRole}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {isCreatingRole ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Create Role
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ModuleMappingModal: React.FC<ModuleMappingModalProps> = ({
  isOpen,
  onClose,
  availableRoles,
  moduleOptions,
  getActionOptionsForModules,
  getSubActionOptionsForModulesAndActions,
  handleCreateMapping,
  isLoading,
}) => {
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [selectedSubActions, setSelectedSubActions] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [openDropdown, setOpenDropdown] = useState<"modules" | "actions" | "subActions" | null>(null);

  // Get available actions for selected modules
  const actionOptions = useMemo(() => {
    return selectedModules.length > 0 
      ? getActionOptionsForModules(selectedModules) 
      : [];
  }, [selectedModules, getActionOptionsForModules]);

  // Get available sub-actions for selected actions
  const subActionOptions = useMemo(() => {
    if (selectedModules.length === 0 || selectedActions.length === 0) return [];

    const allSubActions: any[] = [];
    selectedActions.forEach((action) => {
      const subs = getSubActionOptionsForModulesAndActions(
        selectedModules,
        action,
        selectedRole || undefined
      );
      allSubActions.push(...subs);
    });

    return allSubActions;
  }, [
    selectedModules,
    selectedActions,
    selectedRole,
    getSubActionOptionsForModulesAndActions,
  ]);

  const toggleModule = (moduleId: string) => {
    setSelectedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
    // Reset actions and sub-actions when modules change
    if (!selectedModules.includes(moduleId)) {
      setSelectedActions([]);
      setSelectedSubActions([]);
    }
  };

  const toggleAction = (actionId: string) => {
    setSelectedActions(prev => 
      prev.includes(actionId) 
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId]
    );
    // Remove sub-actions that belong to the deselected action
    if (!selectedActions.includes(actionId)) {
      const relatedSubActions = getSubActionOptionsForModulesAndActions(
        selectedModules,
        actionId,
        selectedRole || undefined
      ).map((sub) => sub.id);
      setSelectedSubActions(prev => 
        prev.filter(id => !relatedSubActions.includes(id))
   ) }
  };

  const toggleSubAction = (subActionId: string) => {
    setSelectedSubActions(prev => 
      prev.includes(subActionId) 
        ? prev.filter(id => id !== subActionId)
        : [...prev, subActionId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedRole || selectedModules.length === 0 || selectedActions.length === 0) {
      setError("Please select role, at least one module and one action");
      return;
    }

    try {
      // Create mapping for each selected action
      const results = await Promise.all(
        selectedActions.map((action) =>
          handleCreateMapping(
            selectedRole,
            selectedModules,
            action,
            selectedSubActions.filter((sub) =>
              getSubActionOptionsForModulesAndActions(
                selectedModules,
                action,
                selectedRole || undefined
              ).some((s) => s.id === sub)
            )
          )
        )
      );

      if (results.every(Boolean)) {
        // Reset form on success
        setSelectedRole(null);
        setSelectedModules([]);
        setSelectedActions([]);
        setSelectedSubActions([]);
        onClose();
      }
    } catch (error: any) {
      setError(error.message || "Failed to create mapping(s)");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl lg:max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Settings size={20} className="mr-2 text-indigo-600" />
              Module Mapping
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Role *
            </label>
            <select
              value={selectedRole || ""}
              onChange={(e) => setSelectedRole(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              required
            >
              <option value="">Choose a role</option>
              {availableRoles.map((role) => (
                <option key={role.role_id} value={role.role_id}>
                  {role.role_name}
                </option>
              ))}
            </select>
          </div>

          {/* Module Dropdown */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Modules *
            </label>
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "modules" ? null : "modules")}
              className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <span>
                {selectedModules.length > 0 
                  ? `${selectedModules.length} module(s) selected` 
                  : "Select modules"}
              </span>
              <ChevronDown 
                size={16} 
                className={`transition-transform ${openDropdown === "modules" ? "rotate-180" : ""}`}
              />
            </button>
            
            {openDropdown === "modules" && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-300 max-h-60 overflow-y-auto">
                <div className="p-2 space-y-1">
                  {moduleOptions.map((module) => (
                    <label key={module.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        checked={selectedModules.includes(module.id)}
                        onChange={() => toggleModule(module.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                      />
                      <span className="text-sm text-gray-700">{module.label}</span>
                    </label>
                  ))}
                </div>
                <div className="border-t border-gray-200 p-2 bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-sm text-blue-600 hover:text-blue-800"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Actions Dropdown */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Actions *
            </label>
            <button
              type="button"
              onClick={() => selectedModules.length > 0 && setOpenDropdown(openDropdown === "actions" ? null : "actions")}
              disabled={selectedModules.length === 0}
              className={`w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                selectedModules.length === 0 ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            >
              <span>
                {selectedActions.length > 0 
                  ? `${selectedActions.length} action(s) selected` 
                  : "Select actions"}
              </span>
              <ChevronDown 
                size={16} 
                className={`transition-transform ${openDropdown === "actions" ? "rotate-180" : ""}`}
              />
            </button>
            
            {openDropdown === "actions" && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-300 max-h-60 overflow-y-auto">
                <div className="p-2 space-y-1">
                  {actionOptions.length === 0 ? (
                    <p className="text-gray-500 text-sm p-2">No actions available</p>
                  ) : (
                    actionOptions.map((action) => (
                      <label key={action.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={selectedActions.includes(action.id)}
                          onChange={() => toggleAction(action.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                        />
                        <span className="text-sm text-gray-700">{action.label}</span>
                      </label>
                    ))
                  )}
                </div>
                <div className="border-t border-gray-200 p-2 bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(null)}
                    className="w-full text-sm text-blue-600 hover:text-blue-800"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sub-Actions Dropdown */}
          {selectedActions.length > 0 && (
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Sub-Actions (Optional)
              </label>
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === "subActions" ? null : "subActions")}
                className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <span>
                  {selectedSubActions.length > 0 
                    ? `${selectedSubActions.length} sub-action(s) selected` 
                    : "Select sub-actions"}
                </span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform ${openDropdown === "subActions" ? "rotate-180" : ""}`}
                />
              </button>
              
              {openDropdown === "subActions" && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-300 max-h-60 overflow-y-auto">
                  <div className="p-2 space-y-1">
                    {subActionOptions.length === 0 ? (
                      <p className="text-gray-500 text-sm p-2">No sub-actions available</p>
                    ) : (
                      subActionOptions.map((subAction) => (
                        <label key={subAction.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                          <input
                            type="checkbox"
                            checked={selectedSubActions.includes(subAction.id)}
                            onChange={() => toggleSubAction(subAction.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                          />
                          <span className="text-sm text-gray-700">{subAction.label}</span>
                        </label>
                      ))
                    )}
                  </div>
                  <div className="border-t border-gray-200 p-2 bg-gray-50">
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(null)}
                      className="w-full text-sm text-blue-600 hover:text-blue-800"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Create Mapping
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditMappingModal: React.FC<EditMappingModalProps> = ({
  isOpen,
  onClose,
  mapping,
  availableRoles,
  moduleOptions,
  getActionOptionsForModules,
  getSubActionOptionsForModulesAndActions,
  handleUpdateMapping,
  isLoading,
}) => {
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [selectedSubActions, setSelectedSubActions] = useState<string[]>([]);
  const [originalValues, setOriginalValues] = useState<{
    modules: string[];
    actions: string[];
    subActions: string[];
  }>({ modules: [], actions: [], subActions: [] });
  const [error, setError] = useState<string>("");
  const [openDropdown, setOpenDropdown] = useState<"modules" | "actions" | "subActions" | null>(null);

  // Initialize form with mapping data
  useEffect(() => {
    if (mapping && isOpen) {
      setSelectedRole(mapping.super_admin_role_id);
      
      // Extract all modules, actions and sub-actions from the mapping
      const modules = [mapping.module_name];
      const actions = mapping.actions?.map((action: any) => action.action_name) || [];
      const subActions = mapping.actions?.flatMap((action: any) => 
        action.sub_actions?.map((sub: any) => sub.sub_action_name) || []
      ) || [];
      
      setSelectedModules(modules);
      setSelectedActions(actions);
      setSelectedSubActions(subActions);
      setOriginalValues({
        modules,
        actions,
        subActions
      });
    }
  }, [mapping, isOpen]);

  // Get available actions for selected modules
  const actionOptions = useMemo(() => {
    return selectedModules.length > 0 
      ? getActionOptionsForModules(selectedModules) 
      : [];
  }, [selectedModules, getActionOptionsForModules]);

  // Get available sub-actions for selected modules and actions
  const subActionOptions = useMemo(() => {
    if (selectedModules.length === 0 || selectedActions.length === 0) return [];

    const allSubActions: any[] = [];
    selectedActions.forEach((action) => {
      const subs = getSubActionOptionsForModulesAndActions(
        selectedModules,
        action,
        selectedRole || undefined
      );
      allSubActions.push(...subs);
    });

    return allSubActions;
  }, [
    selectedModules,
    selectedActions,
    selectedRole,
    getSubActionOptionsForModulesAndActions,
  ]);

  const handleModuleChange = (moduleId: string) => {
    setSelectedModules([moduleId]);
    setSelectedActions([]);
    setSelectedSubActions([]);
    setOpenDropdown(null);
  };

  const removeModule = () => {
    setSelectedModules([]);
    setSelectedActions([]);
    setSelectedSubActions([]);
  };

  const toggleAction = (actionId: string) => {
    setSelectedActions(prev => 
      prev.includes(actionId) 
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId]
    );
    // Remove sub-actions that belong to the deselected action
    if (!selectedActions.includes(actionId)) {
      const relatedSubActions = getSubActionOptionsForModulesAndActions(
        selectedModules,
        actionId,
        selectedRole || undefined
      ).map((sub) => sub.id);
      setSelectedSubActions(prev => 
        prev.filter(id => !relatedSubActions.includes(id))
      );
    }
  };

  const removeAction = (actionId: string) => {
    setSelectedActions(prev => prev.filter(id => id !== actionId));
    // Also remove related sub-actions
    const relatedSubActions = getSubActionOptionsForModulesAndActions(
      selectedModules,
      actionId,
      selectedRole || undefined
    ).map((sub) => sub.id);
    setSelectedSubActions(prev => 
      prev.filter(id => !relatedSubActions.includes(id))
    );
  };

  const toggleSubAction = (subActionId: string) => {
    setSelectedSubActions(prev => 
      prev.includes(subActionId) 
        ? prev.filter(id => id !== subActionId)
        : [...prev, subActionId]
    );
  };

  const removeSubAction = (subActionId: string) => {
    setSelectedSubActions(prev => prev.filter(id => id !== subActionId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedRole || selectedModules.length === 0 || selectedActions.length === 0) {
      setError("Please select role, at least one module and one action");
      return;
    }

    try {
      // Use selected values or fall back to original values if nothing was selected
      const modulesToSubmit = selectedModules.length > 0 ? selectedModules : originalValues.modules;
      const actionsToSubmit = selectedActions.length > 0 ? selectedActions : originalValues.actions;
      const subActionsToSubmit = selectedSubActions.length > 0 ? selectedSubActions : originalValues.subActions;

console.log( subActionOptions);


      // Update mapping for each selected action
      const results = await Promise.all(
        actionsToSubmit.map((action) =>
          handleUpdateMapping(
            mapping.mapping_id,
            selectedRole,
            modulesToSubmit,
            action,
            subActionsToSubmit.filter((sub) =>
              getSubActionOptionsForModulesAndActions(
                modulesToSubmit,
                action,
                selectedRole || undefined
              ).some((s) => s.id === sub)
            )
          )
        )
      );

      if (results.every(Boolean)) {
        onClose();
      }
    } catch (error: any) {
      setError(error.message || "Failed to update mapping(s)");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl lg:max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Edit size={20} className="mr-2 text-indigo-600" />
              Edit Module Mapping
            </h2>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Role *
            </label>
            <select
              value={selectedRole || ""}
              onChange={(e) => setSelectedRole(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              disabled={isLoading}
              required
            >
              <option value="">Choose a role</option>
              {availableRoles.map((role) => (
                <option 
                  key={role.role_id} 
                  value={role.role_id}
                  selected={selectedRole === role.role_id}
                >
                  {role.role_name}
                </option>
              ))}
            </select>
          </div>

          {/* Module Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Module *
            </label>
            
            {/* Selected Module Chips */}
            {selectedModules.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedModules.map(moduleId => {
                  const module = moduleOptions.find(m => m.id === moduleId);
                  return (
                    <div key={moduleId} className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm">
                      {module?.label || moduleId}
                      <button
                        type="button"
                        onClick={() => removeModule()}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Module Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === "modules" ? null : "modules")}
                className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <span>Select module</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform ${openDropdown === "modules" ? "rotate-180" : ""}`}
                />
              </button>
              
              {openDropdown === "modules" && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-300 max-h-60 overflow-y-auto">
                  <div className="p-2 space-y-1">
                    {moduleOptions.map((module) => (
                      <button
                        key={module.id}
                        type="button"
                        onClick={() => handleModuleChange(module.id)}
                        className={`w-full text-left p-2 hover:bg-gray-50 rounded flex items-center ${
                          selectedModules.includes(module.id) ? 'bg-blue-50' : ''
                        }`}
                      >
                        <span className="text-sm text-gray-700">{module.label}</span>
                        {originalValues.modules.includes(module.id) && (
                          <span className="ml-2 text-xs text-green-600">(original)</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions Selection */}
          {selectedModules.length > 0 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Actions *
              </label>
              
              {/* Selected Action Chips */}
              {selectedActions.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedActions.map(actionId => {
                    const action = actionOptions.find(a => a.id === actionId);
                    return (
                      <div key={actionId} className="inline-flex items-center bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-sm">
                        {action?.label || actionId}
                        <button
                          type="button"
                          onClick={() => removeAction(actionId)}
                          className="ml-2 text-purple-600 hover:text-purple-800"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Actions Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === "actions" ? null : "actions")}
                  className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <span>Select actions</span>
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform ${openDropdown === "actions" ? "rotate-180" : ""}`}
                  />
                </button>
                
                {openDropdown === "actions" && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-300 max-h-60 overflow-y-auto">
                    <div className="p-2 space-y-1">
                      {actionOptions.length === 0 ? (
                        <p className="text-gray-500 text-sm p-2">No actions available</p>
                      ) : (
                        actionOptions.map((action) => (
                          <label key={action.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                            <input
                              type="checkbox"
                              checked={selectedActions.includes(action.id)}
                              onChange={() => toggleAction(action.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                            />
                            <span className="text-sm text-gray-700">
                              {action.label}
                              {originalValues.actions.includes(action.id) && (
                                <span className="ml-2 text-xs text-green-600">(original)</span>
                              )}
                            </span>
                          </label>
                        ))
                      )}
                    </div>
                    <div className="border-t border-gray-200 p-2 bg-gray-50">
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(null)}
                        className="w-full text-sm text-blue-600 hover:text-blue-800"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sub-Actions Selection */}
          {selectedActions.length > 0 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Sub-Actions (Optional)
              </label>
              
              {/* Selected Sub-Action Chips */}
              {selectedSubActions.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedSubActions.map(subActionId => {
                    const subAction = subActionOptions.find(s => s.id === subActionId);
                    return (
                      <div key={subActionId} className="inline-flex items-center bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm">
                        {subAction?.label || subActionId}
                        <button
                          type="button"
                          onClick={() => removeSubAction(subActionId)}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Sub-Actions Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === "subActions" ? null : "subActions")}
                  className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <span>Select sub-actions</span>
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform ${openDropdown === "subActions" ? "rotate-180" : ""}`}
                  />
                </button>
                
                {openDropdown === "subActions" && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-300 max-h-60 overflow-y-auto">
                    <div className="p-2 space-y-1">
                      {subActionOptions.length === 0 ? (
                        <p className="text-gray-500 text-sm p-2">No sub-actions available</p>
                      ) : (
                        subActionOptions.map((subAction) => (
                          <label key={subAction.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                            <input
                              type="checkbox"
                              checked={selectedSubActions.includes(subAction.id)}
                              onChange={() => toggleSubAction(subAction.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                            />
                            <span className="text-sm text-gray-700">
                              {subAction.label}
                              {originalValues.subActions.includes(subAction.id) && (
                                <span className="ml-2 text-xs text-green-600">(original)</span>
                              )}
                            </span>
                          </label>
                        ))
                      )}
                    </div>
                    <div className="border-t border-gray-200 p-2 bg-gray-50">
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(null)}
                        className="w-full text-sm text-blue-600 hover:text-blue-800"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Update Mapping
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SuperRoleManagement: React.FC = () => {
  const {
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
    getActionOptionsForModules,
    getSubActionOptionsForModulesAndActions,
    // superAdminPaginationParams,
    superAdminPaginationMeta,
    masterAdminPaginationMeta,
    MasterAdminRoleMappings,
    // updateSuperAdminPaginationParams,
    updateMasterAdminPaginationParams,
    // fetchSuperAdminRoleMappings
  } = useSuperAdminRoles();

  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMapping, setSelectedMapping] = useState<any>(null);

  
  const handleCreateRoleSuccess = () => {
    setMessage("");
    setShowMappingModal(true);
  };

  const handleEditMapping = (mapping: any) => {
    setSelectedMapping(mapping);
    setShowEditModal(true);
  };


  return (
    <div className="p-4 lg:p-6  mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Role Management
            </h1>
            <p className="text-gray-600">
              Manage roles and their module mappings
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowCreateRoleModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <Plus size={16} className="mr-2" />
              Create Role
            </button>
            <button
              onClick={() => setShowMappingModal(true)}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            >
              <Settings size={16} className="mr-2" />
              Module Mapping
            </button>
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-700 text-sm">{message}</p>
        </div>
      )}

      {/* Role Mappings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Shield size={20} className="mr-2 text-indigo-600" />
            Role Mappings ({superAdminPaginationMeta.total_items})
          </h2>
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading role mappings...</p>
          </div>
        ) : superAdminRoleMappings.length === 0 ? (
          <div className="p-12 text-center">
            <Shield size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg text-gray-600">No role mappings found</p>
            <p className="text-sm text-gray-500">
              Create your first role mapping to get started.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Module
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sub Actions
                    </th>
                  
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(
                    superAdminRoleMappings.reduce((acc, mapping) => {
                      const key = `${mapping.super_admin_role_id}-${mapping.module_name}`;
                      if (!acc[key]) {
                        acc[key] = {
                          super_admin_role_id: mapping.super_admin_role_id,
                          super_admin_role_name: mapping.super_admin_role_name,
                          module_name: mapping.module_name,
                          actions: [],
                          created_at: mapping.created_at,
                          mapping_id: mapping.mapping_id, // Keep for edit functionality
                        };
                      }

                      // Check if this action already exists
                      const existingAction = acc[key].actions.find(
                        (a: any) => a.action_name === mapping.action_name
                      );

                      if (existingAction) {
                        // Add sub-actions to existing action
                        mapping.sub_actions.forEach((subAction: any) => {
                          if (
                            !existingAction.sub_actions.some(
                              (s: any) =>
                                s.sub_action_name === subAction.sub_action_name
                            )
                          ) {
                            existingAction.sub_actions.push(subAction);
                          }
                        });
                      } else {
                        // Add new action
                        acc[key].actions.push({
                          action_name: mapping.action_name,
                          sub_actions: mapping.sub_actions || [],
                        });
                      }

                      return acc;
                    }, {} as Record<string, any>)
                  ).map(([key, groupedMapping]) => (
                    <tr key={key} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <User size={12} className="mr-1" />
                          {groupedMapping.super_admin_role_name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          <Building size={12} className="mr-1" />
                          {groupedMapping.module_name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8">
                            <option value="">
                              All Actions ({groupedMapping.actions.length})
                            </option>
                            {groupedMapping.actions.map(
                              (action: any, actionIndex: number) => (
                                <option
                                  key={actionIndex}
                                  value={action.action_name}
                                >
                                  {action.action_name}
                                </option>
                              )
                            )}
                          </select>
                          <ChevronDown
                            size={14}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8">
                            <option value="">Select Sub-Action</option>
                            {groupedMapping.actions.map(
                              (action: any, actionIndex: number) => [
                                <optgroup
                                  key={`${actionIndex}-group`}
                                  label={`${action.action_name} (${
                                    action.sub_actions?.length || 0
                                  })`}
                                  className="font-semibold"
                                >
                                  {action.sub_actions?.map(
                                    (subAction: any, subIndex: number) => (
                                      <option
                                        key={`${actionIndex}-${subIndex}`}
                                        value={subAction.sub_action_name}
                                        className="pl-4"
                                      >
                                        {subAction.sub_action_name}
                                      </option>
                                    )
                                  )}
                                </optgroup>,
                              ]
                            )}
                          </select>
                          <ChevronDown
                            size={14}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                          />
                        </div>
                      </td>
                     
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditMapping(groupedMapping)}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center"
                        >
                          <Edit size={14} className="mr-1" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

      
          </>
        )}
      </div>

      {/* Master Admin Role Mappings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Shield size={20} className="mr-2 text-indigo-600" />
            Master Role Mappings ({masterAdminPaginationMeta.total_items})
          </h2>
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading master role mappings...</p>
          </div>
        ) : MasterAdminRoleMappings.length === 0 ? (
          <div className="p-12 text-center">
            <Shield size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg text-gray-600">
              No master role mappings found
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Module
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sub-Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(
                    MasterAdminRoleMappings.slice(
                      (masterAdminPaginationMeta.page - 1) *
                        masterAdminPaginationMeta.limit,
                      masterAdminPaginationMeta.page *
                        masterAdminPaginationMeta.limit
                    ).reduce((acc, mapping) => {
                      const key = `${mapping.role_id}-${mapping.module_id}`;
                      if (!acc[key]) {
                        acc[key] = {
                          role_id: mapping.role_id,
                          role_name: mapping.role_name,
                          module_id: mapping.module_id,
                          module_name: mapping.module_name,
                          actions: mapping.module_data.actions || [],
                        };
                      } else {
                        // Merge actions if they're not already present
                        mapping.module_data.actions?.forEach(
                          (action: { action_id: any }) => {
                            if (
                              !acc[key].actions.some(
                                (a: { action_id: any }) =>
                                  a.action_id === action.action_id
                              )
                            ) {
                              acc[key].actions.push(action);
                            }
                          }
                        );
                      }
                      return acc;
                    }, {} as Record<string, any>)
                  ).map(([key, groupedMapping]) => {
                    // Get all unique actions for this grouped mapping
                    const actions = groupedMapping.actions || [];

                    return (
                      <tr key={key} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <User size={12} className="mr-1" />
                            {groupedMapping.role_name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            <Building size={12} className="mr-1" />
                            {groupedMapping.module_name}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative">
                            <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8">
                              <option value="">
                                All Actions ({actions.length})
                              </option>
                              {actions.map((action: any) => (
                                <option
                                  key={action.action_id}
                                  value={action.action_id}
                                >
                                  {action.action_name}
                                </option>
                              ))}
                            </select>
                            <ChevronDown
                              size={14}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative">
                            <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8">
                              <option value="">Select Sub-Action</option>
                              {actions.map((action: any) => [
                                <optgroup
                                  key={action.action_id}
                                  label={`${action.action_name} (${
                                    action.all_sub_actions?.length || 0
                                  })`}
                                  className="font-semibold"
                                >
                                  {action.all_sub_actions?.map(
                                    (subAction: any) => (
                                      <option
                                        key={subAction.sub_action_id}
                                        value={subAction.sub_action_id}
                                        className="pl-4"
                                      >
                                        {subAction.sub_action_name}
                                      </option>
                                    )
                                  )}
                                </optgroup>,
                              ])}
                            </select>
                            <ChevronDown
                              size={14}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination for Master Admin */}
            {masterAdminPaginationMeta.total_pages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing{" "}
                    {(masterAdminPaginationMeta.page - 1) *
                      masterAdminPaginationMeta.limit +
                      1}{" "}
                    to{" "}
                    {Math.min(
                      masterAdminPaginationMeta.page *
                        masterAdminPaginationMeta.limit,
                      masterAdminPaginationMeta.total_items
                    )}{" "}
                    of {masterAdminPaginationMeta.total_items} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        updateMasterAdminPaginationParams({
                          page: Math.max(1, masterAdminPaginationMeta.page - 1),
                        })
                      }
                      disabled={masterAdminPaginationMeta.page === 1}
                      className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <ChevronLeft size={14} className="mr-1" />
                      Previous
                    </button>

                    <div className="flex items-center space-x-1">
                      {Array.from(
                        { length: masterAdminPaginationMeta.total_pages },
                        (_, i) => i + 1
                      )
                        .slice(
                          Math.max(0, masterAdminPaginationMeta.page - 3),
                          Math.min(
                            masterAdminPaginationMeta.total_pages,
                            masterAdminPaginationMeta.page + 2
                          )
                        )
                        .map((page) => (
                          <button
                            key={page}
                            onClick={() =>
                              updateMasterAdminPaginationParams({ page })
                            }
                            className={`px-3 py-1 text-sm rounded-lg ${
                              page === masterAdminPaginationMeta.page
                                ? "bg-blue-600 text-white"
                                : "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                    </div>

                    <button
                      onClick={() =>
                        updateMasterAdminPaginationParams({
                          page: Math.min(
                            masterAdminPaginationMeta.total_pages,
                            masterAdminPaginationMeta.page + 1
                          ),
                        })
                      }
                      disabled={
                        masterAdminPaginationMeta.page ===
                        masterAdminPaginationMeta.total_pages
                      }
                      className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      Next
                      <ChevronRight size={14} className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <CreateRoleModal
        isOpen={showCreateRoleModal}
        onClose={() => setShowCreateRoleModal(false)}
        onSuccess={handleCreateRoleSuccess}
        handleCreateRole={handleCreateRole}
        isCreatingRole={isCreatingRole}
      />

      <ModuleMappingModal
        isOpen={showMappingModal}
        onClose={() => setShowMappingModal(false)}
        availableRoles={availableSuperAdminRoles}
        moduleOptions={moduleOptions}
        getActionOptionsForModules={getActionOptionsForModules}
        getSubActionOptionsForModulesAndActions={
          getSubActionOptionsForModulesAndActions
        }
        handleCreateMapping={handleCreateSuperAdminRoleMapping}
        isLoading={isLoading}
      />

      <EditMappingModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        mapping={selectedMapping}
        availableRoles={availableSuperAdminRoles}
        moduleOptions={moduleOptions}
        getActionOptionsForModules={getActionOptionsForModules}
        getSubActionOptionsForModulesAndActions={
          getSubActionOptionsForModulesAndActions
        }
        handleUpdateMapping={handleUpdateSuperAdminRoleMapping}
        isLoading={isLoading}
      />
    </div>
  );
};

export default SuperRoleManagement;








