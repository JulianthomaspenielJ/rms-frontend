import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import { useParams } from "react-router-dom";

// HR Data from HR List
const hrList = [
  {
    id: 1,
    name: "Anjali Rao",
    email: "anjali.rao@example.com",
    experience: 5,
    role: "Lead Recruiter",
    employeeId: "HR1001",
    reportingManager: "Ramesh K",
    workLocation: "Mumbai, Maharashtra",
    joiningDate: "March 10, 2020",
    phoneNumber: "+91 91234 56789",
    linkedin: "linkedin.com/in/anjalirao",
    department: "Human Resources",
    location: "Mumbai, India",
    profileImage: null,
    status: "Active"
  },
  {
    id: 2,
    name: "Rajat Singh",
    email: "rajat.singh@example.com",
    experience: 3,
    role: "HR Associate",
    employeeId: "HR2002",
    reportingManager: "Meera Joshi",
    workLocation: "Chennai, Tamil Nadu",
    joiningDate: "July 5, 2021",
    phoneNumber: "+91 98765 43210",
    linkedin: "linkedin.com/in/rajatsingh",
    department: "Human Resources",
    location: "Chennai, India",
    profileImage: null,
    status: "Inactive"
  },
  {
    id: 3,
    name: "Priya Nair",
    email: "priya.nair@example.com",
    experience: 7,
    role: "HR Manager",
    employeeId: "HR3003",
    reportingManager: "Ramesh K",
    workLocation: "Bangalore, Karnataka",
    joiningDate: "June 5, 2019",
    phoneNumber: "+91 99887 66554",
    linkedin: "linkedin.com/in/priyanair",
    department: "Human Resources",
    location: "Bangalore, India",
    profileImage: null,
    status: "Active"
  },
  {
    id: 4,
    name: "Suresh Kumar",
    email: "suresh.kumar@example.com",
    experience: 4,
    role: "Senior HR",
    employeeId: "HR4004",
    reportingManager: "Priya Nair",
    workLocation: "Hyderabad, Telangana",
    joiningDate: "January 15, 2021",
    phoneNumber: "+91 88776 55443",
    linkedin: "linkedin.com/in/sureshkumar",
    department: "Human Resources",
    location: "Hyderabad, India",
    profileImage: null,
    status: "Active"
  },
  {
    id: 5,
    name: "Neha Patel",
    email: "neha.patel@example.com",
    experience: 6,
    role: "HR Specialist",
    employeeId: "HR5005",
    reportingManager: "Arjun Kapoor",
    workLocation: "Pune, Maharashtra",
    joiningDate: "September 20, 2019",
    phoneNumber: "+91 77665 44332",
    linkedin: "linkedin.com/in/nehapatel",
    department: "Human Resources",
    location: "Pune, India",
    profileImage: null,
    status: "Inactive"
  },
  {
    id: 6,
    name: "Vikram Desai",
    email: "vikram.desai@example.com",
    experience: 2,
    role: "Junior HR",
    employeeId: "HR6006",
    reportingManager: "Suresh Kumar",
    workLocation: "Mumbai, Maharashtra",
    joiningDate: "December 1, 2023",
    phoneNumber: "+91 66554 33221",
    linkedin: "linkedin.com/in/vikramdesai",
    department: "Human Resources",
    location: "Mumbai, India",
    profileImage: null,
    status: "Active"
  },
  {
    id: 7,
    name: "Meera Joshi",
    email: "meera.joshi@example.com",
    experience: 8,
    role: "HR Director",
    employeeId: "HR7007",
    reportingManager: "Arjun Kapoor",
    workLocation: "Delhi, NCR",
    joiningDate: "April 12, 2017",
    phoneNumber: "+91 55443 22110",
    linkedin: "linkedin.com/in/meerajoshi",
    department: "Human Resources",
    location: "Delhi, India",
    profileImage: null,
    status: "Active"
  },
  {
    id: 8,
    name: "Arjun Kapoor",
    email: "arjun.kapoor@example.com",
    experience: 10,
    role: "Chief HR Officer",
    employeeId: "HR8008",
    reportingManager: "CEO",
    workLocation: "Mumbai, Maharashtra",
    joiningDate: "March 1, 2015",
    phoneNumber: "+91 44332 11009",
    linkedin: "linkedin.com/in/arjunkapoor",
    department: "Human Resources",
    location: "Mumbai, India",
    profileImage: null,
    status: "Active"
  }
];

const socialLinks = [
  {
    platform: "LinkedIn",
    color: "bg-blue-700",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        className="w-5 h-5"
        viewBox="0 0 24 24"
      >
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z" />
      </svg>
    ),
  },
];

const HRProfilePage = ({ selectedHRId = 1 }) => {
  const { hrId } = useParams();
  const isNewProfile = hrId === 'new';
  const initialHRId = isNewProfile ? null : (hrId ? parseInt(hrId) : selectedHRId);
  const [currentHRId, setCurrentHRId] = useState(initialHRId);
  
  // Default empty profile for new HR
  const emptyProfile = {
    name: "",
    role: "",
    employeeId: "",
    reportingManager: "",
    workLocation: "",
    joiningDate: "",
    email: "",
    phoneNumber: "",
    linkedin: "",
    department: "",
    location: "",
    experience: "",
    status: "Active"
  };
  
  const selectedHR = isNewProfile ? emptyProfile : (hrList.find((hr) => hr.id === currentHRId) || hrList[0]);
  const [profileImg] = useState(selectedHR.profileImage);
  const [formData, setFormData] = useState(isNewProfile ? emptyProfile : {
    name: selectedHR.name || "",
    role: selectedHR.role || "",
    employeeId: selectedHR.employeeId || "",
    reportingManager: selectedHR.reportingManager || "",
    workLocation: selectedHR.workLocation || "",
    joiningDate: selectedHR.joiningDate || "",
    email: selectedHR.email || "",
    phoneNumber: selectedHR.phoneNumber || "",
    linkedin: selectedHR.linkedin || "",
    department: selectedHR.department || "",
    location: selectedHR.location || "",
    experience: selectedHR.experience || "",
  });

  // Update form data when selected HR changes
  useEffect(() => {
    if (!isNewProfile) {
      setFormData({
        name: selectedHR.name || "",
        role: selectedHR.role || "",
        employeeId: selectedHR.employeeId || "",
        reportingManager: selectedHR.reportingManager || "",
        workLocation: selectedHR.workLocation || "",
        joiningDate: selectedHR.joiningDate || "",
        email: selectedHR.email || "",
        phoneNumber: selectedHR.phoneNumber || "",
        linkedin: selectedHR.linkedin || "",
        department: selectedHR.department || "",
        location: selectedHR.location || "",
        experience: selectedHR.experience || "",
      });
    }
  }, [selectedHR, isNewProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (isNewProfile) {
      console.log("Creating new HR profile:", formData);
      alert("New HR profile created successfully! (Check console for details)");
      // Here you would typically make an API call to save the new HR profile
      // After successful save, you might want to navigate back to the HR list
      // navigate('/hrlist');
    } else {
      console.log("Updating HR profile:", formData);
      alert("Profile updated successfully! (Check console for details)");
    }
  };

  // Reusable field
  const Field = ({ label, name, value }) => (
    <div>
      <label className="text-xs font-semibold text-gray-600 mb-1 block">{label}</label>
      <input
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-indigo-600 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        name={name}
        value={value || ""}
        onChange={handleInputChange}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 text-indigo-600 flex justify-center p-8">
      <div className="max-w-6xl w-full">
        {/* <h2 className="text-4xl font-extrabold mb-8 text-center text-indigo-800">HR Profile</h2> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left profile card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="relative mb-6 flex flex-col items-center justify-center">
              <div className="w-36 h-36 rounded-full mx-auto bg-indigo-100 border-4 border-indigo-600 flex items-center justify-center overflow-hidden relative">
                {profileImg ? (
                  <img src={profileImg} alt="Profile" className="object-cover w-full h-full" />
                ) : (
                  <User className="w-20 h-20 text-indigo-600" />
                )}
              </div>
            </div>
            <input
              className="text-3xl font-bold mb-2 text-center w-full border border-gray-300 rounded-lg px-4 py-2 text-indigo-600 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <input
              className="text-indigo-500 text-sm mb-6 text-center w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            />
            {/* Social Media section  */}
            <div className="text-left mt-6">
              <h4 className="text-xs font-semibold text-gray-600 mb-3">Social Media</h4>
              <div className="flex items-center space-x-3">
                <span
                  className={`${socialLinks[0].color} w-10 h-10 rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity`}
                  aria-label={socialLinks[0].platform}
                >
                  {socialLinks[0].icon}
                </span>
              </div>
            </div>
          </div>
          {/* Right info card */}
          <div className="md:col-span-2 bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Field label="Name" name="name" value={formData.name} />
                <Field label="Designation" name="role" value={formData.role} />
                <Field label="Employee ID" name="employeeId" value={formData.employeeId} />
                <Field label="Reporting Manager" name="reportingManager" value={formData.reportingManager} />
                <Field label="Work Location" name="workLocation" value={formData.workLocation} />
                <Field label="Joining Date" name="joiningDate" value={formData.joiningDate} />
              </div>
              <div className="space-y-6">
                <Field label="Email" name="email" value={formData.email} />
                <Field label="Phone Number" name="phoneNumber" value={formData.phoneNumber} />
                <Field label="LinkedIn" name="linkedin" value={formData.linkedin} />
                <Field label="Department" name="department" value={formData.department} />
                <Field label="Location" name="location" value={formData.location} />
                <Field label="Experience (yrs)" name="experience" value={formData.experience} />
              </div>
            </div>
            {/* <div className="mt-8 flex justify-end">
              <button
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRProfilePage;