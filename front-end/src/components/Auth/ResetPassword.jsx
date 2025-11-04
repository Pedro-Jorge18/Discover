import { useState } from "react";

export default function ResetPassword() {
  const [emailSent, setEmailSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  {/* Function to change the screen to the confirmation screen */}
  const handleSubmit = (e) => {
    e.preventDefault();
    setEmailSent(true);
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
            Reposição da palavra-passe
          </h3>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          {!emailSent ? (
            <form className="mb-4 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="newPassword"
                  className="label-text block text-sm font-medium text-gray-300 mb-2"
                >
                  Nova Palavra-passe
                </label>
                <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  placeholder="Insira a sua nova palavra-passe"
                  className="py-2.5 sm:py-3 ps-4 pe-10 block w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-lg sm:text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                />              

                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus:text-indigo-400"
                    >
                    {/*Condition if is show password show password else dont show */}
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
            {/* Confirm New Password */}
            <form className="mb-4 space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label
                    htmlFor="newPassword"
                    className="label-text block text-sm font-medium text-gray-300 mb-2"
                    >
                    Confirmar Palavra-passe
                    </label>
                    <div className="relative">
                        <input
                        type={showPassword ? "text" : "password"}
                        id="newPassword"
                        placeholder="Insira a sua nova palavra-passe"
                        className="py-2.5 sm:py-3 ps-4 pe-10 block w-full border border-gray-600 bg-gray-800 text-gray-100 rounded-lg sm:text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />              

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus:text-indigo-400"
                            >
                            {/*Condition if is show password show password else dont show */}
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
            </form>
              <button
                type="submit"
                className="btn btn-lg btn-primary btn-gradient btn-block w-full rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-400 focus:outline-none cursor-pointer transition ease-in duration-500"
              >
                Confirmar
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-gray-300 text-sm">
                A sua palavra-passe foi alterada.
                Ao pressionar "Voltar" irá regressar para o Login. 
              </p>
              <a
                href="#"
                className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
              >
                <button
                onClick={() => setEmailSent(false)}
                className="w-full rounded-lg bg-gray-700 px-4 py-2 text-sm font-semibold text-gray-200 hover:bg-gray-600 focus:ring-4 focus:ring-gray-500 focus:outline-none transition ease-in duration-500"
              >
                Voltar
              </button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
