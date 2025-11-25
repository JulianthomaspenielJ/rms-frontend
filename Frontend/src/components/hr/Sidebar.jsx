import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FileCheck,
  Briefcase,
  UserPlus,
  Users,
  ClipboardList,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/hrdashboard' },
  { label: 'Manage JD', icon: <Briefcase size={20} />, path: '/managejd' },
  { label: 'Upload Resume', icon: <Users size={20} />, path: '/uploadresume' },
  { label: 'Interview Score', icon: <ClipboardList size={20} />, path: '/interviewscore' },
  { label: 'JD Status', icon: <ClipboardList size={20} />, path: '/jdliststatus' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`transition-all duration-300 bg-[#4f46e5] text-white p-4 ${collapsed ? 'w-20' : 'w-64'} space-y-6 relative`}>
      <button
        className="absolute top-4 right-[-12px] bg-white text-[#4f46e5] rounded-full shadow-md p-1"
        onClick={() => setCollapsed(c => !c)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
      
      <h2 className={`text-2xl font-bold mb-6 ${collapsed ? 'hidden' : 'block'}`}>
        <Link to="/hrdashboard">RMS Panel</Link>
      </h2>
      
      <nav className="space-y-4">
        {SIDEBAR_ITEMS.map((item, idx) => (
          <Link
            key={idx}
            to={item.path}
            className={`flex items-center p-3 rounded-lg transition-colors hover:bg-indigo-600 ${
              window.location.pathname === item.path ? 'bg-indigo-700' : ''
            }`}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && <span className="ml-3">{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
