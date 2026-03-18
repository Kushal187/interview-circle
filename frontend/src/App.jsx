import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  return (
    <div className="ic-app">
      <Navbar />
      <main className="ic-main">
        <Routes>
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
