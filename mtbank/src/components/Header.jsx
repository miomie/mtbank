import React from 'react';
import { GiPiggyBank } from "react-icons/gi";

// Вспомогательный компонент для кнопок быстрых действий
const QuickActionButton = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-1.5 bg-white/15 hover:bg-white/20 active:scale-95 transition-all rounded-2xl py-3 px-2 border border-white/5 cursor-pointer"
  >
    <div className="text-white">{icon}</div>
    <span className="text-white text-xs font-medium tracking-tight">
      {label}
    </span>
  </button>
);

const Header = ({ user, balance }) => {
  const quickActions = [
    {
      id: 'transfers',
      label: 'Переводы',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 4l3 3-3 3" />
          <path d="M4 7h16" />
          <path d="M7 20l-3-3 3-3" />
          <path d="M20 17H4" />
        </svg>
      ),
    },
    {
      id: 'erip',
      label: 'ЕРИП / QR',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <path d="M14 14h3v3h-3z" />
          <path d="M17 17h4v4h-4z" />
          <path d="M14 20h1" />
          <path d="M20 14v1" />
        </svg>
      ),
    },
    {
      id: 'piggy',
      label: 'Копилка',
      icon: (
        <GiPiggyBank />

      ),
    },
  ];

  return (
    <header className="bg-gradient-to-b from-[#1348cd] to-[#0044ff] rounded-[28px] p-5 shadow-lg">
      {/* Профиль пользователя */}
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z" />
          </svg>
        </div>
        <div>
          <h1 className="text-white font-bold text-base leading-tight">
            {user?.name}
          </h1>
          <p className="text-blue-200/90 text-xs mt-0.5">
            Moby ID: {user.mobyId}
          </p>
        </div>
      </div>

      {/* Общий баланс */}
      <div className="mt-5">
        <p className="text-blue-200/90 text-xs font-medium uppercase tracking-wider">
          ОБЩИЙ БАЛАНС
        </p>
        <p className="text-white text-[28px] font-extrabold tracking-tight mt-0.5">
          {balance}
        </p>
      </div>

      {/* Кнопки быстрых действий */}
      <div className="grid grid-cols-3 gap-2.5 mt-4">
        {quickActions.map((action) => (
          <QuickActionButton
            key={action.id}
            icon={action.icon}
            label={action.label}
          />
        ))}
      </div>
    </header>
  );
};

export default Header;