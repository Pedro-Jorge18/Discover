import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import notify from "../../utils/notify";
import { useTranslation } from '../../contexts/TranslationContext';

export default function Registration() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;

    if (form.password.value !== form.password_confirmation.value) {
      notify(t('auth.passwordMismatch'), "error");
      return;
    }

    // Validate birthday: not today or future, and must be at least 18 years old
    const birthValue = form.birthday.value;
    const birthDate = new Date(birthValue);
    if (isNaN(birthDate.getTime())) {
      notify(t('auth.invalidBirthday'), "error");
      return;
    }
    const today = new Date();
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const birthOnly = new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());

    if (birthOnly >= todayOnly) {
      notify(t('auth.futureBirthday'), "error");
      return;
    }

    // Calculate age
    let age = todayOnly.getFullYear() - birthOnly.getFullYear();
    const m = todayOnly.getMonth() - birthOnly.getMonth();
    if (m < 0 || (m === 0 && todayOnly.getDate() < birthOnly.getDate())) {
      age--;
    }

    if (age < 18) {
      notify(t('auth.ageRequirement'), "error");
      return;
    }

    const payload = {
      name: form.name.value,
      last_name: form.last_name.value,
      phone: form.phone.value,
      birthday: form.birthday.value,
      email: form.email.value,
      password: form.password.value,
      password_confirmation: form.password_confirmation.value,
      role: form.role.value,
    };

    try {
      const response = await api.post("/auth/register", payload);

      console.log("REGISTER RESPONSE:", response.data);

      // Check for redirect after login
      localStorage.removeItem('propertyRedirect');

      notify(t('auth.createSuccess'), "success");
      navigate("/login");

    } catch (error) {
      console.error("REGISTER ERROR:", error);

      if (error.response?.data?.errors) {
        notify(Object.values(error.response.data.errors).flat().join("\n"), "error");
      } else if (error.response?.data?.message) {
        notify(error.response.data.message, "error");
      } else {
        notify(t('auth.networkError'), "error");
      }
    }
  };

  return (
    <div
      id="dialog"
      className="fixed inset-0 z-[40] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-labelledby="dialog-title"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl transition-all sm:my-8 p-6">
        <title>Discover - Registo</title>
        {/* Head */}
        <div className="pb-4 border-b border-gray-200">
          <button
            onClick={() => navigate("/")}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition"
            aria-label="Fechar"
          >
            ✕
          </button>
          
          <h3 id="dialog-title" className="text-2xl font-semibold text-gray-900 text-center">
            {t('auth.createAccount')}
          </h3>
        </div>

        {/* Body */}
        <div className="pt-4">
          <form className="space-y-5" onSubmit={handleRegister}>
            {/* Name + Lastname */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">{t('auth.name')}</label>
                <input type="text" id="name" name="name" placeholder={t('auth.namePlaceholder')} required
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">{t('auth.lastName')}</label>
                <input type="text" id="last_name" name="last_name" placeholder={t('auth.lastNamePlaceholder')} required
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            {/* Phone + Birthday */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">{t('auth.phone')}</label>
                <input type="text" id="phone" name="phone" placeholder={t('auth.phonePlaceholder')} required
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-2">{t('auth.birthday')}</label>
                <input type="date" id="birthday" name="birthday" required
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">{t('auth.email')}</label>
              <input type="email" id="email" name="email" placeholder={t('auth.emailPlaceholder')} required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            {/* Password */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">{t('auth.password')}</label>
              <div className="relative">
                <input id="password" name="password" type={showPassword ? "text" : "password"} placeholder={t('auth.passwordPlaceholder')} required
                  className="py-2.5 ps-4 pe-10 block w-full border border-gray-300 bg-white text-gray-900 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-0 flex items-center px-3 text-gray-500 hover:text-gray-900 cursor-pointer">
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">{t('auth.confirmPassword')}</label>
              <div className="relative">
                <input id="password_confirmation" name="password_confirmation" type={showConfirmPassword ? "text" : "password"} placeholder={t('auth.confirmPasswordPlaceholder')}
                  className="py-2.5 ps-4 pe-10 block w-full border border-gray-300 bg-white text-gray-900 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 end-0 flex items-center px-3 text-gray-500 hover:text-gray-900 cursor-pointer">
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Account type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.accountType')}</label>
              <div className="flex gap-6 bg-gray-50 border border-gray-200 rounded-lg p-3">
                <label className="flex items-center gap-2 text-gray-900 cursor-pointer">
                  <input type="radio" name="role" value={"guest"} className="text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="text-sm">{t('auth.client')}</span>
                </label>
                <label className="flex items-center gap-2 text-gray-900 cursor-pointer">
                  <input type="radio" name="role" value={"host"} className="text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm">{t('auth.host')}</span>
                </label>
              </div>
            </div>

            {/* Register Button */}
            <button type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus:ring-4 focus:ring-blue-400 transition">
              {t('auth.createAccount')}
            </button>
          </form>

          {/* Link to login */}
          <p className="mt-6 text-center text-sm text-gray-600">
            {t('auth.alreadyHaveAccount')} {" "}
            <button onClick={() => navigate("/login")}
              className="font-medium text-blue-600 hover:text-blue-500">
              {t('auth.login')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
