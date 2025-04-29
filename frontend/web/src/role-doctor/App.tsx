import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import ExaminationDoctorRoutes from './routes/ExaminationDoctorRoutes'
import TestDoctorRoutes from './routes/TestDoctorRoutes'

const DoctorApp: React.FC = () => {
  return (
    <Router>
      <Routes>
        {ExaminationDoctorRoutes}
        {TestDoctorRoutes}
        <Route path="*" element={<div>404 - Không tìm thấy trang</div>} />
      </Routes>
    </Router>
  )
}

export default DoctorApp
