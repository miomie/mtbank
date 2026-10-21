import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';
import { LuNut } from "react-icons/lu";

// Список предсказаний от белочки
const PREDICTIONS = [
  "Сегодня отличный день для новых открытий!",
  "Твои накопления растут! Так держать!",
  "Орешек за орешком — и мечта станет твоей!",
  "Скоро ты сможешь купить то, что давно хотел!",
  "Ты отлично справляешься с финансами!",
  "Звёзды говорят, что сегодня тебе повезёт!",
  "Отличный выбор! Твоя копилка стала тяжелее."
];

const ChildFamilyPage = () => {
  const { user } = useAuth();
  
  // Баланс карты
  const [balance, setBalance] = useState(450.00);
  
  // ====== ЛОГИКА БЕЛКИ (МОБИ-ГОЧИ) ======
  const [goalName, setGoalName] = useState('Лего');
  const [goalPrice, setGoalPrice] = useState('50');
  const [squirrelSaved, setSquirrelSaved] = useState(0); // Деньги в белке
  const [isJumping, setIsJumping] = useState(false);
  const [prediction, setPrediction] = useState('');

  // Состояния для редактирования цели
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoalName, setTempGoalName] = useState('Лего');
  const [tempGoalPrice, setTempGoalPrice] = useState('50');

  // Задания из БД
  const [tasks, setTasks] = useState([]);

  // Подгрузка заданий
  useEffect(() => {
    if (user?.uid) {
      const fetchMyTasks = async () => {
        if (user.uid.startsWith('fast-')) return;
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

  // Сохранение новой цели со сбросом прогресса
  const handleSaveGoal = (e) => {
    e.preventDefault();
    if (tempGoalName.trim()) setGoalName(tempGoalName);
    if (parseFloat(tempGoalPrice) > 0) setGoalPrice(parseFloat(tempGoalPrice));
    
    // Сбрасываем накопления и закрываем режим редактирования
    setSquirrelSaved(0);
    setIsEditingGoal(false);
    
    // Приветственное сообщение для новой цели
    setPrediction('Новая цель! Начинаем копить' + <LuNut />);
    setIsJumping(true);
    setTimeout(() => {
      setIsJumping(false);
    }, 3000);
  };

  // Кормление белки (Копилка)
  const handleFeedPet = () => {
    if (balance >= 2) {
      // Списываем с карты, добавляем белке
      setBalance((prev) => prev - 2);
      setSquirrelSaved((prev) => prev + 2);
      
      // Анимация еды и случайное предсказание
      setIsJumping(true);
      setPrediction(PREDICTIONS[Math.floor(Math.random() * PREDICTIONS.length)]);
      
      // Возвращаем белку в исходное состояние через 3 секунды
      setTimeout(() => {
        setIsJumping(false);
      }, 3000);
    } else {
      alert('Недостаточно денег на балансе!');
    }
  };

  const handleCompleteTask = async (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Выполнено' } : t))
    );
    if (user && !user.uid.startsWith('fast-')) {
      try {
        await supabase.from('tasks').update({ status: 'Выполнено' }).eq('id', id);
      } catch (err) {
        console.error('Ошибка при обновлении статуса:', err);
      }
    }
  };

  // Вычисления для белки
  const nutsSaved = Math.floor(squirrelSaved / 2);
  const targetPrice = parseFloat(goalPrice) || 0;
  const isGoalReached = squirrelSaved >= targetPrice && targetPrice > 0;
  const squirrelProgress = targetPrice > 0 ? Math.min(100, (squirrelSaved / targetPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#dbe2ef] flex items-center justify-center p-4 font-sans select-none">
      <div className="w-full max-w-[380px] h-[800px] bg-[#f4f7fb] rounded-[46px] border-[10px] border-[#1b2434] shadow-2xl relative flex flex-col overflow-hidden">
        
        <div className="w-32 h-5 bg-[#1b2434] rounded-b-2xl mx-auto shrink-0" />

        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 flex flex-col gap-4 text-[#0f172a]">
          
          <div className="flex justify-between items-center bg-white p-3 rounded-2xl shadow-sm shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-black text-lg">
                {user?.name ? user.name[0].toUpperCase() : 'А'}
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold">Карта •••• 4821</p>
                <h2 className="text-sm font-black text-[#0f172a]">{balance.toFixed(2)} BYN</h2>
              </div>
            </div>
            <div className="bg-[#0044ff] text-white text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-sm">
              Junior
            </div>
          </div>

          {/* ИНТЕРАКТИВНАЯ БЕЛКА (МОБИ-ГОЧИ КОПИЛКА) */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-4 shadow-sm shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black uppercase text-amber-900 tracking-wider flex items-center gap-1.5">
                <span>🐿️</span> Моби-гочи
              </h3>
              <span className="text-[10px] font-black text-amber-700 bg-amber-200/60 px-2.5 py-1 rounded-lg">
                Собрано: {nutsSaved} 🌰
              </span>
            </div>

            <div className="bg-white rounded-2xl p-3 border border-amber-100 flex flex-col gap-2.5">
              
              {/* Блок мечты с режимом редактирования */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-gray-500 font-bold">Моя мечта</span>
                  <button 
                    onClick={() => {
                      setIsEditingGoal(!isEditingGoal);
                      setTempGoalName(goalName);
                      setTempGoalPrice(goalPrice);
                    }}
                    className="text-[10px] font-bold text-amber-600 hover:text-amber-700 transition"
                  >
                    {isEditingGoal ? 'Отмена' : 'Изменить 🎯'}
                  </button>
                </div>
                
                {isEditingGoal ? (
                  <form onSubmit={handleSaveGoal} className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={tempGoalName}
                      onChange={(e) => setTempGoalName(e.target.value)}
                      placeholder="Название мечты"
                      className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:border-amber-400"
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={tempGoalPrice}
                        onChange={(e) => setTempGoalPrice(e.target.value)}
                        placeholder="Цена (BYN)"
                        className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:border-amber-400"
                      />
                      <button type="submit" className="bg-amber-500 text-white font-bold text-xs px-3 rounded-lg active:scale-95 transition">
                        ✓
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-black text-[#0f172a] truncate">{goalName}</span>
                    <span className="text-xs font-black text-amber-600 whitespace-nowrap">{goalPrice} BYN</span>
                  </div>
                )}
              </div>

              {/* Арена белки */}
              <div className="flex flex-col items-center justify-between py-2.5 px-2 mt-1 bg-gradient-to-b from-amber-50 to-amber-100/50 rounded-xl min-h-[170px] relative border border-amber-100/50">
                
                {/* Облачко с советом СТРОГО СВЕРХУ */}
                <div className="min-h-[45px] w-full flex items-start justify-center z-20 px-1">
                  {isGoalReached ? (
                    <div className="w-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-black p-2 rounded-xl text-center shadow-sm animate-pulse">
                      Ура! Деньги на мечту имеются, можно ее приобрести! 🎉
                    </div>
                  ) : prediction && isJumping ? (
                    <div className="relative w-[92%] bg-white text-amber-800 text-[10px] font-bold px-3 py-2 rounded-2xl text-center shadow-md border border-amber-200">
                      💬 {prediction}
                      {/* Хвостик облачка снизу */}
                      <div className="absolute w-2.5 h-2.5 bg-white border-b border-r border-amber-200 transform rotate-45 left-1/2 -translate-x-1/2 -bottom-[5px]"></div>
                    </div>
                  ) : null}
                </div>

                {/* Белка и прыгающие орехи СНИЗУ ПОД ОБЛАЧКОМ */}
                <div className="flex items-end justify-center gap-3 h-[55px] w-full mb-2 z-10">
                  {isGoalReached && (
                    <span className="text-[26px] animate-bounce" style={{ animationDelay: '0s' }}>🌰</span>
                  )}
                  
                  <span className={`text-[42px] transition-all duration-300 transform origin-bottom ${
                    isGoalReached ? 'animate-bounce' : isJumping ? '-translate-y-3 scale-110' : 'translate-y-0 scale-100'
                  }`}>
                    {isJumping && !isGoalReached ? '🐿️🌰' : '🐿️'}
                  </span>

                  {isGoalReached && (
                    <span className="text-[26px] animate-bounce" style={{ animationDelay: '0.2s' }}>🌰</span>
                  )}
                </div>
                
                {/* Прогресс бар */}
                <div className="text-center w-full px-2 z-10">
                  <div className="flex justify-between text-[9px] font-black text-amber-900/60 mb-1">
                    <span>1 🌰 = 2 BYN</span>
                    <span>{squirrelSaved} / {targetPrice} BYN</span>
                  </div>
                  <div className="w-full bg-amber-200/50 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full transition-all duration-500" 
                      style={{ width: `${squirrelProgress}%` }} 
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleFeedPet}
                disabled={isGoalReached}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 active:scale-95 transition text-white font-black text-xs py-3 rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:grayscale mt-1"
              >
                {isGoalReached ? '✨ Мечта достигнута! ✨' : '🍎 Дать орешек (-2 BYN)'}
              </button>
            </div>
          </div>

          {/* ЗАДАНИЯ ИЗ БАЗЫ */}
          <div className="bg-white border border-gray-100 rounded-3xl p-4 shadow-sm shrink-0">
            <h3 className="text-xs font-black text-[#0f172a] mb-3 flex items-center gap-1.5">
              <span>📋</span> Задания от родителей
            </h3>
            <div className="flex flex-col gap-2.5">
              {tasks.length === 0 ? (
                <div className="text-center text-[11px] font-medium text-gray-400 py-4 border-2 border-dashed border-gray-100 rounded-xl">
                  Активных заданий пока нет.
                </div>
              ) : (
                tasks.map((task) => {
                  const isDone = task.status === 'Выполнено';
                  return (
                    <div key={task.id} className={`border rounded-2xl p-3 flex items-center justify-between shadow-sm transition ${isDone ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-gray-100'}`}>
                      <div className="pr-2">
                        <h4 className={`text-xs font-bold leading-tight ${isDone ? 'text-gray-400 line-through' : 'text-[#0f172a]'}`}>
                          {task.title}
                        </h4>
                        <p className={`text-[10px] font-black mt-1 ${isDone ? 'text-emerald-400' : 'text-emerald-600'}`}>
                          {task.reward}
                        </p>
                      </div>
                      
                      {isDone ? (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-xl shrink-0">
                          Выполнено ✓
                        </span>
                      ) : (
                        <button
                          onClick={() => handleCompleteTask(task.id)}
                          className="bg-[#0044ff] hover:bg-[#0033b3] text-white text-[10px] font-bold px-4 py-2 rounded-xl cursor-pointer active:scale-95 transition shadow-sm shrink-0"
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

        </div>
        <Footer isLight={true} />
      </div>
    </div>
  );
};

export default ChildFamilyPage;