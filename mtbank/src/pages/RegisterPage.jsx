import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from "../firebase.js"; // или "../firebase"
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';

const RegisterPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(false); // Вход или Регистрация
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('child_junior');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isLoginMode) {
        // --- ВХОД ЧЕРЕЗ FIREBASE ---
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        login({
          uid: user.uid,
          email: user.email,
          name: name || user.email.split('@')[0],
          role: role, // Роль сохраняем в контекст
        });

      } else {
        // --- РЕГИСТРАЦИЯ ЧЕРЕЗ FIREBASE ---
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        login({
          uid: user.uid,
          email: user.email,
          name: name,
          role: role,
        });
      }

      // Успешно войдено -> переходим на главную
      navigate('/');
    } catch (err) {
      console.error(err);
      // Отображение понятных ошибок
      if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('Этот Email уже зарегистрирован.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setErrorMsg('Неверный email или пароль.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('Пароль должен быть не менее 6 символов.');
      } else {
        setErrorMsg('Ошибка авторизации: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#152354] flex items-center justify-center p-4 font-sans select-none">
      <div className="w-full max-w-[380px] h-[800px] bg-[#0a101d] rounded-[46px] border-[10px] border-[#1b2434] shadow-2xl relative flex flex-col justify-center px-6 text-white overflow-y-auto">
        {/* Notch */}
        <div className="w-32 h-5 bg-[#1b2434] rounded-b-2xl mx-auto absolute top-0 left-1/2 -translate-x-1/2" />

        <div className="text-center mb-5 mt-6">
          <div className="w-14 h-14 bg-[#0044ff] rounded-2xl mx-auto flex items-center justify-center text-xl font-black mb-2 shadow-lg">
            Moby
          </div>
          <h1 className="text-lg font-bold">
            {isLoginMode ? 'Вход в Moby' : 'Регистрация в Moby'}
          </h1>
          <p className="text-xs text-[#8e9bb0] mt-0.5">
            {isLoginMode ? 'Введите данные вашего аккаунта' : 'Выберите роль и создайте аккаунт'}
          </p>
        </div>

        {/* Сообщение об ошибке */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-2.5 rounded-xl mb-4 text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {!isLoginMode && (
            <div>
              <label className="block text-xs font-medium text-[#8e9bb0] mb-1">
                Имя:
              </label>
              <input
                type="text"
                required
                placeholder="Например: Артём"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#182132] border border-[#263248] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#00f5d4]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#8e9bb0] mb-1">
              Email:
            </label>
            <input
              type="email"
              required
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#182132] border border-[#263248] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#00f5d4]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#8e9bb0] mb-1">
              Пароль:
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#182132] border border-[#263248] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#00f5d4]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#8e9bb0] mb-1">
              Кто вы в системе?
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[#182132] border border-[#263248] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#00f5d4] cursor-pointer"
            >
              <option value="child_junior">Ребёнок (7–13 лет) — Moby Junior</option>
              <option value="child_next">Подросток (14–17 лет) — Moby Next</option>
              <option value="parent">Родитель — Семейный контроль</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#0044ff] to-[#00f5d4] text-[#0a101d] font-extrabold text-xs py-3 rounded-xl mt-2 active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Загрузка...' : isLoginMode ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        {/* Переключатель Вход / Регистрация */}
        <div className="text-center mt-4 mb-2">
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setErrorMsg('');
            }}
            className="text-xs text-[#00f5d4] hover:underline cursor-pointer"
          >
            {isLoginMode ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;