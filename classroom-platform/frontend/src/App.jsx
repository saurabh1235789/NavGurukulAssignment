import { useEffect } from "react";
import ClassroomPage from "./pages/ClassroomPage";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import SessionTestPage from "./pages/SessionTestPage";
import NotesTestPage from "./pages/NotesTestPage";
import PollsTestPage from "./pages/PollsTestPage";
import ProtectedRoute from "./routes/ProtectedRoute";

import {
  connectSocket,
} from "./services/socket";

function App() {

  useEffect(() => {

    connectSocket();

  }, []);

  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/classroom"
          element={
            <ProtectedRoute>
              <ClassroomPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/session"
          element={
            <ProtectedRoute>
              <SessionTestPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notes-test"
          element={
            <ProtectedRoute>
              <NotesTestPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/polls-test"
          element={
            <ProtectedRoute>
              <PollsTestPage />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;