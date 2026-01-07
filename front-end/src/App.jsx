import { useState, useEffect } from 'react';
import './App.css';
import AppRoutes from './Routes/AppRoutes.jsx';
import ToastContainer from './components/Ui/ToastContainer.jsx';
import api from './api/axios';
import SettingsMain from './components/Settings/SettingsMain.jsx';
import SettingsAdmin from './components/Settings/SettingsAdmin.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [termoPesquisa, setTermoPesquisa] = useState(""); 
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsOpenAdmin, setSettingsOpenAdmin] = useState(false);

  useEffect(() => {
    const sessionToken = sessionStorage.getItem("token");
    const localToken = localStorage.getItem("token");
    const currentToken = sessionToken || localToken;

    if (currentToken) {
      api.get("/auth/me", { headers: { Authorization: `Bearer ${currentToken}` } })
        .then(res => {
          setUser(res.data.user);
          setToken(currentToken);
        })
        .catch(() => {
          sessionStorage.removeItem("token");
          localStorage.removeItem("token");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">A carregar...</p>
        </div>
      </div>
    );
  }

  return (    
    <div className="App">
      <ToastContainer />
      <AppRoutes 
        user={user} 
        setUser={setUser} 
        termoPesquisa={termoPesquisa} 
        setTermoPesquisa={setTermoPesquisa} 
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenSettingsAdmin={() => setSettingsOpenAdmin(true)}
      />

      {settingsOpen && <SettingsMain onClose={() => setSettingsOpen(false)} user={user} token={token} />}
      {settingsOpenAdmin && <SettingsAdmin onClose={() => setSettingsOpenAdmin(false)} user={user} token={token} />}
    </div>
  );
}

export default App;