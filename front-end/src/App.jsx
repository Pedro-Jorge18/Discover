import { useState, useEffect } from 'react';
import './App.css';
import AppRoutes from './Routes/AppRoutes.jsx';
import api from './api/axios';
import SettingsMain from './components/Settings/SettingsMain.jsx';
import SettingsHost from './components/Settings/SettingsHost.jsx'; 

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // estado para o token
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
          setToken(currentToken); // guardar token no estado
        })
        .catch(() => {
          sessionStorage.removeItem("token");
          localStorage.removeItem("token");
        });
    }
  }, [localStorage.getItem("token"), sessionStorage.getItem("token")]);

  return (
    <>
      <AppRoutes 
        user={user} 
        setUser={setUser} 
        termoPesquisa={termoPesquisa} 
        setTermoPesquisa={setTermoPesquisa} 
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenSettingsHost={() => setSettingsOpenHost(true)}
      />

      {settingsOpen && <SettingsMain onClose={() => setSettingsOpen(false)} user={user} token={token} />}
      {settingsOpenHost && <SettingsHost onClose={() => setSettingsOpenHost(false)} />}
    </>
  );
}

export default App;
