import { useState, useEffect } from "react";
import api from "../../api/axios";
import notify from "../../utils/notify";
import { useTranslation } from '../../contexts/TranslationContext';

export default function EditProfile({ user, setUser }) {
  const { t } = useTranslation();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    last_name: user?.last_name || user?.lastName || "",
    phone: user?.phone || user?.phone_number || "",
    email: user?.email || ""
  });

  // Update form when user prop changes
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        last_name: user.last_name || user.lastName || "",
        phone: user.phone || user.phone_number || "",
        email: user.email || ""
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email) {
      notify(t('settings.requiredFields'), "error");
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      notify(t('settings.invalidEmail') || "Email inválido", "error");
      return;
    }

    // Validate phone (9 digits)
    if (form.phone && form.phone.length !== 9) {
      notify(t('settings.invalidPhone') || "O contacto deve ter 9 dígitos", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await api.put("/user", {
        name: form.name,
        lastname: form.last_name,
        contact: form.phone,
        email: form.email,
      });
      
      // Update user context with new data
      if (response.data?.data) {
        setUser(response.data.data);
      } else if (response.data?.user) {
        setUser(response.data.user);
      }
      
      setSaved(true);
      notify(t('settings.dataUpdated'), "success");
      
      // Reset saved state after 3 seconds
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("UPDATE ERROR:", error);

      if (error.response?.data?.errors) {
        notify(Object.values(error.response.data.errors).flat().join("\n"), "error");
      } else if (error.response?.data?.message) {
        notify(error.response.data.message, "error");
      } else {
        notify(t('auth.networkError'), "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl bg-white p-6 rounded-xl">

      <h3 className="text-lg font-semibold text-gray-900 pb-4 border-b border-gray-200 text-center">
        {t('settings.editProfile')}
      </h3>

      <div className="pt-6">
        {!saved ? (
          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* First name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.name')}
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={t('settings.firstNamePlaceholder')}
                className="py-2.5 px-4 w-full border border-gray-300 bg-white text-gray-900 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Last name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.lastName')}
              </label>
              <input
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                placeholder={t('settings.lastNamePlaceholder')}
                className="py-2.5 px-4 w-full border border-gray-300 bg-white text-gray-900 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.email')} *
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder={t('auth.emailPlaceholder')}
                required
                className="py-2.5 px-4 w-full border border-gray-300 bg-white text-gray-900 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('settings.contact')}
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder={t('auth.phonePlaceholder')}
                maxLength={9}
                pattern="[0-9]{9}"
                className="py-2.5 px-4 w-full border border-gray-300 bg-white text-gray-900 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus:ring-4 focus:ring-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('common.loading') : t('common.save')}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <p className="text-gray-700 text-sm">
              {t('settings.dataUpdated')}
            </p>

            <button
              onClick={() => setSaved(false)}
              className="rounded-lg bg-gray-200 px-6 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-300 focus:ring-4 focus:ring-gray-400 transition"
            >
              {t('common.back')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
