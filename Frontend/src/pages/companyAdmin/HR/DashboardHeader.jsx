import React, { useState } from 'react';
import { Search, Settings, Menu, LogOut, Bell } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../../../components/Logo';

const breadcrumbNameMap = {
  'hr-dashboard': 'Dashboard',
  'profile': 'Profile',
  'manage-hr': 'Manage HR',
  'manage-jd': 'Manage JD',
  'settings': 'Settings',
  'analytics': 'Analytics',
  'jd-vs-months': 'JD vs Months',
  'applied-jd-vs-jd': 'Applied vs JD',
  'hr-vs-jd': 'HR vs JD',
  'view-hr': 'View HR',
  'notifications': 'Notifications',
};

const DashboardHeader = ({ onSidebarToggle }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the current URL indicates company admin section
  const isCompanyAdmin = location.pathname.includes('/company');

  const pathnames = location.pathname.split('/').filter((x) => x);

  const handleLogout = () => {
    // Add your logout logic here
    // Example: clear user session and redirect to login
    // localStorage.removeItem('token');
    localStorage.removeItem("userEmail"); // remove stored email
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 w-full px-4 sm:px-6 h-16 flex items-center fixed top-0 right-0 z-10">
      <div className="flex items-center justify-between w-full h-full">
        {/* Logo and Sidebar Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onSidebarToggle}
            className="p-1 text-gray-600 hover:text-gray-900 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center">
            <Logo
              className="h-10 w-auto"
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Search Bar */}
        {/* <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700 placeholder-gray-500 text-sm"
            />
          </div>
        </div> */}

        {/* Right Side Icons */}
        <div className="flex items-center gap-4">
          {/* Notification Icon - Hide for company admin section */}
          {/* {!isCompanyAdmin && (
            <button
              onClick={() => navigate('/notifications')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          )} */}
          {/* Settings Icon */}
          {/* <button
            onClick={() => {
              // Check if we're in the candidate section
              // const isCandidate = location.pathname.startsWith('/candidate');
              // navigate(isCandidate ? '/candidate/settings' : '/hr/settings');
              navigate(isCandidate ? '/candidate/settings' : isHr ? '/hr/settings' : '/company/settings');
            }}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button> */}
          {/* <button
            onClick={() => {
              if (location.pathname.startsWith('/candidate')) {
                navigate('/candidate/settings');
              } else if (location.pathname.startsWith('/hr')) {
                navigate('/hr/settings');
              } else if (location.pathname.startsWith('/company')) {
                navigate('/company/settings');
              } else {
                navigate('/settings');
              }
            }}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button> */}
          {/* <button
            onClick={() => {
              if (location.pathname.startsWith('/candidate')) {
                navigate('/candidate/settings');
              } else if (location.pathname.startsWith('/hr')) {
                navigate('/hr/settings');
              } else if (location.pathname.startsWith('/company')) {
                navigate('/company/settings');
              } else if (location.pathname.startsWith('/super-admin')) {
                navigate('/super-admin/settings');
              } else {
                navigate('/settings'); // fallback for any other case
              }
            }}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button> */}


          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
      <div className="mt-3 flex items-center space-x-2 text-sm">
        {/* Assuming Link and ChevronRight are available from react-router-dom or similar */}
        {/* If not, you might need to import them or define them locally */}
        {/* For now, I'll assume they are available */}
        {/* <Link to="/hr-dashboard" className="text-gray-600 hover:text-indigo-600">Dashboard</Link> */}
        {pathnames.map((value, index) => {
          if (value === 'hr-dashboard') return null;

          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const name = breadcrumbNameMap[value] || value;

          return (
            <React.Fragment key={routeTo}>
              {/* <ChevronRight className="w-4 h-4 text-gray-400" /> */}
              {/* Assuming ChevronRight is available */}
              {/* If not, you might need to import it or define it locally */}
              {/* For now, I'll assume it's available */}
              {/* {isLast ? (
                <span className="font-medium text-gray-800">{name}</span>
              ) : (
                <Link to={routeTo} className="text-gray-600 hover:text-indigo-600">{name}</Link>
              )} */}
            </React.Fragment>
          );
        })}
      </div>
    </header>
  );
};

export default DashboardHeader;
