import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Patient from "./pages/Patients/Patient";
import PatientDetail from "./pages/Patients/PatientDetail";
import Doctor from "./pages/Doctors/Doctor";
import Medicine from "./pages/Medicines/Medicines";
import Service from "./pages/HealthServices/Services";
import Department from "./pages/Departments/Department";
import PatientRoom from "./pages/PatientRooms/PatientsRoom";
import AddPatient from "./pages/Patients/AddPatient"; 
import Inpatient from "./pages/PatientRooms/Inpatients";
import RoomDetail from "./pages/PatientRooms/RoomDetails";
import PatientAddForm from "./pages/Patients/PatientAddForm"; 
import Inpatient from "./pages/PatientRooms/Inpatients";
import Clinics from "./pages/MedicalExamination/OutpatientClinics";
import MedicalCalendar from "./pages/MedicalExamination/MedicalCalendar";
import ClinicDetail from "./pages/MedicalExamination/ClinicDetail";
import InpatientRoom from "./pages/PatientRooms/InPatientsRoom";

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

            {/* Medicines Page */}
            <Route path="/admin/medicines" element={<Medicine />} />

            {/* Services Page */}
            <Route path="/admin/health-services" element={<Service />} />

            {/* Patients Room Page */}
            <Route path="/admin/inpatients-rooms" element={<InpatientRoom />} />
            <Route path="/admin/inpatients" element={<Inpatient />} />
            <Route path="/admin/roomdetails" element={<RoomDetail />} />

            {/* Department Page */}
            <Route path="/admin/departments" element={<Department />} />

            {/* Others Page */}
            <Route path="/admin/profile" element={<UserProfiles />} />
            <Route path="/admin/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/admin/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/admin/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/admin/alerts" element={<Alerts />} />
            <Route path="/admin/avatars" element={<Avatars />} />
            <Route path="/admin/badge" element={<Badges />} />
            <Route path="/admin/buttons" element={<Buttons />} />
            <Route path="/admin/images" element={<Images />} />
            <Route path="/admin/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/admin/line-chart" element={<LineChart />} />
            <Route path="/admin/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default AdminApp;