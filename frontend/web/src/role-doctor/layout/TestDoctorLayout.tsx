import React from "react";
import { Sidebar } from "../components/test-doctor/Sidebar";
import { Header } from "../components/test-doctor/Header";
import { Outlet } from "react-router-dom";


const TestDoctorLayout: React.FC = () => {
  return (
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-4 overflow-y-auto">
              <Outlet />
            </main>
          </div>
        </div>
      )
};

export default TestDoctorLayout;