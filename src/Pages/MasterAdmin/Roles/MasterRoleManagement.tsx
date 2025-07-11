import React, { useState } from "react";
import {
  Plus,
  Shield,
  Settings,
  ChevronDown,
  User,
  Building,
  Search 
} from "lucide-react";
import toast from "react-hot-toast";
import { useRoleManagement } from "../../../hooks/useRoleManagement";
import CreateRoleForm from "./CreateRoleForm";
import Modal from "../../../component/common/ui/Modal";
import MasterModuleMappingModal from "./MasterModuleMappingModal";
import Toggle from "../../../component/common/ui/Toggle";
import TableHeader from "../../../component/common/ui/Table/TableHeader";

export const MasterRoleManagement: React.FC = () => {
  const {
    roles,
    // message,
    // setMessage,
    isCreatingRole,
    isLoading,
    handleCreateRole,
    groupedRoleMappings,
    moduleOptions,
    getActionOptionsForModules,
    toggleLoading,
    handleToggleChange,
    handleSaveMasterRoleMapping,
  } = useRoleManagement(false);
const [searchTerm, setSearchTerm] = useState("");
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [showMappingModal, setShowMappingModal] = useState(false);

  const handleCreateRoleSuccess = async (roleData: {
    role_name: string;
    description: string;
    status: string;
  }) => {
    try {
      await handleCreateRole(roleData);
      toast.success("Role created successfully!");
      setShowCreateRoleModal(false);
      setShowMappingModal(true);
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error("Failed to create role");
    }
  };
const filteredRoleMappings = Object.keys(groupedRoleMappings).reduce((acc, roleName) => {
  if (roleName.toLowerCase().includes(searchTerm.toLowerCase())) {
    acc[roleName] = groupedRoleMappings[roleName];
  }
  return acc;
}, {} as typeof groupedRoleMappings);
  // Get available roles for mapping (only active roles that exist)
  const availableRoles = roles.filter((role) => role.status === "active");

  return (
    <div className="p-4 lg:p-6 mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Master Role Management
            </h1>
            <p className="text-gray-600">
              Manage master roles and their module mappings
            </p>
          </div> */}
          <div className="flex items-center gap-4">
           
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
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
      {/* {message && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-700 text-sm">{message}</p>
        </div>
      )} */}

      {/* Role Mappings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Shield size={20} className="mr-2 text-indigo-600" />
            Master Role Mappings
          </h2>
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading role mappings...</p>
          </div>
        ) : Object.keys(filteredRoleMappings).length === 0 ? (
          // <div className="p-12 text-center">
          //   <Shield size={48} className="mx-auto mb-4 text-gray-300" />
          //   <p className="text-lg text-gray-600">No role mappings found</p>
          //   <p className="text-sm text-gray-500">
          //     Create your first role mapping to get started.
          //   </p>
          // </div>

             <div className="p-12 text-center">
            <Shield size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg text-gray-600">
              {searchTerm ? `No roles found matching "${searchTerm}"` : "No role mappings found"}
            </p>
            <p className="text-sm text-gray-500">
              {searchTerm ? "Try adjusting your search term." : "Create your first role mapping to get started."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
             
                <tr>
                  <TableHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </TableHeader>
                  <TableHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Module
                  </TableHeader>
                  <TableHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </TableHeader>
                  <TableHeader className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </TableHeader>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                 {Object.entries(
                  Object.keys(filteredRoleMappings).reduce((acc, roleName) => {
                    const mappings = filteredRoleMappings[roleName];

                    // Group by module within each role
                    mappings.forEach((mapping) => {
                      const key = `${roleName}-${mapping.module_name}`;
                      if (!acc[key]) {
                        acc[key] = {
                          role_name: roleName,
                          module_name: mapping.module_name,
                          actions: [],
                        };
                      }

                      if (
                        !acc[key].actions.some(
                          (a: any) => a === mapping.action_name
                        )
                      ) {
                        acc[key].actions.push(mapping.action_name);
                      }
                    });

                    return acc;
                  }, {} as Record<string, any>)
                ).map(([key, groupedMapping]) => {
                  const role = roles.find(
                    (r) => r.role_name === groupedMapping.role_name
                  );
                  const isToggling = toggleLoading === role?.role_id;

                  return (
                    <tr key={key} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <User size={12} className="mr-1" />
                            {groupedMapping.role_name}
                          </span>
                        </div>
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
                              (action: string, actionIndex: number) => (
                                <option key={actionIndex} value={action}>
                                  {action}
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
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="relative inline-block">
                          <Toggle
                            enabled={role?.status === "active"}
                            onChange={() =>
                              !isToggling && handleToggleChange(role?.role_id)
                            }
                          />

                          {isToggling && (
                            <div className="absolute inset-0 bg-white bg-opacity-40 rounded-full flex items-center justify-center cursor-not-allowed">
                              <div className="h-4 w-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal
        isOpen={showCreateRoleModal}
        onClose={() => setShowCreateRoleModal(false)}
        title="Create New Role"
      >
        <CreateRoleForm
          onSubmit={handleCreateRoleSuccess}
          onCancel={() => setShowCreateRoleModal(false)}
          isLoading={isCreatingRole}
          title="Create Master Role"
          submitButtonText="Create Role"
        />
      </Modal>

      <MasterModuleMappingModal
        isOpen={showMappingModal}
        onClose={() => setShowMappingModal(false)}
        availableRoles={availableRoles}
        moduleOptions={moduleOptions}
        getActionOptionsForModules={getActionOptionsForModules}
        handleCreateMapping={handleSaveMasterRoleMapping}
        isLoading={isLoading}
        existingMappings={groupedRoleMappings}
      />
    </div>
  );
};
