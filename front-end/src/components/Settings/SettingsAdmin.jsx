import { useState } from "react";
import { X, House, User } from "lucide-react";
import ResetPassword from "../Auth/ResetPassword";
import TwoFactorAuth from "../Auth/TwoFactory";
import AddAdmin from "./AddAdmin";
import RemovePost from "./RemovePost";

export default function SettingsAdmin({ onClose }) {
  const [selected, setSelected] = useState("utilizador");

  const menuItems = [
    { id: "utilizador", label: "Utilizador", icon: User },
    { id: "imovel", label: "Imóvel", icon: House },
    //{ id: "notificacoes", label: "Notificações", icon: IconBell },
    //{ id: "privacidade", label: "Privacidade", icon: IconLock },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm">

      {/* Card */}
      <div className="w-full max-w-5xl h-[80vh] bg-gray-900 text-white rounded-2xl shadow-2xl flex overflow-hidden">

        {/* Left Menu  */}
        <aside className="w-64 bg-gray-800 p-6 flex flex-col gap-3">
          <h2 className="text-lg font-semibold mb-4 text-gray-200">
            Definições
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

        {/* Content */}
        <main className="flex-1 p-8 relative overflow-y-auto">

          {/* CLOSE BUTTON */}
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
            {selected === "utilizador" && <AddAdmin />}
            {selected === "imovel" && (
              <div className="flex flex-col gap-6">
                <RemovePost />
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
