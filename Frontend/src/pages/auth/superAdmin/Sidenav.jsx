import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  MessageSquare,
  HelpCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
  UserCog,
  BarChart3,
  Bell,
  FileText,
  Activity
} from 'lucide-react';

const SideNavBar = ({ 
  userRole = 'superadmin',
  collapsed = false,
  onToggleCollapse = () => {},
  isMobileMenuOpen = false,
  onMobileMenuToggle = () => {}
}) => {
  const location = useLocation();

  const navItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      path: '/super-admin/dashboard',
      roles: ['superadmin']
    },
    {
      title: 'Sub Admins',
      icon: <UserCog size={20} />,
      path: '/super-admin/sub-admins',
      roles: ['superadmin']
    },
    {
      title: 'Companies',
      icon: <Building2 size={20} />,
      path: '/super-admin/companies',
      roles: ['superadmin']
    },
    {
      title: 'Analytics',
      icon: <BarChart3 size={20} />,
      path: '/super-admin/analytics',
      roles: ['superadmin']
    },
    {
      title: 'Feedback',
      icon: <MessageSquare size={20} />,
      path: '/super-admin/feedback',
      roles: ['superadmin']
    },
    {
      title: 'Support',
      icon: <HelpCircle size={20} />,
      path: '/super-admin/support',
      roles: ['superadmin']
    },
    {
      title: 'Activity Logs',
      icon: <Activity size={20} />,
      path: '/super-admin/activity-logs',
      roles: ['superadmin']
    },
    {
      title: 'Settings',
      icon: <Settings size={20} />,
      path: '/super-admin/settings',
      roles: ['superadmin']
    }
  ];

  // Use the passed in handlers for toggling collapse and mobile menu

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="h-full bg-indigo-800 text-white">
      {/* Logo and Collapse Button */}
      <div className="flex items-center justify-between p-4 border-b border-indigo-700">
        {!collapsed && <h1 className="text-xl font-bold">Super Admin</h1>}
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded-full hover:bg-indigo-700"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-4">

        {navItems
          .filter((item) => item.roles.includes(userRole))
          .map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md mx-2 ${
                isActive(item.path)
                  ? 'bg-indigo-700 text-white'
                  : 'text-indigo-100 hover:bg-indigo-600'
              }`}
              onClick={onMobileMenuToggle}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="ml-3">{item.title}</span>}
            </Link>
          ))}

      </nav>

      {/* User Profile and Logout */}
      <div className="p-4 border-t border-indigo-700">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
            <UserCog size={20} />
          </div>
          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Super Admin</p>
              <p className="text-xs text-indigo-300">Administrator</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => {
                // Handle logout
              }}
              className="ml-auto p-1 rounded-full text-indigo-300 hover:bg-indigo-700"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideNavBar;
