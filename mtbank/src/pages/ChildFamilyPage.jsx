import React, { useState } from 'react';
import ChildHeader from '../components/ChildHeader';
import ChildMain from '../components/ChildMain';
import Footer from '../components/Footer';

const ChildFamilyPage = ({ user }) => {
  const [balanceNum, setBalanceNum] = useState(45.00);

  const handleFeedPet = () => {
    setBalanceNum((prev) => prev + 2.00);
  };

  const formattedBalance = `${balanceNum.toFixed(2)} BYN`;
  const userName = user?.name || 'Артём';

  return (
    <div className="min-h-screen bg-[#dbe2ef] flex items-center justify-center p-4 font-sans select-none">
      <div className="w-full max-w-[380px] h-[800px] bg-[#f4f7fb] rounded-[46px] border-[10px] border-[#1b2434] shadow-2xl relative flex flex-col overflow-hidden">
        {/* Верхняя «чёлка» (Notch) */}
        <div className="w-32 h-5 bg-[#1b2434] rounded-b-2xl mx-auto shrink-0" />

        {/* Контент детского кабинета */}
        <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4 flex flex-col">
          <ChildHeader
            name={userName}
            balance={formattedBalance}
            cardLast4="4821"
          />
          <ChildMain
            balance={formattedBalance}
            onFeedPet={handleFeedPet}
          />
        </div>

        {/* Нижняя навигация (светлая тема) */}
        <Footer isLight={true} />
      </div>
    </div>
  );
};

export default ChildFamilyPage;