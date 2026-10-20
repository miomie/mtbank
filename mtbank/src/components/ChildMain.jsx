import React, { useState } from 'react';

const ChildMain = ({ balance, onFeedPet }) => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Убраться в комнате',
      reward: '5.00 BYN',
      status: 'Выполнено', // Доступные статусы: 'Выполнить', 'Выполнено'
    },
  ]);

  const handleTaskAction = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: 'Выполнено' } : task
      )
    );
  };

  return (
    <main className="flex-1 flex flex-col gap-4 mt-3">
      {/* Блок «Моби-гочи» */}
      <section className="bg-white border border-[#e2e8f0] rounded-[24px] p-4 shadow-[0_2px_8px_rgba(15,23,42,0.03)] flex flex-col items-center text-center">
        <div className="w-full flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-1.5 font-bold text-xs text-[#0f172a]">
            <span>🐶</span> Моби-гочи
          </div>
          <span className="bg-[#e6f6f0] text-[#0d684b] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <span>😊</span> Счастлива
          </span>
        </div>

        {/* Картинка питомца (щенок) */}
        <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md my-2 border-2 border-white">
          <img
            src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80"
            alt="Моби-гочи"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Прогресс-бар / текст задания */}
        <div className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl py-2 px-3 text-[11px] text-[#475569] my-2">
          🎯 Собери все орешки, выполняя задания от родителей!
        </div>

        {/* Кнопка кормления */}
        <button
          onClick={onFeedPet}
          className="w-full bg-gradient-to-r from-[#ff6b00] to-[#ff8c00] hover:opacity-95 active:scale-[0.99] transition-all text-white font-bold text-xs rounded-xl py-3 px-4 mt-1 shadow-md cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>🍎</span> Покормить питомца (+2 BYN)
        </button>
      </section>

      {/* Блок «Задания от родителей» */}
      <section>
        <h2 className="text-[#64748b] text-[11px] font-bold uppercase tracking-wider mb-2 px-0.5 flex items-center gap-1.5">
          <span>🎯</span> ЗАДАНИЯ ОТ РОДИТЕЛЕЙ
        </h2>
        <div className="flex flex-col gap-2.5">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white border border-[#e2e8f0] rounded-2xl p-3.5 flex items-center justify-between shadow-[0_2px_8px_rgba(15,23,42,0.03)]"
            >
              <div>
                <h3 className="text-[#0f172a] font-bold text-xs leading-tight">
                  {task.title}
                </h3>
                <p className="text-[#64748b] text-[11px] mt-1">
                  Награда: {task.reward}
                </p>
              </div>

              {task.status === 'Выполнено' ? (
                <span className="bg-[#0044ff] text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-sm">
                  Выполнено
                </span>
              ) : (
                <button
                  onClick={() => handleTaskAction(task.id)}
                  className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0f172a] font-bold text-xs px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                >
                  Сделать
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default ChildMain;