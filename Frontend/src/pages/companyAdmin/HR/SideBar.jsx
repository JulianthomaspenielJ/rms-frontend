import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Users,
  LayoutDashboard,
  FileText,
  ChevronLeft,
  ChevronRight,
  Bell,
  User,
  Settings
} from 'lucide-react';

const SideBar = ({ isOpen = true, onClose }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const mainNavItems = [
    { id: 1, path: '/hr/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 2, path: '/hr/manage-hr', label: 'Manage HR', icon: <Users size={20} /> },
    // { id: 3, path: '/hr/managejd', label: 'Manage JD', icon: <FileText size={20} /> },
    { id: 5, path: '/hr/profile', label: 'Profile', icon: <User size={20} /> },
  ];

  // Improved link class with more padding, always readable, with hover/active/focus style and gap
  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `
      flex items-center gap-4 px-5 py-3 rounded-lg w-full
      text-base font-medium transition-all duration-150
      ${isActive
        ? 'bg-indigo-600 text-white shadow font-semibold'
        : 'text-gray-100 hover:bg-indigo-500/30 hover:text-white'}
      focus:outline focus:outline-2 focus:outline-indigo-300
      whitespace-nowrap overflow-visible
    `;
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) onClose?.();
  };

  const sidebarClasses = `
    fixed lg:relative top-0 left-0 z-40 h-screen select-none
    bg-gradient-to-b from-indigo-700 via-indigo-800 to-indigo-900 text-white
    shadow-xl border-r border-indigo-950/25
    transition-all duration-300 ease-in-out
    flex flex-col
    ${collapsed ? 'w-20' : 'w-64'}
    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  `;

  const overlayClasses = `
    fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 lg:hidden
    ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
  `;

  return (
    <>
      {isOpen && <div className={overlayClasses} onClick={onClose} aria-label="Close sidebar" />}
      <aside className={sidebarClasses}>
        <div className="flex items-center justify-between h-16 pl-5 pr-2 border-b border-indigo-400/20">
          <div className="flex items-center">
            <Briefcase size={28} className="text-indigo-200" />
            {!collapsed && (
              <span className="ml-3 text-xl font-extrabold tracking-wide text-white">Company Portal</span>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 ml-2 text-indigo-200 hover:bg-indigo-700/30 rounded-lg transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        {/* Main Nav */}
        <nav className="flex-1 py-6 overflow-y-auto space-y-1 custom-scrollbar">
          <div className="flex flex-col gap-1">
            {mainNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                title={item.label}
                className={`${getLinkClass(item.path)} group`}
                aria-current={location.pathname === item.path ? "page" : undefined}
              >
                <span className="shrink-0 text-white">
                  {item.icon}
                </span>
                <span className={`${collapsed ? 'hidden' : 'block'} ml-2`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </nav>
        {/* Bottom Settings Button */}
        <div className="p-4 border-t border-indigo-400/20">
          <button
            className="flex items-center w-full gap-4 p-3 rounded-lg text-indigo-100 hover:bg-indigo-600/40 hover:text-white transition-colors group"
            onClick={() => handleNavigation('/settings')}
            title={collapsed ? "Settings" : undefined}
          >
            <Settings size={20} className="group-hover:scale-110 transition-transform" />
            {!collapsed && <span className="truncate font-medium">Settings</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
