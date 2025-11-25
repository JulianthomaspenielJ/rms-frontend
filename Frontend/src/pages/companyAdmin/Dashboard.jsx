import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  CartesianGrid,
} from 'recharts';
import {
  Briefcase,
  Users,
  LayoutDashboard,
  FileText,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import BASE_URL from '../../utils/url';

const defaultMonthData = [];
const defaultHRData = [];
const defaultAppliedData = [];

const COLORS = ['#4f46e5', '#6366f1', '#a5b4fc'];

const AnalyticsCard = ({ title, data, dataKey, colors, icon: Icon }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const total = data.reduce((sum, item) => sum + (item[dataKey] || 0), 0);
  const average = data.length > 0 ? Math.round((total / data.length) * 100) / 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3 flex-1">
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
              <Icon size={20} />
            </div>
            <div>
              <h3 className="font-medium text-gray-700">{title}</h3>
              <p className="text-2xl font-bold text-indigo-600">{total}</p>
              <p className="text-sm text-gray-500">Avg: {average}</p>
            </div>
          </div>
          <button 
            className="expand-control p-1 hover:bg-gray-100 rounded"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 border-t border-gray-100">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={dataKey} name={title.split(' - ')[0]} fill="#4f46e5">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

const CompanyAdminDashboard = () => {
  const navigate = useNavigate();
  const [jdMonthData, setJdMonthData] = useState(defaultMonthData);
  const [jdHRData, setJdHRData] = useState(defaultHRData);
  const [jdAppliedData, setJdAppliedData] = useState(defaultAppliedData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No authentication token found');

        const res = await fetch(`${BASE_URL}/companies/analytics/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const json = await res.json();
        if (!res.ok || !json.ok) throw new Error(json.message || 'Failed to load dashboard');

        const { totals, graphs } = json.data || {};
        const { jdVsMonths = [], jdByHR = [], applicationsByDepartment = [] } = graphs || {};

        // Map backend to chart datasets
        const monthData = jdVsMonths.map(m => ({ name: m.month, JD_Month: m.jdCount }));
        const hrData = jdByHR.map(h => ({ name: h.name || h.hrId, JD_HR: h.count }));
        const appliedData = applicationsByDepartment.map(d => ({ name: d.name, JD_Applications: d.value }));

        setJdMonthData(monthData);
        setJdHRData(hrData);
        setJdAppliedData(appliedData);
      } catch (e) {
        setError(e.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);
  
  const analyticsCards = [
    {
      title: 'JD vs Month',
      data: jdMonthData,
      dataKey: 'JD_Month',
      colors: ['#4f46e5', '#60a5fa', '#6366f1', '#7c3aed', '#8b5cf6'],
      icon: BarChart2,
      route: '/company/analytics/jd-vs-months'
    },
    {
      title: 'JD by HR',
      data: jdHRData,
      dataKey: 'JD_HR',
      colors: ['#4f46e5', '#818cf8', '#a5b4fc'],
      icon: Users,
      route: '/company/analytics/hr-vs-jd'
    },
    {
      title: 'Applications by Role',
      data: jdAppliedData,
      dataKey: 'JD_Applications',
      colors: ['#4f46e5', '#818cf8', '#93c5fd', '#3b82f6', '#2563eb'],
      icon: FileText,
      route: '/company/analytics/applied-jd-vs-jd'
    }
  ];

  const handleCardClick = (route) => {
    console.log('Navigating to:', route); // Debug log
    navigate(route);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Analytics Dashboard</h1>
        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 text-red-600 text-sm">{error}</div>
        )}
        {loading && (
          <div className="mb-4 p-3 rounded bg-indigo-50 text-indigo-600 text-sm">Loading...</div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analyticsCards.map((card, index) => (
            <div 
              key={index} 
              className="cursor-pointer"
              onClick={() => handleCardClick(card.route)}
            >
              <AnalyticsCard
                title={card.title}
                data={card.data}
                dataKey={card.dataKey}
                colors={card.colors}
                icon={card.icon}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyAdminDashboard;