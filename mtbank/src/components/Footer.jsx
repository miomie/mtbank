import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavItem = ({ label, icon, isActive, isLight, onClick }) => {
  const activeColor = isLight ? 'text-[#0044ff]' : 'text-[#00f5d4]';
  const inactiveColor = isLight
    ? 'text-[#64748b] hover:text-[#334155]'
    : 'text-[#6c7c93] hover:text-[#94a3b8]';

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 py-1 cursor-pointer transition-colors ${
        isActive ? activeColor : inactiveColor
      }`}
    >
      <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
      <span className="text-[11px] font-medium tracking-tight">{label}</span>
    </button>
  );
};

const Footer = ({ isLight = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: 'home',
      label: 'Главная',
      path: '/',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3L2 12h3v8h5v-6h4v6h5v-8h3L12 3z" />
        </svg>
      ),
    },
    {
      id: 'services',
      label: 'Сервисы',
      path: '/services',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        </svg>
      ),
    },
    {
      id: 'chat',
      label: 'Чат',
      path: '/chat',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h3v4l4-4h9c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
        </svg>
      ),
    },
    {
      id: 'family',
      label: 'Семья',
      path: '/family',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3L2 9l1.2 1.6L12 5.4l8.8 5.2L22 9 12 3zm-4.5 7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm9 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM12 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-4.5 3.5C5.57 15.5 4 16.57 4 18.5V20h5v-1.5c0-.68.23-1.3.61-1.81-.64-.12-1.35-.19-2.11-.19zm9 0c-.76 0-1.47.07-2.11.19.38.51.61 1.13.61 1.81V20h5v-1.5c0-1.93-1.57-3-3.5-3zm-4.5 1.5c-1.66 0-3 1.07-3 2.5V21h6v-1.5c0-1.43-1.34-2.5-3-2.5z" />
        </svg>
      ),
    },
    {
      id: 'more',
      label: 'Другое',
      path: '/more',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="6" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="18" cy="12" r="2" />
        </svg>
      ),
    },
  ];

  const handleNavigation = (path) => {
    if (path === '/' || path === '/family') {
      navigate(path);
    }
  };

  return (
    <footer
      className={`border-t px-2 py-2.5 rounded-b-[34px] transition-colors shrink-0 ${
        isLight
          ? 'bg-white border-[#e2e8f0]'
          : 'bg-[#0c1322] border-[#1c2638]'
      }`}
    >
      <nav className="grid grid-cols-5">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            label={item.label}
            icon={item.icon}
            isActive={location.pathname === item.path}
            isLight={isLight}
            onClick={() => handleNavigation(item.path)}
          />
        ))}
      </nav>
    </footer>
  );
};

export default Footer;