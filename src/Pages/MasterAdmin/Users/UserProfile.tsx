import React from "react";
import { useLocation } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Building2,
  Phone,
  Mail,
  Calendar,
  Shield,
  Users,
  Activity,
  CheckCircle,
  XCircle,
  Layers,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import axios from "../../../helper/axios";

interface UserData {
  id: string;
  user_id: string;
  username: string;
  email: string;
  created_at?: string;
  organization_name: string;
  phone_number: number;
}

interface SubAction {
  sub_action_id: number;
  sub_action_name: string;
}

interface Screen {
  user_role_assignment_id: number;
  screen_id: number;
  action_id: number;
  action_name: string;
  status: string;
  sub_actions?: SubAction[];
}

interface Role {
  role_id: number;
  role_name: string;
  status: string;
  screens: Screen[];
}

interface ModuleAssignment {
  user_id: string;
  tenant_id: string | null;
  tenant_name: string | null;
  module_id: number;
  module_name: string;
  assigned_by: number;
  assignment_date: string;
  roles: Role[];
}

interface LocationState {
  user: UserData;
  roles?: string[];
  modules?: string[];
}

interface ModuleSummary {
  moduleId: number;
  moduleName: string;
  totalRoles: number;
  rolesList: string[];
  totalActions: number;
  actionsList: string[];
  totalSubActions: number;
  subActionsList: string[];
  status: string;
}

const InfoCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-blue-500 rounded-lg">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-900 truncate">{value}</p>
      </div>
    </div>
  </div>
);

const HoverTooltip = ({
  children,
  items,
  maxVisible = 2,
}: {
  children: React.ReactNode;
  items: string[];
  maxVisible?: number;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  if (items.length <= maxVisible) {
    return <>{children}</>;
  }

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const tooltipWidth = 280;
    const tooltipHeight = Math.min(items.length * 25 + 60, 300);

    let x = rect.left + rect.width / 2 - tooltipWidth / 2;
    let y = rect.bottom + 8;

    if (x < 8) x = 8;
    if (x + tooltipWidth > window.innerWidth - 8) {
      x = window.innerWidth - tooltipWidth - 8;
    }

    if (y + tooltipHeight > window.innerHeight - 8) {
      y = rect.top - tooltipHeight - 8;
    }

    setTooltipPosition({ x, y });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <>
      <div className="relative">
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="cursor-help"
        >
          {children}
        </div>
      </div>

      {showTooltip && (
        <div
          ref={tooltipRef}
          className="fixed z-[9999] p-3 bg-gray-800 text-white text-xs rounded-lg shadow-xl border border-gray-600"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            width: "280px",
            maxHeight: "300px",
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="font-medium mb-2 text-gray-200">
            All items ({items.length}):
          </div>
          <div className="max-h-60 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700">
            {items.map((item, index) => (
              <div key={index} className="flex items-start gap-2 py-1">
                <span className="w-1 h-1 bg-white rounded-full mt-1.5 flex-shrink-0"></span>
                <span className="text-gray-100 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

const UserProfile = () => {
  const location = useLocation();
  const { user } = (location.state || {}) as LocationState;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moduleAssignments, setModuleAssignments] = useState<ModuleAssignment[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const { authState } = useAuth();
  const token = authState.token;

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        const response = await axios.get("api/v1/user/role-assignments", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const allAssignments = response.data.data.assignments;

        const userAssignments = allAssignments.filter(
          (assignment: ModuleAssignment) => assignment.user_id === user.user_id
        );

        setModuleAssignments(userAssignments || []);
      } catch (err) {
        console.error("Failed to fetch modules:", err);
        setError("Failed to fetch modules");
      } finally {
        setLoading(false);
      }
    };

    if (user?.user_id) fetchModules();
  }, [token, user?.user_id]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 max-w-md">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-700 font-semibold">User data not found</p>
          <p className="text-gray-600 text-sm mt-2">
            Please navigate from the User Management page.
          </p>
        </div>
      </div>
    );
  }

  const createdDate = new Date(
    user.created_at || Date.now()
  ).toLocaleDateString();

  // Process data for module summary table
  const moduleSummaryData = React.useMemo(() => {
    return moduleAssignments.map((moduleAssignment): ModuleSummary => {
      const { module_id, module_name, roles } = moduleAssignment;

      const uniqueRoles = [...new Set(roles.map((role) => role.role_name))];
      const allScreens = roles.flatMap((role) => role.screens);
      const uniqueActions = [...new Set(allScreens.map((screen) => screen.action_name))];
      const allSubActions = allScreens.flatMap((screen) =>
        (screen.sub_actions || []).map((sub) => sub.sub_action_name)
      );
      const uniqueSubActions = [...new Set(allSubActions)];
      const hasActiveRoles = roles.some((role) => role.status === "active");
      const status = hasActiveRoles ? "active" : "inactive";

      return {
        moduleId: module_id,
        moduleName: module_name,
        totalRoles: uniqueRoles.length,
        rolesList: uniqueRoles,
        totalActions: uniqueActions.length,
        actionsList: uniqueActions,
        totalSubActions: uniqueSubActions.length,
        subActionsList: uniqueSubActions,
        status,
      };
    });
  }, [moduleAssignments]);

  // Calculate overall statistics
  const overallStats = React.useMemo(() => {
    const totalModules = moduleSummaryData.length;
    const totalUniqueRoles = [
      ...new Set(moduleSummaryData.flatMap((m) => m.rolesList)),
    ].length;
    const totalUniqueActions = [
      ...new Set(moduleSummaryData.flatMap((m) => m.actionsList)),
    ].length;
    const totalUniqueSubActions = [
      ...new Set(moduleSummaryData.flatMap((m) => m.subActionsList)),
    ].length;

    return {
      totalModules,
      totalUniqueRoles,
      totalUniqueActions,
      totalUniqueSubActions,
    };
  }, [moduleSummaryData]);

  const toggleRowExpansion = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-4 bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900 mb-1">{user.username}</h1>
              <p className="text-sm text-gray-600">User ID: {user.user_id || user.id}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  {user.organization_name}
                </span>
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                  Joined {createdDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* User Info Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                Profile Details
              </h2>
              <div className="space-y-3">
                <InfoCard
                  icon={Building2}
                  label="Organization"
                  value={user.organization_name}
                />
                <InfoCard
                  icon={Phone}
                  label="Phone"
                  value={user.phone_number}
                />
                <InfoCard icon={Mail} label="Email" value={user.email} />
                <InfoCard icon={Calendar} label="Joined" value={createdDate} />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="xl:col-span-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-4 lg:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Module Permissions Summary
                    </h2>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Layers className="w-4 h-4" />
                      {overallStats.totalModules} Modules
                    </span>
                    
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-gray-600 mr-3"></div>
                    <span className="text-sm text-gray-600">Loading permissions...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <p className="text-red-500 font-medium">{error}</p>
                </div>
              ) : moduleSummaryData.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No modules assigned</p>
                </div>
              ) : (
                <div className="overflow-hidden">
                  {/* Desktop Table */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wide min-w-[150px]">
                            Module
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wide min-w-[120px]">
                            Roles
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wide min-w-[150px]">
                            Actions
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wide min-w-[150px]">
                            Sub-Actions
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wide min-w-[80px]">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {moduleSummaryData.map((module) => (
                          <tr
                            key={module.moduleId}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                <div>
                                  <span className="font-semibold text-gray-900 text-sm block">
                                    {module.moduleName}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    ID: {module.moduleId}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Users className="w-4 h-4 text-green-600 flex-shrink-0" />
                                  <span className="font-medium text-gray-700 text-sm">
                                    {module.totalRoles} Role{module.totalRoles !== 1 ? "s" : ""}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {module.rolesList
                                    .slice(0, 2)
                                    .map((role, i) => (
                                      <span
                                        key={i}
                                        className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium"
                                      >
                                        {role}
                                      </span>
                                    ))}
                                  {module.rolesList.length > 2 && (
                                    <HoverTooltip
                                      items={module.rolesList}
                                      maxVisible={2}
                                    >
                                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs cursor-help">
                                        +{module.rolesList.length - 2} more
                                      </span>
                                    </HoverTooltip>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Activity className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                  <span className="font-medium text-gray-700 text-sm">
                                    {module.totalActions} Action{module.totalActions !== 1 ? "s" : ""}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {module.actionsList
                                    .slice(0, 2)
                                    .map((action, i) => (
                                      <span
                                        key={i}
                                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                                      >
                                        {action}
                                      </span>
                                    ))}
                                  {module.actionsList.length > 2 && (
                                    <HoverTooltip
                                      items={module.actionsList}
                                      maxVisible={2}
                                    >
                                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs cursor-help">
                                        +{module.actionsList.length - 2} more
                                      </span>
                                    </HoverTooltip>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <CheckCircle className="w-4 h-4 text-gray-600 flex-shrink-0" />
                                  <span className="font-medium text-gray-700 text-sm">
                                    {module.totalSubActions} Sub-Action{module.totalSubActions !== 1 ? "s" : ""}
                                  </span>
                                </div>
                                {module.totalSubActions > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {module.subActionsList
                                      .slice(0, 2)
                                      .map((subAction, i) => (
                                        <span
                                          key={i}
                                          className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs"
                                        >
                                          {subAction}
                                        </span>
                                      ))}
                                    {module.subActionsList.length > 2 && (
                                      <HoverTooltip
                                        items={module.subActionsList}
                                        maxVisible={2}
                                      >
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs cursor-help">
                                          +{module.subActionsList.length - 2} more
                                        </span>
                                      </HoverTooltip>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-400">
                                    No sub-actions
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  module.status === "active"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {module.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="lg:hidden">
                    {moduleSummaryData.map((module, index) => (
                      <div
                        key={module.moduleId}
                        className="border-b border-gray-100 last:border-b-0"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Layers className="w-4 h-4 text-blue-600" />
                              <div>
                                <span className="font-semibold text-gray-900 text-sm">
                                  {module.moduleName}
                                </span>
                                <span className="text-xs text-gray-500 block">
                                  ID: {module.moduleId}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  module.status === "active"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {module.status}
                              </span>
                              <button
                                onClick={() => toggleRowExpansion(index)}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                              >
                                {expandedRows.has(index) ? (
                                  <ChevronDown className="w-4 h-4 text-gray-500" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-gray-500" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-green-50 p-2 rounded">
                              <div className="font-semibold text-green-800">
                                {module.totalRoles}
                              </div>
                              <div className="text-xs text-green-600">
                                Roles
                              </div>
                            </div>
                            <div className="bg-blue-50 p-2 rounded">
                              <div className="font-semibold text-blue-800">
                                {module.totalActions}
                              </div>
                              <div className="text-xs text-blue-600">
                                Actions
                              </div>
                            </div>
                            <div className="bg-gray-50 p-2 rounded">
                              <div className="font-semibold text-gray-800">
                                {module.totalSubActions}
                              </div>
                              <div className="text-xs text-gray-600">
                                Sub-Actions
                              </div>
                            </div>
                          </div>

                          {expandedRows.has(index) && (
                            <div className="mt-3 space-y-3 pt-3 border-t border-gray-100">
                              <div>
                                <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  Roles ({module.totalRoles})
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {module.rolesList.map((role, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                                    >
                                      {role}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                                  <Activity className="w-3 h-3" />
                                  Actions ({module.totalActions})
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {module.actionsList.map((action, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                                    >
                                      {action}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {module.totalSubActions > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Sub-Actions ({module.totalSubActions})
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {module.subActionsList.map(
                                      (subAction, i) => (
                                        <span
                                          key={i}
                                          className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs"
                                        >
                                          {subAction}
                                        </span>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;