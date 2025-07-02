import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Building,
  Shield,
  Settings,
} from "lucide-react";
import axios from "../../../../helper/axios";
import { useAuth } from "../../../../context/AuthContext";
interface UserDetailProps {
  userId: string;
  onBack: () => void;
}

interface AssignedRole {
  tenant_user_role_mapping_id: number;
  tenant_user_id: string;
  tenant_user_name: string;
  tenant_id: string;
  tenant_name: string;
  assignment_date: string;
  updated_at: string;
  screen_data: {
    screen_id: number;
    role: {
      role_name: string;
    };
    module_action_pair: {
      module: {
        module_name: string;
      };
      action: {
        action_name: string;
      };
    };
  };
  sub_action: {
    sub_action_id: number;
    sub_action_name: string;
  };
}

interface GroupedAssignment {
  role_name: string;
  module_name: string;
  actions: {
    action_name: string;
    sub_actions: {
      sub_action_id: number;
      sub_action_name: string;
      screen_id: number;
      assignment_date: string;
      updated_at: string;
    }[];
  }[];
  assignment_date: string;
  updated_at: string;
}

interface UserInfo {
  name: string;
  email: string;
  tenant_user_id: string;
  tenant_name?: string;
  created_at?: string;
}

const UserDetail: React.FC<UserDetailProps> = ({ userId, onBack }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [, setAssignedRoles] = useState<AssignedRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupedAssignments, setGroupedAssignments] = useState<
    GroupedAssignment[]
  >([]);
  const { authState } = useAuth();
  const token = authState.token;

  // Configure axios defaults
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  axios.defaults.headers.common["accept"] = "application/json";

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user basic info (you might need to adjust this endpoint)
        const userResponse = await axios.get(`api/v1/tenant-user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        // Find the specific user from the response
        const usersData = userResponse.data?.data?.tenant_users || [];
        const currentUser = usersData.find(
          (user: any) => user.tenant_user_id === userId
        );

        if (currentUser) {
          setUserInfo(currentUser);
        }

        // Fetch assigned roles for this specific user
        const rolesResponse = await axios.get(
          `/api/v1/assigned-tenant-user-screen?page=1&limit=10000`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const allAssignments =
          rolesResponse.data.data.assigned_screen_to_tenant_user || [];
        // Filter assignments for this specific user
        const userAssignments = allAssignments.filter(
          (assignment: AssignedRole) => assignment.tenant_user_id === userId
        );

        // Group assignments by role and module
        const grouped = allAssignments
          .filter(
            (assignment: AssignedRole) => assignment.tenant_user_id === userId
          )
          .reduce((acc: any, assignment: AssignedRole) => {
            const key = `${assignment.screen_data.role.role_name}-${assignment.screen_data.module_action_pair.module.module_name}`;

            if (!acc[key]) {
              acc[key] = {
                role_name: assignment.screen_data.role.role_name,
                module_name:
                  assignment.screen_data.module_action_pair.module.module_name,
                actions: {},
                assignment_date: assignment.assignment_date,
                updated_at: assignment.updated_at,
              };
            }

            const actionName =
              assignment.screen_data.module_action_pair.action.action_name;
            if (!acc[key].actions[actionName]) {
              acc[key].actions[actionName] = {
                action_name: actionName,
                sub_actions: [],
              };
            }

            acc[key].actions[actionName].sub_actions.push({
              sub_action_id: assignment.sub_action.sub_action_id,
              sub_action_name: assignment.sub_action.sub_action_name,
              screen_id: assignment.screen_data.screen_id,
              assignment_date: assignment.assignment_date,
              updated_at: assignment.updated_at,
            });

            return acc;
          }, {});

        const groupedArray = Object.values(grouped).map((group: any) => ({
          ...group,
          actions: Object.values(group.actions),
        }));

        setGroupedAssignments(groupedArray);

        setAssignedRoles(userAssignments);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    if (token && userId) {
      fetchUserDetails();
    }
  }, [token, userId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600 mr-3"></div>
          <span className="text-lg">Loading user details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button
            onClick={onBack}
            className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            <ArrowLeft size={16} className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6  mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150 mb-4"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to User List
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User size={32} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {userInfo?.name || "Unknown User"}
                </h1>
                <p className="text-gray-600 flex items-center mt-1">
                  <Mail size={16} className="mr-2" />
                  {userInfo?.email}
                </p>
                <p className="text-gray-600 flex items-center mt-1">
                  <Building size={16} className="mr-2" />
                  User ID: {userId}
                </p>
                <p>
                  <span className="text-gray-600">Tenant:</span>
                  <span className="font-medium text-gray-900">
                    {" "}
                    {userInfo?.tenant_name || "N/A"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Assignments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Settings size={20} className="mr-2 text-indigo-600" />
            Detailed Role Assignments ({groupedAssignments.length})
          </h2>
        </div>

        {groupedAssignments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-gray-500">
              <Shield size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No role assignments found</p>
              <p className="text-sm">
                This user has not been assigned any roles yet.
              </p>
            </div>
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
                    Actions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sub Actions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {groupedAssignments.map((group, index) => (
                  <tr
                    key={`${group.role_name}-${group.module_name}-${index}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Shield size={12} className="mr-1" />
                        {group.role_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <Settings size={12} className="mr-1" />
                        {group.module_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">View Action</option>
                        {group.actions.map((action, actionIndex) => (
                          <option key={actionIndex} value={action.action_name}>
                            {action.action_name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">View Sub Action</option>
                        {group.actions.flatMap((action) =>
                          action.sub_actions.map((subAction, subIndex) => (
                            <option
                              key={`${action.action_name}-${subIndex}`}
                              value={subAction.sub_action_name}
                            >
                              {action.action_name} - {subAction.sub_action_name}
                            </option>
                          ))
                        )}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-2" />
                        {formatDate(group.assignment_date)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
