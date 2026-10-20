import React from 'react';
import FamilyHeader from '../components/FamilyHeader';
import FamilyMain from '../components/FamilyMain';
import Footer from '../components/Footer';

const FamilyPage = () => {
  return (
    <div className="min-h-screen bg-[#dbe2ef] flex items-center justify-center p-4 font-sans select-none">
      <div className="w-full max-w-[380px] h-[800px] bg-[#f4f7fb] rounded-[46px] border-[10px] border-[#1b2434] shadow-2xl relative flex flex-col overflow-hidden">
        {/* Верхняя «чёлка» */}
        <div className="w-32 h-5 bg-[#1b2434] rounded-b-2xl mx-auto shrink-0" />

        {/* Контент страницы «Семья» */}
        <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4 flex flex-col">
          <FamilyHeader />
          <FamilyMain />
        </div>

        {/* Нижняя панель (светлая тема) */}
        <Footer isLight={true} />
      </div>
    </div>
  );
};

export default FamilyPage;