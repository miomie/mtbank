import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

const TeenFamilyPage = () => {
  const { user } = useAuth();
  useEffect(() => {
    if (user?.uid) {
      const isFakeId = user.uid.startsWith('fast-');
      
      const fetchData = async () => {
        if (isFakeId) return;

        try {
          const { data: piggyData, error: piggyError } = await supabase
            .from('piggy_banks')
            .select('*')
            .eq('child_id', user.uid)
            .single();

          if (piggyData) {
            setBalance(Number(piggyData.balance));
            setPiggyBalance(Number(piggyData.piggy_balance));
            setGoalTitle(piggyData.goal_title);
            setGoalTarget(Number(piggyData.goal_target));
            if (piggyData.piggy_grid && piggyData.piggy_grid.length > 0) {
              setPiggyGrid(piggyData.piggy_grid);
            }
          } else if (piggyError && piggyError.code === 'PGRST116') {
            await supabase.from('piggy_banks').insert([
              { child_id: user.uid, balance: 1180.50, piggy_balance: 0, goal_title: 'Новый смартфон', goal_target: 500, piggy_grid: createEmptyGrid() }
            ]);
          }

          const { data: tasksData, error: tasksError } = await supabase
            .from('tasks')
            .select('*')
            .eq('child_id', user.uid)
            .order('id', { ascending: false });

          if (tasksError) throw tasksError;
          setTasks(tasksData || []);
        } catch (err) {
          console.error('Ошибка загрузки данных из БД:', err);
        }
      };
      
      fetchData();
    }
  }, [user]);

  // Функция сохранения в БД
  const savePiggyState = async (newBalance, newPiggyBalance, newGrid, newTitle, newTarget) => {
    if (!user?.uid || user.uid.startsWith('fast-')) return;

    try {
      await supabase
        .from('piggy_banks')
        .upsert({
          child_id: user.uid,
          balance: newBalance,
          piggy_balance: newPiggyBalance,
          goal_title: newTitle,
          goal_target: newTarget,
          piggy_grid: newGrid,
          updated_at: new Date()
        }, { onConflict: 'child_id' });
    } catch (err) {
      console.error('Ошибка сохранения копилки в БД:', err);
    }
  };
  const [balance, setBalance] = useState(1180.50);
  // Изначально банка пустая
  const [piggyBalance, setPiggyBalance] = useState(0.00);
  
  const [goalTitle, setGoalTitle] = useState('Новый смартфон');
  const [goalTarget, setGoalTarget] = useState(500);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoalTitle, setTempGoalTitle] = useState('');
  const [tempGoalTarget, setTempGoalTarget] = useState('');

  const [piggyInput, setPiggyInput] = useState('');
  
  // Состояния для анимаций
  const [isLidOpen, setIsLidOpen] = useState(false);
  const [isGoalCompletedAnim, setIsGoalCompletedAnim] = useState(false);

  const [friendTag, setFriendTag] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferMsg, setTransferMsg] = useState('');
  
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (user?.uid) {
      const isFakeId = user.uid.startsWith('fast-');
      
      const fetchMyTasks = async () => {
        if (isFakeId) return;

        try {
          const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('child_id', user.uid)
            .order('id', { ascending: false });

          if (error) throw error;
          setTasks(data || []);
        } catch (err) {
          console.error('Ошибка загрузки заданий из БД:', err);
        }
      };
      
      fetchMyTasks();
    }
  }, [user]);

  const handleAddToPiggy = (e) => {
    e.preventDefault();
    const amount = parseFloat(piggyInput);
    if (!amount || amount <= 0) return;

    if (balance >= amount) {
      setBalance((prev) => prev - amount);
      const newTotal = piggyBalance + amount;
      setPiggyBalance(newTotal);

      // Анимация открытия крышки
      setIsLidOpen(true);
      setTimeout(() => setIsLidOpen(false), 900);

      if (newTotal >= goalTarget) {
        setIsGoalCompletedAnim(true);
      }

      setPiggyInput('');
    } else {
      alert('Недостаточно средств на карте!');
    }
  };

  const handleTransfer = (e) => {
    e.preventDefault();
    const amount = parseFloat(transferAmount);
    if (!friendTag.trim() || !amount || amount <= 0) return;

    if (balance >= amount) {
      setBalance((prev) => prev - amount);
      setTransferMsg(`Успешно отправлено ${amount.toFixed(2)} BYN для ${friendTag}`);
      setFriendTag('');
      setTransferAmount('');
      setTimeout(() => setTransferMsg(''), 4000);
    } else {
      alert('Недостаточно средств на карте!');
    }
  };

  const handleCompleteTask = async (taskId, rewardString) => {
    const rewardNum = parseFloat((rewardString || '').replace(/[^\d.-]/g, '')) || 0;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'Выполнено' } : t))
    );
    setBalance((prev) => prev + rewardNum);

    if (user && !user.uid.startsWith('fast-')) {
      try {
        await supabase.from('tasks').update({ status: 'Выполнено' }).eq('id', taskId);
      } catch (err) {
        console.error('Ошибка при обновлении статуса в БД:', err);
      }
    }
  };

  const handleSaveGoal = (e) => {
    e.preventDefault();
    if (tempGoalTitle.trim()) setGoalTitle(tempGoalTitle);
    if (parseFloat(tempGoalTarget) > 0) setGoalTarget(parseFloat(tempGoalTarget));
    
    // СБРОС НАКОПЛЕНИЙ ПРИ СМЕНЕ ЦЕЛИ
    setPiggyBalance(0.00); 
    setIsGoalCompletedAnim(false); 
    
    setIsEditingGoal(false);
  };

  const recentTransfers = [
    { id: 1, letter: 'М', tag: '@max_pro' },
    { id: 2, letter: 'Д', tag: '@dasha_k' },
    { id: 3, letter: 'В', tag: '@vlad_99' },
    { id: 4, letter: 'О', tag: '@olga_t' },
  ];

  const goalProgress = Math.min(100, Math.round((piggyBalance / goalTarget) * 100));
  
  // Высота заполнения колбы (максимум 90px внутри SVG)
  const fillHeight = Math.min(90, (goalProgress / 100) * 90);

  return (
    <div className="min-h-screen bg-[#dbe2ef] flex items-center justify-center p-4 font-sans select-none">
      <div className="w-full max-w-[380px] h-[800px] bg-[#f4f7fb] rounded-[46px] border-[10px] border-[#1b2434] shadow-2xl relative flex flex-col overflow-hidden">
        
        <div className="w-32 h-5 bg-[#1b2434] rounded-b-2xl mx-auto shrink-0" />

        <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4 flex flex-col gap-3.5 text-[#0f172a]">
          
          <div className="flex justify-between items-start pt-1 px-1 shrink-0">
            <div>
              <h1 className="text-xl font-black text-[#0f172a] flex items-center gap-1">
                {user?.name || 'Алиса'} <span className="text-orange-500">⚡</span>
              </h1>
              <p className="text-xs text-purple-600 font-bold">Moby Next</p>
            </div>
            <span className="bg-[#0f172a] text-[#00f5d4] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              PRO
            </span>
          </div>

          <div className="w-full h-[150px] bg-black text-white rounded-3xl p-4 shadow-xl relative flex flex-col justify-end shrink-0 overflow-hidden border border-gray-800">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-7xl font-black tracking-tighter bg-gradient-to-br from-[#1e40af] via-[#3b82f6] to-[#60a5fa] bg-clip-text text-transparent opacity-95">
                MT.
              </span>
            </div>
            <div className="flex justify-between items-end z-20">
              <div className="text-xs font-black text-gray-300">
                Баланс: {balance.toFixed(2)} BYN
              </div>
              <div className="flex -space-x-3.5 items-center">
                <div className="w-7 h-7 rounded-full bg-[#eb001b] opacity-90" />
                <div className="w-7 h-7 rounded-full bg-[#f79e1b] opacity-90 mix-blend-screen" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 shrink-0">
            <button className="bg-white border border-gray-100 shadow-sm hover:bg-gray-50 transition py-2.5 rounded-2xl text-xs font-bold text-[#0044ff] flex items-center justify-center gap-2 cursor-pointer">
              <span className="text-base">⇄</span> Перевести
            </button>
            <button className="bg-white border border-gray-100 shadow-sm hover:bg-gray-50 transition py-2.5 rounded-2xl text-xs font-bold text-[#0044ff] flex items-center justify-center gap-2 cursor-pointer">
              <span className="text-base">📄</span> Оплатить
            </button>
          </div>

          <div className="bg-white border border-purple-100 rounded-3xl p-4 shadow-sm flex flex-col items-center text-center shrink-0 relative">
            
            {/* Салют и сообщение при достижении цели */}
            {isGoalCompletedAnim && (
              <div className="absolute inset-0 bg-purple-900/95 backdrop-blur-md z-30 rounded-3xl flex flex-col items-center justify-center p-4 text-white animate-fade-in shadow-2xl">
                <span className="text-4xl mb-2 animate-bounce">🎆✨🎉</span>
                <h3 className="text-sm font-black text-[#00f5d4] uppercase tracking-wider mb-1">Цель достигнута!</h3>
                <p className="text-xs font-medium text-gray-200 mb-3 text-center">КРЫШКА СЛЕТЕЛА! Накопления завершены! Можно покупать «{goalTitle}»!</p>
                <button 
                  onClick={() => setIsGoalCompletedAnim(false)}
                  className="bg-[#00f5d4] text-[#0f172a] font-black text-xs px-4 py-2 rounded-xl shadow cursor-pointer active:scale-95"
                >
                  Круто! ✨
                </button>
              </div>
            )}

            <div className="w-full flex justify-between items-center mb-2 px-1">
              <div className="text-left">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Моя цель</span>
                <h3 className="text-xs font-extrabold text-[#0f172a]">{goalTitle}</h3>
              </div>
              <button 
                onClick={() => {
                  setIsEditingGoal(!isEditingGoal);
                  setTempGoalTitle(goalTitle);
                  setTempGoalTarget(goalTarget);
                }}
                className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-xl hover:bg-purple-100 transition cursor-pointer"
              >
                {isEditingGoal ? 'Отмена' : 'Изменить 🎯'}
              </button>
            </div>

            {isEditingGoal && (
              <form onSubmit={handleSaveGoal} className="w-full bg-purple-50/50 p-2.5 rounded-2xl mb-3 flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Название цели"
                  value={tempGoalTitle}
                  onChange={(e) => setTempGoalTitle(e.target.value)}
                  className="bg-white border border-purple-200 rounded-xl px-3 py-1.5 text-xs text-[#0f172a] focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Сумма цели (BYN)"
                  value={tempGoalTarget}
                  onChange={(e) => setTempGoalTarget(e.target.value)}
                  className="bg-white border border-purple-200 rounded-xl px-3 py-1.5 text-xs text-[#0f172a] focus:outline-none"
                />
                <button type="submit" className="bg-purple-600 text-white font-bold text-xs py-1.5 rounded-xl cursor-pointer">
                  Сохранить цель
                </button>
              </form>
            )}

            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mb-2">
              <div 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full transition-all duration-500" 
                style={{ width: `${goalProgress}%` }}
              />
            </div>
            <div className="w-full flex justify-between text-[10px] font-bold text-gray-400 mb-3">
              <span>Накоплено: {piggyBalance.toFixed(2)} BYN</span>
              <span>Цель: {goalTarget} BYN ({goalProgress}%)</span>
            </div>

            {/* БАНКА С ЭФФЕКТКОМ НАЛИВАНИЯ ЖИДКОСТИ */}
            <div className="relative w-36 h-44 flex items-center justify-center my-1">
              <svg className="w-full h-full drop-shadow-md relative z-10" viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                
                {/* Жидкость внутри банки с плавной анимацией высоты */}
                <g clipPath="url(#jarInnerClip)">
                  <rect 
                    x="18" 
                    y={130 - fillHeight} 
                    width="84" 
                    // Если накоплений нет, жидкость не рисуется вообще
                    height={fillHeight > 0 ? fillHeight + 10 : 0} 
                    fill="url(#liquidGradient)" 
                    className="transition-all duration-700 ease-out" 
                  />
                </g>

                {/* Контур банки */}
                <rect x="18" y="24" width="84" height="120" rx="22" stroke="#cbd5e1" strokeWidth="4" fill="none" />
                <path d="M 26 32 Q 23 80 26 136" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.8" />

                {/* Крышка с анимацией взлета */}
                <g className={`transition-all duration-500 transform ${isLidOpen || goalProgress >= 100 ? '-translate-y-8 -rotate-45 scale-110' : 'translate-y-0 rotate-0 scale-100'}`} style={{ transformOrigin: '60px 15px' }}>
                  <rect x="35" y="6" width="50" height="12" rx="4" fill="#9333ea" />
                  <rect x="30" y="15" width="60" height="6" rx="2" fill="#c084fc" />
                </g>

                <defs>
                  <clipPath id="jarInnerClip">
                    <rect x="20" y="26" width="80" height="116" rx="18" />
                  </clipPath>
                  <linearGradient id="liquidGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9333ea" />
                    <stop offset="100%" stopColor="#9333ea" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <form onSubmit={handleAddToPiggy} className="w-full flex gap-2 mt-3">
              <input
                type="number"
                placeholder="Сумма (BYN)"
                value={piggyInput}
                onChange={(e) => setPiggyInput(e.target.value)}
                className="w-28 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 active:scale-95 transition text-white font-extrabold text-xs py-2 rounded-xl shadow-md cursor-pointer"
              >
                Положить в банку
              </button>
            </form>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-3.5 shadow-sm shrink-0">
            <h3 className="text-xs font-black text-[#0f172a] mb-2.5 flex items-center gap-1.5">
              <span>📋</span> Задания от родителей
            </h3>

            <div className="flex flex-col gap-2">
              {tasks.length === 0 ? (
                <div className="text-center text-[11px] font-medium text-gray-400 py-3 border-2 border-dashed border-gray-100 rounded-xl">
                  Активных заданий пока нет.
                </div>
              ) : (
                tasks.map((task) => {
                  const isDone = task.status === 'Выполнено';
                  return (
                    <div key={task.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-2.5 flex items-center justify-between gap-2">
                      <div className="flex-1">
                        <p className={`text-xs font-bold leading-tight ${isDone ? 'text-gray-400 line-through' : 'text-[#0f172a]'}`}>
                          {task.title}
                        </p>
                        <span className={`text-[10px] font-extrabold mt-0.5 block ${isDone ? 'text-emerald-400' : 'text-emerald-600'}`}>
                          {task.reward} 
                        </span>
                      </div>
                      {isDone ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-xl">
                          Выполнено ✓
                        </span>
                      ) : (
                        <button
                          onClick={() => handleCompleteTask(task.id, task.reward)}
                          className="bg-[#0044ff] hover:bg-[#0033b3] text-white text-[10px] font-extrabold px-3 py-1.5 rounded-xl transition cursor-pointer shadow-sm active:scale-95"
                        >
                          Сделать
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-3.5 shadow-sm shrink-0">
            <h3 className="text-xs font-black text-[#0f172a] mb-2 flex items-center gap-1.5">
              <span>💸</span> Перевод друзьям
            </h3>

            {transferMsg && (
              <div className="bg-emerald-50 text-emerald-600 text-[10px] font-bold p-2 rounded-xl mb-2 text-center">
                {transferMsg}
              </div>
            )}

            <form onSubmit={handleTransfer} className="flex flex-col gap-2 mb-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="@ник_друга"
                  value={friendTag}
                  onChange={(e) => setFriendTag(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  placeholder="Сумма"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-24 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#0044ff] hover:bg-[#0033b3] active:scale-95 transition text-white font-bold text-xs py-2.5 rounded-xl shadow cursor-pointer"
              >
                Отправить перевод
              </button>
            </form>

            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-2">
              Быстрый выбор:
            </p>

            <div className="flex gap-2.5">
              {recentTransfers.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFriendTag(item.tag)}
                  className={`w-8 h-8 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-black text-xs cursor-pointer hover:scale-105 transition shadow-sm`}
                >
                  {item.letter}
                </button>
              ))}
            </div>
          </div>

        </div>

        <Footer isLight={true} />
      </div>
    </div>
  );
};

export default TeenFamilyPage;