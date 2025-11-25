import { HomeIcon, ProfileIcon, ManageHrIcon, AnalyticsIcon, ChartBarIcon, DocumentChartBarIcon, UserGroupIcon, SettingsIcon, ManageJDIcon } from '../components/icons/Icons';

export const NAVIGATION_ITEMS = [
  { to: '/hr-dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/profile', label: 'Profile', icon: ProfileIcon },
  { to: '/manage-hr', label: 'Manage HR', icon: ManageHrIcon },
  { to: '/manage-jd', label: 'Manage JD', icon: ManageJDIcon },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

export const ANALYTICS_SUBITEMS = [
  { to: '/analytics/jd-vs-months', label: 'JD vs Months', icon: ChartBarIcon },
  { to: '/analytics/applied-jd-vs-jd', label: 'Applied vs JD', icon: DocumentChartBarIcon },
  { to: '/analytics/hr-vs-jd', label: 'HR vs JD', icon: UserGroupIcon },
]; 