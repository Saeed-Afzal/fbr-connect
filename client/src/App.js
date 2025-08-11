import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import RedirectIfAuth from "./components/RedirectIfAuth";
import PendingApproval from "./components/PendingApproval";
import { useAxiosInterceptor } from "./hooks/useAxiosInterceptor";
import AxiosInterceptorWrapper from "./components/AxiosInterceptorWrapper";
import AdminDashboard from "./pages/AdminDashboard";

const RedirectHome = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;
  console.log(user.role,'user.role === "admin"');
  
  if (user.role === "admin") return <Navigate to="/admin" />;
  return <Navigate to="/dashboard" />;
};


// const RedirectIfAuth = ({ children }) => {
//   const { user } = useContext(AuthContext);
//   return user ? <Navigate to="/dashboard" /> : <>{children}</>;
// };

const NotFound = () => (
  <div style={{ padding: 20, textAlign: "center" }}>
    <h1>404 Not Found</h1>
    <p>Page does not exist.</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <AxiosInterceptorWrapper>
          <AppRoutes /> {/* Now user is safe to use here */}
        </AxiosInterceptorWrapper>
      </Router>
    </AuthProvider>
  );
}

function AppRoutes() {
  const { user } = useContext(AuthContext);
console.log(user, 'user');

  return (
    <Routes>
      <Route path="/" element={<RedirectHome />} />
      <Route
        path="/login"
        element={
          <RedirectIfAuth>
            <Login />
          </RedirectIfAuth>
        }
      />
      <Route
        path="/signup"
        element={
          <RedirectIfAuth>
            <Signup />
          </RedirectIfAuth>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
             {user?.role === "admin" ? <Navigate to="/admin" /> : <Dashboard />}
          </ProtectedRoute>
        }
      />
      <Route path="/pending" element={<PendingApproval />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            {user?.role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/dashboard" />
            )}
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}


export default App;
