import { useState } from "react";

export default function TwoFactorAuth() {
  const [enabled, setEnabled] = useState(false);
  const [showCodePopup, setShowCodePopup] = useState(false);
  const [secret, setSecret] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (!enabled) {
      setLoading(true);
      try {
        const response = await fetch("/api/2fa/enable", { method: "POST" });
        const result = await response.json();

        if (result.status) {
          // Recebe o código e/ou QR code do backend
          setSecret(result.data?.secret || "");
          setQrCode(result.data?.qr_code || "");
          setShowCodePopup(true);
        } else {
          alert(result.message || "Erro ao ativar 2FA");
        }
      } catch (err) {
        console.error(err);
        alert("Erro ao ativar 2FA");
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
        alert("Erro ao desativar 2FA");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleConfirmCode = () => {
    setShowCodePopup(false);
    setEnabled(true);
  };

  return (
    <div className="w-full max-w-xl bg-gray-800 rounded-xl border border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-white pb-4 border-b border-gray-700 text-center">
        Autenticação de Dois Fatores (2FA)
      </h3>

      <div className="pt-6 space-y-6">
        <p className="text-gray-300 text-sm">
          Ative a autenticação de dois fatores para adicionar uma camada extra de segurança à sua conta.
        </p>

        {/* Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-gray-200 font-medium">Ativar Autenticação de 2 fatores</span>
          <button
            onClick={handleToggle}
            disabled={loading}
            className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none ${enabled ? 'bg-indigo-600' : 'bg-gray-700'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>

        <p className="text-gray-300 text-sm">
          {enabled 
            ? "A autenticação de dois fatores está ativada." 
            : "A autenticação de dois fatores está desativada."}
        </p>

        {/* Pop-up do código */}
        {showCodePopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full text-center border border-gray-700">
              <h4 className="text-white font-semibold mb-4">Código de Autenticação</h4>

              {qrCode ? (
                <img src={qrCode} alt="QR Code 2FA" className="mx-auto mb-4" />
              ) : (
                <p className="text-gray-300 text-sm mb-4">{secret}</p>
              )}

              <button
                onClick={handleConfirmCode}
                className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-400 transition duration-300"
              >
                Confirmar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
