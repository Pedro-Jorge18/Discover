import { useState } from 'react';
import './App.css';
import Login from './components/Auth/Login';
import Registration from './components/Auth/Registration';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import SettingsMain from './components/Settings/SettingsMain';

function App() {/*
  const [showLogin, setShowLogin] = useState(false);

  const handleOpenLogin = () => {
    setShowLogin(true);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };


  return (
    <div className="App">
      <AppRoutes onOpenLogin={handleOpenLogin} />
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Login onClose={handleCloseLogin} />
        </div>
      )}
    </div>
  );

  
*/
const [showLogin, setShowLogin] = useState(false)
    return (
      <div className="min-h-screen bg-green-400 text-white flex flex-col items-center justify-center">
        <Registration />
      </div>
    );
}

export default App;
