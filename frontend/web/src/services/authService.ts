import type {
  LoginCredentials,
  LoginResponse,
  AuthUser,
  DoctorInfo,
  AdminInfo,
  ReceptionistInfo,
} from "../types/auths";
import { api } from "./api";
import { doctorService } from "./doctorService";

export const authService = {
  // Login - only returns token, then fetch user info
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // Step 1: Login to get token
    const loginResponse = await api.post<{ token: string }>(
      "/users/auth/login",
      credentials
    );
    const { token } = loginResponse.data;

    // Step 2: Store token temporarily to make authenticated requests
    localStorage.setItem("authToken", token);

    // Step 3: Use token to get current user info from /users/me
    const userResponse = await api.get<AuthUser>("/users/me");
    const user = userResponse.data;

    // Step 4: Store user info
    localStorage.setItem("authUser", JSON.stringify(user));
    localStorage.setItem("authRole", user.role); // Thêm dòng này để lưu role riêng
    localStorage.setItem("currentUserId", user.userId.toString());

    // Step 5: If user is a doctor, fetch doctor info
    let doctorInfo: DoctorInfo | undefined;
    if (user.role === "DOCTOR") {
      try {
        const doctors = await doctorService.getAllDoctors();
        const doctor = doctors.find((d) => d.userId === user.userId);
        if (doctor) {
          doctorInfo = doctor;
          localStorage.setItem("doctorInfo", JSON.stringify(doctor));
          localStorage.setItem("currentDoctorId", doctor.doctorId.toString());
        }
      } catch (error) {
        console.error("Failed to fetch doctor info:", error);
      }
    } else if (user.role === "ADMIN") {
      const adminInfo: AdminInfo = {
        ...user,
        role: "ADMIN",
      };
      localStorage.setItem("adminInfo", JSON.stringify(adminInfo));
    } else if (user.role === "RECEPTIONIST") {
      const receptionistInfo: ReceptionistInfo = {
        ...user,
        role: "RECEPTIONIST",
      };
      localStorage.setItem(
        "receptionistInfo",
        JSON.stringify(receptionistInfo)
      );
    }

    return {
      token,
      user,
      doctorInfo,
    };
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage regardless of API call result
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      localStorage.removeItem("doctorInfo");
      localStorage.removeItem("currentUserId");
      localStorage.removeItem("currentDoctorId");
      localStorage.removeItem("adminInfo");
      localStorage.removeItem("receptionistInfo");
    }
  },

  // Get current user info using the /users/me endpoint
  async getCurrentUser(): Promise<AuthUser> {
    const response = await api.get<AuthUser>("/users/me");
    return response.data;
  },

  // Get current user with doctor info if applicable
  async getCurrentUserWithDoctorInfo(): Promise<{
    user: AuthUser;
    doctorInfo?: DoctorInfo;
  }> {
    const user = await this.getCurrentUser();

    let doctorInfo: DoctorInfo | undefined;
    if (user.role === "DOCTOR") {
      try {
        const doctors = await doctorService.getAllDoctors();
        const doctor = doctors.find((d) => d.userId === user.userId);
        if (doctor) {
          doctorInfo = doctor;
        }
      } catch (error) {
        console.error("Failed to fetch doctor info:", error);
      }
    }

    return { user, doctorInfo };
  },

  // Refresh token
  async refreshToken(): Promise<string> {
    const response = await api.post<{ token: string }>("/auth/refresh");

    // Update token in localStorage
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }

    return response.data.token;
  },

  // Verify token
  async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await api.post<{ valid: boolean }>("/auth/verify", {
        token,
      });
      return response.data.valid;
    } catch (error) {
      return false;
    }
  },
};
