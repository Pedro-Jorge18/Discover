import { useState } from "react";
import { X } from "lucide-react";
import ResetPassword from "../Auth/ResetPassword";
import TwoFactorAuth from "../Auth/TwoFactory";
import EditProfile from "./EditProfile";

export default function SettingsMain({ onClose , user, token }) {
  const [selected, setSelected] = useState("perfil");

  const menuItems = [
    { id: "perfil", label: "Perfil", icon: IconUser },
    { id: "seguranca", label: "Segurança", icon: IconShield },
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
            {selected === "perfil" && <EditProfile />}
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

/* ICONS */
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
