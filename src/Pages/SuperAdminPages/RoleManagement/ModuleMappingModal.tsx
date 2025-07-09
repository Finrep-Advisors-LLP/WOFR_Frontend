

import React, { useState, useMemo } from "react";
import { X, Save, Settings, ChevronDown } from "lucide-react";

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

  const actionOptions = useMemo(() => {
    return selectedModules.length > 0
      ? getActionOptionsForModules(selectedModules)
      : [];
  }, [selectedModules, getActionOptionsForModules]);

  const subActionOptions = useMemo(() => {
    if (selectedModules.length === 0 || selectedActions.length === 0) return [];

    const allSubActions: any[] = [];
    selectedActions.forEach((action) => {
      const subs = getSubActionOptionsForModulesAndActions(
        selectedModules,
        action,
        selectedRole || undefined
      );
      // Add unique identifier to prevent cross-action selection
      const subsWithUniqueId = subs.map(sub => ({
        ...sub,
        uniqueId: `${sub.id}-${action}`,
        displayLabel: `${sub.label.split(' (')[0]} (${action})`
      }));
      allSubActions.push(...subsWithUniqueId);
    });

    return allSubActions;
  }, [selectedModules, selectedActions, selectedRole, getSubActionOptionsForModulesAndActions]);

  const toggleModule = (moduleId: string) => {
    setSelectedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
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
    if (!selectedActions.includes(actionId)) {
      // Remove related sub-actions when action is deselected
      const relatedSubActions = getSubActionOptionsForModulesAndActions(
        selectedModules,
        actionId,
        selectedRole || undefined
      ).map((sub) => `${sub.id}-${actionId}`);
      setSelectedSubActions(prev =>
        prev.filter(id => !relatedSubActions.includes(id))
      );
    }
  };

  const toggleSubAction = (subActionUniqueId: string) => {
    setSelectedSubActions(prev =>
      prev.includes(subActionUniqueId)
        ? prev.filter(id => id !== subActionUniqueId)
        : [...prev, subActionUniqueId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedRole || selectedModules.length === 0 || selectedActions.length === 0) {
      setError("Please select role, at least one module and one action");
      return;
    }

    if (selectedSubActions.length === 0) {
      setError("Please select at least one sub-action");
      return;
    }

    try {
      // Convert unique IDs back to sub-action names
      const subActionNames = selectedSubActions.map(uniqueId => {
        const parts = uniqueId.split('-');
        return parts.slice(0, -1).join('-'); // Remove the last part (action name)
      });

      const results = await Promise.all(
        selectedActions.map((action) =>
          handleCreateMapping(
            selectedRole,
            selectedModules,
            action,
            subActionNames.filter((sub) =>
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

  const resetForm = () => {
    setSelectedRole(null);
    setSelectedModules([]);
    setSelectedActions([]);
    setSelectedSubActions([]);
    setError("");
    setOpenDropdown(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl" style={{ height: '80vh' }}>
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
              <Settings size={20} className="mr-2 text-indigo-600" />
              Module Mapping
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-col h-full">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 flex-1 overflow-y-auto">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Modules */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        <label key={module.id} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
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
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                          <label key={action.id} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
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
                  </div>
                )}
              </div>

              {/* Sub-Actions */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Sub-Actions *
                </label>
                <button
                  type="button"
                  onClick={() => selectedActions.length > 0 && setOpenDropdown(openDropdown === "subActions" ? null : "subActions")}
                  disabled={selectedActions.length === 0}
                  className={`w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                    selectedActions.length === 0 ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
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
                          <label key={subAction.uniqueId} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedSubActions.includes(subAction.uniqueId)}
                              onChange={() => toggleSubAction(subAction.uniqueId)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                            />
                            <span className="text-sm text-gray-700">{subAction.displayLabel}</span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full sm:w-auto px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
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
        </div>
      </div>
    </div>
  );
};

export default ModuleMappingModal;
