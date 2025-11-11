import { useState } from 'react';
import './App.css';
import AppRoutes from './Routes/AppRoutes.jsx'; 
import Login from './components/Auth/Login.jsx'; 

function App() {
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
}

export default App;