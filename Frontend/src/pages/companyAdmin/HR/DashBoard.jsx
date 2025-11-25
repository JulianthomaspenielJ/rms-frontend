// src/components/Dashboard.js
import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Footer from '../../landing/Components/Footer';
import JDTrendChart from '../../../components/charts/JDTrendChart';
import AppliedJdVsJd from './analytics/AppliedJdVsJd';
import HrVsJd from './analytics/HrVsJd';
import useAnalyticsData from '../../../hooks/useAnalyticsData';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_DASHBOARD_DATA } from '../../../constants/dashboardData';
import { selectLastUpdated, selectNavigationStatus } from '../../../store/slices/navigationSlice';

// Fallback data in case the analytics data is not available
const getFallbackData = () => ({
  jdVsMonths: MOCK_DASHBOARD_DATA.jdVsMonths || [],
  appliedJobs: MOCK_DASHBOARD_DATA.appliedJobs || [],
  hrPerformance: MOCK_DASHBOARD_DATA.hrPerformance || [],
  summary: MOCK_DASHBOARD_DATA.summary || {
    totalJobs: 0,
    activeApplications: 0,
    interviewsScheduled: 0,
    offersExtended: 0
  }
});

const DashboardCard = React.memo(({ title, icon, children, className = '', isLoading = false }) => (
  <div className={`bg-gradient-to-br from-indigo-100 via-white to-yellow-100 rounded-3xl shadow-xl border border-gray-200 p-7 transition-all duration-200 hover:shadow-2xl hover:-translate-y-1 scale-100 hover:scale-[1.04] ${className}`}
    style={{ minWidth: 0, maxWidth: '100%', minHeight: 340, width: '100%' }}>
    <div className="flex items-center gap-4 mb-6">
      {icon && <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-300 to-yellow-200 shadow text-3xl">{icon}</span>}
      <h3 className="text-2xl font-extrabold text-gray-900 flex items-center drop-shadow">
        {title}
        {isLoading && (
          <div className="ml-3 w-5 h-5 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
        )}
      </h3>
    </div>
    <div className="h-[220px] w-full relative overflow-hidden">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : (
        children
      )}
    </div>
  </div>
));

const AnimatedNumber = ({ value }) => (
  <motion.span
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="inline-block"
  >
    {value ? value.toLocaleString() : '0'}
  </motion.span>
);

const StatCard = ({ label, value, icon, gradient }) => (
  <motion.div
    whileHover={{ scale: 1.06, boxShadow: '0 12px 36px 0 rgba(80,80,180,0.14)' }}
    className={`relative p-8 rounded-3xl shadow-2xl bg-gradient-to-br ${gradient} flex flex-col gap-4 min-h-[150px] overflow-hidden border border-white/20`}
  >
    <div className="flex items-center gap-4">
      <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/40 text-4xl shadow-lg">{icon}</span>
      <span className="text-xl font-bold text-white/90 drop-shadow-lg">{label}</span>
    </div>
    <div className="mt-3 text-5xl font-extrabold text-white drop-shadow-xl">
      <AnimatePresence>
        <AnimatedNumber value={value || 0} />
      </AnimatePresence>
    </div>
  </motion.div>
);

function Dashboard() {
  const [timeRange, setTimeRange] = useState('month');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  
  // Get navigation status and last update time from Redux
  const navigationStatus = useSelector(selectNavigationStatus);
  const lastUpdated = useSelector(selectLastUpdated);
  
  // Use the analytics data hook with the selected time range
  const { data, isLoading, error, refresh } = useAnalyticsData(timeRange);
  
  // Fallback to mock data if there's an error or data is empty
  const dashboardData = useMemo(() => {
    if (error || !data) {
      console.warn('Using fallback data due to:', error);
      return getFallbackData();
    }
    return data;
  }, [data, error]);
  
  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refresh();
      setLastUpdateTime(new Date());
    } finally {
      setIsRefreshing(false);
    }
  };
  
  
  // Update last update time when navigation data changes
  useEffect(() => {
    if (lastUpdated) {
      setLastUpdateTime(new Date(lastUpdated));
    }
  }, [lastUpdated]);

  // Merge analytics data with fallback data
  const chartData = useMemo(() => {
    const fallbackData = getFallbackData();
    
    if (!dashboardData) {
      return {
        jdVsMonths: fallbackData.jdVsMonths,
        appliedJobs: fallbackData.appliedJobs,
        hrPerformance: fallbackData.hrPerformance,
        summary: fallbackData.summary
      };
    }
    
    return {
      jdVsMonths: (dashboardData.jdTrends || []).map(item => ({
        name: item.month,
        value: item.jdCount,
        trend: item.trend || 0
      })),
      appliedJobs: (dashboardData.departmentStats || []).map(dept => ({
        name: dept.name,
        'Total JDs': dept.totalJds,
        'Applied JDs': dept.appliedJds,
        'Interviewed': dept.interviewed,
        'Filled Positions': dept.filledPositions
      })),
      hrPerformance: (dashboardData.hrPerformance || []).map(hr => ({
        name: hr.name,
        'JDs Managed': hr.jdsManaged,
        'Applications Processed': hr.applicationsProcessed,
        'Hires Made': hr.hiresMade,
        idx: hr.idx || 0
      })),
      summary: {
        totalJobs: (dashboardData.jdTrends || []).reduce((sum, item) => sum + (item.jdCount || 0), 0),
        activeApplications: (dashboardData.departmentStats || []).reduce((sum, dept) => sum + (dept.appliedJds || 0), 0),
        interviewsScheduled: Math.floor(Math.random() * 50) + 10, // Mock data
        offersExtended: Math.floor(Math.random() * 20) + 5 // Mock data
      }
    };
  }, [dashboardData]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">We couldn't load the dashboard data. Please try again later.</p>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }



  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <main className="flex-1 px-2 sm:px-8 lg:px-20 py-10 overflow-x-hidden">
        {/* Hero Header */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-extrabold text-gray-900">HR Analytics Dashboard</h2>
              <div className="flex items-center gap-4">
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="week">Last 7 days</option>
                  <option value="month">Last 30 days</option>
                  <option value="quarter">Last 90 days</option>
                </select>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 flex items-center gap-2"
                >
                  {isRefreshing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Refreshing...
                    </>
                  ) : 'Refresh'}
                </button>
              </div>
            </div>
            
            {/* Status Bar */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-2 ${navigationStatus === 'succeeded' ? 'bg-green-500' : navigationStatus === 'loading' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                  {navigationStatus === 'succeeded' ? 'Connected' : navigationStatus === 'loading' ? 'Connecting...' : 'Disconnected'}
                </span>
                {lastUpdateTime && (
                  <span className="text-xs text-gray-500">
                    Last updated: {lastUpdateTime.toLocaleTimeString()}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500">
                Real-time updates enabled
              </div>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* JD Trend Chart */}
            <DashboardCard 
              title="JD vs Months Analysis" 
              
              isLoading={isLoading || isRefreshing}
            >
              <JDTrendChart data={chartData.jdVsMonths} />
            </DashboardCard>

            {/* Applied JDs vs Total JDs */}
            <DashboardCard 
              title="Applied vs Total JDs" 
              
              isLoading={isLoading || isRefreshing}
            >
              <AppliedJdVsJd data={chartData.appliedJobs} mini={false} />
            </DashboardCard>

            {/* HR vs JD Workload */}
            <DashboardCard 
              title="HR vs JD Workload" 
              className="lg:col-span-2"
              isLoading={isLoading || isRefreshing}
            >
              <HrVsJd data={chartData.hrPerformance} mini={false} />
            </DashboardCard>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <StatCard 
              label="Total Jobs" 
              value={chartData.summary.totalJobs} 
              
              gradient="from-blue-500 to-blue-400"
            />
            <StatCard 
              label="Active Applications" 
              value={chartData.summary.activeApplications}
              
              gradient="from-green-500 to-green-400"
            />
            <StatCard 
              label="Interviews Scheduled" 
              value={chartData.summary.interviewsScheduled}
              
              gradient="from-purple-500 to-purple-400"
            />
            <StatCard 
              label="Offers Extended" 
              value={chartData.summary.offersExtended}
              icon="📨"
              gradient="from-yellow-500 to-yellow-400"
            />
          </div>
      </main>
      <Footer />
    </div>
  );
}

export default Dashboard;
