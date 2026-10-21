import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { GoogleGenAI } from '@google/genai';
import Footer from '../components/Footer'; // Импортируем футер, чтобы он был внизу

// Инициализация Gemini (ВНИМАНИЕ: В продакшене ключи нельзя хранить в клиенте!)
const ai = new GoogleGenAI({ apiKey: 'AQ.Ab8RN6J758GH0EFGyk5BdsFj0jQIbY6Y8njYZzQgEx-pWyWq4w' });

const ChatPage = () => {
  const { user } = useAuth();
  const role = user?.role || 'child_next';

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Привет! Я банковская белка 🐿️ Твой умный ИИ-помощник. Спроси меня о чём угодно!' }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      let persona = "Ты — дружелюбная и умная белка-талисман мобильного банкинга МТБанк. Отвечай коротко, с полезными советами и финансовыми метафорами про орешки и дупло.";
      if (role === 'child_junior') {
        persona += " Пользователь — ребёнок 7-13 лет (Moby Junior). Отвечай очень просто, с большим количеством эмодзи, хвали за интерес к деньгам.";
      } else if (role === 'child_next') {
        persona += " Пользователь — подросток 14-17 лет (Moby Next). Общайся на «ты», современным языком, помогай разобраться с копилками и накоплениями.";
      } else {
        persona += " Пользователь — взрослый родитель. Отвечай вежливо, профессионально, помогай с вопросами семейного бюджета.";
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash-lite',
        contents: [
          { role: 'user', parts: [{ text: `${persona}\n\nВопрос пользователя: ${userMessage}` }] }
        ],
      });

      const botReply = response.text || 'Ой, орех застрял в зубах! Повтори вопрос? 🌰';
      setMessages(prev => [...prev, { role: 'model', text: botReply }]);
    } catch (error) {
      console.error('Ошибка ИИ:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Хм, связь с деревом 🌳 временно прервалась. Но я всё равно считаю, что ты отлично справляешься с финансами! 🌰' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Внешний фон (как на экране с копилкой)
    <div className="min-h-screen bg-[#dbe2ef] flex items-center justify-center p-4 font-sans select-none">
      
      {/* Корпус телефона */}
      <div className="w-full max-w-[380px] h-[800px] bg-[#f4f7fb] rounded-[46px] border-[10px] border-[#1b2434] shadow-2xl relative flex flex-col overflow-hidden">
        
        {/* Верхний вырез (Динамик) */}
        <div className="w-32 h-5 bg-[#1b2434] rounded-b-2xl mx-auto shrink-0 z-50" />

        {/* Шапка чата */}
        <div className="flex items-center gap-3 px-5 pt-3 pb-3 shrink-0 bg-white/60 backdrop-blur-md border-b border-purple-100 shadow-sm z-40">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl shadow-sm border border-orange-200 relative">
            🐿️
            {/* Зеленая точка онлайна */}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h1 className="text-sm font-black text-[#0f172a] flex items-center gap-1 leading-tight">
              Белка-помощник <span className="text-amber-500 text-xs">⚡</span>
            </h1>
            <p className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-wider">Онлайн (ИИ)</p>
          </div>
        </div>

        {/* Область сообщений */}
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 bg-gradient-to-b from-[#f3e8ff] via-[#fce7f3] to-[#dbeafe]">
          
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex items-end gap-2 max-w-[85%] ${isUser ? 'self-end flex-row-reverse' : 'self-start'}`}
              >
                {/* Аватарка (показываем только для ИИ, у пользователя можно скрыть) */}
                {!isUser && (
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex-shrink-0 flex items-center justify-center text-xs border border-orange-200 mb-1">
                    🐿️
                  </div>
                )}

                <div
                  className={`p-3 rounded-2xl text-[12px] font-medium leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-purple-600 text-white rounded-br-sm'
                      : 'bg-white/90 backdrop-blur-md text-[#0f172a] rounded-bl-sm border border-purple-100'
                  }`}
                >
                  {msg.text}
                  
                  {/* Галочки прочтения / Время для сообщений пользователя */}
                  {isUser && (
                    <div className="flex justify-end items-center gap-1 mt-1 opacity-70">
                      <span className="text-[9px]">17:35</span>
                      <span className="text-[10px]">✓✓</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Индикатор набора текста */}
          {loading && (
            <div className="flex items-end gap-2 self-start max-w-[85%]">
               <div className="w-6 h-6 rounded-full bg-orange-100 flex-shrink-0 flex items-center justify-center text-xs border border-orange-200 mb-1">
                  🐿️
                </div>
              <div className="bg-white/90 backdrop-blur-md text-gray-500 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-purple-100 flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Поле ввода */}
        <div className="p-3 bg-white/80 backdrop-blur-md border-t border-purple-100 shrink-0">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              placeholder="Спроси белку о деньгах..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-3 text-xs text-[#0f172a] focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 shadow-inner"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 active:scale-95 transition text-white w-11 h-11 rounded-full flex items-center justify-center shadow-md cursor-pointer disabled:opacity-50 flex-shrink-0"
            >
              {/* Иконка отправки (бумажный самолетик) */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-1">
                <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
              </svg>
            </button>
          </form>
        </div>

        {/* Подключаем ваш Footer, чтобы нижняя навигация оставалась на месте */}
        <Footer isLight={true} />
        
      </div>
    </div>
  );
};

export default ChatPage;