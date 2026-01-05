import { useState } from "react";
import api from "../../api/axios";

export default function ResetPassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setNewPasswordError("A nova password e a confirmação não coincidem.");
      return;
    }
    
    // clear field errors before request
    setOldPasswordError("");
    setNewPasswordError("");

    try {
      // For authenticated users we call change-password endpoint
      const res = await api.post("/auth/change-password", {
        current_password: oldPassword,
        password: newPassword,
        password_confirmation: confirmPassword
      });

      console.log("Resposta:", res.data);
      setSuccess(true);
    } catch (err) {
      console.error("Erro ao resetar password:", err);

      const errors = err.response?.data?.errors;
      if (errors) {
        if (errors.current_password) {
          setOldPasswordError(errors.current_password.join(' '));
        }
        if (errors.password) {
          setNewPasswordError(errors.password.join(' '));
        }
        // if there is a general message, show it in the top-level error
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        }
      } else {
        setError(err.response?.data?.message || 'Erro interno do servidor');
      }
    }
  };

  return (
    <div className="w-full max-w-xl bg-gray-800 p-6 rounded-xl mx-auto mt-10">
      <h3 className="text-lg font-semibold text-white pb-4 border-b border-gray-700 text-center">
        Alterar Palavra-passe
      </h3>

      {!success ? (
        <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
            {/* Old password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Palavra-passe antiga
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => { setOldPassword(e.target.value); setOldPasswordError(""); setError(""); }}
                placeholder="Insira a sua palavra-passe atual"
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
            {oldPasswordError && <p className="text-red-500 text-sm mt-1">{oldPasswordError}</p>}
          </div>

          {/* New password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nova palavra-passe
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setNewPasswordError(""); setError(""); }}
                placeholder="Insira a sua nova palavra-passe"
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
            {newPasswordError && <p className="text-red-500 text-sm mt-1">{newPasswordError}</p>}
          </div>

          {/* Confirm new password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirmar nova palavra-passe
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme a sua nova palavra-passe"
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

          {/* Error message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 py-2 px-4 rounded-lg text-white font-semibold hover:bg-indigo-500 transition"
          >
            Confirmar
          </button>
        </form>
      ) : (
        <div className="text-center mt-6">
          <p className="text-green-400">A palavra-passe foi alterada com sucesso!</p>
        </div>
      )}
    </div>
  );
}
