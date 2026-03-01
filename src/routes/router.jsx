import { createBrowserRouter } from "react-router-dom";

// Layouts
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Public Pages
import Home from "../pages/Home";
import About from "../pages/About";
import Search from "../pages/Search";
import DonationRequests from "../pages/DonationRequests";
import Funding from "../pages/Funding";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";

// Donation Details (PRIVATE)
import DonationRequestDetails from "../pages/DonationRequestDetails";

// Dashboard Pages
import Overview from "../pages/dashboard/Overview";
import Profile from "../pages/dashboard/Profile";
import MyDonationRequests from "../pages/dashboard/MyDonationRequests";
import CreateDonationRequest from "../pages/dashboard/CreateDonationRequest";
import EditDonationRequest from "../pages/dashboard/EditDonationRequest";
import AllRequests from "../pages/dashboard/AllRequests";
import Users from "../pages/dashboard/Users";

// Route Guards
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import AdminOrVolunteerRoute from "./AdminOrVolunteerRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "find-blood", element: <Search /> },
      { path: "donation-requests", element: <DonationRequests /> },

      // Details must be private
      {
        path: "donation-requests/:id",
        element: (
          <PrivateRoute>
            <DonationRequestDetails />
          </PrivateRoute>
        ),
      },

      // Funding private
      {
        path: "funding",
        element: (
          <PrivateRoute>
            <Funding />
          </PrivateRoute>
        ),
      },

      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },

  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Overview /> },
      { path: "profile", element: <Profile /> },

      // Donor
      { path: "my-donation-requests", element: <MyDonationRequests /> },
      { path: "create-donation-request", element: <CreateDonationRequest /> },

      // ✅ consistent edit route
      { path: "edit-donation-request/:id", element: <EditDonationRequest /> },

      // Admin + Volunteer
      {
        path: "all-blood-donation-request",
        element: (
          <AdminOrVolunteerRoute>
            <AllRequests />
          </AdminOrVolunteerRoute>
        ),
      },

      // Admin only
      {
        path: "all-users",
        element: (
          <AdminRoute>
            <Users />
          </AdminRoute>
        ),
      },
    ],
  },
]);
