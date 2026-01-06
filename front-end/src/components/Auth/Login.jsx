import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import notify from "../../utils/notify";

export default function Login({ setUser }) {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [show2FAPopup, setShow2FAPopup] = useState(false);
  const [twoFACode, setTwoFACode] = useState("");
  const [tempToken, setTempToken] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  // Load user if saved token exists
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      api.get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          setUser(res.data.user);
          navigate("/");
        })
        .catch(err => {
          console.error("Erro ao carregar user:", err);
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
        });
    }
  }, [setUser, navigate]);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await api.post("/auth/login", { email, password, remember_me: remember });

      // If 2FA enabled, show popup and save temp token
      if (response.data.two_factor_required) {
          if (!response.data.temp_token) {
          console.error("Temp token não fornecido pelo backend.");
          notify("Erro ao iniciar 2FA. Tente novamente.", "error");
          return;
        }
        setTempToken(response.data.temp_token); 
        setShow2FAPopup(true);
        return;
      }

      // Normal login
      const token = response.data.token;
      if (!token) {
        console.error("Token não fornecido pelo backend.");
        notify("Erro no login. Tente novamente.", "error");
        return;
      }

      // Save token
      if (remember) {
        localStorage.setItem("token", token);
        sessionStorage.removeItem("token");
      } else {
        sessionStorage.setItem("token", token);
        localStorage.removeItem("token");
      }

      // Update user and navigate
      setUser(response.data.user);
      navigate("/");

    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 422) {
        setErrorMessage("Credenciais inválidas. Verifique o email e a palavra-passe.");
      } else {
        setErrorMessage("Erro de comunicação com o servidor.");
      }
    }
  };

  // Confirm 2FA
  const handleConfirm2FA = async () => {
    try {
      const res = await api.post("/auth/2fa/verify", { code: twoFACode }, {
        headers: { Authorization: `Bearer ${tempToken}` }
      });

      console.log("Resposta 2FA:", res.data);

      if (!res.data.status) {
        notify("Erro ao autenticar 2FA. Tente novamente.", "error");
        return;
      }

      const token = res.data.token;

      if (!token) {
        console.error("Token não fornecido pelo backend após 2FA.");
        notify("Erro ao autenticar 2FA. Tente novamente.", "error");
        return;
      }

      if (remember) {
        localStorage.setItem("token", token);
        sessionStorage.removeItem("token");
      } else {
        sessionStorage.setItem("token", token);
        localStorage.removeItem("token");
      }

      setUser(res.data.user);
      setShow2FAPopup(false);
      navigate("/");

    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 422) {
        setErrorMessage("Código inválido.");
      } else {
        setErrorMessage("Erro de comunicação com o servidor.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[40] flex items-center justify-center bg-black/60 backdrop-blur-sm" role="dialog">
      <div className="relative w-full max-w-md rounded-2xl bg-gray-800 shadow-2xl transition-all sm:my-8">
        <title>Discover - Login</title>
        {/* Head */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-700">
          <button
            onClick={() => navigate("/")}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            aria-label="Fechar"
          >
            ✕
          </button>

          <h3 className="text-xl font-semibold text-white text-center">
            Inicia sessão na tua conta
          </h3>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Endereço de email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="exemplo@empresa.com"
                required
                className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Palavra-passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  required
                  className="py-2.5 ps-4 pe-10 block w-full border border-gray-600 bg-gray-700 text-gray-100 rounded-lg sm:text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-0 flex items-center px-3 text-gray-400 cursor-pointer"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Remember me / Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-400">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="mr-2 rounded border-gray-600 bg-gray-700 focus:ring-indigo-500"
                />
                Lembrar-me
              </label>
              <button type="button" onClick={() => window.location.href="/forgotpassword"} className="text-sm font-medium text-indigo-400 hover:text-indigo-300">
                Esqueceu-se da palavra-passe?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-400 transition"
            >
              Entrar
            </button>
          </form>

          {/* Link to register */}
          <p className="mt-6 text-center text-sm text-gray-400">
            Ainda não tem conta?{" "}
            <button type="button" onClick={() => window.location.href="/register"} className="font-medium text-indigo-400 hover:text-indigo-300">
              Crie uma agora
            </button>
          </p>
        </div>

        {/* Border "ou" */}
        <div className="flex items-center justify-center px-6 py-4">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="mx-3 text-gray-400 text-sm font-medium">ou</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        {/* Social logins */}
        <div className="px-6 py-4 max-w-sm mx-auto">
            <div className="flex gap-4">
              <button onClick={async () => {
                try {
                  const resp = await api.get('/auth/google/redirect');
                  const url = resp.data?.url;
                  if (!url) {
                      notify('Não foi possível iniciar autenticação Google.', 'error');
                    return;
                  }
                  window.location.href = url;
                } catch (err) {
                  console.error('Erro Google redirect:', err);
                  notify('Erro ao iniciar autenticação Google.', 'error');
                }
              }} className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg text-gray-500 text-sm font-medium hover:border-gray-900 hover:bg-gray-900 transition duration-300">
                <img src="https://img.icons8.com/color/48/google-logo.png" className="w-5 h-5" />
                <span>Google</span>
              </button>
            </div>
        </div>
      </div>

      {/* Pop-up 2FA */}
      {show2FAPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full text-center border border-gray-800 shadow-lg">
            <h4 className="text-white font-semibold mb-4 text-lg">Código de Autenticação</h4>
            <input
              type="text"
              placeholder="Código"
              maxLength={6}
              id="2fa-code-input"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={twoFACode}
              onChange={(e) => setTwoFACode(e.target.value)}
              className="w-full mb-3 px-3 py-2 rounded-lg bg-gray-800 text-gray-300 border border-white"
            />
            <button
              onClick={handleConfirm2FA}
              className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-400 transition duration-300 w-full"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
      
      {errorMessage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-xl p-5 max-w-sm w-full text-center border border-gray-700 shadow-lg">
            <h4 className="text-white font-semibold mb-3">Ocorreu um erro</h4>

            <p className="text-gray-300 text-sm mb-6">
              {errorMessage}
            </p>

            <button
              onClick={() => setErrorMessage("")}
              className="w-full rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
