import { useState } from "react";

export default function TwoFactorAuth() {
  const [enabled, setEnabled] = useState(false);
  const [showCodePopup, setShowCodePopup] = useState(false);
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  const handleToggle = async () => {
    if (!enabled) {
      setLoading(true);
      try {
        const response = await fetch("/api/2fa/enable", { method: "POST" });
        const result = await response.json();

        if (result.status) {
          setSecret(result.data?.secret || "");
          setShowCodePopup(true);
        } else {
          alert(result.message || "Erro ao ativar 2FA");
        }
      } catch (err) {
        console.error(err);
        setErrorMessage("Erro ao ativar 2FA");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        await fetch("/api/2fa/disable", { method: "POST" });
        setEnabled(false);
      } catch (err) {
        console.error(err);
        setErrorMessage("Erro ao desativar 2FA");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleConfirmCode = () => {
    setShowCodePopup(false);
    setEnabled(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setErrorMessage("Erro ao copiar");
    }
  };

  return (
    <div className="w-full max-w-xl bg-gray-800 p-6 rounded-xl-">
      <h3 className="text-lg font-semibold text-white pb-4 border-b border-gray-700 text-center">
        Autenticação de Dois Fatores (2FA)
      </h3>

      <div className="pt-6 space-y-6">
        <p className="text-gray-300 text-sm">
          Adicione uma camada extra de segurança ativando a autenticação de dois fatores.
        </p>

        {/* Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-gray-200 font-medium">
            Ativar Autenticação de 2 fatores
          </span>

          <button
            onClick={handleToggle}
            disabled={loading}
            className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 outline-none ${
              enabled ? "bg-indigo-600" : "bg-gray-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                enabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <p className="text-gray-300 text-sm">
          {enabled
            ? "A autenticação de dois factores está ativada."
            : "A autenticação de dois factores está desativada."}
        </p>

        {/* Pop-up */}
        {showCodePopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full text-center border border-gray-700 shadow-lg">
              <h4 className="text-white font-semibold mb-4 text-lg">
                Código de Autenticação
              </h4>

              {/* Código */}
              <p className="text-indigo-400 text-2xl font-bold tracking-widest mb-4 select-text">
                {secret}
              </p>

              <p className="text-gray-400 text-sm mb-4">
                Introduza este código na sua aplicação de autenticação
                (Google Authenticator, Authy, etc.)
              </p>

              {/* Botão Copiar */}
              <button
                onClick={copyToClipboard}
                className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600 transition duration-300 mb-3 w-full"
              >
                {copied ? "Copiado ✔" : "Copiar código"}
              </button>

              {/* Confirmar */}
              <button
                onClick={handleConfirmCode}
                className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-400 transition duration-300 w-full"
              >
                Confirmar
              </button>
            </div>
          </div>
        )}
        {errorMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-xl p-5 max-w-sm w-full text-center border border-gray-700 shadow-lg">
              <h4 className="text-white font-semibold mb-3 text-lg">Ocorreu um erro</h4>

              <p className="text-gray-300 text-sm mb-6">{errorMessage}</p>

              <button
                onClick={() => setErrorMessage("")}
                className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition duration-300 w-full"
              >
                OK
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
