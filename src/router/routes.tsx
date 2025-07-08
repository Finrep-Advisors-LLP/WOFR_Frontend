
import { RouteObject, Navigate } from "react-router-dom";
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";
import AppSolutions from "../Pages/WORF/AppSolution";
import FreeTrial from "../Pages/WORF/FreeTrial";
import WofrLeaseIntro from "../Pages/WORF/WofrLeaseIntro";
import ResetPasswordForm from "../Pages/Auth/ResetPasswordForm";
import WOFRDashboard from "../Pages/HomeScreen/Dashboard";
import Calendly from "../Calendly/Calendly";
import NotFound from "../Pages/NotFound";
import { DashboardRoutes } from "./DashboardRoutes";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "../Pages/unauthorized/Unauthorized";
import BulkUpload from "../Pages/LeaseMangement/createLease/BulkUpload/BulkUpload";
import CreateLease from "../Pages/LeaseMangement/createLease/CreateLease";
import PublicLayoutWrapper from "../component/layout/PublicLayoutWrapper";
import DashboardLayout from "../component/layout/DashboardLayout";
import UserProfile from "../Pages/MasterAdmin/Users/UserProfile";
import ViewLease from "../Pages/LeaseMangement/ViewLease/ViewLease";
// import CheckerLeaseReview from "../Pages/LeaseMangement/CheckerWorkflow/CheckerLeaseReview";

export const publicRoutes: RouteObject[] = [
  {
    element: <PublicLayoutWrapper />,
    children: [
      {
        path: "/",
        element: <WOFRDashboard />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/book-demo",
        element: <Calendly />,
      },
      {
        path: "/wofr/lease-intro",
        element: <WofrLeaseIntro />,
      },
      {
        path: "/free-trial",
        element: <FreeTrial />,
      },
      {
        path: "/explore-solutions",
        element: <AppSolutions />,
      },
      {
        path: "/reset-password",
        element: <ResetPasswordForm />,
      },
    ],
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

// Function to recursively flatten all routes (including nested children)
// This function now correctly builds the full path for each route
const flattenRoutes = (routes: any[], parentPath = ''): RouteObject[] => {
  const flattened: RouteObject[] = [];

  routes.forEach((route) => {
    // Construct the full path for the current route
    const currentFullPath = route.path ? `${parentPath}/${route.path}`.replace(/\/\//g, '/') : parentPath;

    // If the route has an element, add it to the flattened list
    if (route.element) {
      flattened.push({
        path: currentFullPath.startsWith('/') ? currentFullPath.substring(1) : currentFullPath, // Remove leading slash if present
        element: (
          <ProtectedRoute allowedRoles={route.allowedRoles}>
            {route.element}
          </ProtectedRoute>
        ),
      });
    }

    // Recursively process children, passing the currentFullPath as the new parentPath
    if (route.children) {
      flattened.push(...flattenRoutes(route.children, currentFullPath));
    }
  });

  return flattened;
};

const InitialDashboardRedirect = () => {
  const lastRoute = localStorage.getItem('lastRoute');

  // Check if the lastRoute is valid and not the dashboard overview
  if (lastRoute && lastRoute !== '/dashboard/overview') {
    return <Navigate to={lastRoute} replace />;
  }

  // Default to overview
  return <Navigate to="/dashboard/overview" replace />;
};

export const dashboardRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <InitialDashboardRedirect />,
      },

      // Use the updated flatten function to handle all nested routes
      ...flattenRoutes(DashboardRoutes),

      // Additional dynamic routes
      {
        path: "users/userDetails/:id",
        element: <ProtectedRoute allowedRoles={["dev", "master_admin", "super_admin"]}><UserProfile /></ProtectedRoute>,
      },
      {
        path: "create-lease",
        element: <ProtectedRoute allowedRoles={["dev", "master_admin", "super_admin"]}><CreateLease /></ProtectedRoute>,
      },
      {
        path: "lease/view/:id",
        element: <ProtectedRoute allowedRoles={["dev", "master_admin", "super_admin"]}><ViewLease /></ProtectedRoute>,
      },
      // {
      //   path: "checker-lease/review/:id",
      //   element: <ProtectedRoute allowedRoles={["dev", "master_admin", "super_admin"]}><CheckerLeaseReview /></ProtectedRoute>,
      // },
      {
        path: "bulk-upload",
        element: <ProtectedRoute allowedRoles={["dev", "master_admin", "super_admin"]}><BulkUpload /></ProtectedRoute>,
      },
    ],
  },
];

