// import React from 'react';

// const Notifications = () => {
//   return (
//     <div className="flex-1 p-6">
//       <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
//       <p className="mt-2 text-gray-600">This is the notifications page. Content to be added soon.</p>
//     </div>
//   );
// };

// export default Notifications; 
import React, { useState } from 'react';
import { Bell, Briefcase, Users, Eye, Clock, CheckCircle, X } from 'lucide-react';

const Notifications =  () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'new_jd',
      title: 'New Job Description Created',
      message: 'Senior Frontend Developer position has been posted',
      jobTitle: 'Senior Frontend Developer',
      department: 'Engineering',
      timestamp: '2 minutes ago',
      isRead: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'new_application',
      title: 'New Application Received',
      message: 'John Smith applied for Backend Engineer position',
      jobTitle: 'Backend Engineer',
      applicantName: 'John Smith',
      timestamp: '5 minutes ago',
      isRead: false,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'new_application',
      title: 'New Application Received',
      message: 'Sarah Johnson applied for UX Designer position',
      jobTitle: 'UX Designer',
      applicantName: 'Sarah Johnson',
      timestamp: '15 minutes ago',
      isRead: false,
      priority: 'medium'
    },
    {
      id: 4,
      type: 'new_jd',
      title: 'New Job Description Created',
      message: 'Product Manager position has been posted',
      jobTitle: 'Product Manager',
      department: 'Product',
      timestamp: '1 hour ago',
      isRead: true,
      priority: 'medium'
    },
    {
      id: 5,
      type: 'new_application',
      title: 'New Application Received',
      message: 'Michael Brown applied for Data Scientist position',
      jobTitle: 'Data Scientist',
      applicantName: 'Michael Brown',
      timestamp: '2 hours ago',
      isRead: true,
      priority: 'low'
    },
    {
      id: 6,
      type: 'new_application',
      title: 'New Application Received',
      message: 'Emily Davis applied for Senior Frontend Developer position',
      jobTitle: 'Senior Frontend Developer',
      applicantName: 'Emily Davis',
      timestamp: '3 hours ago',
      isRead: false,
      priority: 'high'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.isRead;
    return notif.type === filter;
  });

  const getIcon = (type) => {
    return type === 'new_jd' ? <Briefcase className="w-5 h-5" /> : <Users className="w-5 h-5" />;
  };

  const getIconBg = (type, priority) => {
    if (type === 'new_jd') {
      return priority === 'high' ? 'bg-blue-100 text-blue-600' : 'bg-blue-50 text-blue-500';
    }
    return priority === 'high' ? 'bg-green-100 text-green-600' : 'bg-green-50 text-green-500';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-gray-400';
      default: return 'border-l-gray-300';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Notification Center</h1>
                <p className="text-gray-600">Stay updated with job postings and applications</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                  {unreadCount} unread
                </span>
              )}
              <button 
                onClick={markAllAsRead}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Mark all as read
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 bg-gray-50 border-b border-gray-100">
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All', count: notifications.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'new_jd', label: 'Job Postings', count: notifications.filter(n => n.type === 'new_jd').length },
              { key: 'new_application', label: 'Applications', count: notifications.filter(n => n.type === 'new_application').length }
            ].map(item => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === item.key
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label} ({item.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-600">You're all caught up! New notifications will appear here.</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 ${getPriorityColor(notification.priority)} transition-all hover:shadow-md ${
                !notification.isRead ? 'bg-blue-50/30' : ''
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex space-x-4 flex-1">
                    <div className={`p-2 rounded-lg ${getIconBg(notification.type, notification.priority)}`}>
                      {getIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`text-sm font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{notification.timestamp}</span>
                        </div>
                        
                        {notification.type === 'new_jd' && notification.department && (
                          <div className="flex items-center space-x-1">
                            <Briefcase className="w-3 h-3" />
                            <span>{notification.department}</span>
                          </div>
                        )}
                        
                        {notification.type === 'new_application' && (
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>Job: {notification.jobTitle}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Mark as read"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete notification"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats Summary */}
      {filteredNotifications.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Job Postings</span>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {notifications.filter(n => n.type === 'new_jd').length}
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">Applications</span>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {notifications.filter(n => n.type === 'new_application').length}
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-yellow-900">Unread</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {unreadCount}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications