import { useState } from "react";

export default function ForgotPassword() {
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.userEmail.value;

    try {
      await axios.post("/api/forgot-password", { email });

      setEmailSent(true); 
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      setEmailSent(true); // Show menssage same if have error 
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
            Recuperar palavra-passe
          </h3>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          {!emailSent ? (
            <form className="mb-4 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="userEmail"
                  className="label-text block text-sm font-medium text-gray-300 mb-2"
                >
                  Endereço de email
                </label>
                <input
                  type="email"
                  id="userEmail"
                  placeholder="Insere o teu endereço de email"
                  required
                  className="input w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="btn btn-lg btn-primary btn-gradient btn-block w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-400 focus:outline-none cursor-pointer transition ease-in duration-500"
              >
                Enviar link de recuperação
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-gray-300 text-sm">
                Se o email existir na nossa base de dados, vais receber um link
                para redefinir a tua palavra-passe em breve.
              </p>
              <button
                onClick={() => {
                  setEmailSent(false);
                  window.location.href = "/login"; // Redirect to login
                }}
                className="w-full rounded-lg bg-gray-700 px-4 py-2 text-sm font-semibold text-gray-200 hover:bg-gray-600 focus:ring-4 focus:ring-gray-500 focus:outline-none transition ease-in duration-500"
              >
                Voltar
              </button>
            </div>
          )}
        </div>

        {/* Border */}
        <div className="flex items-center justify-center px-6 py-2">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="mx-3 text-gray-400 text-sm font-medium">ou</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        {/* Return to Login */}
        <div className="px-6 pb-6 text-center">
            <button
              onClick={() => {
                window.location.href = "/login"; // Redirect to login
              }}
              className="font-medium text-indigo-400 hover:text-indigo-300 text-sm"
            >
              Voltar ao início de sessão
            </button>
        </div>  
      </div>
    </div>
  );
}
