import React from 'react';
import Main from '../components/Main';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#dbe2ef] flex items-center justify-center p-4 font-sans select-none">
      {/* Убрали bg-[#f4f7fb] с внешнего контейнера */}
      <div className="w-full max-w-[380px] h-[800px] rounded-[46px] border-[10px] border-[#1b2434] shadow-2xl relative flex flex-col overflow-hidden bg-transparent">
        
        {/* Чёлка поверх градиента */}
        <div className="w-32 h-5 bg-[#1b2434] rounded-b-2xl mx-auto shrink-0 z-30 absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none" />

        {/* Главный экран: убрали px-4, mt-2, mb-4. Теперь Main занимает 100% пространства и заливает фон! */}
        <div className="flex-1 w-full h-full overflow-hidden flex flex-col pt-5">
          <Main />
        </div>

        {/* Светлый футер внизу */}
        <Footer isLight={true} />
        
      </div>
    </div>
  );
};

export default HomePage;