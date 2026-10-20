import React from 'react';
import Footer from '../components/Footer';

const TeenFamilyPage = ({ user }) => {
  return (
    <div className="min-h-screen bg-[#152354] flex items-center justify-center p-4 font-sans select-none">
      <div className="w-full max-w-[380px] h-[800px] bg-[#0d1527] rounded-[46px] border-[10px] border-[#1b2434] shadow-2xl relative flex flex-col overflow-hidden text-white">
        <div className="w-32 h-5 bg-[#1b2434] rounded-b-2xl mx-auto shrink-0" />

        <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between mt-1">
            <div>
              <h1 className="font-bold text-lg">Привет, {user.name}! 🚀</h1>
              <p className="text-xs text-[#8e9bb0]">Moby Next • 14–17 лет</p>
            </div>
            <span className="bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
              NEXT
            </span>
          </div>

          {/* Карточка стильная */}
          <div className="bg-gradient-to-br from-[#1e1b4b] via-[#311042] to-[#431407] rounded-2xl p-4 border border-white/10 shadow-lg">
            <p className="text-xs text-purple-300 font-medium">МОЙ СЧЁТ</p>
            <p className="text-2xl font-black mt-1">118.50 BYN</p>
            <div className="flex justify-between items-center mt-3 text-xs text-purple-200/80">
              <span>{user.name.toUpperCase()}</span>
              <span>•••• 9912</span>
            </div>
          </div>

          {/* Онлайн-покупки статус */}
          <div className="bg-[#162032] border border-[#233149] rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🛍️</span>
              <div>
                <p className="text-xs font-bold">Онлайн-покупки</p>
                <p className="text-[10px] text-[#8e9bb0]">Игры, сервисы, подписки</p>
              </div>
            </div>
            <span className="bg-[#00f5d4]/10 text-[#00f5d4] text-[11px] font-bold px-2.5 py-1 rounded-md">
              ВКЛ
            </span>
          </div>

          {/* Активные задачи от родителей */}
          <div>
            <p className="text-[11px] font-bold text-[#8e9bb0] uppercase mb-2">Задачи и челенджи</p>
            <div className="bg-[#162032] border border-[#233149] rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold">Закончить четверть без 7-ок</p>
                <p className="text-[10px] text-[#8e9bb0]">Награда: +50.00 BYN</p>
              </div>
              <button className="bg-[#0044ff] text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                В процессе
              </button>
            </div>
          </div>
        </div>

        <Footer isLight={false} />
      </div>
    </div>
  );
};

export default TeenFamilyPage;