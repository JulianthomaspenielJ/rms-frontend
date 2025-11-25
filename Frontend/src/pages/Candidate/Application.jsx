// import React from 'react';
// export default function Application() {
//     return (
//         <div>
//             <h1>Application</h1>
//         </div>
//     );
// }
// import React, { useState } from "react";

// const applicationsData = [
//   {
//     company: "TechNova",
//     profile: "Frontend Developer",
//     dateApplied: "2025-07-12",
//   },
//   {
//     company: "BlueSky Solutions",
//     profile: "Backend Engineer",
//     dateApplied: "2025-07-20",
//   },
//   // Add more sample data as needed
// ];

// function MyApplications() {
//   const [search, setSearch] = useState("");

//   const filteredApplications = applicationsData.filter(app =>
//     app.company.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-blue-50 py-8 px-4">
//       <div className="max-w-2xl mx-auto">
//         <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
//           My Applications
//         </h1>
//         <div className="mb-6">
//           <input
//             type="text"
//             placeholder="Search by company name..."
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
//           />
//         </div>
//         <div className="bg-white rounded-lg shadow-md">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-blue-600 text-white">
//                 <th className="py-3 px-4">Company</th>
//                 <th className="py-3 px-4">Profile</th>
//                 <th className="py-3 px-4">Date Applied</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredApplications.length === 0 ? (
//                 <tr>
//                   <td colSpan="3" className="py-6 px-4 text-center text-blue-500">
//                     No applications found.
//                   </td>
//                 </tr>
//               ) : (
//                 filteredApplications.map((app, idx) => (
//                   <tr key={idx} className="border-t">
//                     <td className="py-3 px-4">{app.company}</td>
//                     <td className="py-3 px-4">{app.profile}</td>
//                     <td className="py-3 px-4">{app.dateApplied}</td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MyApplications;
import { CloudSnow } from "lucide-react";
import React, { useState } from "react";
import { FiSearch, FiCalendar, FiBriefcase, FiExternalLink } from "react-icons/fi";
const userEmail = localStorage.getItem('userEmail');



console.log("useremail", userEmail);

const applicationsData = [
  {
    id: 1,
    company: "TechNova",
    profile: "Frontend Developer",
    dateApplied: "2025-07-12",
    status: "In Review",
    companyLogo: "https://logo.clearbit.com/technova.com",
    jobType: "Full-time",
    location: "San Francisco, CA",
  },
  {
    id: 2,
    company: "BlueSky Solutions",
    profile: "Backend Engineer",
    dateApplied: "2025-07-20",
    status: "Interview",
    companyLogo: "https://logo.clearbit.com/blueskysolutions.com",
    jobType: "Contract",
    location: "Remote",
  },
  {
    id: 3,
    company: "Quantum Innovations",
    profile: "Full Stack Developer",
    dateApplied: "2025-07-15",
    status: "Applied",
    companyLogo: "https://logo.clearbit.com/quantuminnovations.com",
    jobType: "Full-time",
    location: "New York, NY",
  },
];

// Map emails to specific profiles
const roleMap = {
  "t88li3046p@mkzaso.com": "Frontend Developer",
  "Narayanan.m@jitglobalinfosystems.com": "Backend Engineer",
  "praveenjit32@gmail.com": "Full Stack Developer",
};

// Status badge styles
const statusStyles = {
  Applied: "bg-blue-100 text-blue-800",
  "In Review": "bg-yellow-100 text-yellow-800",
  Interview: "bg-purple-100 text-purple-800",
  Offered: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

function MyApplications() {
  const [search, setSearch] = useState("");

  const filteredApplications = applicationsData.filter(app =>
    app.company.toLowerCase().includes(search.toLowerCase()) ||
    app.profile.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            My Applications
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Track your job applications in one place
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 relative max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by company or position..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
          />
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">
                No applications found
              </h3>
              <p className="mt-2 text-gray-500">
                Try adjusting your search or check back later.
              </p>
            </div>
          ) : (
            filteredApplications.map((app) => (
              <div
                key={app.id}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300 border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        className="h-14 w-14 rounded-full border-2 border-white shadow-sm"
                        src={app.companyLogo}
                        alt={`${app.company} logo`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://ui-avatars.com/api/?name=" +
                            encodeURIComponent(app.company) +
                            "&background=3b82f6&color=fff";
                        }}
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {app.profile}
                        </h3>
                        <p className="text-gray-700">{app.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          statusStyles[app.status] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {app.status}
                      </span>
                      <button
                        onClick={() => navigate("/instructions")}
                        className="inline-flex items-center px-4 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        Start
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <FiBriefcase className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
                      <span>{app.jobType}</span>
                    </div>
                    <div className="flex items-center">
                      <FiCalendar className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
                      <span>Applied on {formatDate(app.dateApplied)}</span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>{app.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MyApplications;
