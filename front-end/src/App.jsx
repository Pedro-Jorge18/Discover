import { useState } from 'react';
import './App.css';
import AppRoutes from './Routes/AppRoutes.jsx'; 
import Login from './components/Auth/Login.jsx'; 
import Registration from './components/Auth/Registration';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import SettingsMain from './components/Settings/SettingsMain';

/**
 * The main component of the application.
 * Manages the global state (like the Login modal) and renders the AppRoutes.
 */
function App() {

  return (
    <div className="App">
      
      {/* AppRoutes calls Routes */}
      <AppRoutes />

    </div>
  );
}

export default App;