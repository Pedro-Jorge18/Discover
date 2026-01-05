import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function TwoFactorAuth() {
  const [enabled, setEnabled] = useState(false);
  const [showCodePopup, setShowCodePopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [showDisablePopup, setShowDisablePopup] = useState(false);
  const [disableCode, setDisableCode] = useState("");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [password, setPassword] = useState("");
  const [qrCode, setQrCode] = useState("");

  /* Obter estado atual do 2FA do utilizador */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
          },
        });

        const user = response.data.user;
        setEnabled(user?.two_factor?.enabled ?? false);
      } catch (error) {
        console.error("Erro ao obter utilizador:", error);
      }
    };

    fetchUser();
  }, []);

  /* Enable / Disable */
  const handleToggle = async () => {
    setErrorMessage("");

    if (!enabled) {
      if (loading) return;
      setShowPasswordPopup(true);
      return;
    }

    // Se já está ativo, mostrar popup para inserir código para desativar
    setShowDisablePopup(true);
  };

  /* Ativar 2FA com password */
  const handlePasswordSubmit = async () => {
    if (!password) {
      setErrorMessage("Por favor, introduza a sua password.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(
        "/auth/2fa/enable",
        { password },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}` } }
      );

      if (res.data?.status) {
        setSecret(res.data.data?.secret || "");
        setQrCode(res.data.data?.qr_code || "");
        setShowPasswordPopup(false);
        setShowCodePopup(true);
        setPassword("");
      } else {
        setErrorMessage(res.data?.message || "Erro ao ativar 2FA");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Erro de comunicação com o servidor");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  /* Confirmar código para ativar 2FA */
  const handleConfirmCode = async () => {
    const code = document.getElementById("2fa-code-input")?.value;

    if (!code || code.length < 6) {
      setErrorMessage("Código inválido");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(
        "/auth/2fa/verify",
        { code },
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
          },
        }
      );

      if (res.data?.status) {
        setEnabled(true);
        setShowCodePopup(false);
        setSecret("");
        setPassword("");
      } else {
        setErrorMessage(res.data.message || "Código incorreto");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Erro ao validar o código");
    } finally {
      setLoading(false);
    }
  };

  /* Disable 2FA */
  const handleDisable2FA = async () => {
  if (!disableCode || disableCode.length < 6) {
    setErrorMessage("Código inválido");
    return;
  }

  setLoading(true);
  try {
    const res = await api.post(
      "/auth/2fa/disable",
      { code: disableCode },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`,
        },
      }
    );

    if (res.data?.status) {
      setEnabled(false);
      setShowDisablePopup(false);
      setDisableCode("");
      setErrorMessage("");
    } else {
      setErrorMessage(res.data?.message || "Código incorreto");
    }
  } catch (err) {
    if (err.response?.status === 422) {
      setErrorMessage("Código de autenticação incorreto.");
    } else {
      setErrorMessage("Erro de comunicação com o servidor.");
    }
  } finally {
    setLoading(false);
  }
};


  /* Copy to clipboard */
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setErrorMessage("Não foi possível copiar o código");
    }
  };

  return (
    <div className="w-full max-w-xl bg-gray-800 p-6 rounded-xl">
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
            className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 outline-none cursor-pointer ${
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
            ? "A autenticação de dois fatores está ativada."
            : "A autenticação de dois fatores está desativada."}
        </p>

        {/* Pop-up Password */}
        {showPasswordPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full text-center border border-gray-700 shadow-lg">
              <h4 className="text-white font-semibold mb-4 text-lg">
                Introduza a sua Palavra-Passe
              </h4>

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-3 px-3 py-2 rounded-lg text-white-900 border"
              />

              <button
                onClick={handlePasswordSubmit}
                className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-400 transition duration-300 w-full"
              >
                Confirmar
              </button>
            </div>
          </div>
        )}

        {/* Pop-up Código */}
        {showCodePopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full text-center border border-gray-700 shadow-lg">
              <h4 className="text-white font-semibold mb-4 text-lg">
                Código de Autenticação
              </h4>

              {qrCode && (
                <div className="flex justify-center mb-4">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrCode)}`}
                    alt="QR Code 2FA"
                    className="rounded-lg bg-white p-2"
                  />
                </div>
              )}

              <p className="text-gray-400 text-sm font-mono tracking-widest mb-4 select-text break-all">
                {secret}
              </p>

              <p className="text-gray-400 text-sm mb-4">
                Introduza este código na sua aplicação de autenticação
                (Google Authenticator, Authy, etc.)
              </p>

              <button
                onClick={copyToClipboard}
                className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600 transition duration-300 mb-3 w-full"
              >
                {copied ? "Copiado ✔" : "Copiar código"}
              </button>

              <input
                type="text"
                placeholder="Código"
                maxLength={6}
                className="w-full mb-3 px-3 py-2 rounded-lg text-white-900 border"
                id="2fa-code-input"
              />
              <button
                onClick={handleConfirmCode}
                className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-400 transition duration-300 w-full"
              >
                Confirmar
              </button>
            </div>
          </div>
        )}

        {/* Pop-up Código para desativar */}
        {showDisablePopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full text-center border border-gray-700 shadow-lg">
              <h4 className="text-white font-semibold mb-4 text-lg">
                Código de Autenticação 2FA
              </h4>

              <p className="text-gray-300 text-sm mb-3">
                Introduza o código da sua aplicação de autenticação para desativar o 2FA.
              </p>

              <input
                type="text"
                placeholder="Código"
                maxLength={6}
                value={disableCode}
                onChange={(e) => setDisableCode(e.target.value)}
                className="w-full mb-4 px-3 py-2 rounded-lg text-white-900 border"
              />

              {errorMessage && (
                <p className="text-red-400 text-sm mb-3">
                  {errorMessage}
                </p>
              )}

              <button
                onClick={handleDisable2FA}
                className="rounded-lg bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-500 focus:ring-4 focus:ring-red-400 transition duration-300 w-full"
              >
                Desativar 2FA
              </button>
            </div>
          </div>
        )}

        {/* Error */}
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
