import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import { Outlet } from "react-router-dom";

//Layout
import ContactPage from "./pages/ContactPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";

import { UserProvider } from "./components/auth/UserContext";

//Homepage Searchpage
import HomePage from "./pages/Homepage";
import Category from "./components/Category";
import ChineseRestaurants from "./pages/categories/ChineseRestaurants";
import GermanRestaurants from "./pages/categories/GermanRestaurants";
import KoreanRestaurants from "./pages/categories/KoreanRestaurants";
import ItalianRestaurants from "./pages/categories/ItalienRestaurants";
import SearchResultsPage from "./pages/SearchResultsPage";

// Dashboard
import Layout from "./Layout";

import CustomerDashboardPage from "./pages/CustomerDashboardPage";
import RestaurantDashboardPage from "./pages/RestaurantDashboardPage";
import BookingDetailsPage from "./pages/BookingDetails";
import ProfileEditCustomer from "./components/dashboard/ProfileEditCustomer";
import ProfileEditRestaurantOwner from "./components/dashboard/ProfileEditRestaurantOnwer";

// Auth
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import LoginSuccess from "./components/auth/LoginSuccess";
import Profile from "./components/auth/Profile";
import PrivateRoute from "./components/auth/PrivateRoute";
import ProfileSetupCustomer from "./components/auth/ProfileSetupCustomer";
import ProfileSetupRestaurantOwner from "./components/auth/ProfileSetupRestaurantOwner";

// restaurant page
import RestaurantHeader from "./components/RestaurantHeader";
import Discounts from "./components/Discounts";
import Menu from "./components/Menu";
import Photos from "./components/Photos";
import Reviews from "./components/Reviews";
import BookingForm from "./components/BookingForm";
import Success from "./components/Success";

// style for auth
import "./styles/styles.css";
import BookingSuccess from "./components/BookingSuccess";
import AdditionalInfoForm from "./components/auth/AdditionalInfoForm";
import ResetPassword from "./components/auth/ResetPassword";
import ResetPasswordForm from "./components/auth/ResetPasswordForm";

function App() {
  // to get user ID
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  useEffect(() => {
    const handleStorageChange = () => {
      setUserId(localStorage.getItem("userId"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [userId]);

  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Home & search */}
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<HomePage />} />
              <Route path="/search-results" element={<SearchResultsPage />} />
              <Route path="/" element={<Category />} />
              {/* Restaurant types */}
              <Route
                path="/api/restaurants/type/chinese"
                element={<ChineseRestaurants />}
              />
              <Route
                path="/api/restaurants/type/german"
                element={<GermanRestaurants />}
              />
              <Route
                path="/api/restaurants/type/korean"
                element={<KoreanRestaurants />}
              />
              <Route
                path="/api/restaurants/type/italian"
                element={<ItalianRestaurants />}
              />
              {/* Contact & privacy */}
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              {/* Dashboard routes with BookingsProvider */}

              <Route
                path="/customerDashboard/:userId"
                element={<CustomerDashboardPage />}
              />
              <Route
                path="/customerDashboard/profile-edit/:userId"
                element={<ProfileEditCustomer />}
              />
              <Route
                path="/restaurantDashboard/:userId"
                element={<RestaurantDashboardPage />}
              />
              <Route
                path="/restaurantDashboard/profile-edit/:userId"
                element={<ProfileEditRestaurantOwner />}
              />

              <Route path="/bookingDetails" element={<BookingDetailsPage />} />

              {/* Registration & login */}
              <Route path="/register" element={<Register />} />
              <Route
                path="/profile-setup-customer/:userId"
                element={<ProfileSetupCustomer />}
              />
              <Route
                path="/profile-setup-restaurant-owner/:userId"
                element={<ProfileSetupRestaurantOwner />}
              />
              <Route
                path="/additional-info/:userId"
                element={<AdditionalInfoForm />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/login-success" element={<LoginSuccess />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/reset-password-form" element={<ResetPasswordForm />} />
              <Route
                path="/profile"
                element={<PrivateRoute element={Profile} />}
              />
              {/* Restaurant specific routes */}
              <Route path="/:userId" element={<RestaurantHeader />} />
              <Route path="/:userId/discounts" element={<Discounts />} />
              <Route path="/:userId/menu" element={<Menu />} />
              <Route path="/:userId/photos" element={<Photos />} />
              <Route path="/:userId/reviews" element={<Reviews />} />
              <Route path="/:userId/booking" element={<BookingForm />} />
              <Route path="/success" element={<Success />} />
              <Route path="/booking-success" element={<BookingSuccess />} />
              {/* 404 */}
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Routes>
          <ToastContainer />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
