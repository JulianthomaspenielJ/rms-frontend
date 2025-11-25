import React from 'react';
import BaseBarChart from './BaseBarChart';

const JDTrendChart = ({ data = [], loading, mini }) => {
  if (loading) {
    return (
      <div className={mini ? "w-full h-[200px] bg-gradient-to-br from-indigo-100 to-yellow-100 rounded-xl animate-pulse" : "w-full h-48 bg-gradient-to-br from-indigo-100 to-yellow-100 rounded-xl animate-pulse"} />
    );
  }

  // Transform data to match expected format
  const chartData = React.useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map(item => ({
      name: item.name || item.month || '',
      JDs: item.value || 0,
      Applications: Math.round((item.value || 0) * 2.5), // Mock calculation
      Hires: Math.round((item.value || 0) * 0.3), // Mock calculation
      trend: item.trend || 0
    }));
  }, [data]);

  const tooltipFormatter = (value, name) => {
    switch (name) {
      case 'JDs':
        return [value, 'Job Descriptions'];
      case 'Applications':
        return [value, 'Applications'];
      case 'Hires':
        return [value, 'Hires'];
      default:
        return [value, name];
    }
  };

  if (mini) {
    const hasData = chartData.length > 0 && chartData.some(d => d.JDs > 0);
    
    if (!hasData) {
      return (
        <div className="w-full h-[200px] flex items-center justify-center bg-gradient-to-br from-indigo-50 to-yellow-50 rounded-lg shadow-inner">
          <span className="text-gray-400">No data available</span>
        </div>
      );
    }

    return (
      <div className="w-full h-[200px] bg-gradient-to-br from-indigo-50 to-yellow-50 rounded-lg shadow-inner overflow-hidden">
        <BaseBarChart
          data={chartData}
          xKey="name"
          yKeys={['JDs']}
          colors={['#6366f1']}
          height={200}
          showLegend={false}
          showGrid={true}
          tooltipFormatter={tooltipFormatter}
          barSize={20}
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
            tick: { fontSize: 12, fill: '#6b7280', fontWeight: 500 },
            axisLine: false,
            tickLine: false
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Job Descriptions <span className="text-indigo-400">Trend</span>
        </h2>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-lg h-[calc(100%-3rem)]">
        <BaseBarChart
          data={chartData}
          xKey="name"
          yKeys={['JDs', 'Applications', 'Hires']}
          colors={['#6366f1', '#10b981', '#f59e0b']}
          height={400}
          showLegend={true}
          showGrid={true}
          barSize={24}
          tooltipFormatter={tooltipFormatter}
          legendFormatter={(value) => {
            switch (value) {
              case 'JDs': return 'Job Descriptions';
              case 'Applications': return 'Applications';
              case 'Hires': return 'Hires';
              default: return value;
            }
          }}
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
            tick: { fontSize: 12, fill: '#6b7280', fontWeight: 500 },
            axisLine: false,
            tickLine: false
          }}
        />
      </div>
    </div>
  );
};

export default React.memo(JDTrendChart);