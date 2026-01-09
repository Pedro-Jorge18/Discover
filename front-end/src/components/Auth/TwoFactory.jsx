import { useState, useEffect, useRef } from "react";
import api from "../../api/axios";
import notify from "../../utils/notify";
import { useTranslation } from '../../contexts/TranslationContext';

export default function TwoFactorAuth() {
  const { t } = useTranslation();
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
        notify(t('auth.errorGettingUser'), "error");
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
      notify(t('auth.enterPassword'), "error");
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
        notify(t('auth.passwordConfirmed2FA'), "info");
      } else {
        notify(res.data?.message || t('auth.twoFactorAuthError'), "error");
      }
    } catch (err) {
      if (err?.response?.status === 422) {
        notify(t('auth.incorrectPassword'), "error");
      } else {
        console.error(err);
        notify(t('auth.serverError'), "error");
      }
    } finally {
      setLoading(false);
    }
  };

  /* Confirm code to enable 2FA */
  const handleConfirmCode = async () => {
    const code = confirmCode?.trim();

    if (!code || code.length < 6) {
      notify(t('auth.invalidCode'), "error");
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
        notify(t('auth.twoFactorEnabled'), "success");
      } else {
        notify(res.data.message || t('auth.authIncorrect'), "error");
      }
    } catch (err) {
      console.error(err);
      notify(t('auth.errorValidatingCode'), "error");
    } finally {
      setLoading(false);
    }
  };

  /* Disable 2FA */
  const handleDisable2FA = async () => {
    if (!disableCode || disableCode.length < 6) {
      notify(t('auth.invalidCode'), "error");
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
        notify(t('auth.twoFactorDisabled'), "success");
      } else {
        notify(res.data?.message || t('auth.authIncorrect'), "error");
      }
    } catch (err) {
      if (err.response?.status === 422) {
        notify(t('auth.authIncorrect'), "error");
      } else {
        notify(t('auth.serverError'), "error");
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
      notify(t('auth.codesCopied'), "success");
    } catch {
      notify(t('auth.copyFailed'), "error");
    }
  };

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
    };
  }, []);

  return (
    <div className="w-full max-w-xl bg-white p-6 rounded-xl border border-gray-200">

      <h3 className="text-lg font-semibold text-gray-900 pb-4 border-b border-gray-200 text-center">
        {t('auth.twoFactorAuth')}
      </h3>
      <div className="pt-6 space-y-6">
        <p className="text-gray-700 text-sm">
          {t('auth.twoFactorDesc')}
        </p>

        {/* Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-gray-900 font-medium">
            {t('auth.enableTwoFactor')}
          </span>

          <button
            onClick={handleToggle}
            disabled={loading}
            aria-pressed={enabled}
            className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 outline-none cursor-pointer ${
              enabled ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                enabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <p className="text-gray-700 text-sm">
          {enabled ? t('auth.twoFactorEnabled') : t('auth.twoFactorDisabled')}
        </p>

        {/* Pop-up Password */}
        {showPasswordPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="relative bg-white rounded-xl p-6 max-w-sm w-full text-center border border-gray-200 shadow-2xl">
              {/* Botão fechar */}
              <button
                onClick={() => {
                  setShowPasswordPopup(false);
                  setPassword("");
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition"
                aria-label="Fechar"
              >
                ✕
              </button>

              <h4 className="text-gray-900 font-semibold mb-4 text-lg">
                {t('auth.enterPassword')}
              </h4>

              {/* Input com show/hide password */}
              <div className="relative mb-3">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={t('auth.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  className="py-2.5 ps-4 pe-10 block w-full border border-gray-300 bg-white text-gray-900 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-0 flex items-center px-3 text-gray-500 hover:text-gray-900 transition cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Confirm */}
              <button
                onClick={handlePasswordSubmit}
                className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus:ring-4 focus:ring-blue-400 transition duration-300 w-full"
              >
                {t('common.confirm')}
              </button>
            </div>
          </div>
        )}

        {/* Code popup */}
        {showCodePopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="relative bg-white rounded-xl p-6 max-w-sm w-full text-center border border-gray-200 shadow-2xl">
              <button
                  onClick={() => {
                    setShowCodePopup(false);
                    setConfirmCode("");
                  }}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition"
                  aria-label="Fechar"
                >
                  ✕
                </button>
              <h4 className="text-gray-900 font-semibold mb-4 text-lg">
                {t('auth.authCodeTitle')}
              </h4>

              {qrCode && (
                <div className="flex justify-center mb-4">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrCode)}`}
                    alt="QR Code 2FA"
                    className="rounded-lg bg-white p-2 border border-gray-200"
                  />
                </div>
              )}

              <p className="text-gray-700 text-sm font-mono tracking-widest mb-4 select-text break-all bg-gray-100 p-2 rounded">
                {secret}
              </p>

              <p className="text-gray-600 text-sm mb-4">
                {t('auth.authCodeHelp')}
                (Google Authenticator, Authy, etc.)
              </p>

              <button
                onClick={copyToClipboard}
                className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300 transition duration-300 mb-3 w-full"
              >
                {copied ? t('auth.copied') : t('auth.copyCode')}
              </button>

              <input
                type="text"
                placeholder={t('auth.enterCode')}
                maxLength={6}
                inputMode="numeric"
                pattern="\\d*"
                value={confirmCode}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setConfirmCode(v);
                }}
                className="w-full mb-3 px-3 py-2 rounded-lg text-gray-900 border border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                id="2fa-code-input"
                aria-label={t('auth.authCodeTitle')}
              />
              <button
                onClick={handleConfirmCode}
                disabled={loading || confirmCode.length !== 6}
                className={`rounded-lg px-6 py-2 text-sm font-semibold text-white focus:ring-4 transition duration-300 w-full ${
                  loading || confirmCode.length !== 6
                    ? "bg-blue-600/60 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500 focus:ring-blue-400"
                }`}
              >
                {t('common.confirm')}
              </button>
            </div>
          </div>
        )}

        {/* Disable code popup */}
        {showDisablePopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="relative bg-white rounded-xl p-6 max-w-sm w-full text-center border border-gray-200 shadow-2xl">
              <button
                onClick={() => {
                  setShowDisablePopup(false);
                  setDisableCode("");
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition"
                aria-label="Fechar"
              >
                ✕
              </button>
              <h4 className="text-gray-900 font-semibold mb-4 text-lg">
                {t('auth.disable2faTitle')}
              </h4>

              <p className="text-gray-700 text-sm mb-3">
                {t('auth.disable2faHelp')}
              </p>

              <input
                type="text"
                placeholder={t('auth.enterCode')}
                maxLength={6}
                inputMode="numeric"
                pattern="\\d*"
                value={disableCode}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setDisableCode(v);
                }}
                className="w-full mb-4 px-3 py-2 rounded-lg text-gray-900 border border-gray-300 bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500 outline-none"
                aria-label={t('auth.disable2faTitle')}
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
                {t('auth.disable2FA')}
              </button>
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
}
