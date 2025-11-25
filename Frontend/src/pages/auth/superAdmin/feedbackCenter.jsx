import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, User, Building2, Users, Search } from 'lucide-react';
import BASE_URL from '../../../utils/url';

const FeedbackCenter = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch feedback data from API
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`${BASE_URL}/feedback/list`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch feedback');
        }

        const result = await response.json();
        if (result.ok) {
          // Map API response to match the component's expected data structure
          const mappedFeedbacks = result.data.feedbacks.map(feedback => ({
            id: feedback.id,
            userType: feedback.createdBy.includes('admin') ? 'company_admin' : 'candidate', // Adjust based on your API's user type logic
            userName: feedback.createdBy || 'Anonymous',
            company: feedback.createdBy.includes('admin') ? 'Unknown Company' : 'N/A', // Adjust as needed
            rating: feedback.ratings,
            category: feedback.feedbackStatus || 'General',
            subject: feedback.subject,
            message: feedback.message,
            timestamp: new Date(feedback.createdAt).toLocaleString('en-US', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
          }));
          setFeedbacks(mappedFeedbacks);
        } else {
          throw new Error(result.message || 'Error retrieving feedback');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const getUserTypeInfo = (userType) => {
    switch (userType) {
      case 'company_admin':
        return { icon: Building2, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Company Admin' };
      case 'candidate':
        return { icon: User, color: 'text-green-600', bg: 'bg-green-100', label: 'Candidate' };
      case 'hr':
        return { icon: Users, color: 'text-purple-600', bg: 'bg-purple-100', label: 'HR' };
      default:
        return { icon: User, color: 'text-gray-600', bg: 'bg-gray-100', label: 'User' };
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesUserType = filter === 'all' || feedback.userType === filter;
    const matchesSearch = searchTerm === '' || 
      feedback.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesUserType && matchesSearch;
  });

  const stats = {
    total: feedbacks.length,
    avgRating: feedbacks.length > 0 
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
      : 0,
    happyCustomers: feedbacks.filter(f => f.rating >= 4).length,
    byUserType: {
      company_admin: feedbacks.filter(f => f.userType === 'company_admin').length,
      candidate: feedbacks.filter(f => f.userType === 'candidate').length,
      hr: feedbacks.filter(f => f.userType === 'hr').length
    }
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Feedback Center</h1>
                <p className="text-gray-600">Manage feedback from all user types</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Average Rating</p>
                <div className="flex items-center space-x-1">
                  <span className="text-lg font-semibold text-gray-900">{stats.avgRating}</span>
                  <div className="flex">{renderStars(Math.round(stats.avgRating))}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="p-6 bg-gray-50 border-b border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Total Feedback</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium text-yellow-600">Happy Customers</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.happyCustomers}</p>
              <p className="text-xs text-gray-500 mt-1">4+ star ratings</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Company Admins</span>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.byUserType.company_admin}</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">Candidates</span>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.byUserType.candidate}</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">HR</span>
              </div>
              <p className="text-2xl font-bold text-purple-600 mt-1">{stats.byUserType.hr}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All User Types</option>
              <option value="company_admin">Company Admins</option>
              <option value="candidate">Candidates</option>
              <option value="hr">HR</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading feedback...</h3>
            <p className="text-gray-600">Please wait while we fetch the feedback data.</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <MessageSquare className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-900 mb-2">Error</h3>
            <p className="text-red-600">{error}</p>
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback found</h3>
            <p className="text-gray-600">No feedback matches your current filters.</p>
          </div>
        ) : (
          filteredFeedbacks.map(feedback => {
            const userTypeInfo = getUserTypeInfo(feedback.userType);
            const UserIcon = userTypeInfo.icon;

            return (
              <div
                key={feedback.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 transition-all hover:shadow-md"
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${userTypeInfo.bg}`}>
                      <UserIcon className={`w-5 h-5 ${userTypeInfo.color}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{feedback.subject}</h3>
                      
                      <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                        <span className="font-medium">{feedback.userName}</span>
                        <span className="text-gray-400">•</span>
                        <span className={userTypeInfo.color}>{userTypeInfo.label}</span>
                        {feedback.company !== 'N/A' && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span>{feedback.company}</span>
                          </>
                        )}
                        <span className="text-gray-400">•</span>
                        <span>{feedback.category}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-1">
                          {renderStars(feedback.rating)}
                          <span className="text-sm text-gray-600 ml-1">({feedback.rating}/5)</span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-500">{feedback.timestamp}</span>
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed">{feedback.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FeedbackCenter;