import { useState } from 'react';
import './App.css';
import AppRoutes from './Routes/AppRoutes.jsx';
import Login from './components/Auth/Login.jsx';

function App() {

  const [user, setUser] = useState(null); // Save auth user

  //Test 
  /*const [user, setUser] = useState({
    id: 1,
    email: "teste@exemplo.com",
    password: "1234"
  });*/


  return (
    <div className="App">

      <AppRoutes user={user} setUser={setUser}/>
      
    </div>
  );
}

export default App;
