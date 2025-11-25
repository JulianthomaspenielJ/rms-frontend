import { useState, useEffect, useCallback } from 'react';
import { MOCK_DASHBOARD_DATA } from '../constants/dashboardData';

// Transform data to match our unified structure
const transformDashboardData = (data) => ({
  jdTrends: data.jdVsMonths?.map(month => ({
    month: month.name,
    jdCount: month.value,
    applications: Math.round(month.value * 2.5), // Mock calculation
    hires: Math.round(month.value * 0.3), // Mock calculation
    trend: month.trend
  })) || [],
  
  departmentStats: data.appliedJobs?.map(dept => ({
    name: dept.name,
    totalJds: dept.value,
    appliedJds: Math.round(dept.value * 0.85), // Mock calculation
    openPositions: Math.round(dept.value * 0.4), // Mock calculation
    filledPositions: Math.round(dept.value * 0.3) // Mock calculation
  })) || [],
  
  hrPerformance: data.hrPerformance?.map(hr => ({
    name: hr.name,
    jdsManaged: hr.processed,
    applicationsProcessed: hr.processed * 3, // Mock calculation
    hires: hr.hired,
    efficiency: hr.efficiency,
    avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(hr.name)}`
  })) || []
});

const useAnalyticsData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // In a real app, this would be an API call
      // const response = await fetch('/api/analytics');
      // const result = await response.json();
      
      // Using mock data for now
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
      const result = MOCK_DASHBOARD_DATA;
      
      setData(transformDashboardData(result));
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError(err.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    // Set up polling in a real app
    // const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    // return () => clearInterval(interval);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh: fetchData
  };
};

export default useAnalyticsData;
