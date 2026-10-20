import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth, db } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+375');
  const [role, setRole] = useState('child_junior');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' или 'otp'
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Инициализация невидимой reCAPTCHA
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {},
      });
    }
  };

  // Шаг 1: Запрос отправки СМС-кода
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (!phone.trim() || !name.trim()) {
      setErrorMsg('Введите имя и номер телефона.');
      setLoading(false);
      return;
    }

    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;

      // Отправка СМС через Firebase Auth
      const confirmation = await signInWithPhoneNumber(auth, phone.trim(), appVerifier);
      setConfirmationResult(confirmation);
      setStep('otp'); // Переключаем экран на ввод СМС-кода
    } catch (err) {
      console.error('Ошибка отправки СМС:', err);
      setErrorMsg('Ошибка отправки СМС: ' + err.message);
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  // Шаг 2: Проверка кода из СМС и сохранение в базу
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (!otp.trim()) {
        setErrorMsg('Введите код из СМС.');
        setLoading(false);
        return;
      }

      if (!confirmationResult) {
        setErrorMsg('Ошибка сессии. Пожалуйста, запросите код повторно.');
        setStep('phone');
        setLoading(false);
        return;
      }

      // Подтверждение кода
      const result = await confirmationResult.confirm(otp.trim());
      const user = result.user;
      const userId = user.uid;

      // Сохраняем профиль в Firestore
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      let userData = {
        uid: userId,
        name: name.trim(),
        phone: phone.trim(),
        role: role,
      };

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          ...userData,
          createdAt: new Date().toISOString()
        });
      } else {
        userData = userSnap.data();
      }

      login(userData);
      navigate('/');
    } catch (err) {
      console.error('Ошибка верификации OTP:', err);
      if (err.code === 'auth/invalid-verification-code') {
        setErrorMsg('Неверный код подтверждения. Проверьте цифры.');
      } else if (err.code === 'auth/code-expired') {
        setErrorMsg('Срок действия кода истёк. Запросите новый.');
      } else {
        setErrorMsg('Ошибка: ' + err.message);
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

        <div className="text-center mb-5 mt-8">
          <div className="w-14 h-14 bg-[#0044ff] rounded-2xl mx-auto flex items-center justify-center text-xl font-black mb-2 shadow-lg">
            Moby
          </div>
          <h1 className="text-base font-bold">
            {step === 'phone' ? 'Вход по номеру' : 'Подтверждение СМС'}
          </h1>
          <p className="text-[11px] text-[#8e9bb0] mt-0.5">
            {step === 'phone' ? 'Введите данные для получения СМС' : `Код отправлен на ${phone}`}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-2.5 rounded-xl mb-4 text-center">
            {errorMsg}
          </div>
        )}

        {/* Контейнер reCAPTCHA */}
        <div id="recaptcha-container"></div>

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-3">
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

            <div>
              <label className="block text-xs font-medium text-[#8e9bb0] mb-1">
                Номер телефона:
              </label>
              <input
                type="tel"
                required
                placeholder="+375291234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#182132] border border-[#263248] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#00f5d4]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#8e9bb0] mb-1">
                Роль в системе:
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
              className="w-full bg-gradient-to-r from-[#0044ff] to-[#00f5d4] text-[#0a101d] font-extrabold text-xs py-3.5 rounded-xl mt-3 active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Отправка СМС...' : 'Получить код в СМС'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-medium text-[#8e9bb0] mb-1">
                Код из СМС:
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-[#182132] border border-[#263248] rounded-xl px-3 py-3 text-center text-lg tracking-widest text-white focus:outline-none focus:border-[#00f5d4]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#0044ff] to-[#00f5d4] text-[#0a101d] font-extrabold text-xs py-3.5 rounded-xl mt-3 active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Проверка...' : 'Подтвердить и войти'}
            </button>

            <button
              type="button"
              onClick={() => setStep('phone')}
              className="text-xs text-[#8e9bb0] hover:text-white text-center mt-2 cursor-pointer"
            >
              Изменить номер телефона
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;