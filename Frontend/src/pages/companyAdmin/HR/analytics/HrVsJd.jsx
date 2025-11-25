import React, { useState, useMemo } from 'react';
import BaseBarChart from '../../../../components/charts/BaseBarChart';

const HR_COLORS = ['#6366f1', '#facc15', '#34d399', '#a78bfa', '#f472b6'];
const HR_AVATARS = [
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/68.jpg',
  'https://randomuser.me/api/portraits/men/76.jpg',
  'https://randomuser.me/api/portraits/women/12.jpg',
];

const defaultData = [
  { name: 'Alice Johnson', 'JDs Managed': 25, idx: 0, efficiency: 85 },
  { name: 'Bob Smith', 'JDs Managed': 35, idx: 1, efficiency: 78 },
  { name: 'Charlie Davis', 'JDs Managed': 28, idx: 2, efficiency: 92 },
  { name: 'Diana Wilson', 'JDs Managed': 42, idx: 3, efficiency: 88 },
  { name: 'Eve Brown', 'JDs Managed': 30, idx: 4, efficiency: 75 },
];

const HrVsJd = ({ mini, data: propData }) => {
  const chartData = propData && Array.isArray(propData) && propData.length > 0 ? propData : defaultData;
  const [sortOrder, setSortOrder] = useState('desc');

  const sortedData = useMemo(() => {
    const sorted = [...chartData].sort((a, b) => {
      if (a['JDs Managed'] < b['JDs Managed']) return sortOrder === 'asc' ? -1 : 1;
      if (a['JDs Managed'] > b['JDs Managed']) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [sortOrder, chartData]);

  const tooltipFormatter = (value, name, props) => {
    const hrData = props.payload;
    const avatar = HR_AVATARS[hrData.idx % HR_AVATARS.length];
    
    return [
      <div key="tooltip" className="flex flex-col gap-1 p-2">
        <div className="flex items-center gap-2 mb-1">
          <img src={avatar} alt={hrData.name} className="w-8 h-8 rounded-full border-2 border-white shadow" />
          <span className="font-semibold text-indigo-800">{hrData.name}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-gray-600">JDs Managed:</span>
          <span className="font-medium text-right">{hrData['JDs Managed']}</span>
          
          <span className="text-gray-600">Efficiency:</span>
          <span className="font-medium text-right">
            <span className={`font-bold ${hrData.efficiency > 80 ? 'text-green-500' : hrData.efficiency > 60 ? 'text-yellow-500' : 'text-red-500'}`}>
              {hrData.efficiency}%
            </span>
          </span>
        </div>
      </div>,
      'JDs Managed'
    ];
  };

  if (mini) {
    const hasData = sortedData.length > 0 && sortedData.some(d => d['JDs Managed'] > 0);
    
    if (!hasData) {
      return (
        <div className="w-full h-[200px] flex items-center justify-center bg-gradient-to-br from-yellow-50 to-indigo-50 rounded-lg shadow-inner">
          <span className="text-gray-400">No data available</span>
        </div>
      );
    }

    return (
      <div className="w-full h-[200px] bg-gradient-to-br from-yellow-50 to-indigo-50 rounded-lg shadow-inner overflow-hidden">
        <BaseBarChart
          data={sortedData}
          yKeys={['JDs Managed']}
          colors={HR_COLORS}
          height={200}
          showLegend={false}
          showGrid={true}
          layout="horizontal"
          barSize={16}
          tooltipFormatter={tooltipFormatter}
          barProps={{
            radius: [4, 4, 0, 0],
            isAnimationActive: true
          }}
          yAxisProps={{
            tick: { 
              fontSize: 12, 
              fill: '#6b7280', 
              fontWeight: 500 
            },
            axisLine: false,
            tickLine: false,
            width: 80
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          HR <span className="text-indigo-400">Workload</span>
        </h2>
        <div className="relative">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="appearance-none block bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 shadow text-sm"
          >
            <option value="desc">Most JDs First</option>
            <option value="asc">Least JDs First</option>
          </select>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-lg h-[calc(100%-3rem)]">
        <div className="h-full">
          <BaseBarChart
            data={sortedData}
            yKeys={['JDs Managed']}
            colors={HR_COLORS}
            height={400}
            showLegend={false}
            showGrid={true}
            layout="horizontal"
            barSize={28}
            tooltipFormatter={tooltipFormatter}
            barProps={{
              radius: [4, 4, 0, 0],
              isAnimationActive: true
            }}
            xAxisProps={{
              tick: { fontSize: 12, fill: '#6b7280', fontWeight: 500 },
              axisLine: false,
              tickLine: false
            }}
            yAxisProps={{
              tick: { 
                fontSize: 12, 
                fill: '#6b7280', 
                fontWeight: 500,
                // Remove the custom tick formatter as it can cause circular references
              },
              axisLine: false,
              tickLine: false,
              width: 160,
            }}
          />
          
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            {sortedData.slice(0, 5).map((hr, index) => (
              <div key={hr.name} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: HR_COLORS[index % HR_COLORS.length] }} />
                <span className="text-sm text-gray-600">{hr.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(HrVsJd);
