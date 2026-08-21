import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home/Home";
import HousingList from "./pages/Housing/HousingList";
import HousingDetails from "./pages/Housing/HousingDetails";

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

        <Route
          path="/housing/:id"
          element={<HousingDetails />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;