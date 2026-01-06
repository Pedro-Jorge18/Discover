import React, { useState, useEffect } from "react";
import api from "../../api/axios";

export default function AddAdmin({ onSuccess } = {}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    last_name: "",
    phone: "",
    birthday: "",
    email: "",
    password: "",
    password_confirmation: "",
    gender: "",
    language: "pt",
    about: "",
    role: "admin",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 3000);
    return () => clearTimeout(t);
  }, [saved]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validate birthday: not today/future and minimum age 18
    const birthValue = form.birthday;
    const birthDate = new Date(birthValue);
    if (isNaN(birthDate.getTime())) {
      setErrors({ birthday: ["Data de nascimento inválida."] });
      setLoading(false);
      return;
    }
    const today = new Date();
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const birthOnly = new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());

    if (birthOnly >= todayOnly) {
      setErrors({ birthday: ["A data de nascimento não pode ser hoje nem uma data futura."] });
      setLoading(false);
      return;
    }

    // Calculate age
    let age = todayOnly.getFullYear() - birthOnly.getFullYear();
    const m = todayOnly.getMonth() - birthOnly.getMonth();
    if (m < 0 || (m === 0 && todayOnly.getDate() < birthOnly.getDate())) {
      age--;
    }

    if (age < 18) {
      setErrors({ birthday: ["Deve ter pelo menos 18 anos para se registar."] });
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/register", form);
      if (response?.data) {
        setSaved(true);
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(response.data);
        }
        setForm({
          name: "",
          last_name: "",
          phone: "",
          birthday: "",
          email: "",
          password: "",
          password_confirmation: "",
          gender: "",
          language: "pt",
          about: "",
          role: "admin",
        });
      }
    } catch (err) {
      const resp = err?.response?.data;
      if (resp?.errors) {
        setErrors(resp.errors);
      } else if (resp?.message) {
        setErrors({ general: resp.message });
      } else {
        setErrors({ general: "Erro ao criar admin." });
      }
    } finally {
      setLoading(false);
    }
  }

  if (saved) {
    return (
      <div className="w-full max-w-xl bg-gray-800 p-6 rounded-xl text-center space-y-6">
        <p className="text-green-400 text-sm">O admin foi criado com sucesso!</p>
        <button
          onClick={() => setSaved(false)}
          className="rounded-lg bg-gray-700 px-6 py-2 text-sm font-semibold text-gray-200 hover:bg-gray-600 focus:ring-4 focus:ring-gray-500 transition"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl bg-gray-800 p-6 rounded-xl">
      <h3 className="text-lg font-semibold text-white pb-4 border-b border-gray-700 text-center">
        Adicionar Admin
      </h3>

      <form className="pt-6 space-y-4" onSubmit={handleSubmit}>
        {errors.general && (
          <div className="text-red-500 text-sm text-center">{errors.general}</div>
        )}

        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Introduza o nome"
            className="py-2.5 px-4 w-full border border-gray-600 bg-gray-900 text-gray-100 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name[0]}</div>}
        </div>

        {/* Apelido */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Apelido</label>
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            required
            placeholder="Introduza o apelido"
            className="py-2.5 px-4 w-full border border-gray-600 bg-gray-900 text-gray-100 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          {errors.last_name && <div className="text-red-500 text-sm mt-1">{errors.last_name[0]}</div>}
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Telefone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder="Telemóvel ou telefone"
            className="py-2.5 px-4 w-full border border-gray-600 bg-gray-900 text-gray-100 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          {errors.phone && <div className="text-red-500 text-sm mt-1">{errors.phone[0]}</div>}
        </div>

        {/* Data de nascimento */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Data de nascimento</label>
          <input
            type="date"
            name="birthday"
            value={form.birthday}
            onChange={handleChange}
            required
            className="py-2.5 px-4 w-full border border-gray-600 bg-gray-900 text-gray-100 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          {errors.birthday && <div className="text-red-500 text-sm mt-1">{errors.birthday[0]}</div>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Introduza o email"
            className="py-2.5 px-4 w-full border border-gray-600 bg-gray-900 text-gray-100 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email[0]}</div>}
        </div>

        {/* Palavra-passe */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Palavra-passe</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Introduza a palavra-passe"
              className="py-2.5 px-4 w-full border border-gray-600 bg-gray-900 text-gray-100 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 end-0 flex items-center px-3 text-gray-400 cursor-pointer"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password[0]}</div>}
        </div>

        {/* Confirmar palavra-passe */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Confirmar palavra-passe</label>
          <div className="relative">
            <input
              type={showPasswordConfirm ? "text" : "password"}
              name="password_confirmation"
              value={form.password_confirmation}
              onChange={handleChange}
              required
              placeholder="Repita a palavra-passe"
              className="py-2.5 px-4 w-full border border-gray-600 bg-gray-900 text-gray-100 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              className="absolute inset-y-0 end-0 flex items-center px-3 text-gray-400 cursor-pointer"
            >
              {showPasswordConfirm ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* Botão */}
        <div className="text-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-400 transition"
          >
            {loading ? "A criar..." : "Adicionar Admin"}
          </button>
        </div>
      </form>
    </div>
  );
}
