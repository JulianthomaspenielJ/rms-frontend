import React from 'react';
import { 
  Code, 
  Users, 
  Megaphone, 
  DollarSign, 
  Headphones, 
  Settings, 
  Database, 
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const ManageJD = () => {
  const jobs = [
    {
      id: 1,
      title: "Software Developer",
      department: "Engineering",
      level: "Mid-level",
      experience: "3-5 Years Experience",
      workType: ["Full-time", "Remote"],
      salary: "$80,000 - $100,000",
      applicants: 120,
      status: "Active",
      icon: Code,
      iconBg: "bg-lime-200",
      iconColor: "text-lime-800"
    },
    {
      id: 2,
      title: "HR Manager",
      department: "Human Resources",
      level: "Senior-level",
      experience: "8+ Years Experience",
      workType: ["Full-time", "Hybrid"],
      salary: "$90,000 - $110,000",
      applicants: 30,
      status: "Active",
      icon: Users,
      iconBg: "bg-indigo-200",
      iconColor: "text-indigo-800"
    },
    {
      id: 3,
      title: "Marketing Coordinator",
      department: "Marketing",
      level: "Entry-level",
      experience: "0-2 Years Experience",
      workType: ["Full-time", "On-site"],
      salary: "$45,000 - $60,000",
      applicants: 0,
      status: "Draft",
      icon: Megaphone,
      iconBg: "bg-lime-200",
      iconColor: "text-lime-800"
    },
    {
      id: 4,
      title: "Financial Analyst",
      department: "Finance",
      level: "Mid-level",
      experience: "3-5 Years Experience",
      workType: ["Full-time", "Remote"],
      salary: "$70,000 - $85,000",
      applicants: 60,
      status: "Active",
      icon: DollarSign,
      iconBg: "bg-indigo-200",
      iconColor: "text-indigo-800"
    },
    {
      id: 5,
      title: "Customer Support Specialist",
      department: "Customer Support",
      level: "Entry-level",
      experience: "0-1 Years Experience",
      workType: ["Part-time", "Remote"],
      salary: "$30,000 - $40,000",
      applicants: 50,
      status: "Active",
      icon: Headphones,
      iconBg: "bg-indigo-200",
      iconColor: "text-indigo-800"
    },
    {
      id: 6,
      title: "Operations Manager",
      department: "Operations",
      level: "Senior-level",
      experience: "10+ Years Experience",
      workType: ["Full-time", "On-site"],
      salary: "$95,000 - $120,000",
      applicants: 0,
      status: "Draft",
      icon: Settings,
      iconBg: "bg-lime-200",
      iconColor: "text-lime-800"
    },
    {
      id: 7,
      title: "Data Scientist",
      department: "Research and Development",
      level: "Mid-level",
      experience: "4-6 Years Experience",
      workType: ["Full-time", "Remote"],
      salary: "$100,000 - $120,000",
      applicants: 40,
      status: "Active",
      icon: Database,
      iconBg: "bg-indigo-200",
      iconColor: "text-indigo-800"
    },
    {
      id: 8,
      title: "Content Writer",
      department: "Marketing",
      level: "Entry-level",
      experience: "1-3 Years Experience",
      workType: ["Contract", "Remote"],
      salary: "$35,000 - $45,000",
      applicants: 85,
      status: "Pending",
      icon: FileText,
      iconBg: "bg-lime-200",
      iconColor: "text-lime-800"
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Active</span>
          </div>
        );
      case 'Draft':
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Draft</span>
          </div>
        );
      case 'Pending':
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Pending</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 p-2 sm:p-4">
      <main className="bg-white rounded-xl shadow-sm p-6 mt-6 flex-1">
        <div className="flex items-center justify-between mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {jobs.map((job) => {
            const IconComponent = job.icon;
            return (
              <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${job.iconBg}`}>
                    <IconComponent className={`w-5 h-5 ${job.iconColor}`} />
                  </div>
                  {getStatusBadge(job.status)}
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{job.department}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-400 rounded-sm"></div>
                      </div>
                      <span className="text-sm text-gray-600">{job.level}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-400 rounded-sm"></div>
                      </div>
                      <span className="text-sm text-gray-600">{job.experience}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mb-4">
                  {job.workType.map((type, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        index === 0 
                          ? 'bg-gray-900 text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {type}
                    </span>
                  ))}
                </div>
                <div className="mb-4">
                  <p className="text-lg font-semibold text-gray-900">{job.salary}</p>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{job.applicants} Applicants</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-2">
          <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-lg bg-lime-400 text-gray-900 font-medium">1</button>
          {/* <button className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-600 font-medium">2</button>
          <button className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-600 font-medium">3</button>
          <span className="text-gray-400 px-2">...</span>
          <button className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-600 font-medium">16</button> */}
          <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}

export default ManageJD; 