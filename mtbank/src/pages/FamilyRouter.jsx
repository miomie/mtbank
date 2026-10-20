import React from 'react';
import { useAuth } from '../context/AuthContext';
import FamilyPage from './FamilyPage';           // Убедитесь, что файл существует в src/pages/
import ChildFamilyPage from './ChildFamilyPage'; // Убедитесь, что файл существует в src/pages/
import TeenFamilyPage from './TeenFamilyPage';   // Убедитесь, что файл существует в src/pages/
import { Navigate } from 'react-router-dom';

const FamilyRouter = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/register" replace />;
  }

  switch (user.role) {
    case 'parent':
      return <FamilyPage user={user} />;
    case 'child_junior':
      return <ChildFamilyPage user={user} />;
    case 'child_next':
      return <TeenFamilyPage user={user} />;
    default:
      return <FamilyPage user={user} />;
  }
};

export default FamilyRouter;