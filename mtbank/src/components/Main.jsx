import React, { useState } from 'react';
import { MdCurrencyExchange } from "react-icons/md";
import { MdChildCare } from "react-icons/md";


const initialAccounts = [
  {
    id: 'acc-1',
    title: 'Текущий счёт',
    subtitle: '*4821 • MTбанк',
    balance: '1 000.00 BYN',
  },
];

export default function Main({ onNavigate }) {
  const [accounts] = useState(initialAccounts);

  return (
    <main className="flex-1 flex flex-col gap-3.5 mt-3.5 select-none">
      {/* Плашка курса валют */}
      <button
        type="button"
        onClick={() => onNavigate?.('exchange')}
        className="w-full bg-gradient-to-r from-[#8b21c6] via-[#c70e8e] to-[#ff006a] hover:brightness-110 active:scale-[0.99] transition-all rounded-2xl px-4 py-3.5 flex items-center justify-between cursor-pointer shadow-lg shadow-[#c70e8e]/15"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-base leading-none"><MdCurrencyExchange color="white"/>
</span>
          <span className="text-white font-bold text-sm tracking-tight">
            Обмен валют по курсу банка
          </span>
        </div>
        <svg
          className="w-4 h-4 text-white/90"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Блок семейного банкинга */}
      <div
        onClick={() => onNavigate?.('family')}
        className="bg-[#182132] border border-[#263248] hover:border-[#354664] transition-colors rounded-2xl p-4 cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base leading-none"><MdChildCare color="white"/>
</span>
            <h2 className="text-white font-bold text-sm">
              Семейный банкинг Moby
            </h2>
          </div>
          <span className="text-[#00e5c3] text-xs font-semibold">Активно</span>
        </div>
        <p className="text-[#8e9bb0] text-xs leading-relaxed mt-2">
          Карта Артёма: лимиты настроены,
          <br />
          остаток 45.00 BYN.
        </p>
      </div>

      {/* Список счетов */}
      <section className="mt-1">
        <h2 className="text-[#9ba8bc] text-xs font-semibold mb-2 px-0.5">
          Счета и карты
        </h2>

        <div className="flex flex-col gap-2.5">
          {accounts.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate?.(`account-${item.id}`)}
              className="bg-[#182132] border border-[#263248] hover:border-[#354664] rounded-2xl p-3.5 flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#232f46] flex items-center justify-center text-[#00f5d4] shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[#8e9bb0] text-xs mt-0.5">{item.subtitle}</p>
                </div>
              </div>

              <span className="text-white font-bold text-sm whitespace-nowrap">
                {item.balance}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}