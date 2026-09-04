import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
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
import ContactUs from "./pages/ContactUs";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import OwnerLayout from "./pages/Owner/OwnerLayout";
import OwnerDashboard from "./pages/Owner/OwnerDashboard";
import OwnerHousings from "./pages/Owner/OwnerHousings";
import OwnerHousingForm from "./pages/Owner/OwnerHousingForm";
import OwnerBookings from "./pages/Owner/OwnerBookings";
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
                <Route path="/contact" element={<ContactUs />} />

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

                <Route element={<ProtectedRoute ownerOnly />}>
                  <Route path="/owner" element={<OwnerLayout />}>
                    <Route index element={<OwnerDashboard />} />
                    <Route path="housings" element={<OwnerHousings />} />
                    <Route path="housings/new" element={<OwnerHousingForm />} />
                    <Route path="housings/:id/edit" element={<OwnerHousingForm />} />
                    <Route path="bookings" element={<OwnerBookings />} />
                  </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
