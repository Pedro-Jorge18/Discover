import { useState, useEffect } from 'react';
import './App.css';
import AppRoutes from './Routes/AppRoutes.jsx';
import api from './api/axios';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Only load user if there is a token in sessionStorage or localStorage
    const sessionToken = sessionStorage.getItem("token");
    const localToken = localStorage.getItem("token");

    const token = sessionToken || localToken;

    if (token) {
      api.get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          setUser(res.data.user);
        })
        .catch(() => {
          // If token is invalid, remove it
          sessionStorage.removeItem("token");
          localStorage.removeItem("token");
        });
    }
  }, []);

  return <AppRoutes user={user} setUser={setUser} />;
}

export default App;
