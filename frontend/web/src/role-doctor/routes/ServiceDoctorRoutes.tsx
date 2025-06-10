
import { Route } from 'react-router-dom'
import Dashboard from '../pages/service-doctor/Dashboard'
import Schedule from '../pages/service-doctor/Schedule'
import Patients from '../pages/service-doctor/Patients'
import Account from '../pages/service-doctor/Account'

const ServiceDoctorRoutes = [
  <Route key="service-dashboard" index element={<Dashboard />} />,
  <Route key="service-patients" path="patients" element={<Patients />} />,
  <Route key="service-schedule" path="schedule" element={<Schedule />} />,
  <Route key="service-account" path="account" element={<Account />} />
]

export default ServiceDoctorRoutes
