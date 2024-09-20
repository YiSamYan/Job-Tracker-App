import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import JobListPage from "./pages/JobListPage";
import JobFormPage from "./pages/JobFormPage";
import Login from "./pages/LoginPage"; // Import the Login page
import Signup from "./pages/SignupPage"; // Import the Signup page
import AuthContext from "./context/AuthContext"; // Import the AuthProvider and AuthContext
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

// Component to protect routes that need authentication
const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const authContext = useContext(AuthContext);
  return authContext?.user ? children : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Root path conditionally showing the job list if authenticated */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <JobListPage />
                </PrivateRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/jobs"
              element={
                <PrivateRoute>
                  <JobListPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-job"
              element={
                <PrivateRoute>
                  <JobFormPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit-job/:id"
              element={
                <PrivateRoute>
                  <JobFormPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
