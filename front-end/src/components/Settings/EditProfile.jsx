import { useState } from "react";
import api from "../../api/axios";
import notify from "../../utils/notify";
import { useTranslation } from '../../contexts/TranslationContext';

export default function EditProfile() {
  const { t } = useTranslation();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "",
    last_name: "",
    phone: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.put("/auth/me", form);
      console.log("Update response:", response.data);
      setSaved(true);
      notify(t('settings.dataUpdated'), "success");
    } catch (error) {
      console.error("UPDATE ERROR:", error);

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
    <div className="w-full max-w-xl bg-gray-800 p-6 rounded-xl">

      <h3 className="text-lg font-semibold text-white pb-4 border-b border-gray-700 text-center">
        {t('settings.editProfile')}
      </h3>

      <div className="pt-6">
        {!saved ? (
          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* First name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('auth.name')}
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={t('settings.enterName')}
                className="py-2.5 px-4 w-full border border-gray-600 bg-gray-900 text-gray-100 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Last name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('auth.lastName')}
              </label>
              <input
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                placeholder={t('settings.enterLastName')}
                className="py-2.5 px-4 w-full border border-gray-600 bg-gray-900 text-gray-100 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('settings.contact')}
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder={t('settings.phonePlaceholder')}
                className="py-2.5 px-4 w-full border border-gray-600 bg-gray-900 text-gray-100 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-400 transition"
            >
              {t('common.save')}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <p className="text-gray-300 text-sm">
              {t('settings.dataUpdated')}
            </p>

            <button
              onClick={() => setSaved(false)}
              className="rounded-lg bg-gray-700 px-6 py-2 text-sm font-semibold text-gray-200 hover:bg-gray-600 focus:ring-4 focus:ring-gray-500 transition"
            >
              {t('common.back')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
