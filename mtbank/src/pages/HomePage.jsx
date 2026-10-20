import React from 'react';
import Header from '../components/Header';
import Main from '../components/Main';
import Footer from '../components/Footer';

const HomePage = () => {
  const userData = {
    name: 'Виктория',
    mobyId: '4892',
  };

  return (
    <div className="min-h-screen bg-[#152354] flex items-center justify-center p-4 font-sans select-none">
      <div className="w-full max-w-[380px] h-[800px] bg-[#0a101d] rounded-[46px] border-[10px] border-[#1b2434] shadow-2xl relative flex flex-col overflow-hidden">
        {/* Верхняя «чёлка» */}
        <div className="w-32 h-5 bg-[#1b2434] rounded-b-2xl mx-auto shrink-0" />

        {/* Контент главной страницы */}
        <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4 flex flex-col">
          <Header user={userData} balance="1 000.00 BYN" />
          <Main />
        </div>

        {/* Нижняя панель (тёмная тема) */}
        <Footer isLight={false} />
      </div>
    </div>
  );
};

export default HomePage;