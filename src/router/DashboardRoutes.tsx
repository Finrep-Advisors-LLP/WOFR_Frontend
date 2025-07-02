import DashboardOverview from "../Pages/Sidebar/DashboardOverview";
import {
  BarChart3,
  BookKey,
  FileText,
  Hotel,
  IdCard,
  IndianRupee,
  KeyRound,
  LaptopMinimalCheck,
  LayoutDashboard,
  PackageOpen,
  ReceiptIndianRupee,
  ClipboardList,
  Settings,
  University,
  UserCog,
  UserRoundCog,
  Users,
} from "lucide-react";

import { JSX } from "react";
import FinanceOverviewPage from "../Pages/Sidebar/FinanceOverviewPage";
import OrganizationManager from "../Pages/SuperAdminPages/Organzation/OrganizationManager";
import LeaseManagement from "../Pages/LeaseMangement/LeaseDashbaord";
import UserListPage from "../Pages/MasterAdmin/Users/UserListPage";
import ModulesPage from "../Pages/SuperAdminPages/Module/ModulesPage";
import EntityMaster from "../Pages/LeaseMangement/Masters/EntityMaster";
import LessorMaster from "../Pages/LeaseMangement/Masters/LessorMaster";
import GlMaster from "../Pages/LeaseMangement/Masters/GlMaster";
import AssetMaster from "../Pages/LeaseMangement/Masters/AssetMaster";
import SuperRoleManagement from "../Pages/SuperAdminPages/RoleManagement/SuperRoleManagement";
import DepartmentMaster from "../Pages/LeaseMangement/Masters/DepartmentMaster";
import Currency from "../Pages/LeaseMangement/Masters/Currency";
import CheckerDashboard from "../Pages/LeaseMangement/Checker/CheckerDashboard";
import MasterModulesPage from "../Pages/MasterAdmin/Modules/MasterModulesPage";
import { MasterRoleManagement } from "../Pages/MasterAdmin/Roles/MasterRoleManagement";

export interface RouteChild {
  name: string;
  path: string;
  icon: JSX.Element;
  element?: JSX.Element;
  allowedRoles: string[];
  children?: RouteChild[];
}

export interface RouteItem {
  name: string;
  path: string;
  icon: JSX.Element;
  element?: JSX.Element;
  allowedRoles: string[];
  children?: RouteChild[];
}

export const DashboardRoutes: RouteItem[] = [
  {
    name: "Dashboard",
    path: "overview",
    icon: <LayoutDashboard size={20} />,
    element: <DashboardOverview />,
    allowedRoles: ["dev", "master_admin", "super_admin", 'tenant_user'],
  },
   {
    name: "Module Manager",
    path: "module-dashboard",
    icon: <ClipboardList size={20} />,
    allowedRoles: ["dev", "super_admin"],
    children: [
      {
        name: "Lease Management",
        path: "lease",
        icon: <ReceiptIndianRupee size={20} />,
        element: <LeaseManagement />,
        allowedRoles: ["dev", "super_admin"],
      },
      {
        name: "Lease Checker",
        path: "checker",
        icon: <LaptopMinimalCheck size={20} />,
        element: <CheckerDashboard />,
        allowedRoles: ["dev", "super_admin"],
      },
      {
        name: "Master",
        path: "master", 
        icon: <Hotel size={20} />,
        allowedRoles: ["dev", "super_admin"],
        children: [
          {
            name: "Entity Master",
            path: "entity-master", 
            icon: <IdCard size={20} />,
            element: <EntityMaster/>,
            allowedRoles: ["dev", "super_admin"],
          },
          {
            name: "Lessor Master",
            path: "lessor-master", 
            icon: <UserRoundCog size={20} />,
            element: <LessorMaster />,
            allowedRoles: ["dev", "super_admin"],
          },
          {
            name: "Asset Master",
            path: "asset-master",
            icon: <KeyRound size={20} />,
            element: <AssetMaster />,
            allowedRoles: ["dev", "super_admin"],
          },
          {
            name: "GL Master",
            path: "gl-master", 
            icon: <BookKey size={20} />,
            element: <GlMaster />,
            allowedRoles: ["dev", "super_admin"],
          },
          {
            name: "Department Master",
            path: "department-master", 
            icon: <University size={20} />,
            element: <DepartmentMaster />,
            allowedRoles: ["dev", "super_admin"],
          },
          {
            name: "Currency Master",
            path: "currency-master",
            icon: <IndianRupee size={20} />,
            element: <Currency />,
            allowedRoles: ["dev", "super_admin"],
          },
        ],
      },
    ],
  },
  {
    name: "Admin View",
    path: "admin-view",
    icon: <KeyRound size={20} />,
    allowedRoles: ["dev", "super_admin"],
    children: [
      {
        name: "Modules-control",
        path: "module",
        icon: <PackageOpen size={20} />,
        element: <ModulesPage />,
        allowedRoles: ["dev", "super_admin"],
      },
      {
        name: "User Management",
        path: "users",
        element: <UserListPage />,
        icon: <Users size={20} />,
        allowedRoles: ["dev", "master_admin", "super_admin"],
      },
      {
        name: "Role Management",
        path: "role-mangement",
        element: <SuperRoleManagement isReadOnly={false} />,
        icon: <UserCog size={20} />,
        allowedRoles: ["super_admin"],
      },
      {
        name: "Organization",
        path: "org-form",
        element: <OrganizationManager />,
        icon: <FileText size={20} />,
        allowedRoles: ["dev", "super_admin"],
      },
    ],
  },
  {
    name: "Modules control",
    path: "modules",
    icon: <PackageOpen size={20} />,
    element: <MasterModulesPage />,
    allowedRoles: ["dev", "master_admin"],
  },
 
  {
        name: "User Management",
        path: "users",
        element: <UserListPage />,
        icon: <Users size={20} />,
        allowedRoles: ["dev", "master_admin"],
      },
  {
    name: "Roles Controller",
    path: "role-management",
    icon: <Settings size={20} />,
    element: <MasterRoleManagement  />,
    allowedRoles: ["dev", "master_admin"],
  },
  {
    name: "Financial Dashboard",
    path: "financial",
    icon: <BarChart3 size={20} />,
    element: <FinanceOverviewPage />,
    allowedRoles: ["dev", "master_admin"],
  },
];

