import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/Auth/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import Profile from "./pages/Profile/Profile";
import AppLayout from "./layouts/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { Patient, PatientDetail, PatientAddForm } from "./pages/Patients";
import { Doctor, DoctorDetail, DoctorSchedule } from "./pages/Doctors";
import { Medicines } from "./pages/Medicines";
import { Services } from "./pages/HealthServices";
import { Department, DepartmentDetail } from "./pages/Departments";
import { RoomDetail, Inpatients, InpatientRoom } from "./pages/Inpatient";
import {
  OutpatientClinics,
  MedicalCalendar,
  ClinicDetail,
} from "./pages/MedicalExamination";
import Authorization from "./pages/Authorization/Authorization";

const AdminApp: React.FC = () => {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/admin" element={<Home />} />

            {/* Medical Examinations Pages */}
            <Route path="/admin/calendar" element={<MedicalCalendar />} />
            <Route
              path="/admin/outpatient-clinics"
              element={<OutpatientClinics />}
            />
            <Route
              path="/admin/outpatient-clinics/:id"
              element={<ClinicDetail />}
            />

            {/* Patients Pages */}
            <Route path="/admin/patients" element={<Patient />} />
            <Route path="/admin/patients/:id" element={<PatientDetail />} />
            <Route path="/admin/patients/new" element={<PatientAddForm />} />

            {/* Doctors Page */}
            <Route path="/admin/doctors" element={<Doctor />} />
            <Route
              path="/admin/doctors/detail/:doctorId"
              element={<DoctorDetail />}
            />
            <Route
              path="/admin/doctors/schedule/:id"
              element={<DoctorSchedule />}
            />

            {/* Medicines Page */}
            <Route path="/admin/medicines" element={<Medicines />} />

            {/* Services Page */}
            <Route path="/admin/health-services" element={<Services />} />

            {/* Inpatients Page */}
            <Route path="/admin/inpatients-rooms" element={<InpatientRoom />} />
            <Route path="/admin/inpatients" element={<Inpatients />} />
            <Route
              path="/admin/inpatients-rooms/room-details"
              element={<RoomDetail />}
            />

            {/* Department Page */}
            <Route path="/admin/departments" element={<Department />} />
            <Route
              path="/admin/departments/:id"
              element={<DepartmentDetail />}
            />

            {/* Authorization Page */}
            <Route path="/admin/authorization" element={<Authorization />} />

            {/* Others Page */}
            <Route path="/admin/profile" element={<Profile />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/" element={<SignIn />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
};

export default AdminApp;
