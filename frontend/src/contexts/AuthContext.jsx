import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/services/authService";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      try {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.error("Failed to load user:", err);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const userData = await authService.login(credentials);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // Support both 'role' and 'roleName' for backward compatibility
  const hasRole = (role) => user?.role === role || user?.roleName === role;
  const hasAnyRole = (roles) =>
    roles.includes(user?.role) || roles.includes(user?.roleName);

  const value = {
    user,
    login,
    logout,
    updateUser,
    hasRole,
    hasAnyRole,
    isAuthenticated: !!user,
    loading,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-b-2 border-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};
