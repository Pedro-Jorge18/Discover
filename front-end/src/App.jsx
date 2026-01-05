import { useState, useEffect } from 'react';
import './App.css';
import AppRoutes from './Routes/AppRoutes.jsx';
import api from './api/axios';
import SettingsMain from './components/Settings/SettingsMain.jsx';
import SettingsHost from './components/Settings/SettingsHost.jsx'; 

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [termoPesquisa, setTermoPesquisa] = useState(""); 
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsOpenHost, setSettingsOpenHost] = useState(false);

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
        });
    }
  }, []); // Dependência vazia para correr apenas no load

  return (
    <div className="App">
      <AppRoutes 
        user={user} 
        setUser={setUser} 
        termoPesquisa={termoPesquisa} 
        setTermoPesquisa={setTermoPesquisa} 
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenSettingsHost={() => setSettingsOpenHost(true)}
      />

      {/* Modals/Settings */}
      {settingsOpen && (
        <SettingsMain 
          onClose={() => setSettingsOpen(false)} 
          user={user} 
          token={token} 
        />
      )}
      
      {settingsOpenHost && (
        <SettingsHost 
          onClose={() => setSettingsOpenHost(false)} 
          user={user}
        />
      )}
    </div>
  );
}

export default App;