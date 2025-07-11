


import React, { useState } from "react";
import {
  Plus,
  Edit,
  Shield,
  Settings,
  ChevronDown,
  User,
  ChevronLeft,
  ChevronRight,
  Building,
} from "lucide-react";

import {useSuperAdminRoles} from "../../../hooks/useSuperAdminRoles"
import EditMappingModal from "./EditMappingModal";
import CreateRoleModal from "./CreateRoleModal";
import ModuleMappingModal from "./ModuleMappingModal";

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
    superAdminPaginationMeta,
    masterAdminPaginationMeta,
    MasterAdminRoleMappings,
    updateMasterAdminPaginationParams,
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
    <div className="p-4 lg:p-6 mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-end justify-end gap-4">
          {/* <div>
            <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
            <p className="text-gray-600">Manage roles and their module mappings</p>
          </div> */}
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
                        mapping_id: mapping.mapping_id,
                      };
                    }

                    const existingAction = acc[key].actions.find(
                      (a: any) => a.action_name === mapping.action_name
                    );

                    if (existingAction) {
                      mapping.sub_actions.forEach((subAction: any) => {
                        if (
                          !existingAction.sub_actions.some(
                            (s: any) => s.sub_action_name === subAction.sub_action_name
                          )
                        ) {
                          existingAction.sub_actions.push(subAction);
                        }
                      });
                    } else {
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
                          {groupedMapping.actions.map((action: any, actionIndex: number) => (
                            <option key={actionIndex} value={action.action_name}>
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
                          {groupedMapping.actions.map((action: any, actionIndex: number) => [
                            <optgroup
                              key={`${actionIndex}-group`}
                              label={`${action.action_name} (${action.sub_actions?.length || 0})`}
                              className="font-semibold"
                            >
                              {action.sub_actions?.map((subAction: any, subIndex: number) => (
                                <option
                                  key={`${actionIndex}-${subIndex}`}
                                  value={subAction.sub_action_name}
                                  className="pl-4"
                                >
                                  {subAction.sub_action_name}
                                </option>
                              ))}
                            </optgroup>,
                          ])}
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
            <p className="text-lg text-gray-600">No master role mappings found</p>
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
                      (masterAdminPaginationMeta.page - 1) * masterAdminPaginationMeta.limit,
                      masterAdminPaginationMeta.page * masterAdminPaginationMeta.limit
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
                        mapping.module_data.actions?.forEach((action: { action_id: any }) => {
                          if (!acc[key].actions.some((a: { action_id: any }) => a.action_id === action.action_id)) {
                            acc[key].actions.push(action);
                          }
                        });
                      }
                      return acc;
                    }, {} as Record<string, any>)
                  ).map(([key, groupedMapping]) => {
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
                              <option value="">All Actions ({actions.length})</option>
                              {actions.map((action: any) => (
                                <option key={action.action_id} value={action.action_id}>
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
                                  label={`${action.action_name} (${action.all_sub_actions?.length || 0})`}
                                  className="font-semibold"
                                >
                                  {action.all_sub_actions?.map((subAction: any) => (
                                    <option
                                      key={subAction.sub_action_id}
                                      value={subAction.sub_action_id}
                                      className="pl-4"
                                    >
                                      {subAction.sub_action_name}
                                    </option>
                                  ))}
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
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                  <div className="text-sm text-gray-700">
                    Showing{" "}
                    {(masterAdminPaginationMeta.page - 1) * masterAdminPaginationMeta.limit + 1} to{" "}
                    {Math.min(
                      masterAdminPaginationMeta.page * masterAdminPaginationMeta.limit,
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
                      {Array.from({ length: masterAdminPaginationMeta.total_pages }, (_, i) => i + 1)
                        .slice(
                          Math.max(0, masterAdminPaginationMeta.page - 3),
                          Math.min(masterAdminPaginationMeta.total_pages, masterAdminPaginationMeta.page + 2)
                        )
                        .map((page) => (
                          <button
                            key={page}
                            onClick={() => updateMasterAdminPaginationParams({ page })}
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
                      disabled={masterAdminPaginationMeta.page === masterAdminPaginationMeta.total_pages}
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

      {/* Modals */}
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
        getSubActionOptionsForModulesAndActions={getSubActionOptionsForModulesAndActions}
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
        getSubActionOptionsForModulesAndActions={getSubActionOptionsForModulesAndActions}
        handleUpdateMapping={handleUpdateSuperAdminRoleMapping}
        isLoading={isLoading}
      />
    </div>
  );
};

export default SuperRoleManagement;