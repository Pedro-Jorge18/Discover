import { useState } from "react";
import api from "../../api/axios";
import { useTranslation } from '../../contexts/TranslationContext';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [emailSent, setEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.userEmail.value;

    try {
      await api.post("/auth/forgot-password", { email });
      setEmailSent(true);
      setErrorMessage("");
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      setErrorMessage(
        error.response?.data?.message || t('auth.recoverError')
      );
      setEmailSent(true); // still show the sent message to avoid email enumeration
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
        <title>Discover - Recuperar Palavra-Passe</title>
        {/* Head */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-700 relative">
          <h3
            id="dialog-title"
            className="text-xl font-semibold text-white text-center"
          >
            {t('auth.forgotPassword')}
          </h3>
          {/* Close button */}
          <button
            onClick={() => (window.location.href = "/login")}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            aria-label="Fechar"
          >
            ✕
          </button>
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
                  {t('auth.emailAddress')}
                </label>
                <input
                  type="email"
                  id="userEmail"
                  placeholder={t('auth.emailPlaceholderRecover')}
                  required
                  className="input w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="btn btn-lg btn-primary btn-gradient btn-block w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-400 focus:outline-none cursor-pointer transition ease-in duration-500"
              >
                {t('auth.sendRecoveryLink')}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-gray-300 text-sm">
                {t('auth.recoveryMessage')}
              </p>

              {errorMessage && (
                <div className="bg-red-700 text-white p-3 rounded-lg text-sm">
                  {errorMessage}
                </div>
              )}

              <button
                onClick={() => (window.location.href = "/login")}
                className="w-full rounded-lg bg-gray-700 px-4 py-2 text-sm font-semibold text-gray-200 hover:bg-gray-600 focus:ring-4 focus:ring-gray-500 focus:outline-none transition ease-in duration-500"
              >
                {t('common.back')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
