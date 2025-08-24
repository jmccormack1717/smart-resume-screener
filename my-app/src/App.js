// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "/workspaces/smart-resume-screener/my-app/src/pages/Home.jsx";
import Results from "/workspaces/smart-resume-screener/my-app/src/pages/Results.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

