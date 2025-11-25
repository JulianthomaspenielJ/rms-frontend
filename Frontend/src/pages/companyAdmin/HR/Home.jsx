import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Users as UsersIcon, FileText as FileTextIcon, Calendar } from 'react-feather';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';

// API Configuration
const API_BASE_URL = 'http://localhost:4000/api';

// Helper function to fetch dashboard data
const fetchDashboardData = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/companies/analytics/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.ok) {
      throw new Error(data.message || 'Failed to fetch dashboard data');
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

const JDBarChart = ({
  title,
  data,
  dataKey,
  barColors,
  dateRange,
  onDateChange,
  chartId,
  toggleChartCalendar,
}) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-md transition-all duration-300">
      <div className="flex flex-col space-y-2 mb-4 relative">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[#4f46e5]">{title}</h3>
        </div>
        <div className="relative">
          <button
            onClick={() => toggleChartCalendar(chartId)}
            className="flex items-center text-indigo-600 hover:text-indigo-700 text-xs font-medium p-1.5 -m-1.5 rounded-md hover:bg-indigo-50 transition-colors"
          >
            <Calendar size={14} className="mr-1.5 flex-shrink-0" />
            <span className="whitespace-nowrap">
              {dateRange?.startDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) || 'Start date'} -{' '}
              {dateRange?.endDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) || 'End date'}
            </span>
          </button>
          <div 
            className={`absolute left-0 top-full mt-1 z-50 transition-all duration-200 transform origin-top ${dateRange.showCalendar ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
            style={{ minWidth: '300px' }}
          >
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
              <DatePicker
                selected={dateRange.startDate}
                onChange={onDateChange}
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                selectsRange
                selectsDisabledDaysInRange
                inline
                calendarClassName="border-0"
                renderCustomHeader={({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white">
                    <button
                      onClick={decreaseMonth}
                      disabled={prevMonthButtonDisabled}
                      className={`p-1.5 rounded-md ${prevMonthButtonDisabled ? 'text-gray-300' : 'text-indigo-600 hover:bg-indigo-50'}`}
                      aria-label="Previous Month"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <span className="text-sm font-semibold text-gray-800">
                      {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button
                      onClick={increaseMonth}
                      disabled={nextMonthButtonDisabled}
                      className={`p-1.5 rounded-md ${nextMonthButtonDisabled ? 'text-gray-300' : 'text-indigo-600 hover:bg-indigo-50'}`}
                      aria-label="Next Month"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
                dayClassName={(date) => {
                  let classes = 'w-8 h-8 flex items-center justify-center text-sm rounded-md';
                  const isSelected = (dateRange.startDate && date.getTime() === dateRange.startDate.getTime()) ||
                                   (dateRange.endDate && date.getTime() === dateRange.endDate.getTime());
                  const isInRange = dateRange.startDate && dateRange.endDate &&
                                  date > dateRange.startDate && date < dateRange.endDate;
                  
                  if (isSelected) {
                    classes += ' bg-indigo-600 text-white';
                  } else if (isInRange) {
                    classes += ' bg-indigo-100 text-indigo-700';
                  } else if (date.getDay() === 0 || date.getDay() === 6) {
                    classes += ' text-gray-400';
                  } else {
                    classes += ' text-gray-700 hover:bg-gray-100';
                  }
                  
                  return classes;
                }}
                weekDayClassName={() => 'text-xs font-medium text-gray-500'}
                renderDayContents={(day, date) => {
                  const isInRange = dateRange.startDate && dateRange.endDate && 
                    date > dateRange.startDate && 
                    date < dateRange.endDate;
                  const isStart = date.getTime() === dateRange.startDate?.getTime();
                  const isEnd = date.getTime() === dateRange.endDate?.getTime();
                  
                  return (
                    <div className={`relative w-full h-8 flex items-center justify-center ${
                      isInRange ? 'bg-indigo-50' : ''
                    } ${
                      isStart ? 'rounded-l-md bg-indigo-100' : ''
                    } ${
                      isEnd ? 'rounded-r-md bg-indigo-100' : ''
                    }`}>
                      <span className={`relative z-10 ${
                        isStart || isEnd ? 'bg-indigo-600 text-white' : ''
                      } w-8 h-8 flex items-center justify-center rounded-full`}>
                        {day}
                      </span>
                    </div>
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-[300px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 20,
            }}
            barGap={4}
            barCategoryGap="15%"
          >
            <XAxis
              dataKey="name"
              angle={-25}
              textAnchor="end"
              height={60}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '0.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                fontSize: '0.875rem',
              }}
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: '10px',
                fontSize: '0.75rem',
              }}
            />
            <Bar dataKey={dataKey}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const CompanyAdminDashboard = () => {
  const location = useLocation();
  const [authToken, setAuthToken] = useState('');
  const [zoomedChart, setZoomedChart] = useState(null);
  const [showGlobalCalendar, setShowGlobalCalendar] = useState(false);
  const [globalDateRange, setGlobalDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    endDate: new Date(),
  });

  // Get token from local storage on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    } else {
      console.warn('No authentication token found in local storage');
      // You might want to redirect to login here if needed
      // navigate('/login');
    }
  }, []);

  const [chartDateRanges, setChartDateRanges] = useState({
    month: {
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)),
      endDate: new Date(),
      showCalendar: false,
    },
    hr: {
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)),
      endDate: new Date(),
      showCalendar: false,
    },
    applied: {
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)),
      endDate: new Date(),
      showCalendar: false,
    },
  });

  // Dashboard data state
  const [dashboardData, setDashboardData] = useState({
    totals: { totalJDs: 0, totalApplicants: 0 },
    graphs: {
      jdVsMonths: [],
      jdByHR: [],
      applicationsByDepartment: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Transform API data to chart format
  const transformDataForCharts = () => {
    const { jdVsMonths, jdByHR, applicationsByDepartment } = dashboardData.graphs;

    // Transform JD vs Month data
    const jdMonthData = jdVsMonths.map(item => ({
      name: new Date(item.month).toLocaleDateString('en-US', { month: 'short' }),
      'JD vs Month': item.jdCount
    }));

    // Transform JD vs HR data
    const jdHRData = jdByHR.map(item => ({
      name: item.name || `HR ${item.hrId.slice(-4)}`,
      'JD vs HR': item.count
    }));

    // Transform JD vs Applications data
    const jdAppliedData = applicationsByDepartment.map(item => ({
      name: item.name,
      'JD vs Applications': item.value
    }));

    return { jdMonthData, jdHRData, jdAppliedData };
  };

  const { jdMonthData, jdHRData, jdAppliedData } = transformDataForCharts();
  const { totalJDs, totalApplicants } = dashboardData.totals;

  const handleZoom = (chartId) => {
    setZoomedChart(zoomedChart === chartId ? null : chartId);
  };

  const handleGlobalDateChange = (dates) => {
    const [start, end] = dates;
    setGlobalDateRange({ startDate: start, endDate: end });

    // Update all chart date ranges
    const newRanges = {};
    Object.keys(chartDateRanges).forEach((key) => {
      newRanges[key] = {
        ...chartDateRanges[key],
        startDate: start,
        endDate: end,
      };
    });
    setChartDateRanges(newRanges);
    setShowGlobalCalendar(false);
  };

  const toggleGlobalCalendar = () => setShowGlobalCalendar(prev => !prev);

  const toggleChartCalendar = (chartId) => {
    setChartDateRanges((prev) => ({
      ...prev,
      [chartId]: { ...prev[chartId], showCalendar: !prev[chartId].showCalendar },
    }));
  };

  const handleChartDateChange = (chartId, dates) => {
    const [start, end] = dates;
    setChartDateRanges((prev) => ({
      ...prev,
      [chartId]: { ...prev[chartId], startDate: start, endDate: end, showCalendar: false },
    }));
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 ease-in-out">
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600">Loading dashboard data...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 ease-in-out">
        <div className="p-4 lg:p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="text-red-600 text-lg font-semibold">Error Loading Dashboard</div>
            </div>
            <div className="mt-2 text-red-700">{error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 ease-in-out">
      <div className="p-4 lg:p-6">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
          <div className="flex items-center -ml-4 relative">
            <div className="relative">
              <button
                onClick={toggleGlobalCalendar}
                className="flex items-center bg-white rounded-lg border border-gray-200 p-2 pr-3 hover:border-indigo-300 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
              >
                <Calendar className="text-indigo-600 mr-2 flex-shrink-0" size={18} />
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  {globalDateRange?.startDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) || 'Start date'} -{' '}
                  {globalDateRange?.endDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) || 'End date'}
                </span>
              </button>
              <div className={`absolute top-full right-0 mt-1 z-50 transition-opacity duration-200 ${showGlobalCalendar ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden transform transition-all duration-200 scale-95 hover:scale-100">
                  <DatePicker
                    selected={globalDateRange.startDate}
                    onChange={handleGlobalDateChange}
                    startDate={globalDateRange.startDate}
                    endDate={globalDateRange.endDate}
                    selectsRange
                    inline
                    calendarClassName="border-0"
                    renderCustomHeader={({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white">
                        <button
                          onClick={decreaseMonth}
                          disabled={prevMonthButtonDisabled}
                          className={`p-1.5 rounded-md ${prevMonthButtonDisabled ? 'text-gray-300' : 'text-indigo-600 hover:bg-indigo-50'}`}
                          aria-label="Previous Month"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <span className="text-sm font-semibold text-gray-800">
                          {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </span>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={increaseMonth}
                            disabled={nextMonthButtonDisabled}
                            className={`p-1.5 rounded-md ${nextMonthButtonDisabled ? 'text-gray-300' : 'text-indigo-600 hover:bg-indigo-50'}`}
                            aria-label="Next Month"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setShowGlobalCalendar(false)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                            title="Close calendar"
                            aria-label="Close Calendar"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                    dayClassName={() => "text-sm text-gray-700 hover:bg-indigo-50 rounded-md"}
                    weekDayClassName={() => "text-xs font-medium text-gray-500"}
                    renderDayContents={(day, date) => {
                      const isInRange = globalDateRange.startDate && globalDateRange.endDate && 
                        date > globalDateRange.startDate && 
                        date < globalDateRange.endDate;
                      const isStart = date.getTime() === globalDateRange.startDate?.getTime();
                      const isEnd = date.getTime() === globalDateRange.endDate?.getTime();
                      
                      return (
                        <div className={`relative w-full h-8 flex items-center justify-center ${
                          isInRange ? 'bg-indigo-50' : ''
                        } ${
                          isStart ? 'rounded-l-md bg-indigo-100' : ''
                        } ${
                          isEnd ? 'rounded-r-md bg-indigo-100' : ''
                        }`}>
                          <span className={`relative z-10 ${
                            isStart || isEnd ? 'bg-indigo-600 text-white' : ''
                          } w-8 h-8 flex items-center justify-center rounded-full`}>
                            {day}
                          </span>
                        </div>
                      );
                    }}
                  />
                </div>
              </div>
            </div>


          </div>
        </div>

        {/* Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 flex items-center shadow-md">
            <FileTextIcon className="text-blue-600 mr-4" size={36} />
            <div>
              <div className="text-sm text-gray-500 font-medium">Total JD</div>
              <div className="text-2xl font-bold text-gray-900">{totalJDs}</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 flex items-center shadow-md">
            <UsersIcon className="text-indigo-600 mr-4" size={36} />
            <div>
              <div className="text-sm text-gray-500 font-medium">Total Applicants</div>
              <div className="text-2xl font-bold text-gray-900">{totalApplicants}</div>
            </div>
          </div>
        </div>

        {/* Dashboard Content (Graphs) */}
        <div className={`grid ${zoomedChart ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
          {(zoomedChart === null || zoomedChart === 'month') && (
            <JDBarChart
              title="JD vs Month"
              data={jdMonthData}
              dataKey="JD vs Month"
              barColors={['#4f46e5', '#60a5fa', '#6366f1', '#7c3aed']}
              onZoom={() => handleZoom('month')}
              isZoomed={zoomedChart === 'month'}
              onClose={() => setZoomedChart(null)}
              dateRange={chartDateRanges.month}
              onDateChange={(dates) => handleChartDateChange('month', dates)}
              chartId="month"
              toggleChartCalendar={toggleChartCalendar} // pass toggle function
            />
          )}
          {(zoomedChart === null || zoomedChart === 'hr') && (
            <JDBarChart
              title="JD vs HR"
              data={jdHRData}
              dataKey="JD vs HR"
              barColors={['#4f46e5', '#818cf8', '#a5b4fc']}
              onZoom={() => handleZoom('hr')}
              isZoomed={zoomedChart === 'hr'}
              onClose={() => setZoomedChart(null)}
              dateRange={chartDateRanges.hr}
              onDateChange={(dates) => handleChartDateChange('hr', dates)}
              chartId="hr"
              toggleChartCalendar={toggleChartCalendar} // pass toggle function
            />
          )}
          {(zoomedChart === null || zoomedChart === 'applied') && (
            <JDBarChart
              title="JD vs Total Applied"
              data={jdAppliedData}
              dataKey="JD vs Applications"
              barColors={['#4f46e5', '#818cf8', '#93c5fd', '#3b82f6', '#2563eb']}
              onZoom={() => handleZoom('applied')}
              isZoomed={zoomedChart === 'applied'}
              onClose={() => setZoomedChart(null)}
              dateRange={chartDateRanges.applied}
              onDateChange={(dates) => handleChartDateChange('applied', dates)}
              chartId="applied"
              toggleChartCalendar={toggleChartCalendar} // pass toggle function
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyAdminDashboard;
