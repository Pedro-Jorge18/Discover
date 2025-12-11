import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../components/HomePage/Home.jsx';
import ListingDetails from '../components/Listing/ListingDetails.jsx';
import Footer from '../components/Layout/Footer.jsx';
import SettingsHost from '../components/Settings/SettingsHost.jsx';
import Login from '../components/Auth/Login.jsx';
import Registration from '../components/Auth/Registration.jsx';
import SettingsMain from '../components/Settings/SettingsHost.jsx';
import ForgotPassword from '../components/Auth/ForgotPassword.jsx';
 

function AppRoutes({ user, setUser }) {
  return (
    <BrowserRouter>
      <Routes>
       
        {/* Homepage Route */}
        <Route
            path="/"
            element={<Home user={user} setUser={setUser}/>}
        />
 
        {/* Dynamic Route for Listing Details */}
        <Route
            path="/alojamento/:id"
            element={<ListingDetails />}
        />
       
        {/* Host Settings Route */}
        <Route path="/host"
        element={<SettingsHost />} />
        <Route
            path="/configuration"
            element={<SettingsMain />}
        />
        <Route
            path="/adminMenu"
            element={<SettingsMain />}
        />

        {/* Auth */}
        <Route
            path="/login"
            element={<Login />}
        />
        <Route
            path="/register"
            element={<Registration />}
        />
        <Route
            path="/forgotpassword"
            element={<ForgotPassword />}
        />
 
      </Routes>
    </BrowserRouter>
  );
}
 
export default AppRoutes;