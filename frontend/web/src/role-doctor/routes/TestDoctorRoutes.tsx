
import { Route } from 'react-router-dom'
import Dashboard from '../pages/test-doctor/Dashboard'
import Schedule from '../pages/test-doctor/Schedule'
import Patients from '../pages/test-doctor/Patients'
import Account from '../pages/test-doctor/Account'

const TestDoctorRoutes = [
  <Route key="test-dashboard" index element={<Dashboard />} />,
  <Route key="test-patients" path="patients" element={<Patients />} />,
  <Route key="test-schedule" path="schedule" element={<Schedule />} />,
  <Route key="test-account" path="account" element={<Account />} />
]

export default TestDoctorRoutes
