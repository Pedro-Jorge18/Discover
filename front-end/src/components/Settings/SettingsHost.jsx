import { useState } from "react";
import { X, House  } from "lucide-react";
import ResetPassword from "../Auth/ResetPassword";
import TwoFactorAuth from "../Auth/TwoFactory";
import EditProfile from "./EditProfile";

export default function SettingsHost({ onClose }) {
  const [selected, setSelected] = useState("addHouse");

  const menuItems = [
    { id: "addHouse", label: "Imóvel", icon: House },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

      {/* Card principal */}
      <div className="w-full max-w-5xl h-[80vh] bg-gray-900 text-white rounded-2xl shadow-2xl flex overflow-hidden">

        {/* MENU LATERAL */}
        <aside className="w-64 bg-gray-800 p-6 flex flex-col gap-3">
          <h2 className="text-lg font-semibold mb-4 text-gray-200">
            Menu Host
          </h2>

          {menuItems.map(item => {
            const Icon = item.icon;
            const active = selected === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setSelected(item.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
                  ${active
                    ? "bg-gray-700 border-l-4 border-indigo-500 text-indigo-400"
                    : "text-gray-300 hover:bg-gray-700"
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* CONTEÚDO */}
        <main className="flex-1 p-8 relative overflow-y-auto">

          {/* BOTÃO FECHAR */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>

          <h1 className="text-2xl font-bold mb-6">
            {menuItems.find(x => x.id === selected)?.label}
          </h1>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            {selected === "addHouse" && <EditProfile />}
            {selected === "seguranca" && (
              <div className="flex flex-col gap-6">
                <TwoFactorAuth />
                <ResetPassword />
              </div>
            )}
            {selected === "notificacoes" && <p>Gerir notificações.</p>}
            {selected === "privacidade" && <p>Definições de privacidade.</p>}
          </div>
        </main>
      </div>
    </div>
  );
}
