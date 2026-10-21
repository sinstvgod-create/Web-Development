import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Assessment from "./pages/Assessment";
import Dashboard from "./pages/Dashboard";
import WorkoutPlan from "./pages/WorkoutPlan";
import LogWorkout from "./pages/LogWorkout";
import DietPlan from "./pages/DietPlan";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={<Landing />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/assessment"
              element={<Assessment />}
            />

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/workout"
              element={<WorkoutPlan />}
            />

            {/* Plan Alias */}
            <Route
              path="/plan"
              element={<WorkoutPlan />}
            />

            <Route
              path="/workout/log"
              element={<LogWorkout />}
            />

            <Route
              path="/diet"
              element={<DietPlan />}
            />

            <Route
              path="/progress"
              element={<Progress />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;