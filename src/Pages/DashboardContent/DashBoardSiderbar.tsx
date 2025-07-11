import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  LogOut,
  X,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import icons from "../../../public/icons";
import { useState, useContext, useMemo, useCallback } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";
import { DashboardRoutes } from "../../router/DashboardRoutes";

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
  toggleSidebarVisibility: () => void;
}


const Tooltip = ({ children, text, isVisible }: { 
  children: React.ReactNode; 
  text: string; 
  isVisible: boolean;
}) => {
  if (!isVisible) return <>{children}</>;
  
  return (
    <div className="group relative">
      {children}
      <div className="absolute z-[60] invisible group-hover:visible opacity-0 group-hover:opacity-100 
        transition-all duration-200 delay-300 
        left-full ml-3 top-1/2 transform -translate-y-1/2 
        bg-gray-900 text-white text-xs px-3 py-2 rounded-md shadow-lg whitespace-nowrap
        pointer-events-none">
        {text}
        <div className="absolute top-1/2 transform -translate-y-1/2 -left-1 
          w-2 h-2 bg-gray-900 rotate-45"></div>
      </div>
    </div>
  );
};


export const DashboardSidebar = ({
  isOpen,
  isMobile,
  toggleSidebar,
  toggleSidebarVisibility,
}: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );
  const { authState, logout } = useContext(AuthContext);

  const userType = useMemo(() => authState.user_type, [authState.user_type]);

  const toggleExpand = useCallback((name: string) => {
    setExpandedItems((prev) => {
      // Check if we're toggling a top-level parent or a nested item
      const isTopLevelParent = !name.includes("-");

      if (isTopLevelParent) {
        // For top-level parents, close all other top-level parents
        const newState: Record<string, boolean> = {}; // Close all top-level parents

        Object.keys(prev).forEach((key) => {
          if (!key.includes("-")) {
            newState[key] = false;
          } else {
            newState[key] = false;
          }
        });

        newState[name] = !prev[name];

        return newState;
      } else {
        // For nested items, just toggle normally
        return { ...prev, [name]: !prev[name] };
      }
    });
  }, []);

  const handleLogout = useCallback(() => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire({
          title: "Logged out!",
          text: "You have been logged out successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => navigate("/login"));
      }
    });
  }, [logout, navigate]);

  const isChildRouteActive = (
    children: any[],
    currentBasePath: string
  ): boolean => {
    return (
      children?.some((child) => {
        const fullPath = child.path
          ? `${currentBasePath}/${child.path}`.replace(/\/\//g, "/")
          : currentBasePath;
        if (child.children) {
          // If it has children, recursively check if any of its children are active
          return isChildRouteActive(child.children, fullPath);
        }
        // If it's a leaf node, check if the current location matches its full path
        return (
          location.pathname === `/dashboard${fullPath}` ||
          location.pathname.startsWith(`/dashboard${fullPath}/`)
        );
      }) ?? false
    );
  };

  const renderNestedChildren = (
    children: any[],
    parentName: string,
    level: number = 1,
    currentBasePath: string
  ) => {
    return children.map((child) => {
      // Construct the newBasePath for the current child
      const newBasePath = child.path
        ? `${currentBasePath}/${child.path}`.replace(/\/\//g, "/")
        : currentBasePath;
      const childKey = `${parentName}-${child.name}`;

      return (
        <div key={child.name} className={`${isOpen ? `ml-${level * 3}` : ""}`}>
          {child.children && child.children.length > 0 ? (
            <>
              <Tooltip text={child.name} isVisible={!isOpen}>
                <button
                  onClick={() => toggleExpand(childKey)}
                  className={`flex items-center w-full px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-200 group ${
                    !isOpen ? "justify-center" : "justify-between"
                  }
                    ${
                    isChildRouteActive(child.children, newBasePath)
                      ? " text-blue-700 border border-blue-200"
                      : "text-gray-800 hover:bg-gray-100 hover:text-black"
                  }`}
                >
                  <div className="flex items-center">
                    <span
                      className={`flex-shrink-0 ${
                        isChildRouteActive(child.children, newBasePath)
                          ? "text-blue-600"
                          : "text-gray-700 group-hover:text-black"
                      }`}
                    >
                      {child.icon}
                    </span>
                    {isOpen && (
                      <span className="ml-3 truncate font-semibold">
                        {child.name}
                      </span>
                    )}
                  </div>
                  {isOpen && (
                    <span
                      className={`flex-shrink-0 transition-transform duration-200 ${
                        expandedItems[childKey] ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDown size={16} />
                    </span>
                  )}
                </button>
              </Tooltip>
              {expandedItems[childKey] && (
                <div className={`${isOpen ? "mt-1 space-y-1" : "space-y-1"}`}>
                  {renderNestedChildren(
                    child.children,
                    childKey,
                    level + 1,
                    newBasePath
                  )}
                </div>
              )}
            </>
          ) : (
            <Tooltip text={child.name} isVisible={!isOpen}>
              <NavLink
                to={`/dashboard${newBasePath}`}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    !isOpen ? "justify-center" : ""
                  } ${
                    isActive
                      ? "bg-[#3BB6FE] text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
                onClick={() => {
                  if (isMobile) toggleSidebarVisibility();
                }}
              >
                <span className="flex-shrink-0 text-current">
                  {child.icon}
                </span>
                {isOpen && <span className="ml-3 truncate">{child.name}</span>}
              </NavLink>
            </Tooltip>
          )}
        </div>
      );
    });
  };

  const processedRoutes = useMemo(() => {
    return DashboardRoutes.filter((route) =>
      route.allowedRoles.includes(userType ?? "")
    ).map((route) => {
      const visibleChildren = route.children?.filter((child) =>
        child.allowedRoles.includes(userType ?? "")
      );

      const isParentActive =
        (route.path &&
          (location.pathname === `/dashboard/${route.path}` ||
            location.pathname.startsWith(`/dashboard/${route.path}/`))) ||
        ((visibleChildren ?? []).length > 0 &&
          isChildRouteActive(visibleChildren ?? [], route.path || ""));

      return {
        ...route,
        visibleChildren,
        isParentActive,
      };
    });
  }, [userType, location.pathname, isChildRouteActive]);

  return (

<aside
  className={`bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300 ease-in-out
  ${isOpen ? "w-64" : "w-16"}
  ${isMobile ? "fixed shadow-xl z-50" : "relative z-30"}
  ${!isOpen ? "overflow-visible" : "overflow-hidden"}`}
>
      {/* Header Section */}
      <div className="h-18 flex items-center justify-between px-3 border-b border-gray-200 bg-gray-50">
        {isOpen && (
          <div className="flex items-center min-w-0">
            <img
              src={icons.logo}
              alt="Dashboard logo"
              className="h-8 w-auto object-contain flex-shrink-0"
              loading="lazy"
            />
          </div>
        )}
        <div
          className={`flex ${isOpen ? "justify-end" : "justify-center"} ${
            isOpen ? "" : "w-full"
          }`}
        >
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-md hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200"
              aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          )}
          {isMobile && (
            <button
              onClick={toggleSidebarVisibility}
              className="p-1.5 rounded-md hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      {/* <div className="flex-1 overflow-y-auto py-3 px-2"> */}
      <div className={`flex-1 py-3 px-2 ${isOpen ? "overflow-y-auto" : "overflow-visible"}`}>

        <nav className="space-y-1">
          {processedRoutes.map((item) => (
            <div key={item.name} className="relative">
              {item.visibleChildren && item.visibleChildren.length > 0 ? (
                <>
                  <Tooltip text={item.name} isVisible={!isOpen}>
                    <button
                      onClick={() => toggleExpand(item.name)}
                      className={`flex items-center w-full px-3 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 group ${
                        !isOpen ? "justify-center" : "justify-between"
                      }
                        ${
                        item.isParentActive
                          ? " text-blue-700 border border-blue-200"
                          : "text-gray-700 hover:bg-gray-100 hover:text-black"
                      }`}
                    >
                      <div className="flex items-center">
                        <span
                          className={`flex-shrink-0 ${
                            item.isParentActive
                              ? "text-blue-600"
                              : "text-gray-800 group-hover:text-black"
                          }`}
                        >
                          {item.icon}
                        </span>
                        {isOpen && (
                          <span className="ml-3 truncate font-bold">
                            {item.name}
                          </span>
                        )}
                      </div>
                      {isOpen && (
                        <span
                          className={`flex-shrink-0 transition-transform duration-200 ${
                            expandedItems[item.name] ? "rotate-180" : ""
                          }`}
                        >
                          <ChevronDown size={16} />
                        </span>
                      )}
                    </button>
                  </Tooltip>
                  {expandedItems[item.name] && (
                    <div
                      className={`${isOpen ? "mt-1 space-y-1" : "space-y-1"}`}
                    >
                      {renderNestedChildren(
                        item.visibleChildren,
                        item.name,
                        1,
                        item.path || ""
                      )}
                    </div>
                  )}
                </>
              ) : (
                <Tooltip text={item.name} isVisible={!isOpen}>
                  <NavLink
                    to={`/dashboard/${item.path}`}
                    className={({ isActive }) =>
                      `flex items-center w-full px-3 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 group ${
                        !isOpen ? "justify-center" : ""
                      } ${
                        isActive
                          ? "bg-[#3BB6FE] text-white shadow-sm"
                          : "text-gray-700 hover:bg-gray-100 hover:text-black"
                      }`
                    }
                    onClick={() => {
                      if (isMobile) toggleSidebarVisibility();
                    }}
                  >
                    <span className={`flex-shrink-0 text-current`}>
                      {item.icon}
                    </span>
                    {isOpen && (
                      <span className="ml-3 truncate font-bold">{item.name}</span>
                    )}
                  </NavLink>
                </Tooltip>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Section */}
      <div className="border-t border-gray-200 p-2 bg-gray-50">
        <Tooltip text="Help" isVisible={!isOpen}>
          <button
            className={`flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 ${
              !isOpen ? "justify-center" : ""
            }`}
          >
            <HelpCircle size={18} className="text-gray-500 flex-shrink-0" />
            {isOpen && <span className="ml-3 truncate">Help</span>}
          </button>
        </Tooltip>
        <Tooltip text="Logout" isVisible={!isOpen}>
          <button
            className={`flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-all duration-200 mt-1 ${
              !isOpen ? "justify-center" : ""
            }`}
            onClick={handleLogout}
          >
            <LogOut size={18} className="text-red-500 flex-shrink-0" />
            {isOpen && <span className="ml-3 truncate">Logout</span>}
          </button>
        </Tooltip>
      </div>
    </aside>
  );
};