import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

const fetchFamilyData = async () => {
    try {
      // 1. Загружаем детей текущего родителя
      const { data: childrenData, error: childError } = await supabase
        .from('users')
        .select('*')
        .eq('parent_id', user.uid);

      if (childError) throw childError;

      let currentChildIds = [];
      if (childrenData && childrenData.length > 0) {
        currentChildIds = childrenData.map((c) => c.id);
        setChildrenAccounts(
          childrenData.map((c) => ({
            id: c.id,
            name: c.name,
            details: c.role === 'child_next' ? 'Moby Next • Онлайн-покупки ВКЛ' : 'МТБанк Junior • Лимит 20 BYN/д.',
            balance: '0.00 BYN',
            role: c.role,
          }))
        );
      }

      // 2. Загружаем задания СТРОГО для детей этого родителя
      if (currentChildIds.length > 0) {
        const { data: tasksData, error: taskError } = await supabase
          .from('tasks')
          .select('*')
          .in('child_id', currentChildIds) // <--- Фильтр по списку ID детей родителя
          .order('id', { ascending: false });

        if (taskError) throw taskError;
        if (tasksData) setTasks(tasksData);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error('Ошибка загрузки данных семьи:', err);
    }
  };

// Подкомпонент 1: Карточка счёта ребёнка (динамическая)
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

// Подкомпонент 2: Форма создания нового задания с реальным выбором детей
const NewTaskForm = ({ childrenList, onAddTask, loading }) => {
  const [selectedChildId, setSelectedChildId] = useState(childrenList[0]?.id || '');
  const [description, setDescription] = useState('');
  const [reward, setReward] = useState('5');

  // Обновляем выбранного ребенка, когда список загрузится
  useEffect(() => {
    if (childrenList.length > 0 && !selectedChildId) {
      setSelectedChildId(childrenList[0].id);
    }
  }, [childrenList]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim() || !reward || !selectedChildId) return;

    const targetChild = childrenList.find((c) => c.id === selectedChildId);
    const shortName = targetChild ? targetChild.name.split(' ')[0] : 'Ребёнок';

    onAddTask({
      title: `${description.trim()} (${shortName})`,
      status: 'Ожидает проверки',
      reward: `+${parseFloat(reward).toFixed(2)} BYN`,
      child_name: shortName,
      child_id: selectedChildId,
    });

    setDescription('');
  };

  if (childrenList.length === 0) {
    return (
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 text-center text-xs text-[#64748b]">
        У вас пока нет добавленных детей. Вы можете добавить их при регистрации или в настройках семьи.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#e2e8f0] rounded-2xl p-4 flex flex-col gap-3 shadow-[0_2px_8px_rgba(15,23,42,0.03)]"
    >
      <div>
        <label className="block text-[#475569] text-xs font-medium mb-1">
          Кому назначить:
        </label>
        <div className="relative">
          <select
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
            className="w-full appearance-none bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3 py-2.5 text-xs text-[#0f172a] font-medium focus:outline-none focus:border-[#0044ff] cursor-pointer"
          >
            {childrenList.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name} ({child.role === 'child_next' ? 'Moby Next' : 'Moby Junior'})
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

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#003cd2] hover:bg-[#0033b3] active:scale-[0.99] transition-all text-white font-bold text-xs rounded-xl py-3 px-4 mt-1 shadow-md cursor-pointer leading-snug disabled:opacity-50"
      >
        {loading ? 'Сохранение в базу...' : '✨ Поставить задание и зарезервировать сумму'}
      </button>
    </form>
  );
};

// Подкомпонент 3: Карточка активной задачи
const ActiveTaskCard = ({ title, status, reward, onToggleComplete, onDelete }) => {
  const isCompleted = status === 'Выполнено';

  return (
    <div className={`border rounded-2xl p-3.5 flex items-center justify-between transition-all shadow-[0_2px_8px_rgba(15,23,42,0.03)] ${
      isCompleted ? 'bg-[#f0fdf4] border-[#bbf7d0]' : 'bg-white border-[#e2e8f0]'
    }`}>
      <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={onToggleComplete}
          className="w-4 h-4 accent-[#0044ff] rounded cursor-pointer shrink-0"
          title="Отметить как выполненное"
        />
        <div className="min-w-0">
          <h3 className={`text-xs font-bold leading-tight truncate ${isCompleted ? 'line-through text-[#64748b]' : 'text-[#0f172a]'}`}>
            {title}
          </h3>
          <p className={`text-[11px] mt-1 ${isCompleted ? 'text-emerald-600 font-medium' : 'text-[#64748b]'}`}>
            {isCompleted ? '✅ Задание выполнено' : status}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className={`font-bold text-xs px-2.5 py-1 rounded-lg whitespace-nowrap ${
          isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-[#e6f6f0] text-[#0d684b]'
        }`}>
          {reward}
        </span>
        <button
          onClick={onDelete}
          className="text-red-400 hover:text-red-600 text-xs p-1 cursor-pointer"
          title="Удалить задание"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

const FamilyMain = () => {
  const { user } = useAuth();
  const [childrenAccounts, setChildrenAccounts] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      fetchFamilyData();
    }
  }, [user]);

  // Загружаем реальных детей этого родителя и их общие задачи из Supabase
  const fetchFamilyData = async () => {
    try {
      // 1. Загружаем детей, у которых parent_id равен ID текущего родителя
      const { data: childrenData, error: childError } = await supabase
        .from('users')
        .select('*')
        .eq('parent_id', user.uid);

      if (childError) throw childError;

      if (childrenData && childrenData.length > 0) {
        setChildrenAccounts(
          childrenData.map((c) => ({
            id: c.id,
            name: c.name,
            details: c.role === 'child_next' ? 'Moby Next • Онлайн-покупки ВКЛ' : 'МТБанк Junior • Лимит 20 BYN/д.',
            balance: '0.00 BYN',
            role: c.role,
          }))
        );
      }

      // 2. Загружаем задания
      const { data: tasksData, error: taskError } = await supabase
        .from('tasks')
        .select('*')
        .order('id', { ascending: false });

      if (taskError) throw taskError;
      if (tasksData) setTasks(tasksData);
    } catch (err) {
      console.error('Ошибка загрузки данных семьи:', err);
    }
  };

  const handleAddTask = async (newTaskData) => {
    setLoading(true);
    try {
      // newTaskData уже содержит child_id и child_name из формы родителя
      const { data, error } = await supabase
        .from('tasks')
        .insert([newTaskData])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setTasks((prev) => [data[0], ...prev]);
      }
    } catch (err) {
      console.error('Ошибка сохранения задания в базу:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Выполнено' ? 'Ожидает проверки' : 'Выполнено';
    
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status: newStatus } : task))
    );

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Ошибка обновления статуса:', err);
      fetchFamilyData();
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      console.error('Ошибка удаления задания:', err);
    }
  };

  return (
    <main className="flex-1 flex flex-col gap-4 mt-4 overflow-y-auto pb-6">
      {/* Секция 1: Счета реальных детей и подростков */}
      <section>
        <h2 className="text-[#64748b] text-[11px] font-bold uppercase tracking-wider mb-2 px-0.5">
          СЧЕТА ДЕТЕЙ И ПОДРОСТКОВ
        </h2>
        <div className="flex flex-col gap-2.5">
          {childrenAccounts.length === 0 ? (
            <div className="bg-white border border-[#e2e8f0] p-4 rounded-2xl text-xs text-[#64748b] text-center">
              У вас пока нет привязанных детей. Вы можете добавить их при регистрации.
            </div>
          ) : (
            childrenAccounts.map((child) => (
              <ChildAccountCard
                key={child.id}
                name={child.name}
                details={child.details}
                balance={child.balance}
              />
            ))
          )}
        </div>
      </section>

      {/* Секция 2: Новое задание для конкретного ребёнка */}
      <section>
        <h2 className="text-[#64748b] text-[11px] font-bold uppercase tracking-wider mb-2 px-0.5 flex items-center gap-1.5">
          <span>🎯</span> НОВОЕ ЗАДАНИЕ ДЛЯ РЕБЁНКА
        </h2>
        <NewTaskForm
          childrenList={childrenAccounts}
          onAddTask={handleAddTask}
          loading={loading}
        />
      </section>

      {/* Секция 3: Активные задачи */}
      <section>
        <h2 className="text-[#64748b] text-[11px] font-bold uppercase tracking-wider mb-2 px-0.5">
          АКТИВНЫЕ ЗАДАЧИ
        </h2>
        <div className="flex flex-col gap-2.5">
          {tasks.length === 0 ? (
            <p className="text-xs text-[#64748b] bg-white border border-[#e2e8f0] p-4 rounded-2xl text-center">
              Пока нет созданных заданий
            </p>
          ) : (
            tasks.map((task) => (
              <ActiveTaskCard
                key={task.id}
                title={task.title}
                status={task.status}
                reward={task.reward}
                onToggleComplete={() => handleToggleComplete(task.id, task.status)}
                onDelete={() => handleDeleteTask(task.id)}
              />
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default FamilyMain;