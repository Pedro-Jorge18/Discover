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
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);

  const handleOpenLogin = () => {
    setShowLogin(true);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };


  return (
    <div className="App">
      
      {/* AppRoutes calls Homepage, Header, and Routes */}
      <AppRoutes onOpenLogin={handleOpenLogin} />

      {/* The Login Modal is rendered here outside of the routes */}
      {user && (<h1>TESTETETSTET</h1>)}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Login setUser={setUser}/>
        </div>
      )}
    </div>
  );
}

export default App;