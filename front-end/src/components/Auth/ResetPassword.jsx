import { useState } from "react";
import api from "../../api/axios";
import { useTranslation } from '../../contexts/TranslationContext';
//import notify from "../../utils/notify";

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

    // Verify minimum password length
    if (newPassword.length < 8) {
      window.dispatchEvent(new CustomEvent('app-notify', {
        detail: {
          message: 'A palavra-passe deverá conter no mínimo 8 caracteres',
          type: 'error'
        }
      }));
      return;
    }

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
          message: t('auth.samePassword'),
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
            message: t('auth.passwordIncorrect'),
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
            message: err.response?.data?.message || t('auth.serverError'),
            type: 'error'
          }
        }));
      }
    }
  };

  return (
    <div className="w-full max-w-xl bg-white p-6 rounded-xl border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 pb-4 border-b border-gray-200 text-center">
        {t('auth.changePasswordTitle')}
      </h3>

      {!success ? (
        <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
            {/* Old password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('auth.oldPassword')}
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder={t('auth.oldPasswordPlaceholder')}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(v => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-900"
                aria-label={showOldPassword ? 'Ocultar palavra-passe antiga' : 'Mostrar palavra-passe antiga'}
              >
                {showOldPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* New password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('auth.newPassword')}
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t('auth.newPasswordPlaceholder')}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(v => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-900"
                aria-label={showNewPassword ? 'Ocultar nova palavra-passe' : 'Mostrar nova palavra-passe'}
              >
                {showNewPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Confirm new password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('auth.confirmNewPassword')}
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('auth.confirmNewPasswordPlaceholder')}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(v => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-900"
                aria-label={showConfirmPassword ? 'Ocultar confirmação de palavra-passe' : 'Mostrar confirmação de palavra-passe'}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 py-2.5 px-4 rounded-lg text-white font-semibold hover:bg-blue-500 transition focus:ring-4 focus:ring-blue-400"
          >
            {t('common.confirm')}
          </button>
        </form>
      ) : (
        <div className="text-center mt-6">
          <p className="text-green-600 font-medium">{t('auth.passwordChanged')}</p>
        </div>
      )}
    </div>
  );
}
