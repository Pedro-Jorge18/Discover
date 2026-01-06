import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../components/HomePage/Home.jsx'; 
import ListingDetails from '../components/Listing/ListingDetails.jsx';
import SettingsHost from '../components/Settings/SettingsHost.jsx';
import Login from '../components/Auth/Login.jsx';
import GoogleCallback from '../components/Auth/GoogleCallback.jsx';
import Registration from '../components/Auth/Registration.jsx';
import ForgotPassword from '../components/Auth/ForgotPassword.jsx';
import Footer from '../components/Layout/Footer.jsx';
import SettingsMain from '../components/Settings/SettingsMain.jsx'; 
import SearchPage from '../components/Nav/SearchPage.jsx';

// Added search props to the arguments
function AppRoutes({ user, setUser, termoPesquisa, setTermoPesquisa, onOpenSettings, onOpenSettingsHost, onOpenSettingsAdmin }) {
  // Simple frontend guards. Server must also enforce auth/roles.
  const Protected = ({ children }) => {
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  const RoleProtected = ({ role, children }) => {
    if (!user) return <Navigate to="/login" replace />;
    if (role && user.role !== role) return <Navigate to="/" replace />;
    return children;
  };
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
              onOpenSettingsAdmin={onOpenSettingsAdmin}
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
        <Route path="/host" element={
          <RoleProtected role="host">
            <SettingsHost user={user} />
          </RoleProtected>
        } />
        <Route path="/configuration" element={
          <Protected>
            <SettingsMain user={user} />
          </Protected>
        } />
        <Route path="/adminMenu" element={
          <RoleProtected role="admin">
            <SettingsMain user={user} />
          </RoleProtected>
        } />

        {/* Auth Routes */}
        <Route path="/login" element={<Login setUser={setUser}/>}/>
        <Route path="/auth/google/callback" element={<GoogleCallback setUser={setUser} />}/>
        <Route path="/register" element={<Registration />}/>
        <Route path="/forgotpassword" element={<ForgotPassword />}/>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default AppRoutes;