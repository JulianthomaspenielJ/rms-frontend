import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import HRSidebar from '../components/hr/HRSidebar';
import useResponsive from "@/hooks/useResponsive";
import DashboardHeader from '../pages/companyAdmin/HR/DashboardHeader';
import Footer from '../pages/landing/Components/Footer';

const HRLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useResponsive();
  const location = useLocation();

  // Close sidebar on mobile when route changes
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
            <HRSidebar 
              collapsed={isCollapsed} 
              onToggle={() => setIsCollapsed(c => !c)}
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
            <div className="p-4 md:p-6">
              <Outlet />
            </div>
            <Footer className="border-t border-gray-200 mt-2 pt-2" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default HRLayout;