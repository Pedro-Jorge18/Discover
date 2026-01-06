import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';

export default function GoogleCallback({ setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [tempToken, setTempToken] = useState(null);
  const [accountType, setAccountType] = useState('guest');

  // set-password state
  const [showSetPassword, setShowSetPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  useEffect(() => {
    const qp = Object.fromEntries(new URLSearchParams(location.search));

    // Direct token flow (existing user or linked account)
    if (qp.token) {
      const token = qp.token;
      sessionStorage.setItem('token', token);
      // fetch user and navigate
      api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          setUser(res.data.user);
          navigate('/');
        })
        .catch(() => {
          setError('Erro a obter utilizador.');
          setLoading(false);
        });
      return;
    }

    // New user requires account selection
    if (qp.temp_token || qp.requires_account_type) {
      setTempToken(qp.temp_token || null);
      setUserInfo({ name: qp.name || null, email: qp.email || null, avatar: qp.avatar || null });
      setLoading(false);
      return;
    }

    setError('Autenticação Google incompleta.');
    setLoading(false);
  }, [location.search, navigate, setUser]);

  async function completeSignup() {
    if (!tempToken) return;
    setLoading(true);
    try {
      const res = await api.post('/auth/google/complete-signup', { temp_token: tempToken, account_type: accountType });
      const token = res.data.token;
      if (token) {
        sessionStorage.setItem('token', token);
        setUser(res.data.user);
        // show set-password modal so user can create a password for 2FA later
        setShowSetPassword(true);
        setLoading(false);
        return;
      }
      setError('Não foi possível completar o registo.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Erro ao completar o registo.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">Processando autenticação...</div>
    );
  }

  // Render overlay modal
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" aria-hidden="true"></div>

      {/* Modal container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gray-800 p-6 rounded-xl text-center shadow-lg">
          {error && <div className="text-red-400 mb-4">{error}</div>}

          {tempToken ? (
            <div>
              <div className="flex items-center justify-center mb-4">
                <div className="text-left">
                  <p className="text-gray-200 font-semibold">Bem-vindo{userInfo?.name ? `, ${userInfo.name}` : ''}.</p>
                  <p className="text-gray-400 text-sm">Escolha o tipo de conta para continuar</p>
                </div>
              </div>

              <div className="flex gap-3 justify-center mb-4">
                <button onClick={() => setAccountType('guest')} className={`px-4 py-2 rounded ${accountType==='guest' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-200'}`}>Cliente</button>
                <button onClick={() => setAccountType('host')} className={`px-4 py-2 rounded ${accountType==='host' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-200'}`}>Anfiltrião</button>
              </div>

              <div className="flex gap-3 justify-center">
                <button onClick={completeSignup} className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white">Continuar</button>
                <button onClick={() => { navigate('/'); }} className="rounded-lg bg-gray-700 px-6 py-2 text-sm font-semibold text-gray-200">Cancelar</button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-200">Autenticação concluída. Se não for redirecionado, tente novamente.</p>
            </div>
          )}
        </div>
      </div>

      {/* Set password modal shown after signup via Google */}
      {showSetPassword && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-gray-800 p-6 rounded-xl text-center shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Definir palavra-passe</h3>
            <p className="text-gray-400 text-sm mb-4">Para futuramente ativar 2FA e mais segurança, define uma password para a tua conta.</p>

            {passwordError && <div className="text-red-400 mb-3">{passwordError}</div>}

            <div className="relative mb-3">
              <input type={showPassword ? 'text' : 'password'} placeholder="Nova password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-gray-100 placeholder-gray-400" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 end-0 flex items-center px-3 text-gray-400">
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <div className="relative mb-4">
              <input type={showPasswordConfirm ? 'text' : 'password'} placeholder="Confirma password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-gray-100 placeholder-gray-400" />
              <button type="button" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} className="absolute inset-y-0 end-0 flex items-center px-3 text-gray-400">
                {showPasswordConfirm ? '🙈' : '👁️'}
              </button>
            </div>

            <div className="flex gap-3">
              <button onClick={async () => {
                setPasswordError(null);
                if (password.length < 8) { setPasswordError('A palavra-passe deve ter pelo menos 8 caracteres.'); return; }
                if (password !== passwordConfirm) { setPasswordError('As palavra-passes não coincidem.'); return; }
                try {
                  const token = sessionStorage.getItem('token');
                  await api.post('/auth/set-password', { password, password_confirmation: passwordConfirm }, { headers: { Authorization: `Bearer ${token}` } });
                  // after setting password navigate home
                  setShowSetPassword(false);
                  navigate('/');
                } catch (err) {
                  setPasswordError(err?.response?.data?.message || 'Erro ao definir password.');
                }
              }} className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white">Definir</button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
