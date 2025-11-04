import { useState } from "react";

export default function Registration() {
  const [showPassword, setShowPassword] = useState(false);

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
          <form className="space-y-5">

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
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
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
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-400 focus:outline-none cursor-pointer transition ease-in duration-500"
            >
              Entrar
            </button>
          </form>

          {/* Link to register page */}
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

        {/* Border */}
        <div className="flex items-center justify-center px-6 py-4">
            <div className="flex-grow border-t border-gray-700"></div>
                <span className="mx-3 text-gray-400 text-sm font-medium">ou</span>
            <div className="flex-grow border-t border-gray-700"></div>
        </div>
                
        {/* Different Login types */}        
        <div className="px-6 py-4 max-w-sm mx-auto  ">
            <div className="flex gap-4">
                <a href="https://www.google.com" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg text-gray-500 text-sm font-medium hover:border-gray-900 hover:bg-gray-900 transition duration-300">
                <img
                    src="https://img.icons8.com/color/48/google-logo.png"
                    alt="Google"
                    className="w-5 h-5"
                />
                <span>Google</span>
                </a>
                <a href="https://www.google.com" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg text-gray-500 text-sm font-medium hover:border-gray-900 hover:bg-gray-900 transition duration-300">
                <img
                    src="https://img.icons8.com/?size=100&id=uLWV5A9vXIPu&format=png&color=000000"
                    alt="Google"
                    className="w-5 h-5"
                />
                <span>Facebook</span>
                </a>
                <a href="https://www.google.com" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg text-gray-500 text-sm font-medium hover:border-gray-900 hover:bg-gray-900 transition duration-300">
                <img
                    src="https://img.icons8.com/color/48/google-logo.png"
                    alt="Google"
                    className="w-5 h-5"
                />
                <span>Google</span>
                </a>
            </div>
        </div>
      </div>
    </div>
  );
}
