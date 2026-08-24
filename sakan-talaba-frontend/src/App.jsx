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
import BookingConfirmation from "./pages/Bookings/BookingConfirmation";

import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <div className="flex min-h-screen flex-col bg-slate-50">
            <Navbar />

            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/housing" element={<HousingList />} />
                <Route path="/housing/compare" element={<HousingCompare />} />
                <Route path="/housing/:id" element={<HousingDetails />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/bookings" element={<MyBookings />} />
                  <Route path="/my-bookings" element={<MyBookings />} />
                  <Route path="/bookings/request" element={<RequestBooking />} />
                  <Route path="/booking-confirmation/:id" element={<BookingConfirmation />} />
                  <Route path="/bookings/:id" element={<BookingDetails />} />
                </Route>

                <Route element={<ProtectedRoute adminOnly />}>
                  <Route path="/admin" element={<Admin />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<AdminUsers />} />
                  </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
