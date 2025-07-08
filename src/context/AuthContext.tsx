
import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
  useCallback,
} from "react";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  user_id: any;
  tenant_id: any;
  isAuthenticated: boolean;
  token: string | null;
  username: string | null;
  user_type: string | null;
  email: string | null;
  isLoading: boolean; // Added loading state
}

interface AuthContextType {
  authState: AuthState;
  login: (
    token: string,
    username?: string,
    user_type?: string,
    email?: string
  ) => void;
  logout: () => void;
}

const initialAuthState: AuthState = {
  isAuthenticated: false,
  token: null,
  username: null,
  user_type: null,
  user_id: null,
  email: null,
  tenant_id: null,
  isLoading: true, // Initial loading state
};

export const AuthContext = createContext<AuthContextType>({
  authState: initialAuthState,
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

interface TokenPayload {
  username?: string;
  user_type?: string;
  user_id?: string;
  tenant_id?: string;
  exp?: number;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  // Rehydrate auth state from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        console.log("Decoded token:", decoded);

        setAuthState({
          isAuthenticated: true,
          token,
          username: decoded.username || null,
          user_type: decoded.user_type || null,
          user_id: decoded.user_id || null,
          tenant_id: decoded.tenant_id || null,
          email: null,
          isLoading: false,
        });
      } catch (err) {
        console.error("Invalid token:", err);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        logout();
      }
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(
    (
      token: string,
      usernameFromApi?: string,
      userTypeFromApi?: string,
      emailFromApi?: string
    ) => {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        localStorage.setItem("token", token);

        setAuthState({
          isAuthenticated: true,
          token,
          username: usernameFromApi ?? decoded.username ?? null,
          user_type: userTypeFromApi ?? decoded.user_type ?? null,
          user_id: decoded.user_id ?? null,
          tenant_id: decoded.tenant_id ?? null,
          email: emailFromApi ?? null,
          isLoading: false,
        });
        localStorage.setItem(
          "userData",
          JSON.stringify({
            username: usernameFromApi ?? decoded.username ?? "",
            user_type: userTypeFromApi ?? decoded.user_type ?? "",
            user_id: decoded.user_id ?? "",
            tenant_id: decoded.tenant_id ?? "",
            email: emailFromApi ?? "",
          })
        );
      } catch (err) {
        console.error("Failed to decode token:", err);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setAuthState({
      ...initialAuthState,
      isLoading: false, // Ensure loading is false after logout
    });
  }, []);

  // Auto logout after 15 minutes
  useEffect(() => {
    const events = ["mousemove", "keydown", "scroll", "click"];
    let timeoutId: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logout();
        Swal.fire({
          icon: "info",
          title: "Session expired",
          text: "You have been logged out due to inactivity.",
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/login";
        });
      }, 30 * 60 * 1000);
    };

    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [logout]);

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {!authState.isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);