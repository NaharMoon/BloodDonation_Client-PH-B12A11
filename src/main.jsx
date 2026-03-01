import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "./routes/router";
import AuthProvider from "./context/AuthProvider"; // যদি তোমার AuthProvider ফাইল নামে ভিন্ন হয়, সেটার নাম দাও
import ThemeProvider from "./context/ThemeProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);

