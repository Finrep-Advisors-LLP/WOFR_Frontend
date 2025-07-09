import React, { useState, useEffect, useMemo } from "react";
import { X, Save, Edit, Trash2, ChevronDown, Plus } from "lucide-react";

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
  const [existingData, setExistingData] = useState<{
    modules: string[];
    actions: string[];
    subActions: { name: string; parentAction: string }[];
  }>({ modules: [], actions: [], subActions: [] });
  const [newSelections, setNewSelections] = useState<{
    modules: string[];
    actions: string[];
    subActions: { name: string; parentAction: string }[];
  }>({ modules: [], actions: [], subActions: [] });
  const [error, setError] = useState<string>("");
  const [openDropdown, setOpenDropdown] = useState<"modules" | "actions" | "subActions" | null>(null);

  useEffect(() => {
    if (mapping && isOpen) {
      setSelectedRole(mapping.super_admin_role_id);
     
      const modules = [mapping.module_name];
      const actions = mapping.actions?.map((action: any) => action.action_name) || [];
     

      
      // Store sub-actions with their parent action information
      const subActions = mapping.actions?.flatMap((action: any) =>
        action.sub_actions?.map((sub: any) => ({
          name: sub.sub_action_name,
          parentAction: action.action_name
        })) || []
      ) || [];
     



      console.log("Final Modules:", modules);
console.log("Final Actions:", actions);
console.log("Final Sub-Actions:", subActions);

      setExistingData({
        modules,
        actions,
        subActions
      });
      setNewSelections({ modules: [], actions: [], subActions: [] });
      setError("");
    }
  }, [mapping, isOpen]);

  // Get available actions (excluding already selected ones)
  const actionOptions = useMemo(() => {
    const allModules = [...existingData.modules, ...newSelections.modules];
    if (allModules.length === 0) return [];
   
    const allActions = getActionOptionsForModules(allModules);
    // Filter out actions that are already in existing data
    return allActions.filter(action => !existingData.actions.includes(action.id));
  }, [existingData.modules, newSelections.modules, existingData.actions, getActionOptionsForModules]);

  // Get available sub-actions (excluding already selected ones for the same parent action)
  const subActionOptions = useMemo(() => {
    const allModules = [...existingData.modules, ...newSelections.modules];
    const allActions = [...existingData.actions, ...newSelections.actions];
   
    if (allModules.length === 0 || allActions.length === 0) return [];

    const allSubActions: any[] = [];
   
    // Get sub-actions for each action
    allActions.forEach((action) => {
      const subs = getSubActionOptionsForModulesAndActions(
        allModules,
        action,
        selectedRole || undefined
      );
     
      // Filter out sub-actions that are already selected for this specific action
      const filteredSubs = subs.filter(sub => {
        const isAlreadySelected = existingData.subActions.some(
          existing => existing.name === sub.id && existing.parentAction === action
        );
        return !isAlreadySelected;
      });
     
      // Add parent action info to each sub-action with unique identifier
      const subsWithParent = filteredSubs.map(sub => ({
        ...sub,
        parentAction: action,
        uniqueId: `${sub.id}-${action}`, // Create unique identifier
        label: `${sub.label.split(' (')[0]} (${action})`
      }));
     
      allSubActions.push(...subsWithParent);
    });

    return allSubActions;
  }, [existingData.modules, existingData.actions, existingData.subActions, newSelections.modules, newSelections.actions, selectedRole, getSubActionOptionsForModulesAndActions]);


const removeExistingItem = (
  type: 'modules' | 'actions' | 'subActions',
  item: string | { name: string; parentAction: string }
) => {
  if (type === 'subActions' && typeof item === 'object') {
    setExistingData(prev => ({
      ...prev,
      subActions: prev.subActions.filter(
        s => !(s.name === item.name && s.parentAction === item.parentAction)
      )
    }));
  } else if (typeof item === 'string') {
    setExistingData(prev => {
      const updated = {
        ...prev,
        [type]: prev[type].filter((i: any) => i !== item),
      };

      if (type === 'actions') {
        // Remove related sub-actions from existingData and newSelections
        updated.subActions = prev.subActions.filter(s => s.parentAction !== item);

        setNewSelections(prevSel => ({
          ...prevSel,
          subActions: prevSel.subActions.filter(s => s.parentAction !== item),
        }));
      }

      return updated;
    });

    if (type === 'modules') {
      // Optional: You may want to also remove actions/sub-actions linked to this module
      // depending on your domain logic
    }
  }
};

  const addNewSelection = (type: 'modules' | 'actions', item: string) => {
    setNewSelections(prev => ({
      ...prev,
      [type]: prev[type].includes(item)
        ? prev[type].filter(i => i !== item)
        : [...prev[type], item]
    }));
  };


const addNewSubActionSelection = (subAction: { name: string; parentAction: string; uniqueId: string; id: string }) => {
  setNewSelections(prev => {
    const existingIndex = prev.subActions.findIndex(
      s => s.name === subAction.id && s.parentAction === subAction.parentAction
    );
    
    if (existingIndex !== -1) {
      // Remove if already selected
      return {
        ...prev,
        subActions: prev.subActions.filter((_, index) => index !== existingIndex)
      };
    } else {
      // Add new selection - use subAction.id instead of subAction.name
      return {
        ...prev,
        subActions: [...prev.subActions, { name: subAction.id, parentAction: subAction.parentAction }]
      };
    }
  });
};
  // const isSubActionSelected = (subAction: { name: string; parentAction: string }) => {
  //   return newSelections.subActions.some(
  //     s => s.name === subAction.name && s.parentAction === subAction.parentAction
  //   );
  // };
const isSubActionSelected = (subAction: { name: string; parentAction: string; id: string }) => {
  return newSelections.subActions.some(
    s => s.name === subAction.id && s.parentAction === subAction.parentAction
  );
};
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  const modules = [...existingData.modules, ...newSelections.modules];
  const actions = [...existingData.actions, ...newSelections.actions];
  const subActions = [...existingData.subActions, ...newSelections.subActions];

  if (!selectedRole || modules.length === 0 || actions.length === 0) {
    setError("Please select role, at least one module and one action");
    return;
  }

  try {
    const results = await Promise.all(
      actions.map(async (action) => {
        const subActionsForAction = subActions
          .filter((s) => s.parentAction === action)
          .map((s) => s.name);

        return handleUpdateMapping(
          mapping.mapping_id,
          selectedRole,
          modules,
          action,
          subActionsForAction
        );
      })
    );

    if (results.every(Boolean)) {
      onClose();
    } else {
      setError("Some mappings failed to update");
    }
  } catch (error: any) {
    console.error("Error updating mappings:", error);
    setError(error.message || "Failed to update mapping(s)");
  }
};

  const handleClose = () => {
    setError("");
    setNewSelections({ modules: [], actions: [], subActions: [] });
    setOpenDropdown(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
              <Edit size={20} className="mr-2 text-indigo-600" />
              Edit Module Mapping
            </h2>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50 p-1"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <option key={role.role_id} value={role.role_id}>
                  {role.role_name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Modules Section */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Modules *
              </label>
             
              {/* Existing Modules */}
              {existingData.modules.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Existing</p>
                  <div className="space-y-2">
                    {existingData.modules.map((module) => (
                      <div key={module} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <span className="text-sm text-blue-900 font-medium">{module}</span>
                        <button
                          type="button"
                          onClick={() => removeExistingItem('modules', module)}
                          className="text-red-600 hover:text-red-800 p-1 hover:bg-red-100 rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Module Selection */}
              <div className="space-y-2">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium flex items-center">
                  <Plus size={12} className="mr-1" />
                  Add New
                </p>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === "modules" ? null : "modules")}
                    className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-700">
                      {newSelections.modules.length > 0
                        ? `${newSelections.modules.length} selected`
                        : "Select modules"}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform text-gray-400 ${openDropdown === "modules" ? "rotate-180" : ""}`}
                    />
                  </button>
                 
                  {openDropdown === "modules" && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-300 max-h-60 overflow-y-auto">
                      <div className="p-2 space-y-1">
                        {moduleOptions.filter(m => !existingData.modules.includes(m.id)).map((module) => (
                          <label key={module.id} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newSelections.modules.includes(module.id)}
                              onChange={() => addNewSelection('modules', module.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                            />
                            <span className="text-sm text-gray-700">{module.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Actions *
              </label>
             
              {/* Existing Actions */}
              {existingData.actions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Existing</p>
                  <div className="space-y-2">
                    {existingData.actions.map((action) => (
                      <div key={action} className="flex items-center justify-between bg-purple-50 p-3 rounded-lg border border-purple-100">
                        <span className="text-sm text-purple-900 font-medium">{action}</span>
                        <button
                          type="button"
                          onClick={() => removeExistingItem('actions', action)}
                          className="text-red-600 hover:text-red-800 p-1 hover:bg-red-100 rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Action Selection */}
              <div className="space-y-2">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium flex items-center">
                  <Plus size={12} className="mr-1" />
                  Add New
                </p>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === "actions" ? null : "actions")}
                    className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-700">
                      {newSelections.actions.length > 0
                        ? `${newSelections.actions.length} selected`
                        : "Select actions"}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform text-gray-400 ${openDropdown === "actions" ? "rotate-180" : ""}`}
                    />
                  </button>
                 
                  {openDropdown === "actions" && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-300 max-h-60 overflow-y-auto">
                      <div className="p-2 space-y-1">
                        {actionOptions.map((action) => (
                          <label key={action.id} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newSelections.actions.includes(action.id)}
                              onChange={() => addNewSelection('actions', action.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                            />
                            <span className="text-sm text-gray-700">{action.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sub-Actions Section */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Sub-Actions (Optional)
              </label>
             
              {/* Existing Sub-Actions */}
              {existingData.subActions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Existing</p>
                  <div className="space-y-2">
                    {existingData.subActions.map((subAction, index) => (
                      <div key={`${subAction.name}-${subAction.parentAction}-${index}`} className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-100">
                        <div className="flex flex-col">
                          <span className="text-sm text-green-900 font-medium">{subAction.name}</span>
                          <span className="text-xs text-green-600">({subAction.parentAction})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExistingItem('subActions', subAction)}
                          className="text-red-600 hover:text-red-800 p-1 hover:bg-red-100 rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Sub-Action Selection */}
              <div className="space-y-2">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium flex items-center">
                  <Plus size={12} className="mr-1" />
                  Add New
                </p>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === "subActions" ? null : "subActions")}
                    className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-700">
                      {newSelections.subActions.length > 0
                        ? `${newSelections.subActions.length} selected`
                        : "Select sub-actions"}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform text-gray-400 ${openDropdown === "subActions" ? "rotate-180" : ""}`}
                    />
                  </button>
                 
                  {openDropdown === "subActions" && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-300 max-h-60 overflow-y-auto">
                      <div className="p-2 space-y-1">
                        {subActionOptions.map((subAction) => (
                          <label key={subAction.uniqueId} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isSubActionSelected(subAction)}
                              onChange={() => addNewSubActionSelection(subAction)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                            />
                            <span className="text-sm text-gray-700">{subAction.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center transition-colors"
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

export default EditMappingModal;