import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api"; 
interface UserData {
  userId: number;
  phone: string;
  email: string;
}

interface PatientData {
  patientId: number;
  userId: number;
  identityNumber: string;
  insuranceNumber: string;
  fullName: string;
  birthday: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  province: string;
  district: string;
  ward: string;
  emergencyContactDtos: { contactId?: number; phone: string; name: string; relationship: string }[];
}

interface AuthContextType {
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: UserData | null;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  patient: PatientData | null;
  setPatient: React.Dispatch<React.SetStateAction<PatientData | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [patient, setPatient] = useState<PatientData | null>(null);

  useEffect(() => {
    const loadAuthData = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        setLoggedIn(true);
        try {
          // Load từ AsyncStorage trước để tăng tốc
          const storedUser = await AsyncStorage.getItem("user");
          const storedPatient = await AsyncStorage.getItem("patient");
          if (storedUser) setUser(JSON.parse(storedUser));
          if (storedPatient) setPatient(JSON.parse(storedPatient));
          // Fetch dữ liệu mới từ API để đảm bảo đồng bộ
          const userResponse = await API.get("/users/me"); // Điều chỉnh endpoint
          const patientResponse = await API.get(`/patients/users/${userResponse.data.userId}`);
          setUser(userResponse.data);
          setPatient(patientResponse.data);
          await AsyncStorage.setItem("user", JSON.stringify(userResponse.data));
          await AsyncStorage.setItem("patient", JSON.stringify(patientResponse.data));
        } catch (error) {
          console.error("Error fetching auth data:", error);
          // Nếu fetch thất bại, vẫn giữ dữ liệu từ AsyncStorage
        }
      }
    };
    loadAuthData();
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn, user, setUser, patient, setPatient }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};