import React, { useMemo } from 'react';
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BaseAreaChart = ({
  data = [],
  xKey = 'name',
  yKeys = [],
  colors = ['#4f46e5', '#10b981', '#06b6d4', '#f59e0b', '#ef4444'],
  height = 300,
  showLegend = true,
  showGrid = true,
  stacked = false,
  tooltipFormatter,
  legendFormatter,
  xAxisProps = {
    angle: -25,                // Tilt labels for better readability
    textAnchor: 'end',         // Anchor text to the end
    interval: 0,               // Show all labels
    minTickGap: 10,            // Minimum gap between ticks
    tickMargin: 10,            // Add some margin to prevent text cutoff
    height: 60,                // Increase height to accommodate rotated labels
    ...xAxisProps              // Allow overrides from props
  },
  yAxisProps = {},
  areaProps = {},
  children,
  ...rest
}) => {
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return [...data];
  }, [data]);

  const renderAreas = useMemo(() => {
    if (!yKeys.length) return null;
    
    return yKeys.map((key, index) => {
      const gradientId = `areaGradient-${key}`;
      const color = colors[index % colors.length];
      
      return (
        <defs key={gradientId}>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
            <stop offset="95%" stopColor={color} stopOpacity={0.05}/>
          </linearGradient>
        </defs>
      );
    }).concat(
      yKeys.map((key, index) => {
        const gradientId = `areaGradient-${key}`;
        const color = colors[index % colors.length];
        
        return (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stroke={color}
            fillOpacity={1}
            fill={`url(#${gradientId})`}
            strokeWidth={2}
            activeDot={{ r: 6, stroke: color, strokeWidth: 2, fill: '#fff' }}
            connectNulls
            stackId={stacked ? 'stack' : undefined}
            {...areaProps}
          />
        );
      })
    );
  }, [yKeys, colors, stacked, areaProps]);

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
        <RechartsAreaChart
          data={chartData}
          margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
          {...rest}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />}
          <XAxis 
            dataKey={xKey}
            axisLine={false}
            tickLine={false}
            tick={{
              fill: '#6b7280',
              fontSize: 12,
              fontWeight: 500,
              ...(xAxisProps.tick || {})  // Allow tick props to be overridden
            }}
            {...xAxisProps}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
            width={60}
            {...yAxisProps}
          />
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
          {renderAreas}
          {children}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BaseAreaChart;
