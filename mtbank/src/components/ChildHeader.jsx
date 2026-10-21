import React from 'react';

const ChildHeader = ({ name, balance, cardLast4 }) => {
  return (
    <header className="pt-2 pb-1">
      {/* Приветствие и бейдж Junior */}
      <div className="flex items-center justify-between mb-3 px-1">
        {/* <h1 className="text-[#0f172a] font-bold text-lg tracking-tight flex items-center gap-1.5">
          Привет, {name}! <span>🐶</span>
        </h1> */}
        <span className="bg-[#f59e0b] text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
          Junior
        </span>
      </div>

      {/* Синяя карточка баланса */}
      <div className="bg-gradient-to-r from-[#0044ff] to-[#1348cd] rounded-[24px] p-4 text-white shadow-lg">
        <p className="text-blue-200 text-[10px] font-bold uppercase tracking-wider">
          БАЛАНС НА КАРТЕ
        </p>
        <p className="text-[26px] font-extrabold tracking-tight mt-0.5">
          {balance}
        </p>
        <div className="flex items-center justify-between mt-3 text-xs text-blue-100 font-medium">
          <span>{name.toUpperCase()} ИВАНОВ</span>
          <span className="tracking-widest">•••• {cardLast4}</span>
        </div>
      </div>
    </header>
  );
};

export default ChildHeader;