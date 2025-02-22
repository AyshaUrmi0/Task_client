import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import AddTask from "./components/AddTask";
import AuthProvider from "./provider/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Privet from "./privet/Privet";
import { Toaster } from "react-hot-toast";
import LoginPage from "./components/LoginPage";
import SignUpPAge from "./components/SignUpPAge";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: "/",
        element: (
          <Privet>
            <Home></Home>
          </Privet>
        ),
      },
      {
        path: "/add-task",
        element: (
          <Privet>
            <AddTask></AddTask>
          </Privet>
        ),
      },
      {
        path: "/login",
        element: <LoginPage></LoginPage>,
      },
      {
        path: "/sign-up",
        element: <SignUpPAge></SignUpPAge>,
      },
    ],
  },
]);

const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster></Toaster>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
