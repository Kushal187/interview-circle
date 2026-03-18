import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ExperienceListPage from "./pages/ExperienceListPage";
import ExperienceDetailPage from "./pages/ExperienceDetailPage";
import CreateExperiencePage from "./pages/CreateExperiencePage";
import EditExperiencePage from "./pages/EditExperiencePage";
import MySubmissionsPage from "./pages/MySubmissionsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import "./App.css";

function App() {
  return (
    <div className="ic-app">
      <Navbar />
      <main className="ic-main">
        <Routes>
          <Route path="/" element={<ExperienceListPage />} />
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
    </div>
  );
}

export default App;
