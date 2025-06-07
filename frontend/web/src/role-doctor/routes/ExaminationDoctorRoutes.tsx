
import { Route } from 'react-router-dom'
import Dashboard from '../pages/examination-doctor/Dashboard'
import Appointment from '../pages/examination-doctor/Appointment'
import Schedule from '../pages/examination-doctor/Schedule'
import Patients from '../pages/examination-doctor/Patients'
import PatientDetail from '../pages/examination-doctor/PatientDetail'
import Account from '../pages/examination-doctor/Account'


const ExaminationDoctorRoutes = [
  <Route key="examination-dashboard" index element={<Dashboard />} />,
  <Route key="examination-patients" path="patients" element={<Patients />} />,
  <Route key="examination-patient-detail" path="patient/detail" element={<PatientDetail />} />,
  <Route key="examination-appointment" path="appointment" element={<Appointment />} />,
  <Route key="examination-schedule" path="schedule" element={<Schedule />} />,
  <Route key="examination-account" path="account" element={<Account />} />,
]

export default ExaminationDoctorRoutes
