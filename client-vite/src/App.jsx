import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyAchievements from "./pages/MyAchievements";
import AddAchievement from "./pages/AddAchievement";
import AdminDashboard from "./pages/AdminDashboard";
import VerifyAchievements from "./pages/VerifyAchievements";
import Gamification from "./pages/Gamification";
import HallOfFame from "./pages/HallOfFame";

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hall-of-fame" element={<HallOfFame />} />
      <Route
        path="/login"
        element={user ? <Navigate to={user.role === "student" ? "/dashboard" : "/admin/dashboard"} replace /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to={user.role === "student" ? "/dashboard" : "/admin/dashboard"} replace /> : <Register />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/achievements"
        element={
          <ProtectedRoute>
            <MyAchievements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/achievements/add"
        element={
          <ProtectedRoute>
            <AddAchievement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/achievements/edit/:id"
        element={
          <ProtectedRoute>
            <AddAchievement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gamification"
        element={
          <ProtectedRoute requireRole={["student"]}>
            <Gamification />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requireRole={["admin", "faculty"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/verify"
        element={
          <ProtectedRoute requireRole={["admin", "faculty"]}>
            <VerifyAchievements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute requireRole={["admin", "faculty"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#fff",
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
