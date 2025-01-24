import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandPage from "./parts/landPage";
import Guide from "./parts/Guide"
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandPage />} />
        <Route path="/Login" element={<h1>About Page</h1>} />
        <Route path="/Guide" element={<Guide/>} />
      </Routes>
    </Router>
  );
}

export default App;
