import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../components/HomePage/Home.jsx'; 
import ListingDetails from '../components/Listing/ListingDetails.jsx';
import Login from '../components/Auth/Login.jsx';
import GoogleCallback from '../components/Auth/GoogleCallback.jsx';
import Registration from '../components/Auth/Registration.jsx';
import ForgotPassword from '../components/Auth/ForgotPassword.jsx';
import Footer from '../components/Layout/Footer.jsx';
import SettingsMain from '../components/Settings/SettingsMain.jsx'; 
import SearchPage from '../components/Nav/SearchPage.jsx';
import FavoritesPage from '../components/Nav/FavoritesPage.jsx';
import MyReviews from '../components/Review/MyReviews.jsx';
import HostDashboard from '../components/Host/HostDashboard.jsx';
import CompanyInfo from '../components/Layout/CompanyInfo.jsx';
import TermsPage from '../components/Layout/TermsPage.jsx';
import PrivacyPage from '../components/Layout/PrivacyPage.jsx';
import HelpCenter from '../components/Layout/HelpCenter.jsx';

function AppRoutes({ user, setUser, termoPesquisa, setTermoPesquisa, onOpenSettings, onOpenSettingsAdmin }) {
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
        <Route 
          path="/" 
          element={
            <Home 
              user={user} 
              setUser={setUser} 
              termoPesquisa={termoPesquisa} 
              setTermoPesquisa={setTermoPesquisa}
              onOpenSettings={onOpenSettings}
              onOpenSettingsAdmin={onOpenSettingsAdmin}
            />
          }
        />

        <Route 
          path="/search" 
          element={
            <SearchPage 
              user={user} 
              setUser={setUser} 
              onOpenSettings={onOpenSettings}
              onOpenSettingsAdmin={onOpenSettingsAdmin}
            />
          }
        />

        {/* Dedicated Favorites Route */}
        <Route 
          path="/favoritos" 
          element={
            <FavoritesPage 
              user={user} 
              setUser={setUser} 
              onOpenSettings={onOpenSettings}
              onOpenSettingsAdmin={onOpenSettingsAdmin}
            />
          }
        />

        {/* Company Information Route */}
        <Route 
          path="/empresa" 
          element={
            <CompanyInfo 
              user={user} 
              setUser={setUser} 
              onOpenSettings={onOpenSettings}
              onOpenSettingsAdmin={onOpenSettingsAdmin}
            />
          }
        />

        {/* Terms and Conditions Route */}
        <Route 
          path="/termos" 
          element={
            <TermsPage 
              user={user} 
              setUser={setUser} 
              onOpenSettings={onOpenSettings}
              onOpenSettingsAdmin={onOpenSettingsAdmin}
            />
          }
        />

        {/* Privacy Policy Route */}
        <Route 
          path="/privacidade" 
          element={
            <PrivacyPage 
              user={user} 
              setUser={setUser} 
              onOpenSettings={onOpenSettings}
              onOpenSettingsAdmin={onOpenSettingsAdmin}
            />
          }
        />

        {/* Help Center Route */}
        <Route 
          path="/ajuda" 
          element={
            <HelpCenter 
              user={user} 
              setUser={setUser} 
              onOpenSettings={onOpenSettings}
              onOpenSettingsAdmin={onOpenSettingsAdmin}
            />
          }
        />

        <Route 
          path="/property/:id" 
          element={
            <ListingDetails 
              user={user} 
              setUser={setUser} 
              onOpenSettings={onOpenSettings}
              onOpenSettingsAdmin={onOpenSettingsAdmin}
            />
          }
        />

        {/* User & Settings Routes */}
        <Route path="/host" element={
          <RoleProtected role="host">
            <HostDashboard 
              user={user} 
              setUser={setUser}
              onOpenSettings={onOpenSettings}
              onOpenSettingsAdmin={onOpenSettingsAdmin}
            />
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

        {/* My Reviews Route */}
        <Route path="/my-reviews" element={
          <Protected>
            <MyReviews 
              user={user}
              setUser={setUser}
              onOpenSettings={onOpenSettings}
              onOpenSettingsAdmin={onOpenSettingsAdmin}
            />
          </Protected>
        } />

        <Route path="/login" element={<Login setUser={setUser}/>}/>
        <Route path="/auth/google/callback" element={<GoogleCallback setUser={setUser} />}/>
        <Route path="/register" element={<Registration />}/>
        <Route path="/forgotpassword" element={<ForgotPassword />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;