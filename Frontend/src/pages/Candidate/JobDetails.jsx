import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../common/Header.jsx';
import Footer from '../common/Footer.jsx';
import '../../index.css';

// Candidates data (should match InterviewReports.jsx)
const candidates = [
  { name: "Sophia Turner", role: "Legal Advisor", employmentType: "Full-time", workType: "Hybrid", appliedDate: "22-07-2025", attachments: ["Resume", "Cover Letter"], status: "Interview", score: 70, interviewScore: 67 },
  { name: "Lucas Green", role: "Software Developer", employmentType: "Full-time", workType: "Remote", appliedDate: "22-07-2025", attachments: ["Resume", "Portfolio"], status: "In-Review", score: 30, interviewScore: 25 },
  { name: "Olivia Smith", role: "HR Manager", employmentType: "Full-time", workType: "Hybrid", appliedDate: "22-07-2025", attachments: ["Resume", "Certifications"], status: "Hired", score: 100, interviewScore: 98 },
  { name: "Ethan Taylor", role: "Network Engineer", employmentType: "Full-time", workType: "On-site", appliedDate: "22-07-2025", attachments: ["Resume", "Certifications"], status: "Interview", score: 50, interviewScore: 45 },
  { name: "Emma Wilson", role: "Financial Analyst", employmentType: "Full-time", workType: "Remote", appliedDate: "22-07-2025", attachments: ["Resume"], status: "Hired", score: 95, interviewScore: 90 },
  { name: "Noah Brown", role: "Operations Manager", employmentType: "Full-time", workType: "On-site", appliedDate: "22-07-2025", attachments: ["Resume", "References"], status: "In-Review", score: 80, interviewScore: 75 },
  { name: "Mia Davis", role: "Customer Support Specialist", employmentType: "Contract", workType: "Remote", appliedDate: "22-07-2025", attachments: ["Resume", "Writing Samples"], status: "Rejected", score: 10, interviewScore: 5 },
  { name: "Ava Johnson", role: "Data Scientist", employmentType: "Full-time", workType: "Remote", appliedDate: "22-07-2025", attachments: ["Resume", "Project Portfolio"], status: "Interview", score: 85, interviewScore: 80 },
  { name: "William Moore", role: "Marketing Coordinator", employmentType: "Full-time", workType: "On-site", appliedDate: "22-07-2025", attachments: ["Resume", "Portfolio"], status: "Rejected", score: 65, interviewScore: 60 },
];

const InterviewDetail = () => {
  const { id } = useParams();
  const candidate = candidates[id] || candidates[0];

  const questions = candidate.role === "Legal Advisor" ? [
    {
      question: "How do you ensure compliance with regulatory requirements in a corporate setting?",
      answer: "I conduct thorough audits and stay updated on relevant laws, implementing compliance programs that align with industry standards, reducing legal risks by 15% in my previous role.",
    },
    {
      question: "Can you describe your experience in drafting legal agreements?",
      answer: "I have drafted and reviewed over 100 contracts, including NDAs and service agreements, ensuring clarity and enforceability while protecting company interests.",
    },
    {
      question: "How do you handle disputes or negotiations with external parties?",
      answer: "I use a collaborative approach, leveraging strong communication and legal expertise to negotiate favorable terms, successfully resolving 90% of disputes without escalation.",
    },
  ] : [
    // Fallback for other roles
    {
      question: "Can you describe your experience relevant to this role?",
      answer: "I have extensive experience in my field, delivering high-quality results in various projects tailored to organizational needs.",
    },
    {
      question: "How do you approach problem-solving in your work?",
      answer: "I use a systematic approach, analyzing issues thoroughly and collaborating with teams to find effective solutions.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-indigo-600 p-6 text-white">
          <h1 className="text-3xl font-bold">Interview Details - {candidate.name}</h1>
          <p className="mt-2 text-indigo-200">Role: {candidate.role}</p>
        </div>

        {/* Candidate Profile */}
        <div className="p-6">
          <div className="flex items-center space-x-6 border-b border-indigo-100 pb-6">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=4f46e5&color=fff&size=96`}
              alt={`${candidate.name} profile`}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">{candidate.name}</h2>
              <p className="text-lg text-gray-600">
                
                Resume Score: <span className="font-medium text-indigo-600">{candidate.score}%</span>
              </p>
              <p className="text-lg text-gray-600">
                Interview Score: <span className="font-medium text-indigo-600">{candidate.interviewScore}%</span>
              </p>
            </div>
          </div>

          {/* Interview Breakdown */}
          <div className="mt-6">
            <h3 className="text-xl font-medium text-gray-700">Interview Breakdown</h3>
            <div className="mt-4 space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{candidate.role === "Legal Advisor" ? "Legal Knowledge" : "Technical Skills"}</span>
                  <span className="text-indigo-600">{Math.round(candidate.interviewScore * 0.4)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{ width: `${Math.round(candidate.interviewScore * 0.4)}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Communication Skills</span>
                  <span className="text-indigo-600">{Math.round(candidate.interviewScore * 0.3)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{ width: `${Math.round(candidate.interviewScore * 0.3)}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{candidate.role === "Legal Advisor" ? "Analytical Thinking" : "Problem Solving"}</span>
                  <span className="text-indigo-600">{Math.round(candidate.interviewScore * 0.3)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{ width: `${Math.round(candidate.interviewScore * 0.3)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Questions and Answers */}
          <div className="mt-8">
            <h3 className="text-xl font-medium text-gray-700">Interview Questions & Answers</h3>
            <div className="mt-4 space-y-6">
              {questions.map((qa, index) => (
                <div key={index} className="bg-indigo-50 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-indigo-700">
                    Question {index + 1}: {qa.question}
                  </h4>
                  <p className="mt-2 text-gray-600">{qa.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewDetail;
