import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import useResponsive from "@/hooks/useResponsive";
import DashboardHeader from '../pages/companyAdmin/HR/DashboardHeader';
import Footer from '../pages/landing/Components/Footer';
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart2,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  User,
  UserCog,
  Building2,
  ShieldCheck,
  BarChart3,
  ListChecks,
  MessageSquare,
  HelpCircle
} from 'lucide-react';

const SUPER_ADMIN_ITEMS = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/super-admin/dashboard' },
  { label: 'Sub Admins', icon: <UserCog size={20} />, path: '/super-admin/sub-admins' },
  { label: 'Companies', icon: <Building2 size={20} />, path: '/super-admin/companies' },
  { label: 'Feedback', icon: <MessageSquare size={20} />, path: '/super-admin/feedback' },
  { label: 'Support', icon: <HelpCircle size={20} />, path: '/super-admin/support' },
  { label: 'Settings', icon: <Settings size={20} />, path: '/super-admin/settings' },
];

const SuperAdminSidebar = ({ isOpen, onClose, collapsed, setCollapsed }) => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8 p-2">
        {!collapsed && <h1 className="text-xl font-bold">Super Admin</h1>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-full hover:bg-indigo-700"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <nav className="space-y-2 flex-1 overflow-y-auto px-2">
        {SUPER_ADMIN_ITEMS.map((item, idx) => (
          <Link
            key={idx}
            to={item.path}
            className={`flex items-center p-3 rounded-lg transition-colors ${
              location.pathname === item.path 
                ? 'bg-indigo-700 text-white shadow-md' 
                : 'text-indigo-100 hover:bg-indigo-600'
            }`}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && <span className="ml-3">{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

const SuperAdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useResponsive();

  // Close sidebar on mobile when route changes
  const location = useLocation();
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location, isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - Fixed at top */}
      <header className="h-16 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-30">
        <DashboardHeader onSidebarToggle={toggleSidebar} />
      </header>
      
      <div className="flex flex-1 pt-16 relative">
        {/* Sidebar - Fixed below header */}
        <div 
          className={`fixed top-16 bottom-0 z-20 ${isSidebarOpen ? 'block' : 'hidden'} lg:block`}
          style={{
            width: isCollapsed ? '5rem' : '16rem',
            transition: 'width 0.3s ease',
            left: 0
          }}
        >
          <div className="h-full bg-indigo-800 text-white overflow-y-auto">
            <SuperAdminSidebar 
              isOpen={isSidebarOpen} 
              onClose={() => setIsSidebarOpen(false)}
              collapsed={isCollapsed}
              setCollapsed={setIsCollapsed}
            />
          </div>
        </div>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-10 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content - Takes remaining space */}
        <main 
          className={`flex-1 overflow-auto transition-all duration-300 bg-gray-50 z-10`}
          style={{
            marginLeft: isCollapsed ? '5rem' : '16rem',
            minHeight: 'calc(100vh - 4rem)',
            width: isCollapsed ? 'calc(100% - 5rem)' : 'calc(100% - 16rem)'
          }}
        >
          <div className="w-full h-full">
            <Outlet />
            <Footer className="border-t border-gray-200 mt-2 pt-2" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;