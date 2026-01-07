import { useState } from "react";
import api from "../../api/axios";
import { useTranslation } from '../../contexts/TranslationContext';
import notify from "../../utils/notify";

export default function ResetPassword() {
  const { t } = useTranslation();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      window.dispatchEvent(new CustomEvent('app-notify', {
        detail: {
          message: t('auth.passwordMismatch'),
          type: 'error'
        }
      }));
      return;
    }

    // Verify if the new password is the same as the old one
    if (oldPassword === newPassword) {
      window.dispatchEvent(new CustomEvent('app-notify', {
        detail: {
          message: t('auth.passwordSameAsOld'),
          type: 'error'
        }
      }));
      return;
    }
    
    try {
      // For authenticated users we call change-password endpoint
      const res = await api.post("/auth/change-password", {
        current_password: oldPassword,
        password: newPassword,
        password_confirmation: confirmPassword
      });

      console.log("Resposta:", res.data);
      setSuccess(true);
      
      // Clear tokens and redirect to login
      setTimeout(() => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      console.error("Erro ao resetar password:", err);

      const errors = err.response?.data?.errors;
      if (errors?.current_password) {
        window.dispatchEvent(new CustomEvent('app-notify', {
          detail: {
            message: t('auth.incorrectPassword'),
            type: 'error'
          }
        }));
      } else if (errors?.password) {
        window.dispatchEvent(new CustomEvent('app-notify', {
          detail: {
            message: errors.password.join(' '),
            type: 'error'
          }
        }));
      } else {
        window.dispatchEvent(new CustomEvent('app-notify', {
          detail: {
            message: err.response?.data?.message || 'Erro interno do servidor',
            type: 'error'
          }
        }));
      }
    }
  };

  return (
    <div className="w-full max-w-xl bg-gray-800 p-6 rounded-xl mx-auto mt-10">
      <h3 className="text-lg font-semibold text-white pb-4 border-b border-gray-700 text-center">
        {t('auth.changePassword')}
      </h3>

      {!success ? (
        <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
            {/* Old password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('auth.oldPassword')}
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder={t('auth.enterCurrentPassword')}
                required
                className="w-full rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(v => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-300 hover:text-white"
                aria-label={showOldPassword ? 'Ocultar palavra-passe antiga' : 'Mostrar palavra-passe antiga'}
              >
                {showOldPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* New password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('auth.newPassword')}
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t('auth.enterNewPassword')}
                required
                className="w-full rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(v => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-300 hover:text-white"
                aria-label={showNewPassword ? 'Ocultar nova palavra-passe' : 'Mostrar nova palavra-passe'}
              >
                {showNewPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Confirm new password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('auth.confirmNewPassword')}
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('auth.confirmNewPasswordPlaceholder')}
                required
                className="w-full rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-gray-100"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(v => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-300 hover:text-white"
                aria-label={showConfirmPassword ? 'Ocultar confirmação de palavra-passe' : 'Mostrar confirmação de palavra-passe'}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 py-2 px-4 rounded-lg text-white font-semibold hover:bg-indigo-500 transition"
          >
            {t('common.confirm')}
          </button>
        </form>
      ) : (
        <div className="text-center mt-6">
          <p className="text-green-400">{t('auth.passwordChangedSuccess')}</p>
        </div>
      )}
    </div>
  );
}
