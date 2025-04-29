
import { Route } from 'react-router-dom'
import Dashboard from '../pages/examination-doctor/Dashboard'
import Appointment from '../pages/examination-doctor/Appointment'
import Schedule from '../pages/examination-doctor/Schedule'
import Patients from '../pages/examination-doctor/Patients'
import Account from '../pages/examination-doctor/Account'

const ExaminationDoctorRoutes = [
  <Route key="examination-dashboard" path="/examination/" element={<Dashboard />} />,
  <Route key="examination-patients" path="/examination/patients" element={<Patients />} />,
  <Route key="examination-appointment" path="/examination/appointment" element={<Appointment />} />,
  <Route key="examination-schedule" path="/examination/schedule" element={<Schedule />} />,
  <Route key="examination-account" path="/examination/account" element={<Account />} />
]

export default ExaminationDoctorRoutes
