import api from '../utils/api';

// Dashboard API service functions
export const dashboardService = {
  // Get overall dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await api.get('/hr/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get applications over time data
  getApplicationsOverTime: async (params = {}) => {
    try {
      const response = await api.get('/hr/dashboard/applications-over-time', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching applications over time:', error);
      throw error;
    }
  },

  // Get applications by department
  getApplicationsByDepartment: async () => {
    try {
      const response = await api.get('/hr/dashboard/applications-by-department');
      return response.data;
    } catch (error) {
      console.error('Error fetching applications by department:', error);
      throw error;
    }
  },

  // Get application sources data
  getApplicationSources: async () => {
    try {
      const response = await api.get('/hr/dashboard/application-sources');
      return response.data;
    } catch (error) {
      console.error('Error fetching application sources:', error);
      throw error;
    }
  },

  // Get open positions data
  getOpenPositions: async () => {
    try {
      const response = await api.get('/hr/dashboard/open-positions');
      return response.data;
    } catch (error) {
      console.error('Error fetching open positions:', error);
      throw error;
    }
  }
};

export default dashboardService;
