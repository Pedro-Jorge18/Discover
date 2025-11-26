import { useState } from "react";
import ResetPassword from "../Auth/ResetPassword";
import TwoFactorAuth from "../Auth/TwoFactory";
import EditProfile from "./EditProfile";
export default function SettingsMain() {
  const [selected, setSelected] = useState("perfil");

  const menuItems = [
    { id: "perfil", label: "Perfil", icon: IconUser },
    { id: "seguranca", label: "Segurança", icon: IconShield },
    { id: "notificacoes", label: "Notificações", icon: IconBell },
    { id: "privacidade", label: "Privacidade", icon: IconLock },
  ];

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Left MENU */}
      <aside className="w-64 border-r border-gray-700 bg-gray-800 p-6 flex flex-col gap-3">
        <h2 className="text-lg font-semibold mb-4 text-gray-200">
          Definições
        </h2>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = selected === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setSelected(item.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
                ${isActive
                  ? "bg-gray-700 border-l-4 border-indigo-500 text-indigo-400"
                  : "text-gray-300 hover:bg-gray-700"
                }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-indigo-400" : "text-gray-400"}`} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </aside>

      <main className="flex-1 p-10">
        <h1 className="text-2xl font-bold mb-4 flex justify-center items-center">
          {menuItems.find((x) => x.id === selected)?.label}
        </h1>

        <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 text-gray-300 flex justify-center items-center">
          {/* Settings Options */}
          {selected === "perfil" && (
            <div className="flex flex-col gap-4 items-center">
              <EditProfile />
            </div>
          )}
          {selected === "seguranca" && (
            <div className="flex flex-col gap-4 items-center">
              <TwoFactorAuth />
              <ResetPassword />
            </div>
          )}
          {selected === "notificacoes" && <p>Gerir notificações e alertas.</p>}
          {selected === "privacidade" && <p>Controlar definições de privacidade.</p>}
        </div>
      </main>
    </div>
  );
}

/* ícones of Settings */
function IconUser({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5z" />
      <path d="M4 22c0-4 4-7 8-7s8 3 8 7" />
    </svg>
  );
}

function IconShield({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconBell({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 13.8V11a6 6 0 1 0-12 0v2.8a2 2 0 0 1-.6 1.4L4 17h5" />
      <path d="M10 21h4" />
    </svg>
  );
}

function IconLock({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
