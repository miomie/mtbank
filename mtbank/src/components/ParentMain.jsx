import React from 'react';

const ParentMain = () => {
  return (
    <div className="px-5 flex flex-col gap-4 text-[#0f172a] animate-fade-in">
      {/* Шапка */}
      <div className="flex items-center gap-3 pt-1">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-sm border border-blue-200 shadow-sm">
          В
        </div>
        <div>
          <h1 className="text-base font-black text-[#0f172a] leading-tight">Виктория</h1>
          <p className="text-[11px] text-gray-400 font-bold">Онлайн</p>
        </div>
      </div>

      {/* Карта MTBank Premium */}
      <div className="w-full h-[160px] bg-black text-white rounded-[28px] p-5 shadow-2xl relative flex flex-col justify-between overflow-hidden border border-gray-800">
        <div className="flex justify-between items-start z-10">
          <span className="text-sm font-black tracking-wide">MTBank</span>
          <span className="text-xs font-bold text-gray-400">Premium</span>
        </div>
        <div className="flex justify-between items-end z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-5 rounded bg-gray-700/80 border border-gray-600 flex items-center justify-center">
              <div className="w-4 h-2.5 border border-gray-400 rounded-sm" />
            </div>
            <span className="text-lg font-black tracking-wider">1000.00 BYN</span>
          </div>
          <div className="flex -space-x-3 items-center">
            <div className="w-7 h-7 rounded-full bg-[#eb001b] opacity-90" />
            <div className="w-7 h-7 rounded-full bg-[#f79e1b] opacity-90 mix-blend-screen" />
          </div>
        </div>
      </div>

      {/* Быстрые действия */}
      <div className="grid grid-cols-3 gap-2.5 bg-white/70 backdrop-blur-md p-2.5 rounded-3xl border border-white/80 shadow-sm">
        <button className="flex flex-col items-center justify-center py-2.5 rounded-2xl hover:bg-white/80 transition cursor-pointer">
          <span className="text-lg mb-1">📥</span>
          <span className="text-[11px] font-extrabold text-gray-800">Пополнить</span>
        </button>
        <button className="flex flex-col items-center justify-center py-2.5 rounded-2xl hover:bg-white/80 transition cursor-pointer">
          <span className="text-lg mb-1">🔄</span>
          <span className="text-[11px] font-extrabold text-gray-800">Перевести</span>
        </button>
        <button className="flex flex-col items-center justify-center py-2.5 rounded-2xl hover:bg-white/80 transition cursor-pointer">
          <span className="text-lg mb-1">💳</span>
          <span className="text-[11px] font-extrabold text-gray-800">Оплатить</span>
        </button>
      </div>

      {/* Баннер обмена */}
      <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/80 rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-xs font-black text-[#0f172a]">Обмен валюты</p>
          <p className="text-[11px] text-gray-500 font-medium">по выгодному курсу</p>
        </div>
        <span className="text-2xl">💱</span>
      </div>

      {/* Список счетов */}
      <div className="bg-white/75 backdrop-blur-md border border-white/80 rounded-[32px] p-4 shadow-sm">
        <h3 className="text-xs font-black text-[#0f172a] mb-3">Мои счета</h3>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/80 border border-gray-100 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-900 flex items-center justify-center text-white text-xs">💳</div>
              <div>
                <p className="text-xs font-bold text-[#0f172a]">Основной счет</p>
                <p className="text-xs font-black text-gray-900">1000.00 BYN</p>
              </div>
            </div>
            <span className="text-gray-400 text-xs">👁️</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/80 border border-gray-100 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs">🐖</div>
              <div>
                <p className="text-xs font-bold text-[#0f172a]">Сберегательный BYN</p>
                <p className="text-xs font-black text-emerald-600">350.00 BYN</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/80 border border-gray-100 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-xs">💵</div>
              <div>
                <p className="text-xs font-bold text-[#0f172a]">Валютный USD</p>
                <p className="text-xs font-black text-blue-600">120.00 $</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentMain;