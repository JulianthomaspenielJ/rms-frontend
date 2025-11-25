import React, { useState } from 'react';
import { Headphones, User, Building2, Users, Clock, AlertTriangle, CheckCircle, MessageCircle, Search, Filter, Calendar, Phone, Mail, ExternalLink, FileText, Paperclip, ArrowRight, MoreHorizontal } from 'lucide-react';


const SupportCenter = () => {
  const [tickets, setTickets] = useState([
    {
      id: 'TCK-001',
      userType: 'company_admin',
      userName: 'John Mitchell',
      userEmail: 'john.mitchell@techcorp.com',
      company: 'Tech Corp',
      subject: 'Unable to Access Analytics Dashboard',
      category: 'Technical Issue',
      priority: 'high',
      status: 'open',
      description: 'Getting 500 error when trying to access the analytics dashboard. This is blocking our weekly reporting process. Need urgent assistance.',
      attachments: ['error_screenshot.png', 'browser_console.txt'],
      assignedTo: 'Sarah Wilson',
      createdAt: '2024-07-21 09:15',
      updatedAt: '2024-07-21 09:15',
      responseTime: null,
      resolutionTime: null,
      lastResponse: null,
      responseCount: 0,
      tags: ['analytics', 'dashboard', 'error-500'],
      channel: 'email'
    },
    {
      id: 'TCK-002',
      userType: 'candidate',
      userName: 'Alice Johnson',
      userEmail: 'alice.johnson@email.com',
      company: 'N/A',
      subject: 'Password Reset Not Working',
      category: 'Account Issue',
      priority: 'medium',
      status: 'in_progress',
      description: 'I have been trying to reset my password for the past 2 days but I am not receiving the reset email. I have checked spam folder as well.',
      attachments: [],
      assignedTo: 'Mike Davis',
      createdAt: '2024-07-20 16:30',
      updatedAt: '2024-07-21 08:45',
      responseTime: '2h 15m',
      resolutionTime: null,
      lastResponse: '2024-07-21 08:45',
      responseCount: 2,
      tags: ['password', 'reset', 'email'],
      channel: 'chat'
    },
    {
      id: 'TCK-003',
      userType: 'hr',
      userName: 'Emily Davis',
      userEmail: 'emily.davis@innovate.com',
      company: 'Innovate Solutions',
      subject: 'Bulk Candidate Import Feature Request',
      category: 'Feature Request',
      priority: 'low',
      status: 'pending',
      description: 'We need a feature to bulk import candidate profiles from CSV files. Currently doing this manually is very time-consuming for large hiring drives.',
      attachments: ['sample_candidate_data.csv'],
      assignedTo: null,
      createdAt: '2024-07-20 14:20',
      updatedAt: '2024-07-20 14:20',
      responseTime: null,
      resolutionTime: null,
      lastResponse: null,
      responseCount: 0,
      tags: ['bulk-import', 'csv', 'feature-request'],
      channel: 'portal'
    },
    {
      id: 'TCK-004',
      userType: 'candidate',
      userName: 'Michael Brown',
      userEmail: 'michael.brown@email.com',
      company: 'N/A',
      subject: 'Application Status Not Updating',
      category: 'Technical Issue',
      priority: 'medium',
      status: 'resolved',
      description: 'My application status for Software Engineer position at TechStart has been stuck on "Under Review" for 3 weeks. Can you please check?',
      attachments: [],
      assignedTo: 'Lisa Parker',
      createdAt: '2024-07-18 11:00',
      updatedAt: '2024-07-20 15:30',
      responseTime: '4h 30m',
      resolutionTime: '2d 4h 30m',
      lastResponse: '2024-07-20 15:30',
      responseCount: 3,
      tags: ['application-status', 'tracking'],
      channel: 'email'
    },
    {
      id: 'TCK-005',
      userType: 'company_admin',
      userName: 'David Wilson',
      userEmail: 'david.wilson@startup.com',
      company: 'StartUp Inc',
      subject: 'Integration with ATS System',
      category: 'Integration',
      priority: 'high',
      status: 'escalated',
      description: 'Need help integrating our existing ATS (Workday) with your platform. We have the API credentials but the connection keeps failing.',
      attachments: ['integration_logs.txt', 'api_credentials.pdf'],
      assignedTo: 'Technical Team',
      createdAt: '2024-07-19 10:15',
      updatedAt: '2024-07-21 07:30',
      responseTime: '1h 45m',
      resolutionTime: null,
      lastResponse: '2024-07-21 07:30',
      responseCount: 5,
      tags: ['integration', 'ats', 'workday', 'api'],
      channel: 'phone'
    },
    {
      id: 'TCK-006',
      userType: 'hr',
      userName: 'Lisa Anderson',
      userEmail: 'lisa.anderson@global.com',
      company: 'Global Corp',
      subject: 'Custom Report Generation Issue',
      category: 'Technical Issue',
      priority: 'medium',
      status: 'closed',
      description: 'Unable to generate custom reports with date range filters. The system shows loading spinner indefinitely.',
      attachments: ['report_config.json'],
      assignedTo: 'Tom Johnson',
      createdAt: '2024-07-17 09:00',
      updatedAt: '2024-07-19 16:45',
      responseTime: '30m',
      resolutionTime: '2d 7h 45m',
      lastResponse: '2024-07-19 16:45',
      responseCount: 4,
      tags: ['reports', 'filters', 'loading-issue'],
      channel: 'chat'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);

  const supportAgents = ['Sarah Wilson', 'Mike Davis', 'Lisa Parker', 'Tom Johnson', 'Technical Team'];

  const updateTicketStatus = (id, status, assignedTo = null) => {
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === id ? { 
          ...ticket, 
          status, 
          assignedTo: assignedTo || ticket.assignedTo,
          updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
        } : ticket
      )
    );
  };

  const assignTicket = (id, agent) => {
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === id ? { 
          ...ticket, 
          assignedTo: agent,
          status: ticket.status === 'pending' ? 'open' : ticket.status,
          updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
        } : ticket
      )
    );
  };

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

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Pending', icon: Clock };
      case 'open':
        return { color: 'text-blue-600', bg: 'bg-blue-100', label: 'Open', icon: MessageCircle };
      case 'in_progress':
        return { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'In Progress', icon: Clock };
      case 'escalated':
        return { color: 'text-red-600', bg: 'bg-red-100', label: 'Escalated', icon: AlertTriangle };
      case 'resolved':
        return { color: 'text-green-600', bg: 'bg-green-100', label: 'Resolved', icon: CheckCircle };
      case 'closed':
        return { color: 'text-gray-500', bg: 'bg-gray-50', label: 'Closed', icon: CheckCircle };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Unknown', icon: Clock };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'chat': return <MessageCircle className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'portal': return <ExternalLink className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesUserType = filter === 'all' || ticket.userType === filter;
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesSearch = searchTerm === '' || 
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesUserType && matchesStatus && matchesPriority && matchesSearch;
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => ['pending', 'open', 'in_progress'].includes(t.status)).length,
    escalated: tickets.filter(t => t.status === 'escalated').length,
    resolved: tickets.filter(t => ['resolved', 'closed'].includes(t.status)).length,
    avgResponseTime: '2h 45m',
    avgResolutionTime: '1d 6h',
    byUserType: {
      company_admin: tickets.filter(t => t.userType === 'company_admin').length,
      candidate: tickets.filter(t => t.userType === 'candidate').length,
      hr: tickets.filter(t => t.userType === 'hr').length
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
                <Headphones className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Support Center</h1>
                <p className="text-gray-600">Manage support tickets from all users</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Avg Response Time</p>
                <p className="text-lg font-semibold text-gray-900">{stats.avgResponseTime}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Avg Resolution Time</p>
                <p className="text-lg font-semibold text-gray-900">{stats.avgResolutionTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="p-6 bg-gray-50 border-b border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2">
                <Headphones className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Total</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Open</span>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.open}</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-red-600">Escalated</span>
              </div>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.escalated}</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">Resolved</span>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.resolved}</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Admins</span>
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
                placeholder="Search tickets..."
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

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="escalated">Escalated</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Priority</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Headphones className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No support tickets found</h3>
            <p className="text-gray-600">No tickets match your current filters.</p>
          </div>
        ) : (
          filteredTickets.map(ticket => {
            const userTypeInfo = getUserTypeInfo(ticket.userType);
            const statusInfo = getStatusInfo(ticket.status);
            const UserIcon = userTypeInfo.icon;
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={ticket.id}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 ${getPriorityColor(ticket.priority)} transition-all hover:shadow-md`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`p-2 rounded-lg ${userTypeInfo.bg}`}>
                        <UserIcon className={`w-5 h-5 ${userTypeInfo.color}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{ticket.subject}</h3>
                          <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">{ticket.id}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                          <span className="font-medium">{ticket.userName}</span>
                          <span className="text-gray-400">•</span>
                          <span className={userTypeInfo.color}>{userTypeInfo.label}</span>
                          {ticket.company !== 'N/A' && (
                            <>
                              <span className="text-gray-400">•</span>
                              <span>{ticket.company}</span>
                            </>
                          )}
                          <span className="text-gray-400">•</span>
                          <span>{ticket.category}</span>
                          <span className="text-gray-400">•</span>
                          <div className="flex items-center space-x-1">
                            {getChannelIcon(ticket.channel)}
                            <span className="capitalize">{ticket.channel}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 leading-relaxed mb-4 line-clamp-2">{ticket.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div>
                            <span className="font-medium">Created:</span> {ticket.createdAt}
                          </div>
                          <div>
                            <span className="font-medium">Updated:</span> {ticket.updatedAt}
                          </div>
                          {ticket.responseTime && (
                            <div>
                              <span className="font-medium">Response Time:</span> {ticket.responseTime}
                            </div>
                          )}
                          <div>
                            <span className="font-medium">Responses:</span> {ticket.responseCount}
                          </div>
                          {ticket.attachments.length > 0 && (
                            <div className="flex items-center space-x-1">
                              <Paperclip className="w-4 h-4" />
                              <span>{ticket.attachments.length} files</span>
                            </div>
                          )}
                        </div>

                        {ticket.tags.length > 0 && (
                          <div className="flex items-center space-x-2 mt-3">
                            {ticket.tags.map(tag => (
                              <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                        ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority
                      </span>
                      
                      {ticket.assignedTo && (
                        <span className="text-sm text-gray-600">
                          Assigned to: <span className="font-medium">{ticket.assignedTo}</span>
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {!ticket.assignedTo && (
                        <select
                          onChange={(e) => assignTicket(ticket.id, e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                          defaultValue=""
                        >
                          <option value="">Assign to...</option>
                          {supportAgents.map(agent => (
                            <option key={agent} value={agent}>{agent}</option>
                          ))}
                        </select>
                      )}
                      
                      {ticket.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateTicketStatus(ticket.id, 'open')}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => updateTicketStatus(ticket.id, 'escalated')}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                          >
                            Escalate
                          </button>
                        </>
                      )}
                      
                      {ticket.status === 'open' && (
                        <>
                          <button
                            onClick={() => updateTicketStatus(ticket.id, 'in_progress')}
                            className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
                          >
                            Start Work
                          </button>
                          <button
                            onClick={() => updateTicketStatus(ticket.id, 'resolved')}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                          >
                            Resolve
                          </button>
                        </>
                      )}
                      
                      {ticket.status === 'in_progress' && (
                        <>
                          <button
                            onClick={() => updateTicketStatus(ticket.id, 'escalated')}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                          >
                            Escalate
                          </button>
                          <button
                            onClick={() => updateTicketStatus(ticket.id, 'resolved')}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                          >
                            Resolve
                          </button>
                        </>
                      )}
                      
                      {ticket.status === 'resolved' && (
                        <button
                          onClick={() => updateTicketStatus(ticket.id, 'closed')}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                          Close
                        </button>
                      )}

                      <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
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

export default SupportCenter;