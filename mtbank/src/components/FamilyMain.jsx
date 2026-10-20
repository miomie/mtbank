import React, { useState } from 'react';

// Подкомпонент 1: Карточка счёта ребёнка
const ChildAccountCard = ({ name, details, balance }) => (
  <div className="bg-white border border-[#e2e8f0] rounded-2xl p-3.5 flex items-center justify-between shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
    <div>
      <h3 className="text-[#0f172a] font-bold text-sm leading-tight">
        {name}
      </h3>
      <p className="text-[#64748b] text-xs mt-1">{details}</p>
    </div>
    <span className="text-[#0044ff] font-extrabold text-sm whitespace-nowrap">
      {balance}
    </span>
  </div>
);

// Подкомпонент 2: Форма создания нового задания
const NewTaskForm = ({ childrenList, onAddTask }) => {
  const [selectedChild, setSelectedChild] = useState(childrenList[0].name);
  const [description, setDescription] = useState('');
  const [reward, setReward] = useState('5');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim() || !reward) return;

    const shortName = selectedChild.split(' ')[0];
    
    // ИСПРАВЛЕНИЕ: добавлены обратные кавычки для шаблонных строк
    onAddTask({
      id: Date.now(),
      title: `${description.trim()} (${shortName})`,
      status: 'Ожидает проверки',
      reward: `+${parseFloat(reward).toFixed(2)} BYN`,
    });

    setDescription('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-3 shadow-[0_2px_8px_rgba(15,23,42,0.03)]"
    >
      {/* Выпадающий список: Кому назначить */}
      <div>
        <label className="block text-[#475569] text-xs font-medium mb-1">
          Кому назначить:
        </label>
        <div className="relative">
          <select
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            className="w-full appearance-none bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3 py-2.5 text-xs text-[#0f172a] font-medium focus:outline-none focus:border-[#0044ff] cursor-pointer"
          >
            {childrenList.map((child) => (
              <option key={child.id} value={child.name}>
                {child.name}
              </option>
            ))}
          </select>
          <svg
            className="w-4 h-4 text-[#0f172a] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      {/* Поле ввода: Описание задания */}
      <div>
        <label className="block text-[#475569] text-xs font-medium mb-1">
          Описание задания:
        </label>
        <input
          type="text"
          placeholder="Например: Сделать уроки по физике"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3 py-2.5 text-xs text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#0044ff]"
        />
      </div>

      {/* Поле ввода: Награда за выполнение */}
      <div>
        <label className="block text-[#475569] text-xs font-medium mb-1">
          Награда за выполнение (BYN):
        </label>
        <input
          type="number"
          min="1"
          step="0.5"
          value={reward}
          onChange={(e) => setReward(e.target.value)}
          className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3 py-2.5 text-xs text-[#0f172a] font-medium focus:outline-none focus:border-[#0044ff]"
        />
      </div>

      {/* Кнопка отправки */}
      <button
        type="submit"
        className="w-full bg-[#003cd2] hover:bg-[#0033b3] active:scale-[0.99] transition-all text-white font-bold text-xs rounded-xl py-3 px-4 mt-1 shadow-md cursor-pointer leading-snug"
      >
        ✨ Поставить задание и
        <br />
        зарезервировать сумму
      </button>
    </form>
  );
};

// Подкомпонент 3: Карточка активной задачи
const ActiveTaskCard = ({ title, status, reward }) => (
  <div className="bg-white border border-[#e2e8f0] rounded-2xl p-3.5 flex items-center justify-between shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
    <div>
      <h3 className="text-[#0f172a] font-bold text-xs leading-tight">
        {title}
      </h3>
      <p className="text-[#64748b] text-[11px] mt-1">{status}</p>
    </div>
    <span className="bg-[#e6f6f0] text-[#0d684b] font-bold text-xs px-2.5 py-1 rounded-lg whitespace-nowrap">
      {reward}
    </span>
  </div>
);

const FamilyMain = () => {
  const childrenAccounts = [
    {
      id: 1,
      name: 'Артём',
      details: 'МТБанк Junior • Лимит 20 BYN/д.',
      balance: '45.00 BYN',
    },
    {
      id: 2,
      name: 'Алиса',
      details: 'Moby Next • Онлайн-покупки ВКЛ',
      balance: '118.50 BYN',
    },
  ];

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Убраться в комнате (Артём)',
      status: 'Ожидает проверки',
      reward: '+5.00 BYN',
    },
  ]);

  const handleAddTask = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  return (
    <main className="flex-1 flex flex-col gap-4 mt-4">
      {/* Секция 1: Счета детей и подростков */}
      <section>
        <h2 className="text-[#64748b] text-[11px] font-bold uppercase tracking-wider mb-2 px-0.5">
          СЧЕТА ДЕТЕЙ И ПОДРОСТКОВ
        </h2>
        <div className="flex flex-col gap-2.5">
          {childrenAccounts.map((child) => (
            <ChildAccountCard
              key={child.id}
              name={child.name}
              details={child.details}
              balance={child.balance}
            />
          ))}
        </div>
      </section>

      {/* Секция 2: Новое задание для ребёнка */}
      <section>
        <h2 className="text-[#64748b] text-[11px] font-bold uppercase tracking-wider mb-2 px-0.5 flex items-center gap-1.5">
          <span>🎯</span> НОВОЕ ЗАДАНИЕ ДЛЯ РЕБЁНКА
        </h2>
        <NewTaskForm
          childrenList={childrenAccounts}
          onAddTask={handleAddTask}
        />
      </section>

      {/* Секция 3: Активные задачи */}
      <section>
        <h2 className="text-[#64748b] text-[11px] font-bold uppercase tracking-wider mb-2 px-0.5">
          АКТИВНЫЕ ЗАДАЧИ
        </h2>
        <div className="flex flex-col gap-2.5">
          {tasks.map((task) => (
            <ActiveTaskCard
              key={task.id}
              title={task.title}
              status={task.status}
              reward={task.reward}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default FamilyMain;