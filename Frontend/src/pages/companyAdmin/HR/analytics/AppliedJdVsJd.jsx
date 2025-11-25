import React, { useState, useMemo } from 'react';
import BaseBarChart from '../../../../components/charts/BaseBarChart';

// const DEPT_ICONS = {
//   Engineering: '🛠️',
//   Marketing: '📢',
//   Sales: '💼',
//   HR: '👥',
//   Finance: '💰',
//   Operations: '⚙️',
//   Product: '📦',
// };

const COLORS = ['#6366f1', '#34d399', '#facc15', '#a78bfa', '#f472b6', '#60a5fa', '#f87171'];

const defaultData = [
  { name: 'C', 'Total JDs': 45, 'Applied JDs': 38 },
  { name: 'C++', 'Total JDs': 32, 'Applied JDs': 27 },
  { name: 'Java', 'Total JDs': 28, 'Applied JDs': 22 },
  { name: 'OOPS', 'Total JDs': 15, 'Applied JDs': 12 },
  { name: 'AIML', 'Total JDs': 20, 'Applied JDs': 18 },
  { name: 'DevOps', 'Total JDs': 25, 'Applied JDs': 20 },
  { name: 'Cloud', 'Total JDs': 18, 'Applied JDs': 15 },
];

const AppliedJdVsJd = ({ mini, data: propData }) => {
  const chartData = propData && Array.isArray(propData) && propData.length > 0 ? propData : defaultData;
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('desc');

  const sortedData = useMemo(() => {
    const sorted = [...chartData].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [sortKey, sortOrder, chartData]);

  const tooltipFormatter = (value, name, props) => {
    if (name === 'Total JDs') {
      return [value, 'Total JDs'];
    }
    if (name === 'Applied JDs') {
      return [value, 'Received Resumes'];
    }
    return [value, name];
  };

  if (mini) {
    const hasData = sortedData.length > 0 && sortedData.some(d => d['Total JDs'] > 0 || d['Applied JDs'] > 0);
    
    if (!hasData) {
      return (
        <div className="w-full h-[200px] flex items-center justify-center bg-gradient-to-br from-green-50 to-indigo-50 rounded-lg shadow-inner">
          <span className="text-gray-400">No data available</span>
        </div>
      );
    }

    return (
      <div className="w-full h-[200px] bg-gradient-to-br from-green-50 to-indigo-50 rounded-lg shadow-inner overflow-hidden">
        <BaseBarChart
          data={sortedData}
          yKeys={['Total JDs', 'Applied JDs']}
          colors={['#a5b4fc', '#4f46e5']}
          height={200}
          showLegend={false}
          showGrid={true}
          layout="vertical"
          barGap={4}
          barSize={12}
          tooltipFormatter={tooltipFormatter}
          barProps={{
            radius: [0, 4, 4, 0],
            isAnimationActive: true
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Job Descriptions <span className="text-indigo-400">by Department</span>
        </h2>
        <div className="flex items-center space-x-2">
          <select 
            onChange={(e) => setSortKey(e.target.value)} 
            value={sortKey}
            className="appearance-none block bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 shadow text-sm"
          >
            <option value="name">Department</option>
            <option value="Total JDs">Total JDs</option>
            <option value="Applied JDs">Applied JDs</option>
          </select>
          <select 
            onChange={(e) => setSortOrder(e.target.value)} 
            value={sortOrder}
            className="appearance-none block bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 shadow text-sm"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-lg h-[calc(100%-3rem)]">
        <div className="h-full">
          <BaseBarChart
            data={sortedData}
            yKeys={['Total JDs', 'Applied JDs']}
            colors={['#a5b4fc', '#4f46e5']}
            height={400}
            showLegend={true}
            showGrid={true}
            layout="vertical"
            barGap={8}
            barSize={24}
            tooltipFormatter={tooltipFormatter}
            legendFormatter={(value) => {
              if (value === 'Total JDs') return 'Total Job Descriptions';
              if (value === 'Applied JDs') return 'Applied Job Descriptions';
              return value;
            }}
            barProps={{
              radius: [0, 4, 4, 0],
              isAnimationActive: true
            }}
            xAxisProps={{
              tick: { fontSize: 12, fill: '#6b7280', fontWeight: 500 },
              axisLine: false,
              tickLine: false,
              interval: 0
            }}
            yAxisProps={{
              tick: { fontSize: 12, fill: '#6b7280', fontWeight: 500 },
              axisLine: false,
              tickLine: false,
              width: 120,
              // tickFormatter: (value) => {
              //   const icon = DEPT_ICONS[value] || '🏢';
              //   return `${icon} ${value}`;
              // }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(AppliedJdVsJd);
