import { useState } from "react";

export default function Registration() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;

    const payload = {
      name: form.name.value,
      phone: form.phone.value,
      email: form.email.value,
      password: form.password.value,
      tipo_conta: form.tipo_conta.value, // 1 = Cliente | 2 = Anfitrião
      remember: form.remember?.checked ? 1 : 0,
    };

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Erro ao registar");
      }

      const data = await response.json();
      console.log("Utilizador registado:", data);
      alert("Registo concluído com sucesso!");

    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao criar a conta.");
    }
  };

  return (
    <div
      id="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-labelledby="dialog-title"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-gray-800 shadow-2xl transition-all sm:my-8">

        {/* Head */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-700">
          <h3
            id="dialog-title"
            className="text-xl font-semibold text-white text-center"
          >
            Inicia sessão na tua conta
          </h3>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Nome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="António Rodrigues"
                required
                className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Telefone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="987654321"
                required
                className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
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
            <div className="space-y-5">
              <label htmlFor="password" className="block text-sm mb-2 text-gray-300">
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  required
                  className="py-2.5 sm:py-3 ps-4 pe-10 block w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-lg sm:text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-0 flex items-center px-3 text-gray-400 cursor-pointer"
                >
                  {showPassword ? (
                    <svg
                      className="size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg
                      className="size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M17.94 17.94A10.06 10.06 0 0 1 12 19c-7 0-10-7-10-7a16.14 16.14 0 0 1 3.07-4.34" />
                      <path d="M1 1l22 22" />
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Tipo de conta */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de conta
              </label>

              <div className="inline-flex items-cente bg-gray-700 border border-gray-600 rounded-lg p-3 gap-4">
                <label className="flex items-center gap-2 text-gray-200 cursor-pointer">
                  <input
                    type="radio"
                    name="tipo_conta"
                    value={1}
                    className="text-indigo-500 focus:ring-indigo-500"
                    defaultChecked
                  />
                  <span className="text-sm">Cliente</span>
                </label>

                <label className="flex items-center gap-2 text-gray-200 cursor-pointer">
                  <input
                    type="radio"
                    name="tipo_conta"
                    value={2}
                    className="text-indigo-500 focus:ring-indigo-500"
                  />
                  <span className="text-sm">Anfitrião</span>
                </label>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-400">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  className="mr-2 rounded border-gray-600 bg-gray-700 focus:ring-indigo-500"
                />
                Lembrar-me
              </label>

              <a
                href="#"
                className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
              >
                Esqueceste-te da palavra-passe?
              </a>
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
            <a
              href="#"
              className="font-medium text-indigo-400 hover:text-indigo-300"
            >
              Cria uma agora
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
