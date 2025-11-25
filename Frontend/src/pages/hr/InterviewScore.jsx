import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../utils/api";

function BreakdownBar({ label, percent, color }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-xs text-gray-500">{percent.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}

const InterviewDetails = ({ candidate, onClose }) => {
  if (!candidate) return null;
  
  const breakdown = candidate.breakdown || {
    communication: Math.min(25, candidate.interviewScore * 0.4),
    technicalSkills: Math.min(25, candidate.interviewScore * 0.3),
    problemSolving: Math.min(25, candidate.interviewScore * 0.2),
    experience: Math.min(25, candidate.interviewScore * 0.1),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Interview Score</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {candidate.name}
              </h3>
              <p className="text-sm text-gray-500">{candidate.role || 'N/A'}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {candidate.interviewScore}%
              </div>
              <div className="text-sm text-gray-500">Overall Score</div>
            </div>
          </div>

          <div className="space-y-4">
            <BreakdownBar
              label="Communication"
              percent={breakdown.communication}
              color="bg-blue-500"
            />
            <BreakdownBar
              label="Technical Skills"
              percent={breakdown.technicalSkills}
              color="bg-green-500"
            />
            <BreakdownBar
              label="Problem Solving"
              percent={breakdown.problemSolving}
              color="bg-yellow-500"
            />
            <BreakdownBar
              label="Experience"
              percent={breakdown.experience}
              color="bg-purple-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const CandidateRow = ({
  candidate,
  index,
  onInterviewClick
}) => {
  return (
    <tr 
      className="border-b hover:bg-blue-50 transition duration-200 cursor-pointer"
      onClick={() => onInterviewClick(index)}
    >
      <td className="py-3 px-6 text-gray-900 whitespace-nowrap font-medium w-1/2">
        {candidate.name}
      </td>
      <td className="py-3 px-2 text-center w-32">
        <div className="flex justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInterviewClick(index);
            }}
            className={`px-3 py-1 rounded-full font-semibold text-sm outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 w-20 text-center
              ${
                candidate.interviewScore >= 80
                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                  : candidate.interviewScore >= 50
                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                  : "bg-red-100 text-red-800 hover:bg-red-200"
              }`}
          >
            {candidate.interviewScore}%
          </button>
        </div>
      </td>
      <td className="py-3 px-6 text-gray-600 text-right whitespace-nowrap w-1/4">
        {candidate.appliedDate}
      </td>
    </tr>
  );
};

const InterviewScore = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { jdId, jdTitle } = location.state || {};
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showInterviewDetails, setShowInterviewDetails] = useState(false);

  useEffect(() => {
    const fetchCandidatePerformance = async () => {
      if (!jdId) {
        setError("Job Description ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`http://13.203.246.229:8012/candidate-performance?jdId=${jdId}`);
        
        const formattedCandidates = response.data.map(candidate => ({
          id: candidate.candidate_id,
          name: candidate.candidate_name,
          role: jdTitle || "Candidate",
          employmentType: candidate.employment_type || "Full-time",
          workType: candidate.work_type || "On-site",
          appliedDate: new Date(candidate.applied_date).toLocaleDateString() || new Date().toLocaleDateString(),
          attachments: candidate.resume_url ? [candidate.resume_url.split('/').pop()] : [],
          status: candidate.status || "In-Review",
          score: candidate.overall_score || 0,
          interviewScore: candidate.interview_score || 0,
          experience: candidate.experience_years ? `${candidate.experience_years} years` : "Not specified",
          breakdown: {
            communication: candidate.communication_score || 0,
            technicalSkills: candidate.technical_score || 0,
            problemSolving: candidate.problem_solving_score || 0,
            experience: candidate.experience_score || 0
          }
        }));

        setCandidates(formattedCandidates);
      } catch (err) {
        console.error("Error fetching candidate performance:", err);
        setError("Failed to load candidate performance data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidatePerformance();
  }, [jdId, jdTitle]);

  const handleInterviewClick = (index) => {
    setSelectedCandidate(candidates[index]);
    setShowInterviewDetails(true);
    document.body.classList.add("overflow-hidden");
  };

  const handleCloseModal = () => {
    setShowInterviewDetails(false);
    setTimeout(() => document.body.classList.remove("overflow-hidden"), 300);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-700 font-medium">Loading candidate data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex justify-center items-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-blue-700">
                {jdTitle || 'Candidates'}
              </h1>
              {jdId && (
                <p className="text-gray-500 text-sm mt-1">
                  Job ID: {jdId}
                </p>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2"
                  >
                    Candidate
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32"
                  >
                    Score
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4"
                  >
                    Applied On
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {candidates.length > 0 ? (
                  candidates.map((candidate, index) => (
                    <CandidateRow
                      key={candidate.id}
                      candidate={candidate}
                      index={index}
                      onInterviewClick={handleInterviewClick}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                      No candidates found for this job posting.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showInterviewDetails && selectedCandidate && (
        <InterviewDetails
          candidate={selectedCandidate}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default InterviewScore;