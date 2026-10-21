import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { GoogleGenAI } from '@google/genai';

// Прямая инициализация с твоим ключом
const _k = 'AQ.Ab8RN6J758GH0EFGyk5BdsFj0jQIbY6Y8njYZzQgEx-pWyWq4w';
const ai = new GoogleGenAI({ apiKey: _k });

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
        model: 'gemini-3.8-flash',
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
    <div className="px-5 flex flex-col h-full text-[#0f172a] animate-fade-in bg-gradient-to-b from-[#f3e8ff] via-[#fce7f3] to-[#dbeafe] overflow-hidden">
      {/* Шапка чата */}
      <div className="flex items-center gap-3 pt-1 pb-3 shrink-0">
        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-lg shadow-sm border border-orange-200">
          🐿️
        </div>
        <div>
          <h1 className="text-base font-black text-[#0f172a] flex items-center gap-1 leading-tight">
            Белка-помощник <span className="text-amber-500 text-sm">⚡</span>
          </h1>
          <p className="text-[11px] text-emerald-600 font-extrabold">● Онлайн (ИИ)</p>
        </div>
      </div>

      {/* История сообщений */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-1 pb-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[85%] p-3.5 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
              msg.role === 'user'
                ? 'bg-purple-600 text-white self-end rounded-br-xs'
                : 'bg-white/90 backdrop-blur-md text-[#0f172a] self-start rounded-bl-xs border border-purple-100'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="bg-white/90 backdrop-blur-md text-gray-400 self-start p-3.5 rounded-2xl text-xs rounded-bl-xs shadow-sm border border-purple-100 animate-pulse">
            Белка обдумывает ответ... 🌰
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода */}
      <form onSubmit={handleSend} className="pt-2 pb-2 shrink-0 flex gap-2">
        <input
          type="text"
          placeholder="Спроси белку о деньгах..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-white/80 backdrop-blur-md border border-purple-200 rounded-2xl px-4 py-3 text-xs text-[#0f172a] focus:outline-none focus:border-purple-500 shadow-2xs"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 active:scale-95 transition text-white px-4 py-3 rounded-2xl text-xs font-bold shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center"
        >
          ➤
        </button>
      </form>
    </div>
  );
};

export default ChatPage;