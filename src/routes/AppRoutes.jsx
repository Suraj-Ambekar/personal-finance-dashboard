import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import ProtectedRoute from "../components/ProtectedRoute";
import { AuthProvider } from "../context/AuthContext";
import Dashboard from "../pages/Dashboard";
import TransactionPage from "../pages/TransactionPage";
import SavingsGoals from "../pages/SavingsGoals";
import Layout from "../components/Layout";

export default function AppRoutes() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<AuthPage type="login" />} />
          <Route path="/register" element={<AuthPage type="register" />} />

          {/* Protected Routes with Navigation */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout /> {/* This includes Navigation and Outlet */}
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="transactions" element={<TransactionPage />} />
            <Route path="savings" element={<SavingsGoals />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
