import { useState } from "react";

export default function EditProfile() {
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    apelido: "",
    contacto: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full max-w-xl bg-gray-800 p-6">

      {/* Head */}
      <h3 className="text-lg font-semibold text-white pb-4 border-b border-gray-700 text-center">
        Editar Perfil
      </h3>

      <div className="pt-6">
        {!saved ? (
          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* Name */}
            <div>
              <label
                htmlFor="nome"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Nome
              </label>

              <input
                type="text"
                id="nome"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Introduza o seu nome"
                className="py-2.5 ps-4 pe-10 w-full border border-gray-600 bg-gray-900 text-gray-100 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Surname */}
            <div>
              <label
                htmlFor="apelido"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Apelido
              </label>

              <input
                type="text"
                id="apelido"
                name="apelido"
                value={form.apelido}
                onChange={handleChange}
                placeholder="Introduza o seu apelido"
                className="py-2.5 ps-4 pe-10 w-full border border-gray-600 bg-gray-900 text-gray-100 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="contacto"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Contacto
              </label>

              <input
                type="text"
                id="contacto"
                name="contacto"
                value={form.contacto}
                onChange={handleChange}
                placeholder="Telemóvel ou telefone"
                className="py-2.5 ps-4 pe-10 w-full border border-gray-600 bg-gray-900 text-gray-100 rounded-lg text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-400 transition duration-300"
            >
              Guardar
            </button>

          </form>
        ) : (
          <div className="text-center space-y-6">

            <p className="text-gray-300 text-sm">
              Os dados foram atualizados com sucesso.
            </p>

            {/* Botão Voltar */}
            <button
              onClick={() => setSaved(false)}
              className="rounded-lg bg-gray-700 px-6 py-2 text-sm font-semibold text-gray-200 hover:bg-gray-600 focus:ring-4 focus:ring-gray-500 transition duration-300"
            >
              Voltar
            </button>

          </div>
        )}
      </div>
    </div>
  );
}
