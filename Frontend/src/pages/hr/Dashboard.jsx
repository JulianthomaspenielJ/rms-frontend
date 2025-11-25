import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from 'recharts';
import { Users, Briefcase, CheckCircle, Clock, X, Calendar, Filter, TrendingUp } from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';
import { toast } from 'react-toastify';

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c084fc', '#f472b6'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [showLargeGraph, setShowLargeGraph] = useState(false);
  const [selectedChart, setSelectedChart] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('all');
  const [selectedMonths, setSelectedMonths] = useState(6);

  // Dashboard data state
  const [dashboardStats, setDashboardStats] = useState({
    totalApplications: 0,
    shortlisted: 0,
    hired: 0,
    pending: 0
  });
  const [allApplications, setAllApplications] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);
  const [applicationSources, setApplicationSources] = useState([]);
  const [openPositions, setOpenPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fetch applications over time when months selection changes
  useEffect(() => {
    if (!loading) {
      fetchApplicationsOverTime();
    }
  }, [selectedMonths, startDate, endDate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, departmentsResponse, sourcesResponse, positionsResponse] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getApplicationsByDepartment(),
        dashboardService.getApplicationSources(),
        dashboardService.getOpenPositions()
      ]);

      if (statsResponse.ok) {
        setDashboardStats(statsResponse.data);
      }
      if (departmentsResponse.ok) {
        setAllDepartments(departmentsResponse.data);
      }
      if (sourcesResponse.ok) {
        setApplicationSources(sourcesResponse.data);
      }
      if (positionsResponse.ok) {
        setOpenPositions(positionsResponse.data);
      }

      // Fetch applications over time
      await fetchApplicationsOverTime();
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicationsOverTime = async () => {
    try {
      const params = {
        months: selectedMonths,
        ...(startDate && { startDate: startDate.toISOString() }),
        ...(endDate && { endDate: endDate.toISOString() })
      };
      
      const response = await dashboardService.getApplicationsOverTime(params);
      if (response.ok) {
        setAllApplications(response.data);
      }
    } catch (error) {
      console.error('Error fetching applications over time:', error);
      toast.error('Failed to load applications data');
    }
  };

  const setDateRangePreset = (days, presetName) => {
    if (days === null) {
      setDateRange([null, null]);
      setSelectedPreset('all');
      return;
    }
    
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setDateRange([start, end]);
    setSelectedPreset(presetName);
    setShowDatePicker(false);
  };

  const clearDateFilter = () => {
    setDateRange([null, null]);
    setSelectedPreset('all');
  };

  // Filter applications based on chosen date range and month selection
  const filteredApplications = useMemo(() => {
    let result = [...allApplications];
    
    // Apply month selection first
    result = result.slice(0, selectedMonths);
    
    if (startDate && endDate) {
      result = result.filter(d => {
        const date = new Date(d.date);
        return date >= startDate && date <= endDate;
      });
    }
    
    return result.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [allApplications, startDate, endDate, selectedMonths]);

  // Calculate totals
  const totalApplicationsFromSources = applicationSources.reduce((sum, item) => sum + item.value, 0);
  const totalDepartmentApplications = allDepartments.reduce((sum, dept) => sum + dept.value, 0);
  const totalOpenPositions = openPositions.reduce((sum, pos) => sum + pos.positions, 0);

  const getPresetLabel = () => {
    switch (selectedPreset) {
      case 'today': return 'Today';
      case 'week': return 'Last 7 Days';
      case 'month': return 'Last 30 Days';
      case 'quarter': return 'Last 90 Days';
      case 'thisMonth': return 'This Month';
      case 'lastMonth': return 'Last Month';
      case 'custom': return `${startDate?.toLocaleDateString()} - ${endDate?.toLocaleDateString()}`;
      default: return 'All Time';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-3">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading dashboard data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3">
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Compact Header */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">HR Dashboard</h1>
              <p className="text-sm text-gray-600">Monitor recruitment metrics and analytics</p>
            </div>
            
            {/* Compact Date Filter */}
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>{getPresetLabel()}</span>
                {(startDate || endDate) && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      clearDateFilter();
                    }}
                    className="text-indigo-200 hover:text-white ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </button>

              {showDatePicker && (
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl border p-4 z-50 w-72">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-sm">Filter by Date</h3>
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {[
                      { key: 'all', label: 'All Time', action: () => setDateRangePreset(null, 'all') },
                      { key: 'today', label: 'Today', action: () => setDateRangePreset(0, 'today') },
                      { key: 'week', label: 'Last 7 Days', action: () => setDateRangePreset(6, 'week') },
                      { key: 'month', label: 'Last 30 Days', action: () => setDateRangePreset(29, 'month') },
                    ].map(preset => (
                      <button
                        key={preset.key}
                        onClick={preset.action}
                        className={`text-left p-2 text-xs rounded transition-colors ${
                          selectedPreset === preset.key
                            ? 'bg-indigo-100 text-indigo-700 font-medium'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Compact Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard 
            title="Total Applications" 
            count={loading ? "..." : dashboardStats.totalApplications.toLocaleString()} 
            icon={Users} 
            color="blue" 
          />
          <StatCard 
            title="Shortlisted" 
            count={loading ? "..." : dashboardStats.shortlisted.toLocaleString()} 
            icon={CheckCircle} 
            color="green" 
          />
          <StatCard 
            title="Hired" 
            count={loading ? "..." : dashboardStats.hired.toLocaleString()} 
            icon={Briefcase} 
            color="purple" 
          />
          <StatCard 
            title="Pending" 
            count={loading ? "..." : dashboardStats.pending.toLocaleString()} 
            icon={Clock} 
            color="orange" 
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Applications Over Time */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Applications Over Time</h3>
                <p className="text-sm text-gray-500">{filteredApplications.length} data points</p>
              </div>
              <div className="flex items-center gap-2">
                <select 
                  value={selectedMonths}
                  onChange={(e) => setSelectedMonths(Number(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value={6}>Last 6 months</option>
                  <option value={12}>All 12 months</option>
                </select>
                <button
                  onClick={() => { setSelectedChart('bar'); setShowLargeGraph(true); }}
                  className="text-indigo-500 hover:text-indigo-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredApplications} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="applications" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Applications by Department with Center Total */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Applications by Department</h3>
                <p className="text-sm text-gray-500">{totalDepartmentApplications} total applications</p>
              </div>
              <button
                onClick={() => { setSelectedChart('pie'); setShowLargeGraph(true); }}
                className="text-indigo-500 hover:text-indigo-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allDepartments}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={45}
                    paddingAngle={2}
                  >
                    {allDepartments.map((entry, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-gray-700">
                    {totalDepartmentApplications}
                  </text>
                  <text x="50%" y="50%" dy={20} textAnchor="middle" dominantBaseline="middle" className="text-sm fill-gray-500">
                    Total
                  </text>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {allDepartments.map((dept, index) => (
                <div key={dept.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index] }}
                  ></div>
                  <span className="text-xs text-gray-600 truncate">{dept.name}</span>
                  <span className="text-xs font-medium text-gray-800">{dept.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Application Sources Chart - temporarily hidden */}
        {/**
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Application Sources</h3>
              <p className="text-sm text-gray-500">{totalApplicationsFromSources} total applications</p>
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applicationSources} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]}>
                  {applicationSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        */}

        {/* Open Positions with Department Details - temporarily hidden */}
        {/**
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Open Positions by Department</h3>
              <p className="text-sm text-gray-500">{totalOpenPositions} total positions • {openPositions.length} departments</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {openPositions.map((position, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-800 text-sm">{position.department}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(position.priority)}`}>
                      {position.priority}
                    </span>
                  </div>
                  <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-2 py-1 rounded">
                    {position.positions}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-700 mb-2">{position.title}</p>
                <div className="space-y-1 mb-3">
                  {position.roles.slice(0, 2).map((role, roleIndex) => (
                    <div key={roleIndex} className="text-xs text-gray-600 flex items-center">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2"></div>
                      {role}
                    </div>
                  ))}
                  {position.roles.length > 2 && (
                    <div className="text-xs text-gray-500">+{position.roles.length - 2} more roles</div>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{position.applications} applications</span>
                  <button 
                    onClick={() => navigate('/hr/jdliststatus')}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        */}

        {/* Modal for Enlarged Charts */}
        {showLargeGraph && (
          <Modal onClose={() => setShowLargeGraph(false)}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedChart === 'bar' ? 'Applications Over Time' : 'Applications by Department'}
                </h2>
                <p className="text-gray-600 mt-1">
                  Filtered by: {getPresetLabel()}
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              {selectedChart === 'bar' ? (
                <LineChart 
                  data={filteredApplications}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#6b7280', fontSize: 14 }}
                    tickLine={{ stroke: '#e5e7eb' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 14 }}
                    tickLine={{ stroke: '#e5e7eb' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="applications" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    dot={{ fill: '#6366f1', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              ) : (
                <PieChart>
                  <Pie
                    data={allDepartments}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    innerRadius={60}
                    paddingAngle={3}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {allDepartments.map((entry, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold fill-gray-700">
                    {totalDepartmentApplications}
                  </text>
                  <text x="50%" y="50%" dy={25} textAnchor="middle" dominantBaseline="middle" className="text-lg fill-gray-500">
                    Total
                  </text>
                </PieChart>
              )}
            </ResponsiveContainer>
          </Modal>
        )}
      </div>
    </div>
  );
}

// Compact Components

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
}

function StatCard({ title, count, icon: Icon, color }) {
  const colorClasses = {
    blue: '#2563eb',
    green: '#16a34a',
    purple: '#9333ea',
    orange: '#ea580c'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${colorClasses[color]}20`, color: colorClasses[color] }}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <h3 className="text-xs font-medium text-gray-500 mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{count}</p>
      </div>
    </div>
  );
}