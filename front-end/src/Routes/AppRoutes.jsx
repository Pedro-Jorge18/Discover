import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../components/HomePage/Home.jsx'; 
import ListingDetails from '../components/Listing/ListingDetails.jsx';
import SettingsHost from '../components/Settings/SettingsHost.jsx';
import Login from '../components/Auth/Login.jsx';
import Registration from '../components/Auth/Registration.jsx';
import ForgotPassword from '../components/Auth/ForgotPassword.jsx';
import Footer from '../components/Layout/Footer.jsx';
import SettingsMain from '../components/Settings/SettingsHost.jsx'; 

// Added search props to the arguments
function AppRoutes({ user, setUser, termoPesquisa, setTermoPesquisa }) {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pass search props to Home */}
        <Route 
          path="/" 
          element={
            <Home 
              user={user} 
              setUser={setUser} 
              termoPesquisa={termoPesquisa} 
              setTermoPesquisa={setTermoPesquisa}
            />
          }
        />

        {/* Pass search props to ListingDetails so the Header stays functional there */}
        <Route 
          path="/alojamento/:id" 
          element={
            <ListingDetails 
              user={user} 
              setUser={setUser} 
              termoPesquisa={termoPesquisa} 
              setTermoPesquisa={setTermoPesquisa}
            />
          }
        />

        {/* User Routes */}
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