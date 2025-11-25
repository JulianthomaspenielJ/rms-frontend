import React from 'react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const HRPerformanceBar = ({ data, loading }) => {
  if (loading) return <div className="w-full h-48 bg-gray-100 rounded animate-pulse" />;
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="horizontal">
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis type="number" tick={{ fontSize: 12, fill: '#6b7280' }} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} width={80} />
        <Tooltip />
        <Bar dataKey="hired" fill="#10b981" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default React.memo(HRPerformanceBar); 