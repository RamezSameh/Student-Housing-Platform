import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home/Home";
import HousingList from "./pages/Housing/HousingList";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/housing"
          element={<HousingList />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;