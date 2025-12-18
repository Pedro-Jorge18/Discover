import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Registration({ setUser }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;

    // Verify if the password is
    if (form.password.value !== form.password_confirmation.value) {
      alert("As passwords não coincidem.");
      return;
    }

    const payload = {
      name: form.name.value,
      last_name: form.last_name.value,
      phone: form.phone.value,
      birthday: form.birthday.value,
      email: form.email.value,
      password: form.password.value,
      password_confirmation: form.password_confirmation.value,
      role: form.role.value,
    };

    try {
      const response = await api.post("/auth/register", payload);

      alert("Conta criada com sucesso!");
      setUser(response.data.user);
      navigate("/");

    } catch (error) {
      if (error.response) {
      const data = error.response.data;

      if (data.errors) {        
        const messages = Object.values(data.errors)
          .flat()
          .join("\n");
        alert(messages);
      } else if (data.message) {
        
        alert(data.message);
      } else {
        alert("Erro desconhecido.");
      }
    } else {      
      alert("Erro de rede ou servidor.");
    }
    }
  };

  return (
    <div
      id="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-labelledby="dialog-title"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-gray-800 shadow-2xl transition-all sm:my-8 p-6">
        {/* Head */}
        <div className="pb-4 border-b border-gray-700">
          <h3 id="dialog-title" className="text-2xl font-semibold text-white text-center">
            Criar Conta
          </h3>
        </div>

        {/* Body */}
        <div className="pt-4">
          <form className="space-y-5" onSubmit={handleRegister}>
            {/* Name + Lastname */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                <input type="text" id="name" name="name" placeholder="António" required
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-300 mb-2">Apelido</label>
                <input type="text" id="last_name" name="last_name" placeholder="Rodrigues" required
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>

            {/* Phone + Birthday */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">Telefone</label>
                <input type="text" id="phone" name="phone" placeholder="987654321" required
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label htmlFor="birthday" className="block text-sm font-medium text-gray-300 mb-2">Data de Nascimento</label>
                <input type="date" id="birthday" name="birthday" required
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input type="email" id="email" name="email" placeholder="exemplo@empresa.com" required
                className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="********" required
                  className="py-2.5 ps-4 pe-10 block w-full border border-gray-600 bg-gray-700 text-gray-100 rounded-lg sm:text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-0 flex items-center px-3 text-gray-400 cursor-pointer">
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-300 mb-2">Confirmar Password</label>
              <div className="relative">
                <input id="password_confirmation" name="password_confirmation" type={showConfirmPassword ? "text" : "password"} placeholder="********" required
                  className="py-2.5 ps-4 pe-10 block w-full border border-gray-600 bg-gray-700 text-gray-100 rounded-lg sm:text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 end-0 flex items-center px-3 text-gray-400 cursor-pointer">
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Tipo de conta */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de conta</label>
              <div className="flex gap-6 bg-gray-700 border border-gray-600 rounded-lg p-3">
                <label className="flex items-center gap-2 text-gray-200 cursor-pointer">
                  <input type="radio" name="role" value={"guest"} className="text-indigo-500 focus:ring-indigo-500" defaultChecked />
                  <span className="text-sm">Cliente</span>
                </label>
                <label className="flex items-center gap-2 text-gray-200 cursor-pointer">
                  <input type="radio" name="role" value={"host"} className="text-indigo-500 focus:ring-indigo-500" />
                  <span className="text-sm">Anfitrião</span>
                </label>
              </div>
            </div>

            {/* Register Button */}
            <button type="submit"
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-400 transition">
              Criar Conta
            </button>
          </form>

          {/* Link to login */}
          <p className="mt-6 text-center text-sm text-gray-400">
            Já tem conta?{" "}
            <button onClick={() => window.location.href = "/login"}
              className="font-medium text-indigo-400 hover:text-indigo-300">
              Entre agora
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
