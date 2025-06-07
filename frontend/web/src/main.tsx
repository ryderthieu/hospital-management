import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";

import AdminApp from "./role-admin/App.tsx";
import DoctorApp from "./role-doctor/App.tsx";
import { AppWrapper } from "./role-admin/components/common/PageMeta.tsx";


// Chọn App theo URL: nếu path chứa '/admin' thì dùng AdminApp, ngược lại dùng DoctorApp
const App = window.location.pathname.startsWith("/admin")
  ? AdminApp
  : DoctorApp;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <AppWrapper>
        <App />
      </AppWrapper>
  </StrictMode>
);
