import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
const Header = ({ user, isLight = false }) => {
  return (
    <header className={`flex items-center justify-between py-3 px-1 ${isLight ? 'text-[#0f172a]' : 'text-white'}`}>
      {/* Информация о пользователе */}
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm ${
          isLight ? 'bg-blue-600 text-white' : 'bg-white/20 text-white'
        }`}>
          {user?.name ? user.name[0] : 'В'}
        </div>
        <div>
          <h1 className="font-bold text-sm leading-tight">
            {user?.name || 'Виктория'}
          </h1>
          <p className={`text-[10px] ${isLight ? 'text-gray-500' : 'text-[#8e9bb0]'}`}>
            Moby ID: {user?.mobyId || '4892'}
          </p>
        </div>
      </div>

      {/* Кнопка уведомлений / профиля */}
      <div className={`w-9 h-9 rounded-full border flex items-center justify-center cursor-pointer shadow-sm transition ${
        isLight 
          ? 'bg-white border-gray-200 text-[#0f172a] hover:bg-gray-50' 
          : 'bg-[#182132] border-[#263248] text-white hover:bg-[#232f46]'
      }`}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </div>
    </header>
  );
};

export default Header;