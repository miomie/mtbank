import React from 'react';

const FamilyHeader = () => {
  return (
    <header className="flex items-center gap-3.5 pt-2 pb-1">
      <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-[#0044ff] shrink-0">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 17.93V4.14l6 2.25v4.7c0 4.06-2.55 7.82-6 8.84z" />
        </svg>
      </div>
      <div>
        <h1 className="text-[#0f172a] font-bold text-base leading-tight">
          Семейный контроль
        </h1>
        <p className="text-[#64748b] text-xs mt-0.5">
          Управление счетами и задачами
        </p>
      </div>
    </header>
  );
};

export default FamilyHeader;