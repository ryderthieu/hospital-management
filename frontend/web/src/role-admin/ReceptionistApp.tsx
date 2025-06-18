import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/Auth/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import Profile from "./pages/Profile/Profile";
import AppLayout from "./layouts/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { Patient, PatientDetail, PatientAddForm } from "./pages/Patients";
import {
  RoomDetail,
  Inpatients,
  InpatientRoom,
  AddPatientRoom,
  EditPatientRoom,
  AddRoom,
} from "./pages/Inpatient";
import {
  OutpatientClinics,
  MedicalCalendar,
  ClinicDetail,
  AddClinic,
} from "./pages/MedicalExamination";
import {
  Department,
  DepartmentDetail,
  AddDepartment,
} from "./pages/Departments";

const RequireReceptionist: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const role = localStorage.getItem("authRole");
  if (role !== "RECEPTIONIST") {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const ReceptionistApp: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Auth Layout */}
        <Route path="login" element={<SignIn />} />

        {/* Dashboard Layout - chỉ cho receptionist */}
        <Route
          element={
            <RequireReceptionist>
              <AppLayout />
            </RequireReceptionist>
          }
        >
          <Route index element={<Home />} />

          {/* Medical Examinations Pages */}
          <Route path="calendar" element={<MedicalCalendar />} />
          <Route path="outpatient-clinics" element={<OutpatientClinics />} />
          <Route path="outpatient-clinics/:id" element={<ClinicDetail />} />
          <Route path="outpatient-clinics/add" element={<AddClinic />} />

          {/* Patients Pages */}
          <Route path="patients" element={<Patient />} />
          <Route path="patients/:patientId" element={<PatientDetail />} />
          <Route path="patients/add" element={<PatientAddForm />} />

          {/* Inpatients Page */}
          <Route path="inpatients-rooms" element={<InpatientRoom />} />
          <Route path="inpatients-rooms/add" element={<AddPatientRoom />} />
          <Route
            path="inpatients-rooms/edit/:detailId"
            element={<EditPatientRoom />}
          />
          <Route path="inpatients" element={<Inpatients />} />
          <Route
            path="inpatients-rooms/room-details"
            element={<RoomDetail />}
          />
          <Route path="inpatients-rooms/add-room" element={<AddRoom />} />

          {/* Department Page */}
          <Route path="departments" element={<Department />} />
          <Route path="departments/add" element={<AddDepartment />} />
          <Route path="departments/:id" element={<DepartmentDetail />} />

          {/* Others Page */}
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default ReceptionistApp;
