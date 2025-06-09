import { Routes, Route } from "react-router-dom";
import SignIn from "./pages/Auth/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import Profile from "./pages/Profile/Profile";
import AppLayout from "./layouts/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { Patient, PatientDetail, PatientAddForm } from "./pages/Patients";
import { Doctor, DoctorDetail, DoctorSchedule } from "./pages/Doctors";
import {
  Medicines,
  AddMedicine,
  EditMedicine,
  ViewMedicine,
} from "./pages/Medicines";
import {
  Services,
  AddService,
  EditService,
  ViewService,
} from "./pages/HealthServices";
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
      <ScrollToTop />
      <Routes>
        {/* Dashboard Layout */}
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />

          {/* Medical Examinations Pages */}
          <Route path="calendar" element={<MedicalCalendar />} />
          <Route path="outpatient-clinics" element={<OutpatientClinics />} />
          <Route path="outpatient-clinics/:id" element={<ClinicDetail />} />

          {/* Patients Pages */}
          <Route path="patients" element={<Patient />} />
          <Route path="patients/:patientId" element={<PatientDetail />} />
          <Route path="patients/new" element={<PatientAddForm />} />

          {/* Doctors Page */}
          <Route path="doctors" element={<Doctor />} />
          <Route path="doctors/detail/:doctorId" element={<DoctorDetail />} />
          <Route path="doctors/schedule/:id" element={<DoctorSchedule />} />

          {/* Medicines Pages */}
          <Route path="medicines" element={<Medicines />} />
          <Route path="medicines/add" element={<AddMedicine />} />
          <Route path="medicines/edit/:id" element={<EditMedicine />} />
          <Route path="medicines/:id" element={<ViewMedicine />} />

          {/* Services Page */}
          <Route path="health-services" element={<Services />} />
          <Route path="health-services/add" element={<AddService />} />
          <Route path="health-services/edit/:id" element={<EditService />} />
          <Route path="health-services/:id" element={<ViewService />} />

          {/* Inpatients Page */}
          <Route path="inpatients-rooms" element={<InpatientRoom />} />
          <Route path="inpatients" element={<Inpatients />} />
          <Route
            path="inpatients-rooms/room-details"
            element={<RoomDetail />}
          />

          {/* Department Page */}
          <Route path="departments" element={<Department />} />
          <Route path="departments/:id" element={<DepartmentDetail />} />

          {/* Authorization Page */}
          <Route path="authorization" element={<Authorization />} />

          {/* Others Page */}
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Auth Layout */}
        <Route path="signin" element={<SignIn />} />

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AdminApp;
