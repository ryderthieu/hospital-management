import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/Auth/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import Profile from "./pages/Profile/index";
import AppLayout from "./layouts/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Patient from "./pages/Patients/Patient";
import PatientDetail from "./pages/Patients/PatientDetail";
import Doctor from "./pages/Doctors/Doctor";
import DoctorDetail from "./pages/Doctors/DoctorDetail";
import DoctorSchedule from "./pages/Doctors/DoctorSchedule";
import Medicine from "./pages/Medicines/Medicines";
import Service from "./pages/HealthServices/Services";
import Department from "./pages/Departments/Department";
import RoomDetail from "./pages/Inpatient/RoomDetail";
import PatientAddForm from "./pages/Patients/PatientAddForm"; 
import Inpatient from "./pages/Inpatient/Inpatients";
import Clinics from "./pages/MedicalExamination/OutpatientClinics";
import MedicalCalendar from "./pages/MedicalExamination/MedicalCalendar";
import ClinicDetail from "./pages/MedicalExamination/ClinicDetail";
import InpatientRoom from "./pages/Inpatient/InpatientRoom";
import Authorization from "./pages/Authorization/index";

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
            <Route path="/admin/outpatient-clinics" element={<Clinics />} />
            <Route path="/admin/outpatient-clinics/:id" element={<ClinicDetail />} />

            {/* Patients Pages */}
            <Route path="/admin/patients" element={<Patient />} />
            <Route path="/admin/patients/:id" element={<PatientDetail />} />
            <Route path="/admin/patients/new" element={<PatientAddForm />} /> 

            {/* Doctors Page */}
            <Route path="/admin/doctors" element={<Doctor />} />
            <Route path="/admin/doctors/detail" element={<DoctorDetail />} />
            <Route path="/admin/doctors/schedule" element={<DoctorSchedule />} />

            {/* Medicines Page */}
            <Route path="/admin/medicines" element={<Medicine />} />

            {/* Services Page */}
            <Route path="/admin/health-services" element={<Service />} />

            {/* Patients Room Page */}
            <Route path="/admin/inpatients-rooms" element={<InpatientRoom />} />
            <Route path="/admin/inpatients" element={<Inpatient />} />
            <Route path="/admin/inpatients-rooms/room-details" element={<RoomDetail />} />

            {/* Department Page */}
            <Route path="/admin/departments" element={<Department />} />

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
}

export default AdminApp;