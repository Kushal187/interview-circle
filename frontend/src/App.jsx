import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import ExperienceListPage from "./pages/ExperienceListPage";
import ExperienceDetailPage from "./pages/ExperienceDetailPage";
import CreateExperiencePage from "./pages/CreateExperiencePage";
import EditExperiencePage from "./pages/EditExperiencePage";
import MySubmissionsPage from "./pages/MySubmissionsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import "./App.css";

function App() {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <div className="ic-app">
      <a href="#main-content" className="ic-skip-link">
        Skip to main content
      </a>
      <Navbar transparent={isLanding} />
      {isLanding ? (
        <main id="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </main>
      ) : (
        <main id="main-content" className="ic-main">
          <Routes>
            <Route path="/browse" element={<ExperienceListPage />} />
            <Route path="/experience/:id" element={<ExperienceDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/submit"
              element={
                <ProtectedRoute>
                  <CreateExperiencePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <ProtectedRoute>
                  <EditExperiencePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-submissions"
              element={
                <ProtectedRoute>
                  <MySubmissionsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      )}
    </div>
  );
}

export default App;
