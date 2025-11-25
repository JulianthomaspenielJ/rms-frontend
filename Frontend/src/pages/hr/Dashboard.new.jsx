// import React, { useState, useEffect, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip,
//   PieChart, Pie, Cell, ResponsiveContainer,
//   LineChart, Line, CartesianGrid
// } from 'recharts';
// import { Users, Briefcase, CheckCircle, Clock, X, Calendar, Filter, TrendingUp, Loader2 } from 'lucide-react';

// const API_BASE_URL = 'http://localhost:4000/api';

// // Default data in case API fails
// const DEFAULT_DATA = {
//   totalApplications: 1535,
//   newApplications: 120,
//   hired: 45,
//   rejected: 35,
//   pending: 40,
//   totalCandidates: 320,
//   openPositions: 11,
//   applicationTrends: [
//     { name: 'Jan', date: new Date(2025, 0, 15), applications: 400 },
//     { name: 'Feb', date: new Date(2025, 1, 10), applications: 300 },
//     { name: 'Mar', date: new Date(2025, 2, 6), applications: 500 },
//     { name: 'Apr', date: new Date(2025, 3, 12), applications: 200 },
//     { name: 'May', date: new Date(2025, 4, 18), applications: 350 },
//     { name: 'Jun', date: new Date(2025, 5, 24), applications: 420 },
//   ],
//   departments: [
//     { name: 'Engineering', value: 300 },
//     { name: 'Marketing', value: 100 },
//     { name: 'Sales', value: 80 },
//     { name: 'Customer Support', value: 70 },
//     { name: 'HR', value: 50 },
//   ],
//   sources: [
//     { name: 'LinkedIn', value: 461, percentage: 30 },
//     { name: 'Indeed', value: 384, percentage: 25 },
//     { name: 'Company Website', value: 307, percentage: 20 },
//     { name: 'Referrals', value: 230, percentage: 15 },
//     { name: 'Job Boards', value: 153, percentage: 10 },
//   ],
//   openPositions: [
//     { 
//       department: 'Engineering', 
//       title: 'Frontend Developer', 
//       positions: 3, 
//       applications: 45,
//       roles: ['React Developer', 'Vue.js Developer', 'Angular Developer'],
//       priority: 'High'
//     },
//     { 
//       department: 'Design', 
//       title: 'UX Designer', 
//       positions: 2, 
//       applications: 32,
//       roles: ['UI/UX Designer', 'Product Designer'],
//       priority: 'Medium'
//     },
//     { 
//       department: 'Marketing', 
//       title: 'Digital Marketing Manager', 
//       positions: 1, 
//       applications: 28,
//       roles: ['SEO Specialist', 'Content Marketing'],
//       priority: 'High'
//     },
//     { 
//       department: 'Sales', 
//       title: 'Sales Executive', 
//       positions: 4, 
//       applications: 38,
//       roles: ['Inside Sales', 'Account Executive', 'Sales Manager'],
//       priority: 'Medium'
//     },
//     { 
//       department: 'HR', 
//       title: 'HR Generalist', 
//       positions: 1, 
//       applications: 15,
//       roles: ['Recruiter', 'HR Assistant'],
//       priority: 'Low'
//     },
//   ]
// };

// const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c084fc', '#f472b6'];

// export default function Dashboard() {
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showLargeGraph, setShowLargeGraph] = useState(false);
//   const [selectedChart, setSelectedChart] = useState(null);
//   const [dateRange, setDateRange] = useState([null, null]);
//   const [startDate, endDate] = dateRange;
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [selectedPreset, setSelectedPreset] = useState('all');
//   const [selectedMonths, setSelectedMonths] = useState(6);
//   const navigate = useNavigate();

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${API_BASE_URL}/hr/dashboard/stats`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (response.data.success && response.data.data) {
//         setDashboardData(response.data.data);
//       }
//     } catch (err) {
//       console.error('Error fetching dashboard data:', err);
//       setError('Failed to load dashboard data. Using default data.');
//       setDashboardData(DEFAULT_DATA);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const setDateRangePreset = (days, presetName) => {
//     if (days === null) {
//       setDateRange([null, null]);
//       setSelectedPreset('all');
//       return;
//     }
    
//     const end = new Date();
//     const start = new Date();
//     start.setDate(start.getDate() - days);
//     setDateRange([start, end]);
//     setSelectedPreset(presetName);
//     setShowDatePicker(false);
//   };

//   const clearDateFilter = () => {
//     setDateRange([null, null]);
//     setSelectedPreset('all');
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
//         <span className="ml-2 text-gray-700">Loading dashboard...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4 text-red-600 bg-red-100 rounded-lg m-4">
//         {error}
//       </div>
//     );
//   }

//   const data = dashboardData || DEFAULT_DATA;
  
//   const {
//     totalApplications,
//     newApplications,
//     hired,
//     rejected,
//     pending,
//     totalCandidates,
//     openPositions: openPositionsCount,
//     applicationTrends = [],
//     departments = [],
//     sources = [],
//     openPositions = []
//   } = data;

//   // Filter applications based on chosen date range and month selection
//   const filteredApplications = useMemo(() => {
//     let result = [...(applicationTrends || [])];
    
//     // Apply month selection first
//     result = result.slice(0, selectedMonths);
    
//     if (startDate && endDate) {
//       result = result.filter(d => {
//         const date = new Date(d.date);
//         return date >= startDate && date <= endDate;
//       });
//     }
    
//     return result.sort((a, b) => new Date(a.date) - new Date(b.date));
//   }, [applicationTrends, startDate, endDate, selectedMonths]);

//   // Calculate totals
//   const totalApplicationsFromSources = sources.reduce((sum, item) => sum + (item?.value || 0), 0);
//   const totalDepartmentApplications = departments.reduce((sum, dept) => sum + (dept?.value || 0), 0);
//   const totalOpenPositions = openPositions.reduce((sum, pos) => sum + (pos?.positions || 0), 0);

//   const getPresetLabel = () => {
//     switch (selectedPreset) {
//       case 'today': return 'Today';
//       case 'week': return 'Last 7 Days';
//       case 'month': return 'Last 30 Days';
//       case 'quarter': return 'Last 90 Days';
//       case 'thisMonth': return 'This Month';
//       case 'lastMonth': return 'Last Month';
//       case 'custom': return `${startDate?.toLocaleDateString()} - ${endDate?.toLocaleDateString()}`;
//       default: return 'All Time';
//     }
//   };

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'High': return 'bg-red-100 text-red-800';
//       case 'Medium': return 'bg-yellow-100 text-yellow-800';
//       case 'Low': return 'bg-green-100 text-green-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-3">
//       <div className="max-w-7xl mx-auto space-y-4">
//         {/* Compact Header */}
//         <div className="bg-white rounded-lg shadow-sm border p-4">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">HR Dashboard</h1>
//               <p className="text-sm text-gray-600">Monitor recruitment metrics and analytics</p>
//             </div>
            
//             {/* Compact Date Filter */}
//             <div className="relative">
//               <button
//                 onClick={() => setShowDatePicker(!showDatePicker)}
//                 className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
//               >
//                 <Calendar className="w-4 h-4" />
//                 <span>{getPresetLabel()}</span>
//                 {(startDate || endDate) && (
//                   <button
//                     onClick={e => {
//                       e.stopPropagation();
//                       clearDateFilter();
//                     }}
//                     className="text-indigo-200 hover:text-white ml-1"
//                   >
//                     <X className="w-3 h-3" />
//                   </button>
//                 )}
//               </button>

//               {showDatePicker && (
//                 <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl border p-4 z-50 w-72">
//                   <div className="flex items-center justify-between mb-3">
//                     <h3 className="font-semibold text-gray-900 text-sm">Filter by Date</h3>
//                     <button
//                       onClick={() => setShowDatePicker(false)}
//                       className="text-gray-400 hover:text-gray-600"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </div>
                  
//                   <div className="grid grid-cols-2 gap-2 mb-4">
//                     {[
//                       { key: 'all', label: 'All Time', action: () => setDateRangePreset(null, 'all') },
//                       { key: 'today', label: 'Today', action: () => setDateRangePreset(0, 'today') },
//                       { key: 'week', label: 'Last 7 Days', action: () => setDateRangePreset(6, 'week') },
//                       { key: 'month', label: 'Last 30 Days', action: () => setDateRangePreset(29, 'month') },
//                     ].map(preset => (
//                       <button
//                         key={preset.key}
//                         onClick={preset.action}
//                         className={`text-left p-2 text-xs rounded transition-colors ${
//                           selectedPreset === preset.key
//                             ? 'bg-indigo-100 text-indigo-700 font-medium'
//                             : 'hover:bg-gray-50 text-gray-700'
//                         }`}
//                       >
//                         {preset.label}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Compact Stats Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//           <StatCard title="Total Applications" count={totalApplications?.toLocaleString() || '0'} icon={Users} color="blue" />
//           <StatCard title="New Applications" count={newApplications?.toLocaleString() || '0'} icon={CheckCircle} color="green" />
//           <StatCard title="Hired" count={hired?.toLocaleString() || '0'} icon={Briefcase} color="purple" />
//           <StatCard title="Rejected" count={rejected?.toLocaleString() || '0'} icon={X} color="red" />
//         </div>

//         {/* Rest of your existing JSX */}
//         {/* ... */}
//       </div>
//     </div>
//   );
// }

// // Modal component
// function Modal({ children, onClose }) {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-4 border-b flex justify-between items-center">
//           <h3 className="text-lg font-semibold">Chart Details</h3>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <X className="w-5 h-5" />
//           </button>
//         </div>
//         <div className="p-6">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }

// // StatCard component
// function StatCard({ title, count, icon: Icon, color }) {
//   const colorMap = {
//     blue: 'bg-blue-100 text-blue-800',
//     green: 'bg-green-100 text-green-800',
//     purple: 'bg-purple-100 text-purple-800',
//     red: 'bg-red-100 text-red-800',
//     orange: 'bg-orange-100 text-orange-800',
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm border p-4">
//       <div className="flex justify-between items-start">
//         <div>
//           <p className="text-sm font-medium text-gray-500">{title}</p>
//           <p className="text-2xl font-semibold mt-1">{count}</p>
//         </div>
//         <div className={`p-2 rounded-lg ${colorMap[color]}`}>
//           <Icon className="w-5 h-5" />
//         </div>
//       </div>
//     </div>
//   );
// }
