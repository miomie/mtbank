import React from 'react';
import { useAuth } from '../context/AuthContext';
import ParentMain from './ParentMain';
import ChildMain from './ChildMain';
import ChildNextMain from './ChildNextMain';

const Main = () => {
  const { user } = useAuth();
  const role = user?.role || 'child_next';

  const bgGradients = {
    parent: 'from-[#dbeafe] via-[#eff6ff] to-[#dbeafe]',
    child_junior: 'from-[#d1fae5] via-[#ecfdf5] to-[#c7d2fe]',
    child_next: 'from-[#f3e8ff] via-[#fce7f3] to-[#dbeafe]',
  };

  return (
    <div className={`w-full h-full bg-gradient-to-b ${bgGradients[role] || bgGradients.child_next} flex flex-col overflow-y-auto m-0 p-0 border-0`}>
      {role === 'parent' && <ParentMain />}
      {role === 'child_junior' && <ChildMain />}
      {role === 'child_next' && <ChildNextMain />}
    </div>
  );
};

export default Main;