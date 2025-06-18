import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

export interface Department {
  departmentId: number;
  departmentName: string;
  icon?: string | null;
  staffCount?: number;
  description?: string | null;
  location?: string | null;
  // ... các trường khác nếu cần
}

interface DepartmentContextType {
  departments: Department[];
  isLoading: boolean;
  error: string | null;
  reloadDepartments: () => Promise<void>;
}

const DepartmentContext = createContext<DepartmentContextType | undefined>(undefined);

export const useDepartments = () => {
  const ctx = useContext(DepartmentContext);
  if (!ctx) throw new Error('useDepartments must be used within DepartmentProvider');
  return ctx;
};

export const DepartmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reloadDepartments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await API.get('/doctors/departments');
      setDepartments(Array.isArray(res.data) ? res.data : res.data.content);
    } catch (e: any) {
      setDepartments([]);
      setError(e?.response?.data?.error || 'Không thể tải danh sách khoa');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    reloadDepartments();
  }, []);

  return (
    <DepartmentContext.Provider value={{ departments, isLoading, error, reloadDepartments }}>
      {children}
    </DepartmentContext.Provider>
  );
}; 