import { useState } from 'react';
import './App.css';
import Login from './components/Auth/Login';
import Registration from './components/Auth/Registration';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import SettingsMain from './components/Settings/SettingsMain';

function App() {
  const [activeModal, setActiveModal] = useState('login'); // 'login' | 'forgot' | 'register'

  return (
    <Registration />
  );
}

export default App;
