

// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   Plus, 
//   Save, 
//   AlertCircle,
//   CheckCircle,
//   Eye,
//   Loader2,
//   X
// } from 'lucide-react';
// import { MultiSelectDropdownRole } from '../../../component/common/ui/MultiSelectDropdownRole';
// import { useRoleManagement } from '../../../hooks/useRoleManagement';
// import CreateRoleForm from './CreateRoleForm';
// import Modal from '../../../component/common/ui/Modal';
// import Pagination from '../../../component/common/ui/Table/Pagination';
// import TableHeader from '../../../component/common/ui/Table/TableHeader';

// export const MasterRoleManagement: React.FC = () => {
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [selectedRoleDetails, setSelectedRoleDetails] = useState<{
//     role: any;
//     assignments: any;
//   } | null>(null);
//   const tableContainerRef = useRef<HTMLDivElement>(null);
  
//   const {
//     roles,
//     message,
//     setMessage,
//     isCreatingRole,
//     isLoading,
//     currentPage,
//     setCurrentPage,
//     itemsPerPage,
//     totalItems,
//     totalPages,
//     roleModules,
//     roleActions,
//     selectedRole,
//     toggleDropdown,
//     handleApply,
//     handleSaveSingleAssignment,
//     handleCreateRole,
//     groupedRoleMappings,
//     // moduleOptions,
//     // getActionOptionsForModules,
//     validateSingleRoleSelection,
//     getAvailableModules,
//     getAvailableActions,
//   } = useRoleManagement(false);

//   useEffect(() => {
//     if (message) {
//       const timer = setTimeout(() => setMessage(''), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [message, setMessage]);

//   // Close dropdown when clicking outside table
  

//   const getRoleAssignments = (roleName: string) => {
//     const assignments = groupedRoleMappings[roleName] || [];
//     const modules = [...new Set(assignments.map(a => a.module_name))];
//     const actions = [...new Set(assignments.map(a => a.action_name))];
    
//     return { modules, actions, count: assignments.length };
//   };

//   const handleViewDetails = (role: any) => {
//     const assignments = getRoleAssignments(role.role_name);
//     setSelectedRoleDetails({ role, assignments });
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   return (
//     <div className="bg-gray-50 p-4 lg:p-6">
//       <div className="mx-auto space-y-6">
//         {/* Header */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Master Role Management</h1>
//               <p className="text-sm text-gray-600 mt-1">Manage roles and their module/action assignments</p>
//             </div>
//             <button
//               onClick={() => setIsCreateModalOpen(true)}
//               className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
//             >
//               <Plus className="w-4 h-4" />
//               Create Role
//             </button>
//           </div>
//         </div>

//         {/* Message Alert */}
//         {message && (
//           <div className={`p-4 rounded-lg flex items-start gap-2 ${
//             message.includes('Success') || message.includes('successfully')
//               ? 'bg-green-50 border border-green-200'
//               : 'bg-red-50 border border-red-200'
//           }`}>
//             {message.includes('Success') || message.includes('successfully') ? (
//               <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
//             ) : (
//               <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
//             )}
//             <p className={`text-sm ${
//               message.includes('Success') || message.includes('successfully')
//                 ? 'text-green-700'
//                 : 'text-red-700'
//             }`}>
//               {message}
//             </p>
//           </div>
//         )}

//         {/* Table Container */}
//         <div
//           ref={tableContainerRef}
//           className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
//         >
//           {/* Loading State */}
//           {isLoading ? (
//             <div className="px-6 py-12 text-center">
//               <div className="flex items-center justify-center">
//                 <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
//                 <span className="text-sm text-gray-600">Loading roles...</span>
//               </div>
//             </div>
//           ) : (
//             <>
//               {/* Table with fixed positioning to prevent scroll conflicts */}
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50 sticky top-0 z-10">
//                     <tr>
//                       <TableHeader className="text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
//                         #
//                       </TableHeader>
//                       <TableHeader className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
//                         Role Details
//                       </TableHeader>
//                       <TableHeader className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
//                         Current Assignments
//                       </TableHeader>
//                       <TableHeader className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
//                         Module Assignment
//                       </TableHeader>
//                       <TableHeader className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
//                         Action Assignment
//                       </TableHeader>
//                       <TableHeader className="text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
//                         Actions
//                       </TableHeader>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {roles.map((role, index) => {
//                       const assignments = getRoleAssignments(role.role_name);
//                       const selectedModules = roleModules[role.role_id] || [];
//                       const selectedActions = roleActions[role.role_id] || [];
//                       const availableModules = getAvailableModules(role.role_id);
//                       const availableActions = getAvailableActions(role.role_id);
//                       const canSave = validateSingleRoleSelection(role.role_id);
//                       const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

//                       return (
//                         <tr
//                           key={role.role_id}
//                           className="hover:bg-gray-50 transition-colors duration-150"
//                         >
//                           <td className="px-4 py-4 text-center text-sm font-medium text-gray-900">
//                             {indexOfFirstItem + index + 1}
//                           </td>
//                           <td className="px-6 py-4">
//                             <div>
//                               <div className="text-sm font-medium text-gray-900">{role.role_name}</div>
//                               <div className="text-sm text-gray-500 mt-1 truncate max-w-xs">
//                                 {role.description}
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4">
//                             <div className="space-y-1">
//                               <div className="text-sm text-gray-700">
//                                 <span className="inline-flex items-center justify-center min-w-[20px] h-5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-full px-1.5 mr-2 shadow-sm">
//                                   {assignments.modules.length}
//                                 </span>
//                                 Modules
//                               </div>
//                               <div className="text-sm text-gray-700">
//                                 <span className="inline-flex items-center justify-center min-w-[20px] h-5 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-semibold rounded-full px-1.5 mr-2 shadow-sm">
//                                   {assignments.actions.length}
//                                 </span>
//                                 Actions
//                               </div>
//                               {assignments.count > 0 && (
//                                 <button
//                                   onClick={() => handleViewDetails(role)}
//                                   className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"
//                                 >
//                                   <Eye className="w-3 h-3" />
//                                   View Details
//                                 </button>
//                               )}
//                             </div>
//                           </td>
//                           <td className="px-6 py-4">
//                             <div className="w-48">
//                               <MultiSelectDropdownRole
//                                 options={availableModules}
//                                 selectedValues={selectedModules}
//                                 onSelectionChange={(selected) => {
//                                   handleApply(role.role_id, selected, 'module');
//                                 }}
//                                 placeholder={availableModules.length > 0 ? "Select modules" : "No modules available"}
//                                 isOpen={selectedRole?.id === role.role_id && selectedRole?.type === 'module'}
//                                 onToggle={() => toggleDropdown(role.role_id, 'module')}
//                                 disabled={availableModules.length === 0}
//                               />
//                             </div>
//                           </td>
//                           <td className="px-6 py-4">
//                             <div className="w-48">
//                               <MultiSelectDropdownRole
//                                 options={availableActions}
//                                 selectedValues={selectedActions}
//                                 onSelectionChange={(selected) => {
//                                   handleApply(role.role_id, selected, 'action');
//                                 }}
//                                 placeholder={selectedModules.length === 0 ? "Select modules first" : availableActions.length > 0 ? "Select actions" : "No actions available"}
//                                 isOpen={selectedRole?.id === role.role_id && selectedRole?.type === 'action'}
//                                 onToggle={() => toggleDropdown(role.role_id, 'action')}
//                                 disabled={selectedModules.length === 0 || availableActions.length === 0}
//                               />
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 text-center">
//                             <button
//                               onClick={() => handleSaveSingleAssignment(role.role_id)}
//                               disabled={!canSave}
//                               className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
//                                 canSave
//                                   ? 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
//                                   : 'bg-gray-200 text-gray-500 cursor-not-allowed'
//                               }`}
//                             >
//                               <Save className="w-3 h-3" />
//                               Save
//                             </button>
//                           </td>
//                         </tr>
//                       );
//                     })}

//                     {roles.length === 0 && (
//                       <tr>
//                         <td colSpan={6} className="px-6 py-12 text-center">
//                           <div className="text-gray-500">
//                             <span className="text-sm">No roles found</span>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <Pagination
//                   currentPage={currentPage}
//                   totalPages={totalPages}
//                   totalItems={totalItems}
//                   itemsPerPage={itemsPerPage}
//                   onPageChange={handlePageChange}
//                 />
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       {/* Create Role Modal */}
//       <Modal
//         isOpen={isCreateModalOpen}
//         onClose={() => setIsCreateModalOpen(false)}
//         title="Create New Role"
//       >
//         <CreateRoleForm
//           onSubmit={handleCreateRole} 
//           onCancel={() => setIsCreateModalOpen(false)}
//           isLoading={isCreatingRole}
//           title="Create Master Role"
//           submitButtonText="Create Role"
//         />
//       </Modal>

//       {/* Role Details Popup */}
//       {selectedRoleDetails && (
//         <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-[10000] p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
//             {/* Header */}
//             <div className="flex items-center justify-between p-4 border-b border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 Role Details
//               </h3>
//               <button
//                 onClick={() => setSelectedRoleDetails(null)}
//                 className="text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Content */}
//             <div className="p-4 overflow-y-auto">
//               <div className="space-y-4">
//                 {/* Role Info */}
//                 <div>
//                   <h4 className="font-medium text-gray-900 mb-2">
//                     {selectedRoleDetails.role.role_name}
//                   </h4>
//                 </div>

//                 {/* Assignments */}
//                 {selectedRoleDetails.assignments.count > 0 ? (
//                   <div className="space-y-4">
//                     {/* Modules */}
//                     {selectedRoleDetails.assignments.modules.length > 0 && (
//                       <div>
//                         <h5 className="text-sm font-medium text-gray-700 mb-2">
//                           Modules ({selectedRoleDetails.assignments.modules.length})
//                         </h5>
//                         <div className="space-y-1">
//                           {selectedRoleDetails.assignments.modules.map((module: string) => (
//                             <div key={module} className="text-sm bg-blue-50 px-2 py-1 rounded text-blue-800">
//                               {module}
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* Actions */}
//                     {selectedRoleDetails.assignments.actions.length > 0 && (
//                       <div>
//                         <h5 className="text-sm font-medium text-gray-700 mb-2">
//                           Actions ({selectedRoleDetails.assignments.actions.length})
//                         </h5>
//                         <div className="space-y-1">
//                           {selectedRoleDetails.assignments.actions.map((action: string) => (
//                             <div key={action} className="text-sm bg-green-50 px-2 py-1 rounded text-green-800">
//                               {action}
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="text-center py-4">
//                     <p className="text-sm text-gray-500">No assignments found for this role</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
//               <button
//                 onClick={() => setSelectedRoleDetails(null)}
//                 className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Save,
  AlertCircle,
  CheckCircle,
  Eye,
  Loader2,
  X,
} from "lucide-react";
import { MultiSelectDropdownRole } from "../../../component/common/ui/MultiSelectDropdownRole";
import { useRoleManagement } from "../../../hooks/useRoleManagement";
import CreateRoleForm from "./CreateRoleForm";
import Modal from "../../../component/common/ui/Modal";
import Pagination from "../../../component/common/ui/Table/Pagination";
import TableHeader from "../../../component/common/ui/Table/TableHeader";
import Toggle from "../../../component/common/ui/Toggle";

export const MasterRoleManagement: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRoleDetails, setSelectedRoleDetails] = useState<{
    role: any;
    assignments: any;
  } | null>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  

  const {
    roles,
    message,
    setMessage,
    isCreatingRole,
    isLoading,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    roleModules,
    roleActions,
    selectedRole,
    toggleDropdown,
    handleApply,
    handleSaveSingleAssignment,
    handleCreateRole,
    groupedRoleMappings,
    moduleOptions,
    getActionOptionsForModules,
    validateSingleRoleSelection,
    getAvailableModules,
    getAvailableActions,
    handleToggleChange,
    toggleLoading
    
  } = useRoleManagement(false);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message, setMessage]);

  // Close dropdown when clicking outside table

  const getRoleAssignments = (roleName: string) => {
    const assignments = groupedRoleMappings[roleName] || [];
    const modules = [...new Set(assignments.map((a) => a.module_name))];
    const actions = [...new Set(assignments.map((a) => a.action_name))];

    return { modules, actions, count: assignments.length };
  };

  const handleViewDetails = (role: any) => {
    const assignments = getRoleAssignments(role.role_name);
    setSelectedRoleDetails({ role, assignments });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-gray-50 p-4 lg:p-6">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Master Role Management
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage roles and their module/action assignments
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Create Role
            </button>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`p-4 rounded-lg flex items-start gap-2 ${
              message.includes("Success") || message.includes("successfully")
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            {message.includes("Success") || message.includes("successfully") ? (
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            )}
            <p
              className={`text-sm ${
                message.includes("Success") || message.includes("successfully")
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              {message}
            </p>
          </div>
        )}

        {/* Table Container */}
        <div
          ref={tableContainerRef}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Loading State */}
          {isLoading ? (
            <div className="px-6 py-12 text-center">
              <div className="flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
                <span className="text-sm text-gray-600">Loading roles...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Table with fixed positioning to prevent scroll conflicts */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <TableHeader className="text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        #
                      </TableHeader>
                      <TableHeader className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Role Details
                      </TableHeader>
                      
                      <TableHeader className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Module 
                      </TableHeader>
                      <TableHeader className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Module-Action 
                      </TableHeader>
                      <TableHeader className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Current 
                      </TableHeader>
                      <TableHeader className="text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Actions
                      </TableHeader>
                      <TableHeader className="text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        Status
                      </TableHeader>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {roles.map((role, index) => {
                      const assignments = getRoleAssignments(role.role_name);
                      const selectedModules = roleModules[role.role_id] || [];
                      const selectedActions = roleActions[role.role_id] || [];
                      const availableModules = getAvailableModules(
                        role.role_id
                      );
                      const availableActions = getAvailableActions(
                        role.role_id
                      );
                      const canSave = validateSingleRoleSelection(role.role_id);
                      const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
                      const isCurrentModuleToggling = toggleLoading == role.role_id;

                      return (
                        <tr
                          key={role.role_id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-4 py-4 text-center text-sm font-medium text-gray-900">
                            {indexOfFirstItem + index + 1}
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {role.role_name}
                              </div>
                              <div className="text-sm text-gray-500 mt-1 truncate max-w-xs">
                                {role.description}
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="w-48">
                              <MultiSelectDropdownRole
                                options={availableModules}
                                selectedValues={selectedModules}
                                onSelectionChange={(selected) => {
                                  console.log("abc", availableModules);
                                  handleApply(role.role_id, selected, "module");
                                  // handleSaveSingleAssignment(role.role_id); // 🔥 This is crucial
                                }}
                                placeholder={
                                  availableModules.length > 0
                                    ? "Select modules"
                                    : "No modules available"
                                }
                                isOpen={
                                  selectedRole?.id === role.role_id &&
                                  selectedRole?.type === "module"
                                }
                                onToggle={() =>
                                  toggleDropdown(role.role_id, "module")
                                }
                                disabled={availableModules.length === 0}
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="w-48">
                              <MultiSelectDropdownRole
                                options={availableActions}
                                selectedValues={selectedActions}
                                onSelectionChange={(selected) => {
                                  handleApply(role.role_id, selected, "action");
                                  // handleSaveSingleAssignment(role.role_id); // 🔥 This is crucial
                                }}
                                placeholder={
                                  selectedModules.length === 0
                                    ? "Select modules first"
                                    : availableActions.length > 0
                                    ? "Select actions"
                                    : "No actions available"
                                }
                                isOpen={
                                  selectedRole?.id === role.role_id &&
                                  selectedRole?.type === "action"
                                }
                                onToggle={() =>
                                  toggleDropdown(role.role_id, "action")
                                }
                                disabled={
                                  selectedModules.length === 0 ||
                                  availableActions.length === 0
                                }
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              
                              {assignments.count > 0 && (
                                <button
                                  onClick={() => handleViewDetails(role)}
                                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"
                                >
                                  <Eye className="w-3 h-3" />
                                  View Details
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() =>
                                handleSaveSingleAssignment(role.role_id)
                              }
                              disabled={!canSave}
                              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                canSave
                                  ? "bg-green-600 text-white hover:bg-green-700 shadow-sm"
                                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
                              }`}
                            >
                              <Save className="w-3 h-3" />
                              Save
                            </button>
                          </td>
                          
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                            <div className="relative inline-block">
                              <Toggle
                                enabled={role.enabled}
                                onChange={() =>
                                  !isCurrentModuleToggling &&
                                  handleToggleChange(role.role_id)
                                }
                              />

                              {isCurrentModuleToggling && (
                                <div className="absolute inset-0 bg-white bg-opacity-40 rounded-full flex items-center justify-center cursor-not-allowed">
                                  <div className="h-4 w-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {roles.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="text-gray-500">
                            <span className="text-sm">No roles found</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Create Role Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Role"
      >
        <CreateRoleForm
          onSubmit={handleCreateRole}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={isCreatingRole}
          title="Create Master Role"
          submitButtonText="Create Role"
        />
      </Modal>

      {/* Role Details Popup */}
      {selectedRoleDetails && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-[10000] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Role Details
              </h3>
              <button
                onClick={() => setSelectedRoleDetails(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto">
              <div className="space-y-4">
                {/* Role Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {selectedRoleDetails.role.role_name}
                  </h4>
                </div>

                {/* Assignments */}
                {selectedRoleDetails.assignments.count > 0 ? (
                  <div className="space-y-4">
                    {/* Modules */}
                    {selectedRoleDetails.assignments.modules.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">
                          Modules (
                          {selectedRoleDetails.assignments.modules.length})
                        </h5>
                        <div className="space-y-1">
                          {selectedRoleDetails.assignments.modules.map(
                            (module: string) => (
                              <div
                                key={module}
                                className="text-sm bg-blue-50 px-2 py-1 rounded text-blue-800"
                              >
                                {module}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {selectedRoleDetails.assignments.actions.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">
                          Actions (
                          {selectedRoleDetails.assignments.actions.length})
                        </h5>
                        <div className="space-y-1">
                          {selectedRoleDetails.assignments.actions.map(
                            (action: string) => (
                              <div
                                key={action}
                                className="text-sm bg-green-50 px-2 py-1 rounded text-green-800"
                              >
                                {action}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">
                      No assignments found for this role
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => setSelectedRoleDetails(null)}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
