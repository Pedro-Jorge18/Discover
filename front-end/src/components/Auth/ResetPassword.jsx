import { useState } from "react";

export default function ResetPassword() {
  const [emailSent, setEmailSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmailSent(true);
  };

  return (
    <div className="w-full max-w-xl bg-gray-800  p-6">

      {/* Cabeçalho */}
      <h3 className="text-lg font-semibold text-white pb-4 border-b border-gray-700 text-center">
        Reposição da palavra-passe
      </h3>

      {/* Corpo */}
      <div className="pt-6">
        {!emailSent ? (
          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* Nova password */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Nova Palavra-passe
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  placeholder="Insira a sua nova palavra-passe"
                  className="py-2.5 ps-4 pe-10 w-full border border-gray-600 bg-gray-900 text-gray-100 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-indigo-300"
                >
                  {showPassword ? (
                    <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.06 10.06 0 0 1 12 19c-7 0-10-7-10-7a16.14 16.14 0 0 1 3.07-4.34" />
                      <path d="M1 1l22 22" />
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirmar password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Confirmar Palavra-passe
              </label>

              <div className="relative">
                <input
                  type={showPassword2 ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirme a sua nova palavra-passe"
                  className="py-2.5 ps-4 pe-10 w-full border border-gray-600 bg-gray-900 text-gray-100 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword2(!showPassword2)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-indigo-300"
                >
                  {showPassword2 ? (
                    <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.06 10.06 0 0 1 12 19c-7 0-10-7-10-7a16.14 16.14 0 0 1 3.07-4.34" />
                      <path d="M1 1l22 22" />
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Botão Confirmar */}
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-400 transition duration-300"
            >
              Confirmar
            </button>

          </form>
        ) : (
          <div className="text-center space-y-6">

            <p className="text-gray-300 text-sm">
              A palavra-passe foi alterada com sucesso.       
            </p>

            {/* Botão Voltar */}
            <button
              onClick={() => setEmailSent(false)}
              className="rounded-lg bg-gray-700 px-6 py-2 text-sm font-semibold text-gray-200 hover:bg-gray-600 focus:ring-4 focus:ring-gray-500 transition duration-300"
            >
              Voltar
            </button>

          </div>
        )}
      </div>
    </div>
  );
}
