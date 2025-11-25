import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  currentPath: '/',
  previousPath: null,
  sidebarOpen: true,
  items: [],
  status: 'idle',
  error: null
};

// Async thunk for fetching navigation updates
export const fetchNavigationUpdates = createAsyncThunk(
  'navigation/fetchNavigationUpdates',
  async (_, { rejectWithValue }) => {
    try {
      // Replace this with your actual API call
      // const response = await fetch('/api/navigation');
      // const data = await response.json();
      // return data;
      
      // HR Dashboard Navigation Items
      return [
        { 
          id: 1, 
          path: '/hr/dashboard', 
          label: 'Dashboard', 
          icon: 'layout-dashboard',
          exact: true
        },
        { 
          id: 2, 
          path: '/hr/employees', 
          label: 'Employees', 
          icon: 'users',
          children: [
            { id: 21, path: '/hr/employees/list', label: 'All Employees', icon: 'list' },
            { id: 22, path: '/hr/employees/add', label: 'Add New', icon: 'user-plus' },
            { id: 23, path: '/hr/employees/leaves', label: 'Leaves', icon: 'calendar' },
          ]
        },
        { 
          id: 3, 
          path: '/hr/attendance', 
          label: 'Attendance', 
          icon: 'clock',
          children: [
            { id: 31, path: '/hr/attendance/daily', label: 'Daily Logs', icon: 'calendar-days' },
            { id: 32, path: '/hr/attendance/reports', label: 'Reports', icon: 'file-text' },
          ]
        },
        { 
          id: 4, 
          path: '/hr/payroll', 
          label: 'Payroll', 
          icon: 'credit-card',
          children: [
            { id: 41, path: '/hr/payroll/process', label: 'Process Payroll', icon: 'calculator' },
            { id: 42, path: '/hr/payroll/history', label: 'Payment History', icon: 'history' },
          ]
        },
        { 
          id: 5, 
          path: '/hr/recruitment', 
          label: 'Recruitment', 
          icon: 'briefcase',
          children: [
            { id: 51, path: '/hr/recruitment/jobs', label: 'Job Openings', icon: 'folder-plus' },
            { id: 52, path: '/hr/recruitment/candidates', label: 'Candidates', icon: 'users' },
            { id: 53, path: '/hr/recruitment/interviews', label: 'Interviews', icon: 'calendar' },
          ]
        },
        { 
          id: 6, 
          path: '/hr/analytics', 
          label: 'Analytics', 
          icon: 'bar-chart-2',
          children: [
            { id: 61, path: '/hr/analytics/employee', label: 'Employee Stats', icon: 'users' },
            { id: 62, path: '/hr/analytics/attendance', label: 'Attendance', icon: 'calendar' },
            { id: 63, path: '/hr/analytics/performance', label: 'Performance', icon: 'trending-up' },
          ]
        },
        { 
          id: 7, 
          path: '/hr/settings', 
          label: 'Settings', 
          icon: 'settings',
          children: [
            { id: 71, path: '/hr/settings/company', label: 'Company', icon: 'building' },
            { id: 72, path: '/hr/settings/departments', label: 'Departments', icon: 'sitemap' },
            { id: 73, path: '/hr/settings/roles', label: 'Roles & Permissions', icon: 'shield' },
          ]
        }
      ];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    updateNavigation: (state, action) => {
      state.previousPath = state.currentPath;
      state.currentPath = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNavigationUpdates.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNavigationUpdates.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchNavigationUpdates.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

// Selectors
export const selectAllNavigationItems = (state) => state.navigation.items;

export const { updateNavigation, toggleSidebar } = navigationSlice.actions;
export default navigationSlice.reducer;