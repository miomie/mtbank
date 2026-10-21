import React from 'react';

const ChildNextMain = () => {
  return (
    <div className="px-5 flex flex-col gap-4 text-[#0f172a] animate-fade-in">
      {/* Шапка */}
      <div className="flex items-center gap-3 pt-1">
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-lg shadow-sm border border-amber-200">
          👧
        </div>
        <div>
          <h1 className="text-base font-black text-[#0f172a] flex items-center gap-1 leading-tight">
            Алиса <span className="text-amber-500 text-sm">⚡</span>
          </h1>
          <p className="text-[11px] text-purple-600 font-extrabold">Teen PRO</p>
        </div>
      </div>

      {/* Карта MTBank Next */}
      <div className="w-full h-[160px] bg-black text-white rounded-[28px] p-5 shadow-2xl relative flex flex-col justify-between overflow-hidden border border-gray-800">
        <div className="flex justify-between items-start z-10">
          <span className="text-sm font-black tracking-wide">MTBank</span>
          <span className="text-xs font-bold text-gray-400">Next</span>
        </div>
        <div className="flex justify-between items-end z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-5 rounded bg-gray-700/80 border border-gray-600 flex items-center justify-center">
              <div className="w-4 h-2.5 border border-gray-400 rounded-sm" />
            </div>
            <span className="text-lg font-black tracking-wider">118.50 BYN</span>
          </div>
          <div className="flex -space-x-3 items-center">
            <div className="w-7 h-7 rounded-full bg-[#eb001b] opacity-90" />
            <div className="w-7 h-7 rounded-full bg-[#f79e1b] opacity-90 mix-blend-screen" />
          </div>
        </div>
      </div>

      {/* Переключатель точек */}
      <div className="flex justify-center gap-1.5 -my-1">
        <div className="w-2 h-1.5 rounded-full bg-purple-300" />
        <div className="w-4 h-1.5 rounded-full bg-purple-600" />
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

      {/* Активные счета */}
      <div className="bg-white/75 backdrop-blur-md border border-white/80 rounded-[32px] p-4 shadow-sm">
        <h3 className="text-xs font-black text-[#0f172a] mb-3">Активные счета</h3>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/80 border border-gray-100 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center text-xs">💳</div>
              <div>
                <p className="text-xs font-bold text-[#0f172a]">Личная карта</p>
                <p className="text-xs font-black text-gray-900">118.50 BYN</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/70 border border-purple-100 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center text-xs">🎯</div>
              <div>
                <p className="text-xs font-bold text-[#0f172a]">Счет для подписок</p>
                <p className="text-xs font-black text-purple-600">30.00 BYN</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/80 border border-gray-100 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-sm">🐷</div>
              <div>
                <p className="text-xs font-bold text-[#0f172a]">Копилка NEXT</p>
                <p className="text-xs font-black text-gray-700">50.00 BYN</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildNextMain;