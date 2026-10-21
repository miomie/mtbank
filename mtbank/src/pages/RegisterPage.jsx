import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

const MONTHS = [
  { value: '01', label: 'Январь' },
  { value: '02', label: 'Февраль' },
  { value: '03', label: 'Март' },
  { value: '04', label: 'Апрель' },
  { value: '05', label: 'Май' },
  { value: '06', label: 'Июнь' },
  { value: '07', label: 'Июль' },
  { value: '08', label: 'Август' },
  { value: '09', label: 'Сентябрь' },
  { value: '10', label: 'Октябрь' },
  { value: '11', label: 'Ноябрь' },
  { value: '12', label: 'Декабрь' },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 90 }, (_, i) => String(currentYear - i));
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

const calculateAge = (dateStr) => {
  if (!dateStr) return null;
  let year, month, day;

  if (dateStr.includes('-')) {
    [year, month, day] = dateStr.split('-').map(Number);
  } else if (dateStr.includes('.')) {
    const parts = dateStr.split('.');
    if (parts.length !== 3 || parts[2].length < 4) return null;
    [day, month, year] = parts.map(Number);
  } else {
    return null;
  }

  if (!year || !month || !day || year < 1920 || year > currentYear) return null;

  const today = new Date();
  const birthDate = new Date(year, month - 1, day);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const formatChildDateInput = (val) => {
  const digits = val.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4, 8)}`;
};

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [authMode, setAuthMode] = useState('register');

  const [bDay, setBDay] = useState('');
  const [bMonth, setBMonth] = useState('');
  const [bYear, setBYear] = useState('');

  const [hasChildren, setHasChildren] = useState(false);
  const [childrenList, setChildrenList] = useState([
    { name: '', birthDate: '', phone: '' },
  ]);

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const fullBirthDate = bYear && bMonth && bDay ? `${bYear}-${bMonth}-${bDay}` : '';
  const userAge = calculateAge(fullBirthDate);

  const isUnder7 = userAge !== null && userAge < 7;
  const isChildJunior = userAge !== null && userAge >= 7 && userAge <= 13;
  const isTeenNext = userAge !== null && userAge >= 14 && userAge <= 17;
  const isAdultParent = userAge !== null && userAge >= 18;

  const getSystemRole = (age) => {
    if (age >= 18) return 'parent';
    if (age >= 14) return 'child_next';
    return 'child_junior';
  };

  const handleAddChildRow = () => {
    setChildrenList((prev) => [...prev, { name: '', birthDate: '', phone: '' }]);
  };

  const handleRemoveChildRow = (index) => {
    setChildrenList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChildChange = (index, field, value) => {
    const formattedValue =
      field === 'birthDate' ? formatChildDateInput(value) : value;
    setChildrenList((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: formattedValue } : item
      )
    );
  };

  const handleChildLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!phone.trim()) {
      setErrorMsg('Введите ваш номер телефона');
      return;
    }

    setLoading(true);
    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone.trim())
        .maybeSingle();

      if (!existingUser) {
        setErrorMsg('Ребёнок с таким номером не найден. Попросите родителя зарегистрировать вас.');
        setLoading(false);
        return;
      }

      login({
        uid: existingUser.id,
        name: existingUser.name,
        phone: existingUser.phone,
        role: existingUser.role,
        parentId: existingUser.parent_id,
      });

      navigate('/');
    } catch (err) {
      console.error(err);
      setErrorMsg('Ошибка входа через базу данных.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (userAge === null) {
      setErrorMsg('Пожалуйста, выберите полную дату рождения');
      return;
    }

    if (isUnder7) {
      setErrorMsg('Сервис доступен только для детей от 7 лет.');
      return;
    }

    if (isChildJunior) {
      setErrorMsg('Самостоятельная регистрация для детей 7-13 лет недоступна. Используйте режим входа по телефону.');
      return;
    }

    setLoading(true);
    const finalRole = getSystemRole(userAge);

    try {
      const finalName = name.trim() || 'Пользователь';
      const finalPhone = phone.trim() || '+375290000000';

      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('phone', finalPhone)
        .maybeSingle();

      let userData = existingUser;

      if (!userData) {
        const { data: insertedData, error: insertError } = await supabase
          .from('users')
          .insert([{ name: finalName, phone: finalPhone, role: finalRole }])
          .select()
          .single();

        if (!insertError && insertedData) {
          userData = insertedData;
        }
      } else {
        const { data: updatedData } = await supabase
          .from('users')
          .update({ name: finalName, role: finalRole })
          .eq('phone', finalPhone)
          .select()
          .single();
        
        if (updatedData) userData = updatedData;
      }

      if (isAdultParent && hasChildren && userData) {
        const validChildren = childrenList.filter(
          (c) => c.name.trim() && c.birthDate && c.phone.trim()
        );

        for (const child of validChildren) {
          const cAge = calculateAge(child.birthDate);
          if (cAge !== null) {
            const cRole = cAge >= 14 ? 'child_next' : 'child_junior';
            await supabase.from('users').upsert([
              {
                name: child.name.trim(),
                phone: child.phone.trim(),
                role: cRole,
                parent_id: userData.id,
              }
            ], { onConflict: 'phone' });
          }
        }
      }

      login({
        uid: userData?.id || 'user-' + Date.now(),
        name: userData?.name || finalName,
        phone: userData?.phone || finalPhone,
        role: userData?.role || finalRole,
      });

      navigate('/');
    } catch (err) {
      console.warn('Оффлайн/тестовый вход:', err);
      login({
        uid: 'user-' + Date.now(),
        name: name.trim() || 'Пользователь',
        phone: phone.trim() || '+375290000000',
        role: finalRole,
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleFastLogin = (testRole, testName) => {
    login({
      uid: 'fast-' + testRole,
      name: testName,
      phone: '+375291111111',
      role: testRole,
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#152354] flex items-center justify-center p-4 font-sans select-none">
      <div className="w-full max-w-[380px] h-[800px] bg-[#0a101d] rounded-[46px] border-[10px] border-[#1b2434] shadow-2xl relative flex flex-col p-5 text-white overflow-y-auto">
        <div className="w-32 h-5 bg-[#1b2434] rounded-b-2xl mx-auto shrink-0 -mt-5 mb-3" />

        <div className="text-center mb-3 mt-2 shrink-0">
          <div className="w-12 h-12 bg-[#0044ff] rounded-2xl mx-auto flex items-center justify-center text-lg font-black mb-2 shadow-lg">
            Moby
          </div>
          <h1 className="text-base font-bold">Регистрация и вход</h1>
          <p className="text-[11px] text-[#8e9bb0] mt-0.5">Семейный банкинг Moby</p>
        </div>

        <div className="flex bg-[#182132] p-1 rounded-xl mb-3 shrink-0">
          <button
            type="button"
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition cursor-pointer ${
              authMode === 'register' ? 'bg-[#0044ff] text-white shadow' : 'text-[#8e9bb0]'
            }`}
          >
            Регистрация
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('child_login')}
            className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition cursor-pointer ${
              authMode === 'child_login' ? 'bg-[#0044ff] text-white shadow' : 'text-[#8e9bb0]'
            }`}
          >
            Вход для ребёнка (7-13)
          </button>
        </div>

        <div className="mb-3 bg-[#182132] p-2 rounded-xl border border-[#263248] shrink-0">
          <p className="text-[9px] text-[#8e9bb0] mb-1 font-medium text-center">⚡ Демо-вход:</p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleFastLogin('child_junior', 'кирилл')}
              className="bg-[#0044ff]/20 hover:bg-[#0044ff]/40 text-[#00f5d4] text-[10px] py-1 rounded-lg font-bold transition cursor-pointer"
            >
              Ребёнок
            </button>
            <button
              type="button"
              onClick={() => handleFastLogin('child_next', 'кира')}
              className="bg-[#0044ff]/20 hover:bg-[#0044ff]/40 text-[#00f5d4] text-[10px] py-1 rounded-lg font-bold transition cursor-pointer"
            >
              Подросток
            </button>
            <button
              type="button"
              onClick={() => handleFastLogin('parent', 'ольга')}
              className="bg-[#0044ff]/20 hover:bg-[#0044ff]/40 text-[#00f5d4] text-[10px] py-1 rounded-lg font-bold transition cursor-pointer"
            >
              Родитель
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-2.5 rounded-xl mb-3 text-center">
            {errorMsg}
          </div>
        )}

        {authMode === 'child_login' ? (
          <form onSubmit={handleChildLogin} className="flex flex-col gap-3 pb-4">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-amber-200 text-[11px] leading-relaxed">
              <p className="font-bold text-amber-400 mb-1">👶 Вход для участников Moby Junior</p>
              Если ваш родитель уже добавил вас при регистрации, введите ваш номер телефона для входа в приложение.
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#8e9bb0] mb-1">
                Ваш номер телефона:
              </label>
              <input
                type="tel"
                placeholder="+37529..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#182132] border border-[#263248] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#00f5d4]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0044ff] hover:bg-[#0033b3] text-white font-extrabold text-xs py-3.5 rounded-xl mt-2 active:scale-95 transition shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Вход...' : 'Войти в аккаунт'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="flex flex-col gap-3 pb-4">
            <div>
              <label className="block text-[11px] font-medium text-[#8e9bb0] mb-1">
                Ваше имя:
              </label>
              <input
                type="text"
                placeholder="Например: Артём или Виктория"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#182132] border border-[#263248] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00f5d4]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#8e9bb0] mb-1">
                Номер телефона:
              </label>
              <input
                type="tel"
                placeholder="+37529..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#182132] border border-[#263248] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00f5d4]"
              />
            </div>

            <div className="bg-[#182132]/90 border border-[#263248] rounded-2xl p-3 flex flex-col gap-2">
              <label className="block text-[11px] font-bold text-[#00f5d4]">
                📅 Дата вашего рождения:
              </label>

              <div className="grid grid-cols-12 gap-1.5">
                <div className="col-span-3 relative">
                  <select
                    value={bDay}
                    onChange={(e) => setBDay(e.target.value)}
                    className="w-full appearance-none bg-[#0a101d] border border-[#263248] rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-[#00f5d4] cursor-pointer"
                  >
                    <option value="">День</option>
                    {DAYS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-5 relative">
                  <select
                    value={bMonth}
                    onChange={(e) => setBMonth(e.target.value)}
                    className="w-full appearance-none bg-[#0a101d] border border-[#263248] rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-[#00f5d4] cursor-pointer"
                  >
                    <option value="">Месяц</option>
                    {MONTHS.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-4 relative">
                  <select
                    value={bYear}
                    onChange={(e) => setBYear(e.target.value)}
                    className="w-full appearance-none bg-[#0a101d] border border-[#263248] rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-[#00f5d4] cursor-pointer"
                  >
                    <option value="">Год</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {userAge !== null && (
                <div className="mt-1 pt-2 border-t border-[#263248]">
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span className="text-[#8e9bb0]">Ваш возраст:</span>
                    <span className="font-bold text-white bg-[#0a101d] px-2.5 py-0.5 rounded-lg border border-[#263248]">
                      {userAge} лет
                    </span>
                  </div>

                  {isUnder7 && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-2.5 text-red-200 text-[11px] leading-relaxed">
                      ⛔ Возрастное ограничение (0–6 лет). Сервис Moby Junior доступен только для детей с 7 лет!
                    </div>
                  )}

                  {isChildJunior && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-amber-200 text-[11px] leading-relaxed">
                      💡 Вам от 7 до 13 лет. Переключитесь на вкладку «Вход для ребёнка» сверху, чтобы войти по номеру телефона, который указал ваш родитель!
                    </div>
                  )}

                  {isTeenNext && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2.5 text-emerald-200 text-[11px] leading-relaxed">
                      ⚡ Категория: Moby Next (14–17 лет). Доступна самостоятельная регистрация!
                    </div>
                  )}

                  {isAdultParent && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-2.5 text-blue-200 text-[11px] leading-relaxed">
                      🛡️ Роль: Родитель (18+). Ниже вы можете добавить своих детей.
                    </div>
                  )}
                </div>
              )}
            </div>

            {isAdultParent && (
              <div className="bg-[#182132]/90 border border-[#263248] rounded-2xl p-3 flex flex-col gap-3">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasChildren}
                    onChange={(e) => setHasChildren(e.target.checked)}
                    className="w-4 h-4 accent-[#00f5d4] rounded cursor-pointer"
                  />
                  <span className="text-xs font-bold text-white">Есть ли у вас дети?</span>
                </label>

                {hasChildren && (
                  <div className="flex flex-col gap-2.5 pt-2 border-t border-[#263248]">
                    <p className="text-[10px] text-[#8e9bb0]">
                      Введите данные детей (Имя, Дата рождения ДД.ММ.ГГГГ, Телефон):
                    </p>

                    {childrenList.map((child, index) => {
                      const cAge = calculateAge(child.birthDate);
                      let categoryText = 'Укажите дату (ДД.ММ.ГГГГ)';
                      if (cAge !== null) {
                        if (cAge < 7) categoryText = `Младше 7 лет (${cAge} л.)`;
                        else if (cAge <= 13) categoryText = `Moby Junior (${cAge} л.)`;
                        else if (cAge <= 17) categoryText = `Moby Next (${cAge} л.)`;
                        else categoryText = `Взрослый (${cAge} л.)`;
                      }

                      return (
                        <div key={index} className="flex flex-col gap-1.5 bg-[#0a101d] p-2 rounded-xl border border-[#263248]">
                          <div className="grid grid-cols-3 gap-1.5 items-center">
                            <input
                              type="text"
                              placeholder="Имя"
                              value={child.name}
                              onChange={(e) => handleChildChange(index, 'name', e.target.value)}
                              className="w-full bg-[#182132] border border-[#263248] rounded-lg px-2 py-1.5 text-[10px] text-white placeholder-[#8e9bb0]/60 focus:outline-none focus:border-[#00f5d4]"
                            />
                            <input
                              type="text"
                              placeholder="ДД.ММ.ГГГГ"
                              value={child.birthDate}
                              onChange={(e) => handleChildChange(index, 'birthDate', e.target.value)}
                              className="w-full bg-[#182132] border border-[#263248] rounded-lg px-2 py-1.5 text-[10px] text-white placeholder-[#8e9bb0]/60 focus:outline-none focus:border-[#00f5d4] text-center"
                            />
                            <input
                              type="tel"
                              placeholder="+375..."
                              value={child.phone}
                              onChange={(e) => handleChildChange(index, 'phone', e.target.value)}
                              className="w-full bg-[#182132] border border-[#263248] rounded-lg px-2 py-1.5 text-[10px] text-white placeholder-[#8e9bb0]/60 focus:outline-none focus:border-[#00f5d4]"
                            />
                          </div>

                          <div className="flex justify-between items-center px-1">
                            <span className="text-[9px] text-[#00f5d4] font-semibold">{categoryText}</span>
                            {childrenList.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveChildRow(index)}
                                className="text-[9px] text-red-400 hover:text-red-300 cursor-pointer"
                              >
                                Удалить ✕
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={handleAddChildRow}
                      className="w-full py-2 bg-[#0044ff]/20 hover:bg-[#0044ff]/30 border border-dashed border-[#00f5d4]/50 rounded-xl text-[#00f5d4] font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <span className="text-base leading-none">+</span> Добавить ещё ребёнка
                    </button>
                  </div>
                )}
              </div>
            )}

            {(isTeenNext || isAdultParent) && (
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#0044ff] to-[#00f5d4] text-[#0a101d] font-extrabold text-xs py-3.5 rounded-xl mt-1 active:scale-95 transition shadow-md cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Сохранение...' : 'Зарегистрироваться и войти'}
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;