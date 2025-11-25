import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Mail,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';

const ManageHR = () => {
  const hrList = [
    {
      id: 1,
      name: "Priya Sharma",
      position: "HR Executive",
      // experience: "2 Years",
      email: "priya.sharma@company.com",
      iconBg: "bg-lime-200",
      iconColor: "text-lime-800"
    },
    {
      id: 2,
      name: "Rahul Verma",
      position: "Senior HR Manager",
      // experience: "7 Years",
      email: "rahul.verma@company.com",
      iconBg: "bg-indigo-200",
      iconColor: "text-indigo-800"
    },
    {
      id: 3,
      name: "Anjali Mehta",
      position: "Recruiter",
      // experience: "3 Years",
      email: "anjali.mehta@company.com",
      iconBg: "bg-lime-200",
      iconColor: "text-lime-800"
    }
  ];

  // const getStatusBadge = (status) => {
  //   switch (status) {
  //     case 'Active':
  //       return (
  //         <div className="flex items-center gap-1.5">
  //           <div className="w-2 h-2 bg-green-500 rounded-full"></div>
  //           <span className="text-sm text-gray-600">Active</span>
  //         </div>
  //       );
  //     case 'Inactive':
  //       return (
  //         <div className="flex items-center gap-1.5">
  //           <div className="w-2 h-2 bg-red-500 rounded-full"></div>
  //           <span className="text-sm text-gray-600">Inactive</span>
  //         </div>
  //       );
  //     default:
  //       return null;
  //   }
  // };

  const navigate = useNavigate();

  return (
    <div className="flex-1 p-2 sm:p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Manage HR</h2>
        <button
          onClick={() => alert('Navigate to Create HR form')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create HR
        </button>
      </div>
      <main className="bg-white rounded-xl shadow-sm p-6 mt-6 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {hrList.map((hr) => (
            <div key={hr.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${hr.iconBg}`}>
                  <Users className={`w-5 h-5 ${hr.iconColor}`} />
                </div>
                {/* {getStatusBadge(hr.status)} */}
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{hr.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{hr.position}</p>
                {/* <p className="text-sm text-gray-600 mb-1">{hr.experience} Experience</p> */}
              </div>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{hr.email}</span>
              </div>
              <button
                className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors w-full"
                onClick={() => navigate('/company/hr-profiles', { state: { hr } })}
              >
                View Profile
              </button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2">
          <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-lg bg-lime-400 text-gray-900 font-medium">1</button>
          {/* <button className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-600 font-medium">2</button>
          <button className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-600 font-medium">3</button> */}
          {/* <span className="text-gray-400 px-2">...</span> */}
          {/* <button className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-600 font-medium">16</button> */}
          <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>
      {/* Floating Action Button */}
      <button
        className="fixed bottom-8 right-8 z-[100] bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:scale-105"
        title="Register New HR"
        onClick={() => navigate('/hr-register')}
        style={{
          boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.2)'
        }}
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}

export default ManageHR;
