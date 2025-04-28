// context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

// Tạo context
const AuthContext = createContext();

// Tạo AuthProvider để cung cấp context cho các component
export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);  // Trạng thái đăng nhập

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

// Tạo hook useAuth để dễ dàng truy cập vào context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
