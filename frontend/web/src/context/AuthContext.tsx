"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { message } from "antd";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import { doctorService } from "../services/doctorService";
import type {
  AuthState,
  AuthUser,
  DoctorInfo,
  LoginCredentials,
} from "../types/auths";

// Action types
type AuthAction =
  | { type: "LOGIN_START" }
  | {
      type: "LOGIN_SUCCESS";
      payload: { user: AuthUser; doctorInfo?: DoctorInfo; token: string };
    }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "UPDATE_USER"; payload: AuthUser }
  | { type: "UPDATE_DOCTOR_INFO"; payload: DoctorInfo };

// Initial state
const initialState: AuthState = {
  user: null,
  doctorInfo: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        doctorInfo: action.payload.doctorInfo || null,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        doctorInfo: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case "LOGOUT":
      return {
        ...initialState,
        isLoading: false,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };

    case "UPDATE_DOCTOR_INFO":
      return {
        ...state,
        doctorInfo: action.payload,
      };

    default:
      return state;
  }
};

// Context type
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  updateUser: (user: AuthUser) => void;
  updateDoctorInfo: (doctorInfo: DoctorInfo) => void;
  isAdmin: () => boolean;
  isDoctor: () => boolean;
  isReceptionist: () => boolean;
  hasRole: (role: string) => boolean;
  getCurrentUserId: () => number | null;
  getCurrentDoctorId: () => number | null;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load auth data from localStorage on mount
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (token) {
          // Use the getCurrentUser endpoint to verify and get current user
          try {
            const user = await userService.getCurrentUser();

            // If user is a doctor, get doctor info
            let doctorInfo: DoctorInfo | undefined;
            if (user.role === "DOCTOR") {
              const doctor = await doctorService.getDoctorByUserId(user.userId);
              if (doctor) {
                doctorInfo = doctor;
                localStorage.setItem("doctorInfo", JSON.stringify(doctor));
                localStorage.setItem(
                  "currentDoctorId",
                  doctor.doctorId.toString()
                );
              }
            }

            // Update localStorage with fresh data
            localStorage.setItem("authUser", JSON.stringify(user));
            localStorage.setItem("currentUserId", user.userId.toString());

            dispatch({
              type: "LOGIN_SUCCESS",
              payload: { user, doctorInfo, token },
            });
          } catch (error) {
            // Token is invalid or user doesn't exist, clear storage
            console.error("Token validation failed:", error);
            localStorage.removeItem("authToken");
            localStorage.removeItem("authUser");
            localStorage.removeItem("doctorInfo");
            localStorage.removeItem("currentUserId");
            localStorage.removeItem("currentDoctorId");
            dispatch({ type: "LOGOUT" });
          }
        } else {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } catch (error) {
        console.error("Error loading auth data:", error);
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    loadAuthData();
  }, []);

  // Login function
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      try {
        dispatch({ type: "LOGIN_START" });

        const response = await authService.login(credentials);
        const { token, user, doctorInfo } = response;

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user, doctorInfo, token },
        });

        message.success(
          `Chào mừng ${
            user.role === "DOCTOR"
              ? "Bác sĩ"
              : user.role === "ADMIN"
              ? "Quản trị viên"
              : user.role === "RECEPTIONIST"
              ? "Lễ tân"
              : "Người dùng"
          }!`
        );
        return true;
      } catch (error: any) {
        console.error("Login error:", error);

        // Clear any stored token if login fails
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        localStorage.removeItem("doctorInfo");
        localStorage.removeItem("currentUserId");
        localStorage.removeItem("currentDoctorId");

        let errorMessage = "Đăng nhập thất bại";

        if (error.response?.status === 401) {
          errorMessage = "Số điện thoại hoặc mật khẩu không đúng";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
        message.error(errorMessage);
        return false;
      }
    },
    []
  );

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    try {
      await authService.logout();
      dispatch({ type: "LOGOUT" });
      message.success("Đăng xuất thành công");
    } catch (error) {
      console.error("Logout error:", error);
      // Still logout locally even if API call fails
      dispatch({ type: "LOGOUT" });
    }
  }, []);

  // Refresh auth data using getCurrentUser
  const refreshAuth = useCallback(async (): Promise<void> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      // Use getCurrentUser endpoint to get fresh user data
      const user = await userService.getCurrentUser();
      dispatch({ type: "UPDATE_USER", payload: user });

      // Refresh doctor info if user is a doctor
      if (user.role === "DOCTOR") {
        const doctorInfo = await doctorService.getDoctorByUserId(user.userId);
        if (doctorInfo) {
          dispatch({ type: "UPDATE_DOCTOR_INFO", payload: doctorInfo });
          localStorage.setItem("doctorInfo", JSON.stringify(doctorInfo));
          localStorage.setItem(
            "currentDoctorId",
            doctorInfo.doctorId.toString()
          );
        }
      }

      localStorage.setItem("authUser", JSON.stringify(user));
      localStorage.setItem("currentUserId", user.userId.toString());
    } catch (error) {
      console.error("Error refreshing auth data:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Không thể làm mới thông tin đăng nhập",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  // Update user info
  const updateUser = useCallback((user: AuthUser) => {
    dispatch({ type: "UPDATE_USER", payload: user });
    localStorage.setItem("authUser", JSON.stringify(user));
    localStorage.setItem("currentUserId", user.userId.toString());
  }, []);

  // Update doctor info
  const updateDoctorInfo = useCallback((doctorInfo: DoctorInfo) => {
    dispatch({ type: "UPDATE_DOCTOR_INFO", payload: doctorInfo });
    localStorage.setItem("doctorInfo", JSON.stringify(doctorInfo));
    if (doctorInfo.doctorId) {
      localStorage.setItem("currentDoctorId", doctorInfo.doctorId.toString());
    }
  }, []);

  // Helper functions to get current IDs
  const getCurrentUserId = useCallback((): number | null => {
    return state.user?.userId || null;
  }, [state.user]);

  const getCurrentDoctorId = useCallback((): number | null => {
    return state.doctorInfo?.doctorId || null;
  }, [state.doctorInfo]);

  // Role checking functions
  const isAdmin = useCallback(() => state.user?.role === "ADMIN", [state.user]);
  const isDoctor = useCallback(
    () => state.user?.role === "DOCTOR",
    [state.user]
  );
  const isReceptionist = useCallback(
    () => state.user?.role === "RECEPTIONIST",
    [state.user]
  );
  const hasRole = useCallback(
    (role: string) => state.user?.role === role,
    [state.user]
  );

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    refreshAuth,
    updateUser,
    updateDoctorInfo,
    isAdmin,
    isDoctor,
    isReceptionist,
    hasRole,
    getCurrentUserId,
    getCurrentDoctorId,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
