import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import ExaminationDoctorLayout from './layout/ExaminationDoctorLayout'
import TestDoctorLayout from './layout/TestDoctorLayout'
import ExaminationDoctorRoutes from './routes/ExaminationDoctorRoutes'
import TestDoctorRoutes from './routes/TestDoctorRoutes'

const DoctorApp: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/examination" element={<ExaminationDoctorLayout />}>
          {ExaminationDoctorRoutes}
        </Route>
        <Route path="/test" element={<TestDoctorLayout />}>
          {TestDoctorRoutes}
        </Route>
        <Route path="*" element={<div>404 - Không tìm thấy trang</div>} />
      </Routes>
    </Router>
  )
}

export default DoctorApp
