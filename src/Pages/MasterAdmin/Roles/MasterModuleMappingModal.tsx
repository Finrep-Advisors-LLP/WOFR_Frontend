// import React, { useState, useMemo } from "react";
// import { X, Save, Settings, ChevronDown } from "lucide-react";


// interface MasterModuleMappingModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   availableRoles: any[];
//   moduleOptions: any[];
//   getActionOptionsForModules: (modules: string[]) => any[];
//   handleCreateMapping: (
//     roleId: number,
//     modules: string[],
//     actions: string[]
//   ) => Promise<boolean>;
//   isLoading: boolean;
//   existingMappings: Record<string, any[]>;
// }


// const MasterModuleMappingModal: React.FC<MasterModuleMappingModalProps> = ({
//   isOpen,
//   onClose,
//   availableRoles,
//   moduleOptions,
//   getActionOptionsForModules,
//   handleCreateMapping,
//   isLoading,
//   existingMappings,
// }) => {
//   const [selectedRole, setSelectedRole] = useState<number | null>(null);
//   const [selectedModules, setSelectedModules] = useState<string[]>([]);
//   const [selectedActions, setSelectedActions] = useState<string[]>([]);
//   const [error, setError] = useState<string>("");
//   const [openDropdown, setOpenDropdown] = useState<"modules" | "actions" | null>(null);


//   // Get available modules for selected role (exclude already fully mapped ones)
//   const availableModules = useMemo(() => {
//     if (!selectedRole) return moduleOptions;
   
//     const role = availableRoles.find(r => r.role_id === selectedRole);
//     if (!role) return moduleOptions;
   
//     const roleMapping = existingMappings[role.role_name] || [];
//     const mappedModules = [...new Set(roleMapping.map(m => m.module_name))];
   
//     // For each mapped module, check if all possible actions are assigned
//     const fullyMappedModules = new Set<string>();
   
//     mappedModules.forEach(moduleName => {
//       const allPossibleActions = getActionOptionsForModules([moduleName]);
//       const assignedActions = roleMapping
//         .filter(m => m.module_name === moduleName)
//         .map(m => m.action_name);
     
//       // If all possible actions are assigned, mark module as fully mapped
//       if (allPossibleActions.every(action => assignedActions.includes(action.id))) {
//         fullyMappedModules.add(moduleName);
//       }
//     });
   
//     return moduleOptions.filter(module => !fullyMappedModules.has(module.id));
//   }, [selectedRole, availableRoles, moduleOptions, existingMappings, getActionOptionsForModules]);


//   const actionOptions = useMemo(() => {
//     if (selectedModules.length === 0 || !selectedRole) return [];
   
//     const role = availableRoles.find(r => r.role_id === selectedRole);
//     if (!role) return [];
   
//     const roleMapping = existingMappings[role.role_name] || [];
//     const allActions = getActionOptionsForModules(selectedModules);
   
//     // Filter out already assigned actions for the selected modules
//     const assignedActions = roleMapping
//       .filter(m => selectedModules.includes(m.module_name))
//       .map(m => m.action_name);
   
//     return allActions.filter(action => !assignedActions.includes(action.id));
//   }, [selectedModules, selectedRole, availableRoles, existingMappings, getActionOptionsForModules]);


//   const toggleModule = (moduleId: string) => {
//     setSelectedModules(prev =>
//       prev.includes(moduleId)
//         ? prev.filter(id => id !== moduleId)
//         : [...prev, moduleId]
//     );
//     // Clear actions when modules change
//     setSelectedActions([]);
//   };


//   const toggleAction = (actionId: string) => {
//     setSelectedActions(prev =>
//       prev.includes(actionId)
//         ? prev.filter(id => id !== actionId)
//         : [...prev, actionId]
//     );
//   };


//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");


//     if (!selectedRole || selectedModules.length === 0 || selectedActions.length === 0) {
//       setError("Please select role, at least one module and one action");
//       return;
//     }


//     try {
//       const success = await handleCreateMapping(
//         selectedRole,
//         selectedModules,
//         selectedActions
//       );


//       if (success) {
//         resetForm();
//         onClose();
//       }
//     } catch (error: any) {
//       setError(error.message || "Failed to create mapping");
//     }
//   };


//   const resetForm = () => {
//     setSelectedRole(null);
//     setSelectedModules([]);
//     setSelectedActions([]);
//     setError("");
//     setOpenDropdown(null);
//   };


//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };


//   if (!isOpen) return null;


//   return (
//     <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl" style={{ height: '80vh' }}>
//         <div className="p-4 sm:p-6 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
//               <Settings size={20} className="mr-2 text-indigo-600" />
//               Master Module Mapping
//             </h2>
//             <button
//               onClick={handleClose}
//               className="text-gray-400 hover:text-gray-600 p-1"
//             >
//               <X size={20} />
//             </button>
//           </div>
//         </div>


//         <div className="flex flex-col h-full">
//           <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 flex-1 overflow-y-auto">
//             {error && (
//               <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
//                 <p className="text-red-700 text-sm">{error}</p>
//               </div>
//             )}


//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Select Role *
//               </label>
//               <select
//                 value={selectedRole || ""}
//                 onChange={(e) => {
//                   setSelectedRole(Number(e.target.value));
//                   setSelectedModules([]);
//                   setSelectedActions([]);
//                 }}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                 required
//               >
//                 <option value="">Choose a role</option>
//                 {availableRoles.map((role) => (
//                   <option key={role.role_id} value={role.role_id}>
//                     {role.role_name}
//                   </option>
//                 ))}
//               </select>
//             </div>


//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//               {/* Modules */}
//               <div className="relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Select Modules *
//                 </label>
//                 <button
//                   type="button"
//                   onClick={() => setOpenDropdown(openDropdown === "modules" ? null : "modules")}
//                   disabled={!selectedRole}
//                   className={`w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
//                     !selectedRole ? "bg-gray-100 cursor-not-allowed" : ""
//                   }`}
//                 >
//                   <span>
//                     {selectedModules.length > 0
//                       ? `${selectedModules.length} module(s) selected`
//                       : "Select modules"}
//                   </span>
//                   <ChevronDown
//                     size={16}
//                     className={`transition-transform ${openDropdown === "modules" ? "rotate-180" : ""}`}
//                   />
//                 </button>
               
//                 {openDropdown === "modules" && selectedRole && (
//                   <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-300 max-h-60 overflow-y-auto">
//                     <div className="p-2 space-y-1">
//                       {availableModules.length === 0 ? (
//                         <p className="text-gray-500 text-sm p-2">No modules available for mapping</p>
//                       ) : (
//                         availableModules.map((module) => (
//                           <label key={module.id} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
//                             <input
//                               type="checkbox"
//                               checked={selectedModules.includes(module.id)}
//                               onChange={() => toggleModule(module.id)}
//                               className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
//                             />
//                             <span className="text-sm text-gray-700">{module.label}</span>
//                           </label>
//                         ))
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>


//               {/* Actions */}
//               <div className="relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Select Actions *
//                 </label>
//                 <button
//                   type="button"
//                   onClick={() => selectedModules.length > 0 && setOpenDropdown(openDropdown === "actions" ? null : "actions")}
//                   disabled={selectedModules.length === 0}
//                   className={`w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
//                     selectedModules.length === 0 ? "bg-gray-100 cursor-not-allowed" : ""
//                   }`}
//                 >
//                   <span>
//                     {selectedActions.length > 0
//                       ? `${selectedActions.length} action(s) selected`
//                       : "Select actions"}
//                   </span>
//                   <ChevronDown
//                     size={16}
//                     className={`transition-transform ${openDropdown === "actions" ? "rotate-180" : ""}`}
//                   />
//                 </button>
               
//                 {openDropdown === "actions" && selectedModules.length > 0 && (
//                   <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-300 max-h-60 overflow-y-auto">
//                     <div className="p-2 space-y-1">
//                       {actionOptions.length === 0 ? (
//                         <p className="text-gray-500 text-sm p-2">No actions available for selected modules</p>
//                       ) : (
//                         actionOptions.map((action) => (
//                           <label key={action.id} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
//                             <input
//                               type="checkbox"
//                               checked={selectedActions.includes(action.id)}
//                               onChange={() => toggleAction(action.id)}
//                               className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
//                             />
//                             <span className="text-sm text-gray-700">{action.label}</span>
//                           </label>
//                         ))
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </form>


//           <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
//             <button
//               type="button"
//               onClick={handleClose}
//               className="w-full sm:w-auto px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               onClick={handleSubmit}
//               disabled={isLoading}
//               className="w-full sm:w-auto px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
//             >
//               {isLoading ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
//                   Creating...
//                 </>
//               ) : (
//                 <>
//                   <Save size={16} className="mr-2" />
//                   Create Mapping
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// export default MasterModuleMappingModal;


import React, { useState, useMemo, useEffect } from "react";
import { X, Save, Settings, ChevronDown, ChevronUp } from "lucide-react";

interface MasterModuleMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableRoles: any[];
  moduleOptions: any[];
  getActionOptionsForModules: (modules: string[]) => any[];
  handleCreateMapping: (
    roleId: number,
    modules: string[],
    actions: string[]
  ) => Promise<boolean>;
  isLoading: boolean;
  existingMappings: Record<string, any[]>;
}

const MasterModuleMappingModal: React.FC<MasterModuleMappingModalProps> = ({
  isOpen,
  onClose,
  availableRoles,
  moduleOptions,
  getActionOptionsForModules,
  handleCreateMapping,
  isLoading,
  existingMappings,
}) => {
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [showModules, setShowModules] = useState(false);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const filteredRoles = useMemo(() => {
    return availableRoles.filter((role) => {
      const roleMapping = existingMappings[role.role_name] || [];
      const mappedModules = [...new Set(roleMapping.map((m) => m.module_name))];
      const allMapped = mappedModules.every((moduleName) => {
        const allActions = getActionOptionsForModules([moduleName]);
        const assignedActions = roleMapping
          .filter((m) => m.module_name === moduleName)
          .map((m) => m.action_name);
        return allActions.every((action) => assignedActions.includes(action.id));
      });
      return !allMapped;
    });
  }, [availableRoles, existingMappings, getActionOptionsForModules]);

  const availableModules = useMemo(() => {
    if (!selectedRole) return moduleOptions;
    const role = availableRoles.find((r) => r.role_id === selectedRole);
    if (!role) return moduleOptions;

    const roleMapping = existingMappings[role.role_name] || [];
    const mappedModules = [...new Set(roleMapping.map((m) => m.module_name))];

    const fullyMappedModules = new Set<string>();
    mappedModules.forEach((moduleName) => {
      const allActions = getActionOptionsForModules([moduleName]);
      const assignedActions = roleMapping
        .filter((m) => m.module_name === moduleName)
        .map((m) => m.action_name);
      if (allActions.every((a) => assignedActions.includes(a.id))) {
        fullyMappedModules.add(moduleName);
      }
    });

    return moduleOptions.filter((m) => !fullyMappedModules.has(m.id));
  }, [selectedRole, availableRoles, moduleOptions, existingMappings, getActionOptionsForModules]);

  const actionOptions = useMemo(() => {
    if (!selectedModules.length || !selectedRole) return [];
    const role = availableRoles.find((r) => r.role_id === selectedRole);
    if (!role) return [];

    const roleMapping = existingMappings[role.role_name] || [];
    const allActions = getActionOptionsForModules(selectedModules);

    const assignedActions = roleMapping
      .filter((m) => selectedModules.includes(m.module_name))
      .map((m) => m.action_name);

    return allActions.filter((a) => !assignedActions.includes(a.id));
  }, [selectedModules, selectedRole, availableRoles, existingMappings, getActionOptionsForModules]);

  const toggleModule = (moduleId: string) => {
    setSelectedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
    setSelectedActions([]);
  };

  const toggleAction = (actionId: string) => {
    setSelectedActions((prev) =>
      prev.includes(actionId)
        ? prev.filter((id) => id !== actionId)
        : [...prev, actionId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!selectedRole || !selectedModules.length || !selectedActions.length) {
      setError("Please select a role, at least one module, and one action.");
      return;
    }
    try {
      const success = await handleCreateMapping(
        selectedRole,
        selectedModules,
        selectedActions
      );
      if (success) {
        resetForm();
        onClose();
      }
    } catch (error: any) {
      setError(error.message || "Failed to create mapping");
    }
  };

  const resetForm = () => {
    setSelectedRole(null);
    setSelectedModules([]);
    setSelectedActions([]);
    setShowModules(false);
    setShowActions(false);
    setError("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
            <Settings size={20} className="mr-2 text-indigo-600" />
            Master Module Mapping
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {error && (
            <div className="bg-red-100 text-red-700 text-sm p-3 rounded border border-red-300">
              {error}
            </div>
          )}

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Role *</label>
            <select
              value={selectedRole || ""}
              onChange={(e) => {
                setSelectedRole(Number(e.target.value));
                setSelectedModules([]);
                setSelectedActions([]);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose a role</option>
              {filteredRoles.map((role) => (
                <option key={role.role_id} value={role.role_id}>
                  {role.role_name}
                </option>
              ))}
            </select>
          </div>

          {/* Modules Selection */}
          <div>
            <div
              onClick={() => setShowModules(!showModules)}
              className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <span className="text-sm text-gray-700">
                {selectedModules.length
                  ? `${selectedModules.length} module(s) selected`
                  : "Select Modules *"}
              </span>
              {showModules ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {showModules && (
              <div className="mt-2 border border-gray-200 rounded-lg p-3 bg-white space-y-1">
                {availableModules.length === 0 ? (
                  <p className="text-sm text-gray-500">No modules available for mapping.</p>
                ) : (
                  availableModules.map((module) => (
                    <label
                      key={module.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedModules.includes(module.id)}
                        onChange={() => toggleModule(module.id)}
                        className="accent-blue-600"
                      />
                      <span className="text-sm text-gray-800">{module.label}</span>
                    </label>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Actions Selection */}
          <div>
            <div
              onClick={() => selectedModules.length && setShowActions(!showActions)}
              className={`flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg cursor-pointer ${
                selectedModules.length === 0 ? "bg-gray-100 text-gray-400" : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <span className="text-sm">
                {selectedActions.length
                  ? `${selectedActions.length} action(s) selected`
                  : "Select Actions *"}
              </span>
              {showActions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {showActions && (
              <div className="mt-2 border border-gray-200 rounded-lg p-3 bg-white space-y-1">
                {actionOptions.length === 0 ? (
                  <p className="text-sm text-gray-500">No actions available for selected modules.</p>
                ) : (
                  actionOptions.map((action) => (
                    <label
                      key={action.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedActions.includes(action.id)}
                        onChange={() => toggleAction(action.id)}
                        className="accent-blue-600"
                      />
                      <span className="text-sm text-gray-800">{action.label}</span>
                    </label>
                  ))
                )}
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 p-4 sm:p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto flex items-center justify-center"
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
  );
};

export default MasterModuleMappingModal;
