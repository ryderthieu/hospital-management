import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import ExaminationDoctorLayout from "./layout/ExaminationDoctorLayout";
import TestDoctorLayout from "./layout/TestDoctorLayout";
import ExaminationDoctorRoutes from "./routes/ExaminationDoctorRoutes";
import TestDoctorRoutes from "./routes/TestDoctorRoutes";
import SignIn from "../role-doctor/pages/auth/SignIn";
import { ConfigProvider, App as AntdApp } from "antd";
import viVN from "antd/es/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { theme } from "../theme";

dayjs.locale("vi");

const DoctorApp: React.FC = () => {
  return (
    <ConfigProvider theme={theme} locale={viVN} componentSize="large">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/examination" element={<ExaminationDoctorLayout />}>
              {ExaminationDoctorRoutes}
            </Route>
            <Route path="/test" element={<TestDoctorLayout />}>
              {TestDoctorRoutes}
            </Route>
            <Route path="/" element={<SignIn />} />
            <Route path="*" element={<div>404 - Không tìm thấy trang</div>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default DoctorApp;
