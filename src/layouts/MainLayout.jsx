import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { ToastContainer } from "react-toastify";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer></ToastContainer>
    </div>
  );
}
