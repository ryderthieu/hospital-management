import { Routes, Route } from "react-router-dom";
import AdminApp from "./role-admin/AdminApp";
import DoctorApp from "./role-doctor/DoctorApp";
import SignIn from "./role-doctor/pages/auth/SignIn";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/doctor/*" element={<DoctorApp />} />
        <Route path="*" element={<div>404 - Không tìm thấy trang</div>} />
      </Routes>
    </AuthProvider>
  );
}
