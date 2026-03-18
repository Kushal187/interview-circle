import { Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="ic-app">
      <main className="ic-main">
        <Routes>
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
