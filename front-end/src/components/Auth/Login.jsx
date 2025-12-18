import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Login({ setUser }) {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  // Load user if saved token exist
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

  const handleLogin = async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;

  try {
    const response = await api.post("/auth/login", { email, password, remember_me: remember });
    const token = response.data.token;

    if (remember) {
      localStorage.setItem("token", token);
      sessionStorage.removeItem("token"); // Avoid duplication
    } else {
      sessionStorage.setItem("token", token);
      localStorage.removeItem("token"); // Avoid duplication
    }

    setUser(response.data.user);
    navigate("/");

  } catch (error) {
    console.error(error);
    alert("Erro no login. Verifica as credenciais.");
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" role="dialog">
      <div className="relative w-full max-w-md rounded-2xl bg-gray-800 shadow-2xl transition-all sm:my-8">

        {/* Head */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-700">
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
                Password
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
                Esqueceste-te da palavra-passe?
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
            Ainda não tens conta?{" "}
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
            <a href="#" className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg text-gray-500 text-sm font-medium hover:border-gray-900 hover:bg-gray-900 transition duration-300">
              <img src="https://img.icons8.com/color/48/google-logo.png" className="w-5 h-5" />
              <span>Google</span>
            </a>
            <a href="#" className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg text-gray-500 text-sm font-medium hover:border-gray-900 hover:bg-gray-900 transition duration-300">
              <img src="https://img.icons8.com/?size=100&id=uLWV5A9vXIPu&format=png" className="w-5 h-5" />
              <span>Facebook</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
