import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home/Home";
import HousingList from "./pages/Housing/HousingList";
import HousingDetails from "./pages/Housing/HousingDetails";
import HousingCompare from "./pages/Housing/HousingCompare";
import Favorites from "./pages/Favorites/Favorites";
import MyBookings from "./pages/Bookings/MyBookings";
import BookingDetails from "./pages/Bookings/BookingDetails";
import RequestBooking from "./pages/Bookings/RequestBooking";

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

        <Route
          path="/housing/compare"
          element={<HousingCompare />}
        />

        <Route
          path="/favorites"
          element={<Favorites />}
        />

        <Route
          path="/bookings"
          element={<MyBookings />}
        />

        <Route
          path="/bookings/:id"
          element={<BookingDetails />}
        />

        <Route
          path="/bookings/request"
          element={<RequestBooking />}
        />

        <Route
          path="/my-bookings"
          element={<MyBookings />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;