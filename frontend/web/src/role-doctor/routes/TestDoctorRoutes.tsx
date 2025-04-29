
import { Route } from 'react-router-dom'
import Dashboard from '../pages/test-doctor/Dashboard'
import Schedule from '../pages/test-doctor/Schedule'
import Patients from '../pages/test-doctor/Patients'
import Account from '../pages/test-doctor/Account'

const testDoctorRoutes = [
  <Route key="test-dashboard" path="/test/" element={<Dashboard />} />,
  <Route key="test-patients" path="/test/patients" element={<Patients />} />,
  <Route key="test-schedule" path="/test/schedule" element={<Schedule />} />,
  <Route key="test-account" path="/test/account" element={<Account />} />
]

export default testDoctorRoutes
