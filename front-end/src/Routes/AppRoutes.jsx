import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../components/HomePage/Home.jsx'; 
import ListingDetails from '../components/Listing/ListingDetails.jsx';
import SettingsHost from '../components/Settings/SettingsHost.jsx';
import Login from '../components/Auth/Login.jsx';
import Registration from '../components/Auth/Registration.jsx';
import ForgotPassword from '../components/Auth/ForgotPassword.jsx';
import Footer from '../components/Layout/Footer.jsx';
import SettingsMain from '../components/Settings/SettingsMain.jsx'; 
import SearchPage from '../components/Nav/SearchPage.jsx';

function AppRoutes({ user, setUser, termoPesquisa, setTermoPesquisa, onOpenSettings, onOpenSettingsHost }) {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home Page */}
        <Route 
          path="/" 
          element={
            <Home 
              user={user} 
              setUser={setUser} 
              termoPesquisa={termoPesquisa} 
              setTermoPesquisa={setTermoPesquisa}
              onOpenSettings={onOpenSettings}
              onOpenSettingsHost={onOpenSettingsHost}
            />
          }
        />

        {/* Search Results Page */}
        <Route 
          path="/search" 
          element={
            <SearchPage 
              user={user} 
              setUser={setUser} 
              onOpenSettings={onOpenSettings}
              onOpenSettingsHost={onOpenSettingsHost}
            />
          }
        />

        {/* Property Details */}
        <Route 
          path="/property/:id" 
          element={
            <ListingDetails 
              user={user} 
              setUser={setUser} 
              onOpenSettings={onOpenSettings}
              onOpenSettingsHost={onOpenSettingsHost}
            />
          }
        />

        {/* User & Settings Routes */}
        <Route path="/host" element={<SettingsHost />} />
        <Route path="/configuration" element={<SettingsMain />} />
        <Route path="/adminMenu" element={<SettingsMain />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login setUser={setUser}/>}/>
        <Route path="/register" element={<Registration />}/>
        <Route path="/forgotpassword" element={<ForgotPassword />}/>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default AppRoutes;