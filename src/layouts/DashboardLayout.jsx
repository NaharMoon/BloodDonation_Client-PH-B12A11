import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import { ToastContainer } from "react-toastify";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* Dashboard এ Navbar mobile menu বন্ধ */}
      <Navbar hideMenu={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-[290px_1fr] gap-6">
          <DashboardSidebar />
          <main className="min-h-[70vh]">
            <Outlet />
          </main>
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
}
