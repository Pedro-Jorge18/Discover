import { useState } from 'react'
import './App.css'
import Login from './components/Auth/Login'

function App() {
  {const [showLogin, setShowLogin] = useState(false)
  return (
    <div className="min-h-screen bg-green-400 text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Bem-vindo ao meu projeto</h1>
      <button 
        onClick={() => setShowLogin(true)}
        command="show-modal"
        commandfor="dialog"
        className="mb-6 bg-green-400 hover:bg-black text-white font-semibold py-2 px-4 rounded-lg transition"
      >
        Login 
      </button>
    </div>
  )
}} 
export default App
