import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../utils/api';
import { Eye, CalendarCheck2, Users, Search, Filter, MoreVertical } from 'lucide-react';

// Verification Modal for Schedule Interview
const ScheduleModal = ({ selectedIds, onClose, candidates = [] }) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const selectedCandidates = candidates.filter(candidate => 
    selectedIds.includes(candidate.id)
  );

  const handleConfirmSchedule = async () => {
    setIsConfirming(true);
    
    try {
      // Get selected candidate emails
      const candidateEmails = selectedCandidates.map(candidate => candidate.email);

      // Get HR user ID from localStorage or context
      const hrId = localStorage.getItem('userId');
      if (!hrId) {
        throw new Error('HR user ID not found. Please log in again.');
      }

      // Call the schedule interview API
      const response = await fetch('http://localhost:4000/api/hr/schedule-interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          hrId: hrId,
          candidateEmails: candidateEmails
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to schedule interviews');
      }

      // Handle successful scheduling
      if (data.ok) {
        // Show success message with details
        const successCount = data.results.filter(r => r.success).length;
        const failedCount = data.results.length - successCount;
        
        let message = `Successfully scheduled interviews for ${successCount} candidates.`;
        
        // Show temporary passwords if needed
        const successResults = data.results.filter(r => r.success);
        if (successResults.length > 0) {
          message += '\n\nTemporary passwords have been generated:';
          successResults.forEach(result => {
            message += `\n${result.email}: ${result.temporaryPassword}`;
          });
        }
        
        if (failedCount > 0) {
          message += `\n\nFailed to schedule ${failedCount} candidates.`;
        }
        
        alert(message);
        onClose();
        
        // Optionally refresh the candidate list or update UI
        // You can add a callback prop to refresh parent component data
        if (typeof onScheduleSuccess === 'function') {
          onScheduleSuccess();
        }
      } else {
        throw new Error(data.message || 'Failed to schedule interviews');
      }
    } catch (error) {
      console.error('Error scheduling interviews:', error);
      alert(`Error: ${error.message || 'Failed to schedule interviews. Please try again.'}`);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center mb-4">
          <div className="bg-yellow-100 rounded-full p-2 mr-3">
            <CalendarCheck2 className="text-yellow-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Confirm Interview Scheduling
          </h3>
        </div>

        {/* Confirmation Message */}
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to schedule interviews for the following {selectedIds.length} candidate{selectedIds.length > 1 ? 's' : ''}?
          </p>
          
          {/* Candidate List */}
          <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Selected Candidates:</h4>
            <div className="space-y-2">
              {selectedCandidates.map((candidate) => (
                <div key={candidate.id} className="flex items-center justify-between bg-white rounded p-3 border border-gray-200">
                  <div>
                    <div className="font-medium text-gray-900">{candidate.name}</div>
                    <div className="text-sm text-gray-500">{candidate.position}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      Score: {candidate.screeningScore}/100
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${statusConfig[candidate.status].bg} ${statusConfig[candidate.status].text}`}>
                      {candidate.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Warning/Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-800">Important Notes:</h4>
              <div className="mt-1 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Interview invitations will be sent automatically via email</li>
                  <li>Candidates will receive calendar invites with meeting details</li>
                  <li>Status will be updated to "Scheduled L1" after confirmation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isConfirming}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmSchedule}
            disabled={isConfirming}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isConfirming ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Scheduling...</span>
              </>
            ) : (
              <>
                <CalendarCheck2 size={16} />
                <span>Confirm & Schedule</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Candidates will be fetched from the API

const statusConfig = {
  'New': { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-400' },
  'Under Validation': { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
  'Waiting to Schedule L1': { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
  'Scheduled L1': { bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-500' },
  'Completed L1': { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
};

const CandidateManagement = () => {
  const { jdId } = useParams();
  console.log(jdId);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [jdTitle, setJdTitle] = useState('Senior Software Engineer - React/Node.js');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await api.get(`http://13.203.246.229:8012/candidates/by-jd?jdId=${jdId}`);
        // Map the API response to match the expected format
        const formattedCandidates = response.data.map((candidate, index) => ({
          id: candidate.candidateId,
          name: candidate.email.split('@')[0], // Using email prefix as name
          email: candidate.email,
          phone: candidate.phone,
          screeningScore: candidate.analysisScore,
          status: 'New', // Default status
          appliedDate: new Date().toISOString().split('T')[0], // Today's date as applied date
          position: jdTitle // Using the JD title as position
        }));
        setCandidates(formattedCandidates);
      } catch (err) {
        console.error('Error fetching candidates:', err);
        setError('Failed to fetch candidates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (jdId) {
      fetchCandidates();
    }
  }, [jdId, jdTitle]);

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const eligibleCandidates = filteredCandidates.filter(candidate => isEligible(candidate.status));
    const allEligibleIds = eligibleCandidates.map(c => c.id);
    
    if (selectedIds.length === allEligibleIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allEligibleIds);
    }
  };

  const isEligible = (status) => status === 'Waiting to Schedule L1';

  // Enhanced filtering logic
  const filteredCandidates = candidates.filter(candidate => {
    // Search filter
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
    
    // Position filter
    const matchesPosition = positionFilter === 'all' || candidate.position === positionFilter;
    
    // Score filter
    let matchesScore = true;
    if (scoreFilter !== 'all') {
      const score = candidate.screeningScore || candidate.interviewScore;
      switch (scoreFilter) {
        case 'excellent':
          matchesScore = score >= 90;
          break;
        case 'good':
          matchesScore = score >= 75 && score < 90;
          break;
        case 'average':
          matchesScore = score >= 60 && score < 75;
          break;
        case 'below-average':
          matchesScore = score < 60;
          break;
        case 'not-scored':
          matchesScore = !score;
          break;
        default:
          matchesScore = true;
      }
    }
    
    // Date filter
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const appliedDate = new Date(candidate.appliedDate);
      const today = new Date();
      const daysDiff = Math.floor((today - appliedDate) / (1000 * 60 * 60 * 24));
      
      switch (dateFilter) {
        case 'today':
          matchesDate = daysDiff === 0;
          break;
        case 'week':
          matchesDate = daysDiff <= 7;
          break;
        case 'month':
          matchesDate = daysDiff <= 30;
          break;
        case 'quarter':
          matchesDate = daysDiff <= 90;
          break;
        default:
          matchesDate = true;
      }
    }
    
    return matchesSearch && matchesStatus && matchesPosition && matchesScore && matchesDate;
  });

  const eligibleCount = filteredCandidates.filter(c => isEligible(c.status)).length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Candidate Management</h1>
            <div className="mt-1">
              <span className="text-gray-600">Job Title: </span>
              <span className="font-medium text-gray-800">{jdTitle}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users size={16} />
            <span>{filteredCandidates.length} of {candidates.length} candidates</span>
            {(statusFilter !== 'all' || positionFilter !== 'all' || scoreFilter !== 'all' || dateFilter !== 'all') && (
              <span className="text-indigo-600 font-medium">(filtered)</span>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by candidate name, position, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900 flex items-center">
              <Filter size={16} className="mr-2" />
              Filter Candidates
            </h3>
            <button
              onClick={() => {
                setStatusFilter('all');
                setPositionFilter('all');
                setScoreFilter('all');
                setDateFilter('all');
              }}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Clear All Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter - Hidden
            <div className="hidden">
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                {Object.keys(statusConfig).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Position Filter - Hidden
            <div className="hidden">
              <label className="block text-xs font-medium text-gray-700 mb-1">Position</label>
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Positions</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
              </select>
            </div>

            {/* Score Range Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Score Range</label>
              <select
                value={scoreFilter}
                onChange={(e) => setScoreFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Scores</option>
                <option value="excellent">Excellent (90-100)</option>
                <option value="good">Good (75-89)</option>
                <option value="average">Average (60-74)</option>
                <option value="below-average">Below Average (&lt;60)</option>
                <option value="not-scored">Not Scored</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Applied Date</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display - Only showing score and date filters */}
          {(scoreFilter !== 'all' || dateFilter !== 'all') && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-gray-700">Active Filters:</span>
                {/* Status and Position filters hidden from active filters */}
                {scoreFilter !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Score: {scoreFilter}
                    <button
                      onClick={() => setScoreFilter('all')}
                      className="ml-1 text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {dateFilter !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    Date: {dateFilter}
                    <button
                      onClick={() => setDateFilter('all')}
                      className="ml-1 text-orange-600 hover:text-orange-800"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 rounded-full p-2">
                <CalendarCheck2 className="text-indigo-600" size={16} />
              </div>
              <div>
                <p className="font-medium text-indigo-900">
                  {selectedIds.length} candidate{selectedIds.length > 1 ? 's' : ''} selected
                </p>
                <p className="text-sm text-indigo-700">Ready to schedule interviews</p>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
              <CalendarCheck2 size={16} />
              <span>Schedule Interviews</span>
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === eligibleCount && eligibleCount > 0}
                    onChange={handleSelectAll}
                    disabled={eligibleCount === 0}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                {/* Status column commented out
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Screening Score
                </th>
                {/* Interview Score column commented out
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interview Score
                </th>
                */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
                {/* Actions column commented out
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCandidates.map((candidate) => {
                const statusStyle = statusConfig[candidate.status];
                return (
                  <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* {isEligible(candidate.status) ? ( */}
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(candidate.id)}
                          onChange={() => handleCheckboxChange(candidate.id)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      {/* // ) : (
                      //   <span className="text-gray-400">—</span>
                      // )} */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                        {/* Position hidden
                        <div className="text-sm text-gray-500">{candidate.position}</div>
                        */}
                      </div>
                    </td>
                    {/* Status cell commented out
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full ${statusStyle.dot} mr-2`}></div>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                          {candidate.status}
                        </span>
                      </div>
                    </td>
                    */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {/* {['Waiting to Schedule L1', 'Scheduled L1', 'Completed L1'].includes(candidate.status) && candidate.screeningScore
                        ? ( */}
                          <div className="flex items-center">
                            <span className="font-medium">{candidate.screeningScore}</span>
                            <span className="text-gray-400 ml-1">/100</span>
                          </div>
                        {/* )
                        : <span className="text-gray-400">—</span>} */}
                    </td>
                    {/* Interview Score cell commented out
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {candidate.status === 'Completed L1' && candidate.interviewScore ? (
                        <div className="flex items-center">
                          <span className="font-medium">{candidate.interviewScore}</span>
                          <span className="text-gray-400 ml-1">/100</span>
                        </div>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(candidate.appliedDate).toLocaleDateString()}
                    </td>
                    {/* Actions cell commented out
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900 flex items-center space-x-1 transition-colors">
                          <Eye size={16} />
                          <span>View</span>
                        </button>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                    */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredCandidates.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No candidates found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding some candidates.'}
            </p>
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      {isModalOpen && (
        <ScheduleModal 
          selectedIds={selectedIds} 
          onClose={() => setIsModalOpen(false)}
          candidates={candidates}
        />
      )}
    </div>
  );
};

export default CandidateManagement;