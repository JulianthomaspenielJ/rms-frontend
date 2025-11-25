export const MOCK_DASHBOARD_DATA = {
  jdVsMonths: [
    { name: 'Jan', value: 45, trend: 12 },
    { name: 'Feb', value: 52, trend: 15 },
    { name: 'Mar', value: 38, trend: -8 },
    { name: 'Apr', value: 61, trend: 23 },
    { name: 'May', value: 55, trend: -6 },
    { name: 'Jun', value: 67, trend: 12 },
  ],
  appliedJobs: [
    { name: 'Software Engineer', value: 28, color: '#4f46e5' },
    { name: 'Data Analyst', value: 19, color: '#06b6d4' },
    { name: 'Product Manager', value: 15, color: '#10b981' },
    { name: 'UI/UX Designer', value: 12, color: '#f59e0b' },
    { name: 'DevOps Engineer', value: 8, color: '#ef4444' },
  ],
  hrPerformance: [
    { name: 'Alice Johnson', processed: 45, hired: 12, efficiency: 85 },
    { name: 'Bob Smith', processed: 38, hired: 9, efficiency: 78 },
    { name: 'Carol Davis', processed: 52, hired: 15, efficiency: 92 },
    { name: 'David Wilson', processed: 31, hired: 7, efficiency: 71 },
  ],
  summary: {
    totalJobs: 234,
    activeApplications: 87,
    interviewsScheduled: 23,
    offersExtended: 12
  }
};

export const CHART_COLORS = {
  primary: '#4f46e5',
  secondary: '#10b981',
  accent: '#06b6d4',
  warning: '#f59e0b',
  danger: '#ef4444',
}; 