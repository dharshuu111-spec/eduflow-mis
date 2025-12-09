import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Login from "./pages/Login";
import DashboardLayout from "./components/layout/DashboardLayout";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import Students from "./pages/admin/Students";
import AddStudent from "./pages/admin/AddStudent";
import Teachers from "./pages/admin/Teachers";
import Attendance from "./pages/admin/Attendance";
import Timetable from "./pages/admin/Timetable";
import Reports from "./pages/admin/Reports";

// Staff Pages (HOD, Class Coordinator, Subject Incharge)
import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffStudents from "./pages/staff/StaffStudents";
import StaffTeachers from "./pages/staff/StaffTeachers";
import StaffAttendance from "./pages/staff/StaffAttendance";
import StaffTimetable from "./pages/staff/StaffTimetable";
import StaffReports from "./pages/staff/StaffReports";
import StaffClasses from "./pages/staff/StaffClasses";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentAccounts from "./pages/student/StudentAccounts";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Login */}
            <Route path="/" element={<Login />} />
            
            {/* Admin Routes - Full Access */}
            <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="students" element={<Students />} />
              <Route path="students/add" element={<AddStudent />} />
              <Route path="teachers" element={<Teachers />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="timetable" element={<Timetable />} />
              <Route path="reports" element={<Reports />} />
            </Route>

            {/* Staff Routes - HOD, Class Coordinator, Subject Incharge */}
            <Route path="/staff" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/staff/dashboard" replace />} />
              <Route path="dashboard" element={<StaffDashboard />} />
              <Route path="students" element={<StaffStudents />} />
              <Route path="teachers" element={<StaffTeachers />} />
              <Route path="attendance" element={<StaffAttendance />} />
              <Route path="timetable" element={<StaffTimetable />} />
              <Route path="reports" element={<StaffReports />} />
              <Route path="classes" element={<StaffClasses />} />
            </Route>

            {/* Student Routes - Individual Access Only */}
            <Route path="/student" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/student/dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="attendance" element={<StudentAttendance />} />
              <Route path="accounts" element={<StudentAccounts />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
