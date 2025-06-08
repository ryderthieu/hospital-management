import React from "react";
import { Routes, Route } from "react-router-dom";
import ExaminationDoctorLayout from "./layout/ExaminationDoctorLayout";
import TestDoctorLayout from "./layout/TestDoctorLayout";
import ExaminationDoctorRoutes from "./routes/ExaminationDoctorRoutes";
import TestDoctorRoutes from "./routes/TestDoctorRoutes";
import { ConfigProvider, App as AntdApp } from "antd";
import viVN from "antd/es/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { theme } from "../theme";

dayjs.locale("vi");

const DoctorApp: React.FC = () => {
  return (
    <AntdApp>
      <ConfigProvider theme={theme} locale={viVN} componentSize="large">
          <Routes>
            <Route path="examination/*" element={<ExaminationDoctorLayout />}>
              {ExaminationDoctorRoutes}
            </Route>
            <Route path="test/*" element={<TestDoctorLayout />}>
              {TestDoctorRoutes}
            </Route>
            {/* Thêm route mặc định cho doctor */}
            <Route index element={<div>Doctor Dashboard</div>} />
          </Routes>
      </ConfigProvider>
    </AntdApp>
  );
};

export default DoctorApp;