import React, { useMemo } from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BaseBarChart = ({
  data = [],
  xKey = 'name',
  yKeys = [],
  colors = ['#4f46e5', '#10b981', '#06b6d4', '#f59e0b', '#ef4444'],
  layout = 'vertical',
  height = 300,
  showLegend = true,
  showGrid = true,
  stacked = false,
  barSize = 24,
  borderRadius = 6,
  tooltipFormatter,
  legendFormatter,
  xAxisProps = {},
  yAxisProps = {},
  barProps = {},
  children
}) => {
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return [...data];
  }, [data]);

  const renderBars = useMemo(() => {
    if (!yKeys.length) return null;
    
    return yKeys.map((key, index) => (
      <Bar
        key={key}
        dataKey={key}
        fill={colors[index % colors.length]}
        radius={[0, 0, borderRadius, borderRadius]}
        stackId={stacked ? 'stack' : undefined}
        barSize={barSize}
        {...barProps}
      />
    ));
  }, [yKeys, colors, stacked, barSize, barProps]);

  const renderXAxis = useMemo(() => {
    const commonProps = {
      axisLine: false,
      tickLine: false,
      tick: { fill: '#6b7280', fontSize: 12, fontWeight: 500 },
      ...xAxisProps
    };

    return layout === 'vertical' ? (
      <XAxis type="number" {...commonProps} />
    ) : (
      <XAxis dataKey={xKey} type="category" {...commonProps} />
    );
  }, [layout, xKey, xAxisProps]);

  const renderYAxis = useMemo(() => {
    const commonProps = {
      axisLine: false,
      tickLine: false,
      tick: { fill: '#6b7280', fontSize: 12, fontWeight: 500 },
      width: 80,
      ...yAxisProps
    };

    return layout === 'vertical' ? (
      <YAxis dataKey={xKey} type="category" {...commonProps} />
    ) : (
      <YAxis type="number" {...commonProps} />
    );
  }, [layout, xKey, yAxisProps]);

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No data available
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={chartData}
          layout={layout}
          margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={layout === 'vertical'} horizontal={layout !== 'vertical'} />}
          {renderXAxis}
          {renderYAxis}
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            formatter={tooltipFormatter}
          />
          {showLegend && (
            <Legend 
              formatter={legendFormatter}
              wrapperStyle={{ paddingTop: '1rem' }}
            />
          )}
          {renderBars}
          {children}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BaseBarChart;
