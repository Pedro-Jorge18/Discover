import { useState, useEffect, useRef } from "react";
import api from "../../api/axios";
import notify from "../../utils/notify";

export default function TwoFactorAuth() {
  const [enabled, setEnabled] = useState(false);
  const [showCodePopup, setShowCodePopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [showDisablePopup, setShowDisablePopup] = useState(false);
  const [disableCode, setDisableCode] = useState("");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [password, setPassword] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const copiedTimeoutRef = useRef(null);

  /* Get current 2FA status for the user */
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
        notify("Erro ao obter utilizador.", "error");
      }
    };

    fetchUser();
  }, []);

  /* Enable / Disable */
  const handleToggle = async () => {
    if (!enabled) {
      if (loading) return;
      setShowPasswordPopup(true);
      return;
    }

    // If it's already enabled, show popup to enter code to disable
    setShowDisablePopup(true);
  };

  /* Enable 2FA with password */
  const handlePasswordSubmit = async () => {
    if (!password) {
      notify("Por favor, introduza a sua palavra-passe.", "error");
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
        notify("Palavra-passe confirmada. Configure o 2FA.", "info");
      } else {
        notify(res.data?.message || "Erro ao ativar 2FA", "error");
      }
    } catch (err) {
      if (err?.response?.status === 422) {
        notify("Palavra-passe incorreta! Tente novamente.", "error");
      } else {
        console.error(err);
        notify("Erro de comunicação com o servidor.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  /* Confirm code to enable 2FA */
  const handleConfirmCode = async () => {
    const code = confirmCode?.trim();

    if (!code || code.length < 6) {
      notify("Código inválido.", "error");
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
        setConfirmCode("");
        notify("Autenticação de dois fatores ativada.", "success");
      } else {
        notify(res.data.message || "Código incorreto.", "error");
      }
    } catch (err) {
      console.error(err);
      notify("Erro ao validar o código.", "error");
    } finally {
      setLoading(false);
    }
  };

  /* Disable 2FA */
  const handleDisable2FA = async () => {
    if (!disableCode || disableCode.length < 6) {
      notify("Código inválido.", "error");
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
        notify("Autenticação de dois fatores desativada.", "success");
      } else {
        notify(res.data?.message || "Código incorreto.", "error");
      }
    } catch (err) {
      if (err.response?.status === 422) {
        notify("Código de autenticação incorreto.", "error");
      } else {
        notify("Erro de comunicação com o servidor.", "error");
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
      if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
      copiedTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
      notify("Código copiado para a área de transferência.", "success");
    } catch {
      notify("Não foi possível copiar o código.", "error");
    }
  };

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
    };
  }, []);

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
            aria-pressed={enabled}
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
            <div className="relative bg-gray-800 rounded-xl p-6 max-w-sm w-full text-center border border-gray-700 shadow-lg">
              {/* Botão fechar */}
              <button
                onClick={() => {
                  setShowPasswordPopup(false);
                  setPassword("");
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                aria-label="Fechar"
              >
                ✕
              </button>

              <h4 className="text-white font-semibold mb-4 text-lg">
                Introduza a sua Palavra-Passe
              </h4>

              {/* Input com show/hide password */}
              <div className="relative mb-3">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Palavra-Passe"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  className="py-2.5 ps-4 pe-10 block w-full border border-gray-600 bg-gray-700 text-gray-100 rounded-lg sm:text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-0 flex items-center px-3 text-gray-400 hover:text-gray-100 transition cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Confirmar */}
              <button
                onClick={handlePasswordSubmit}
                className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-400 transition duration-300 w-full"
              >
                Confirmar
              </button>
            </div>
          </div>
        )}

        {/* Code popup */}
        {showCodePopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative bg-gray-800 rounded-xl p-6 max-w-sm w-full text-center border border-gray-700 shadow-lg">
              <button
                  onClick={() => {
                    setShowCodePopup(false);
                    setConfirmCode("");
                  }}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                  aria-label="Fechar"
                >
                  ✕
                </button>
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
                inputMode="numeric"
                pattern="\\d*"
                value={confirmCode}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setConfirmCode(v);
                }}
                className="w-full mb-3 px-3 py-2 rounded-lg text-white border"
                id="2fa-code-input"
                aria-label="Código de autenticação"
              />
              <button
                onClick={handleConfirmCode}
                disabled={loading || confirmCode.length !== 6}
                className={`rounded-lg px-6 py-2 text-sm font-semibold text-white focus:ring-4 transition duration-300 w-full ${
                  loading || confirmCode.length !== 6
                    ? "bg-indigo-600/60 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500 focus:ring-indigo-400"
                }`}
              >
                Confirmar
              </button>
            </div>
          </div>
        )}

        {/* Disable code popup */}
        {showDisablePopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative bg-gray-800 rounded-xl p-6 max-w-sm w-full text-center border border-gray-700 shadow-lg">
              <button
                onClick={() => {
                  setShowDisablePopup(false);
                  setDisableCode("");
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                aria-label="Fechar"
              >
                ✕
              </button>
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
                inputMode="numeric"
                pattern="\\d*"
                value={disableCode}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setDisableCode(v);
                }}
                className="w-full mb-4 px-3 py-2 rounded-lg text-white border"
                aria-label="Código para desativar 2FA"
              />


              <button
                onClick={handleDisable2FA}
                disabled={loading || disableCode.length !== 6}
                className={`rounded-lg px-6 py-2 text-sm font-semibold text-white transition duration-300 w-full ${
                  loading || disableCode.length !== 6
                    ? "bg-red-600/60 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-500 focus:ring-4 focus:ring-red-400"
                }`}
              >
                Desativar 2FA
              </button>
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
}
