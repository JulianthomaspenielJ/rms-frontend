import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// API service function to fetch HR list
const fetchHRList = async () => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch('http://localhost:4000/api/hr/list', {
      method: 'GET',
      headers: headers,
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching HR list:', error);
    throw error;
  }
};

// Transform backend data to match frontend structure
const transformHRData = (backendData) => {
  return backendData.map((hr, index) => ({
    id: hr.id || hr.hr_id || index + 1,
    name: hr.full_name || 'N/A',
    email: hr.email_address || 'N/A',
    department: hr.department || 'N/A',
    role: hr.designation || 'N/A',
    status: hr.status === 1 ? 'Active' : 'Inactive',
    employee_id: hr.employee_id || '',
    joining_date: hr.joining_date || '',
    linkedIn_url: hr.linkedIn_url || '',
    phone_number: hr.phone_number || '',
    reporting_manager: hr.reporting_manager || '',
    work_location: hr.work_location || '',
    // Keep empty JDs array for now as per requirement to not disturb JD functionality
    jds: []
  }));
};

const hrList = [
  {
    id: 1,
    name: "Anjali Rao",
    email: "anjali.rao@example.com",
    department: "IT",
    role: "Lead Recruiter",
    status: "Active",
    jds: [
      {
        id: 101,
        title: "Software full stack developer",
        department: "IT",
        location: "Mumbai",
        dateUploaded: "2025-07-14",
        status: "Open",
        details: {
          reportingTo: "CTO",
          description: "Responsible for developing scalable applications...",
          salaryRange: "₹10,00,000 - ₹16,00,000",
          experienceRequired: "3-5 years",
          numberOfApplicants: 25,
          // attachments: ["JobDescription.pdf"],
        },
      },
      {
        id: 102,
        title: "QA Engineer",
        department: "Sales",
        location: "Mumbai",
        dateUploaded: "2025-06-20",
        status: "Open",
        details: {
          reportingTo: "QA Manager",
          description: "Ensure product quality through testing...",
          salaryRange: "₹8,00,000 - ₹12,00,000",
          experienceRequired: "2-4 years",
          numberOfApplicants: 15,
          attachments: [],
        },
      },
    ],
  },
  {
    id: 2,
    name: "Rajat Singh",
    email: "rajat.singh@example.com",
    department: "Sales",  
    role: "HR Associate",
    status: "Inactive",
    jds: [
      {
        id: 201,
        title: "Marketing Lead",
        department: "Marketing",
        location: "Chennai",
        dateUploaded: "2025-07-21",
        status: "Closed",
        details: {
          reportingTo: "CMO",
          description: "Lead marketing campaigns and strategy...",
          salaryRange: "₹12,00,000 - ₹18,00,000",
          experienceRequired: "5-7 years",
          numberOfApplicants: 30,
          attachments: ["CampaignBrief.pdf"],
        },
      },
    ],
  },
  {
    id: 3,
    name: "Priya Nair",
    email: "priya.nair@example.com",
    department: "Supply Chain",
    role: "HR Manager",
    status: "Active",
    jds: [
      {
        id: 301,
        title: "Business Analyst",
        department: "Business",
        location: "Bangalore",
        dateUploaded: "2025-07-10",
        status: "Open",
        details: {
          reportingTo: "Head of Operations",
          description: "Analyze business processes and data...",
          salaryRange: "₹9,00,000 - ₹14,00,000",
          experienceRequired: "4-6 years",
          numberOfApplicants: 20,
          attachments: [],
        },
      },
      {
        id: 302,
        title: "HR Executive",
        department: "Supply Chain",
        location: "Bangalore",
        dateUploaded: "2025-06-30",
        status: "Open",
        details: {
          reportingTo: "HR Manager",
          description: "Manage recruitment and employee engagement...",
          salaryRange: "₹6,00,000 - ₹8,00,000",
          experienceRequired: "2-3 years",
          numberOfApplicants: 18,
          attachments: [],
        },
      },
      {
        id: 303,
        title: "Training Coordinator",
        department: "Sales",
        location: "Bangalore",
        dateUploaded: "2025-07-15",
        status: "Open",
        details: {
          reportingTo: "HR Manager",
          description: "Coordinate and organize employee training programs...",
          salaryRange: "₹7,00,000 - ₹9,00,000",
          experienceRequired: "3-4 years",
          numberOfApplicants: 10,
          attachments: ["TrainingPlan.pdf"],
        },
      },
    ],
  },
  {
    id: 4,
    name: "Suresh Kumar",
    email: "suresh.kumar@example.com",
    department: "IT",
    role: "Senior HR",
    status: "Active",
    jds: [
      {
        id: 401,
        title: "Data Scientist",
        department: "IT",
        location: "Hyderabad",
        dateUploaded: "2025-07-05",
        status: "Open",
        details: {
          reportingTo: "CTO",
          description: "Analyze large datasets to derive insights...",
          salaryRange: "₹11,00,000 - ₹15,00,000",
          experienceRequired: "3-5 years",
          numberOfApplicants: 12,
          attachments: [],
        },
      },
    ],
  },
  {
    id: 5,
    name: "Neha Patel",
    email: "neha.patel@example.com",
    department: "Marketing",
    role: "HR Specialist",
    status: "Inactive",
    jds: [
      {
        id: 501,
        title: "Content Writer",
        department: "Marketing",
        location: "Pune",
        dateUploaded: "2025-06-28",
        status: "Open",
        details: {
          reportingTo: "Marketing Manager",
          description: "Create engaging marketing content...",
          salaryRange: "₹5,00,000 - ₹7,00,000",
          experienceRequired: "2-3 years",
          numberOfApplicants: 8,
          attachments: [],
        },
      },
      {
        id: 502,
        title: "SEO Analyst",
        department: "Marketing",
        location: "Pune",
        dateUploaded: "2025-07-12",
        status: "Open",
        details: {
          reportingTo: "SEO Manager",
          description: "Optimize website content for SEO...",
          salaryRange: "₹6,00,000 - ₹9,00,000",
          experienceRequired: "3-4 years",
          numberOfApplicants: 10,
          attachments: [],
        },
      },
    ],
  },
  {
    id: 6,
    name: "Vikram Desai",
    email: "vikram.desai@example.com",
    department: "IT",
    role: "Junior HR",
    status: "Active",
    jds: [],
  },
  {
    id: 7,
    name: "Meera Joshi",
    email: "meera.joshi@example.com",
    department: "Sales",
    role: "HR Director",
    status: "Active",
    jds: [
      {
        id: 701,
        title: "Project Manager",
        department: "Operations",
        location: "Delhi",
        dateUploaded: "2025-07-18",
        status: "Open",
        details: {
          reportingTo: "CEO",
          description: "Manage project delivery and teams...",
          salaryRange: "₹15,00,000 - ₹22,00,000",
          experienceRequired: "7-10 years",
          numberOfApplicants: 5,
          attachments: ["ProjectPlan.pdf"],
        },
      },
    ],
  },
  {
    id: 8,
    name: "Arjun Kapoor",
    email: "arjun.kapoor@example.com",
    department: "Marketing",
    role: "Chief HR Officer",
    status: "Active",
    jds: [
      {
        id: 801,
        title: "HR Strategy Lead",
        department: "HR",
        location: "Mumbai",
        dateUploaded: "2025-07-01",
        status: "Open",
        details: {
          reportingTo: "CEO",
          description: "Develop and execute HR strategies...",
          salaryRange: "₹18,00,000 - ₹25,00,000",
          experienceRequired: "10+ years",
          numberOfApplicants: 3,
          attachments: [],
        },
      },
      {
        id: 802,
        title: "Compensation Analyst",
        department: "HR",
        location: "Mumbai",
        dateUploaded: "2025-07-08",
        status: "Open",
        details: {
          reportingTo: "HR Strategy Lead",
          description: "Analyze compensation and benefits...",
          salaryRange: "₹12,00,000 - ₹16,00,000",
          experienceRequired: "5-7 years",
          numberOfApplicants: 7,
          attachments: [],
        },
      },
    ],
  },
];

function HRList() {
  const navigate = useNavigate();
  const [hrs, setHrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHr, setSelectedHr] = useState(null);
  const [showJdModal, setShowJdModal] = useState(false);
  const [selectedJd, setSelectedJd] = useState(null);
  const [showJdDetailsModal, setShowJdDetailsModal] = useState(false);
  const [jdFilter, setJdFilter] = useState("all");
  const [hrSearch, setHrSearch] = useState("");

  // Fetch HR list from API
  useEffect(() => {
    const loadHRList = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if user is authenticated
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (!token) {
          setError('Please login to view HR list');
          setLoading(false);
          return;
        }
        
        const response = await fetchHRList();
        
        if (response.ok && response.data) {
          const transformedData = transformHRData(response.data);
          setHrs(transformedData);
        } else {
          // Handle specific error cases
          if (response.status === 401) {
            setError('Authentication failed. Please login again.');
            // Optionally redirect to login
            // navigate('/login');
          } else if (response.status === 403) {
            setError('Access denied. You do not have permission to view HR list.');
          } else {
            setError('Failed to fetch HR list. Please try again.');
          }
          // Fallback to static data in case of API failure
          setHrs(hrList);
        }
      } catch (err) {
        console.error('Error loading HR list:', err);
        setError('Network error. Please check your connection and try again.');
        // Fallback to static data in case of API failure
        setHrs(hrList);
      } finally {
        setLoading(false);
      }
    };

    loadHRList();
  }, []);

  // Toggle HR active/inactive status
  const toggleStatus = (hrId, newStatus) => {
    setHrs((prev) =>
      prev.map((hr) =>
        hr.id === hrId ? { ...hr, status: newStatus } : hr
      )
    );
  };

  // Get unique JD titles
  const jdTitles = [
    "all",
    ...new Set(
      hrList
        .flatMap((hr) => hr.jds.map((jd) => jd.title))
        .sort((a, b) => a.localeCompare(b))
    ),
  ];

  // Filter HRs by JD title and name search
  const filteredHrs = hrs.filter((hr) => {
    const matchesJd =
      jdFilter === "all" || hr.jds.some((jd) => jd.title === jdFilter);
    const matchesName = hr.name
      .toLowerCase()
      .includes(hrSearch.toLowerCase());
    return matchesJd && matchesName;
  });

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading HR list...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* <h1 className="text-3xl font-bold mb-6 text-center">Company Admin Screen</h1> */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <label htmlFor="jd-filter" className="text-sm font-semibold text-gray-600">
              Filter by Department:
            </label>
            <select
              id="jd-filter"
              value={jdFilter}
              onChange={(e) => setJdFilter(e.target.value)}
              className="w-full sm:w-40 rounded-md border border-gray-300 px-3 py-1 text-sm bg-white hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500"
            >
              {jdTitles.map((title) => (
                <option key={title} value={title}>
                  {title === "all" ? "All Departments" : title}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <label htmlFor="hr-search" className="text-sm font-semibold text-gray-600">
              Search HR:
            </label>
            <input
              id="hr-search"
              type="text"
              value={hrSearch}
              onChange={(e) => setHrSearch(e.target.value)}
              placeholder="Enter HR name"
              className="w-full sm:w-60 rounded-md border border-gray-300 px-3 py-1 text-sm bg-white hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500"
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              onClick={() => navigate('/company/hr-profile/new')}
            >
              Create HR
            </button>
          </div>
        </div>
        {/* HR List as cards */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mx-auto max-w-7xl">
          {filteredHrs.length === 0 ? (
            <p className="text-gray-600 col-span-full text-center">No HRs found matching the filters.</p>
          ) : (
            filteredHrs.map((hr) => (
              <div key={hr.id} className="bg-white shadow rounded-lg overflow-hidden flex flex-col min-h-[300px]">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold">{hr.name}</span>
                    <StatusDropdown
                      currentStatus={hr.status}
                      onChange={(newStatus) => toggleStatus(hr.id, newStatus)}
                    />
                  </div>
                  <div className="text-sm text-gray-600">{hr.email}</div>
                  <div className="mt-1 text-sm">Department: {hr.department}</div>
                  <div className="mt-1 text-sm">Role: {hr.role}</div>
                </div>
                <div className="flex flex-1 flex-col justify-end p-6 space-y-2">
                  <button
                    onClick={() => navigate(`/company/hr-profile/${hr.id}`)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded w-full"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => {
                      setSelectedHr(hr);
                      setShowJdModal(true);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded"
                  >
                    List of JD {hr.jds.length > 0 && `(${hr.jds.length})`}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* JD List Modal */}
      {showJdModal && selectedHr && (
        <Modal onClose={() => setShowJdModal(false)} title={`JDs uploaded by ${selectedHr.name}`}>
          {selectedHr.jds.length === 0 ? (
            <p className="p-4 text-gray-600">No JDs found for this HR.</p>
          ) : (
            <table className="min-w-full table-auto border-collapse border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-3 py-2 text-left">JD Title</th>
                  <th className="border px-3 py-2 text-left">Department</th>
                  <th className="border px-3 py-2 text-left">Location</th>
                  <th className="border px-3 py-2 text-left">Date Uploaded</th>
                  <th className="border px-3 py-2 text-left">Status</th>
                  <th className="border px-3 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedHr.jds.map((jd) => (
                  <tr key={jd.id} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">{jd.title}</td>
                    <td className="border px-3 py-2">{jd.department}</td>
                    <td className="border px-3 py-2">{jd.location}</td>
                    <td className="border px-3 py-2">{jd.dateUploaded}</td>
                    <td className="border px-3 py-2">{jd.status}</td>
                    <td className="border px-3 py-2">
                      <button
                        onClick={() => {
                          setSelectedJd(jd);
                          setShowJdDetailsModal(true);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Modal>
      )}

      {/* JD Details Modal */}
      {showJdDetailsModal && selectedJd && (
        <Modal
          title={`JD Details: ${selectedJd.title}`}
          onClose={() => setShowJdDetailsModal(false)}
          className="max-w-3xl"
        >
          <div className="space-y-2">
            <DetailItem label="Title" value={selectedJd.title} />
            <DetailItem label="Department" value={selectedJd.department} />
            <DetailItem label="Reporting To" value={selectedJd?.details?.reportingTo || 'N/A'} />
            <DetailItem label="Description" value={selectedJd?.details?.description || 'N/A'} />
            <DetailItem label="Salary Range" value={selectedJd?.details?.salaryRange || 'N/A'} />
            <DetailItem label="Experience Required" value={selectedJd?.details?.experienceRequired || 'N/A'} />
            <DetailItem label="Location" value={selectedJd?.location || 'N/A'} />
            <DetailItem label="Date Uploaded" value={selectedJd?.dateUploaded || 'N/A'} />
            <DetailItem label="Status" value={selectedJd?.status || 'N/A'} />
            <DetailItem label="Number of Applicants" value={selectedJd?.details?.numberOfApplicants || 'N/A'} />
            <div>
              <span className="font-semibold">Attachments: </span>
              {selectedJd?.details?.attachments?.length > 0 ? (
                selectedJd.details.attachments.map((att, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="text-blue-600 underline mr-2"
                    onClick={(e) => e.preventDefault()}
                  >
                    {att}
                  </a>
                ))
              ) : (
                <span>None</span>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function StatusDropdown({ currentStatus, onChange }) {
  const [open, setOpen] = useState(false);

  const options = ["Active", "Inactive"];
  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex justify-center w-full rounded-md border px-3 py-1 text-sm font-medium ${
          currentStatus === "Active"
            ? "bg-green-500 text-white border-green-600 hover:bg-green-600"
            : "bg-red-500 text-white border-red-600 hover:bg-red-600"
        }`}
      >
        {currentStatus}{" "}
        <svg
          className="ml-1 -mr-1 h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="origin-top-right absolute mt-1 w-28 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
          onMouseLeave={() => setOpen(false)}
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  option === currentStatus ? "font-semibold bg-gray-100" : ""
                } hover:bg-gray-200`}
                role="menuitem"
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Modal({ title, children, onClose, className = "max-w-4xl" }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className={`bg-white rounded shadow-lg w-full ${className} max-h-[90vh] overflow-y-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center border-b px-4 py-3">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    </>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <span className="font-semibold">{label}: </span>
      <span>{value}</span>
    </div>
  );
}

export default HRList;