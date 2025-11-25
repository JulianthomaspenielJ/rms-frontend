import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import './JobCategoryPie.css';

const renderCustomLabel = ({ name, percent, x, y, fill }) => {
  return (
    <text
      x={x}
      y={y}
      fill={fill}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={14}
      fontWeight="bold"
      className="pie-label"
    >
      {`${name}: ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <span className="tooltip-title">{name}</span>
        <span className="tooltip-value">{value}</span>
      </div>
    );
  }
  return null;
};

const JobCategoryPie = ({ data, loading }) => {
  if (loading) return <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow animate-pulse" />;
  return (
    <div className="pie-card-container">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={renderCustomLabel}
            labelLine={false}
            stroke="#fff"
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`url(#pieGradient${index})`}
              />
            ))}
          </Pie>
          {/* Gradients for each slice */}
          <defs>
            {data.map((entry, index) => (
              <linearGradient id={`pieGradient${index}`} key={index} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={entry.color} stopOpacity={0.8} />
                <stop offset="100%" stopColor={entry.color} stopOpacity={0.5} />
              </linearGradient>
            ))}
          </defs>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(JobCategoryPie);