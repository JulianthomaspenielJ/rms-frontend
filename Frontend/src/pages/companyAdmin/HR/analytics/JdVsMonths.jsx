import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', JDs: 30 },
  { name: 'Feb', JDs: 45 },
  { name: 'Mar', JDs: 50 },
  { name: 'Apr', JDs: 62 },
  { name: 'May', JDs: 58 },
  { name: 'Jun', JDs: 75 },
  { name: 'Jul', JDs: 80 },
  { name: 'Aug', JDs: 65 },
  { name: 'Sep', JDs: 70 },
  { name: 'Oct', JDs: 90 },
  { name: 'Nov', JDs: 85 },
  { name: 'Dec', JDs: 105 },
];

const JdVsMonths = () => {
  const [sortOrder, setSortOrder] = useState('default');

  const sortedData = useMemo(() => {
    switch (sortOrder) {
      case 'ascending':
        return [...data].sort((a, b) => a.JDs - b.JDs);
      case 'descending':
        return [...data].sort((a, b) => b.JDs - a.JDs);
      default:
        return data;
    }
  }, [sortOrder]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Job Descriptions vs. Months</h1>
        <div className="relative">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="appearance-none block w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-indigo-500"
          >
            <option value="default">Sort by Month</option>
            <option value="ascending">Sort by JDs (Asc)</option>
            <option value="descending">Sort by JDs (Desc)</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            margin={{
              top: 5,
              right: 30,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#6b7280" 
              tick={{ fontSize: '0.875rem' }}
              tickMargin={10}
            />
            <YAxis 
              stroke="#6b7280"
              tick={{ fontSize: '0.875rem' }}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.97)',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                padding: '0.75rem',
                fontSize: '0.875rem'
              }}
              itemStyle={{ color: '#1f2937' }}
              labelStyle={{ fontWeight: '600', marginBottom: '0.5rem' }}
            />
            <Legend 
              verticalAlign="top"
              height={36}
              iconSize={12}
              wrapperStyle={{
                paddingBottom: '1rem'
              }}
            />
            <Bar 
              dataKey="JDs" 
              fill="#4f46e5" 
              name="Job Descriptions Created" 
              radius={[4, 4, 0, 0]}
              barSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default JdVsMonths;
