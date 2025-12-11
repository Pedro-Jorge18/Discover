import { useState } from 'react';
import './App.css';
import AppRoutes from './Routes/AppRoutes.jsx';
import Login from './components/Auth/Login.jsx';

function App() {

  const [user, setUser] = useState(null); // Save auth user

  return (
    <div className="App">

      <AppRoutes user={user} setUser={setUser}/>

      {/* render login onde quiseres */}
      {/* <Login setUser={setUser}/> */}
    </div>
  );
}

export default App;
