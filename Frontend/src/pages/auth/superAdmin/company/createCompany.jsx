import React, { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, User, Mail, Lock, ChevronDown, Check, X } from "react-feather";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import BASE_URL from '../../utils/url';

const RolePicker = ({ value, onChange }) => {
  const [showOptions, setShowOptions] = useState(false);
  const wrapperRef = useRef(null);
  const roles = ["Recruiter","Candidate"];
  
  const handleSelect = (role) => {
    onChange(role);
    setShowOptions(false);
  };

  const handleClickOutside = (e) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
      <div
        onClick={() => setShowOptions(!showOptions)}
        className="flex items-center justify-between w-full px-4 py-3 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-indigo-500 transition-colors"
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value || "Select your role"}
        </span>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${showOptions ? "transform rotate-180" : ""}`} />
      </div>
      
      {showOptions && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-y-auto max-h-48">
          {roles.map((role) => (
            <div
              key={role}
              onClick={() => handleSelect(role)}
              className={`px-4 py-2 hover:bg-indigo-50 cursor-pointer flex items-center justify-between ${
                value === role ? "font-semibold text-indigo-600" : "text-gray-700"
              }`}
              style={{ minHeight: '32px' }}
            >
              {role}
              {value === role && <Check className="h-5 w-5 text-indigo-600" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isModal = new URLSearchParams(location.search).get('modal') === 'true';
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    companyName: "",
    companyLocation: "",
    companySize: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = `${BASE_URL}/auth/register-company`;
      
      const requestData = {
        full_name: `${formData.firstName} ${formData.lastName}`.trim(),
        email_address: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        user_role: 'company_admin',
        company_name: formData.companyName,
        company_location: formData.companyLocation,
        company_size: formData.companySize
      };
      
      // Remove undefined fields
      Object.keys(requestData).forEach(key => requestData[key] === undefined && delete requestData[key]);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store email in localStorage for verification if needed
      localStorage.setItem('verificationEmail', formData.email);
      
      // Show success message
      alert('Registration successful!');

    } catch (error) {
      console.error('Registration error:', error);
      alert(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isModal) {
      navigate(-1); // Go back to previous page if in modal mode
    }
  };

  useEffect(() => {
    if (isModal) {
      document.body.style.overflow = 'hidden'; // Prevent scrolling on the background
      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, [isModal]);

  return (
    <div className={`${isModal ? 'fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50' : 'min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex items-center justify-center p-2'}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`w-full max-w-4xl bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-lg flex flex-col md:flex-row relative ${isModal ? 'max-h-[90vh] overflow-y-auto' : ''}`}
      >
        {isModal && (
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        )}
        <div className="w-full md:w-[420px] mx-auto p-6 md:p-8 flex flex-col justify-center relative bg-white">
            {!isModal && (
              <div className="hidden md:block absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#181ed4] to-[#6a82fb] rounded-l-2xl" />
            )}
            <div className="mb-10 flex flex-col items-center md:items-start">
              {/* <div className="flex items-center mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#181ed4] to-[#6a82fb] flex items-center justify-center shadow-lg">
                  <span className="text-white font-extrabold text-2xl tracking-wider">RMS</span>
                </div>
                <span className="ml-3 text-2xl font-bold text-[#181ed4] tracking-wide">RecruitMS</span>
              </div> */}
              <span className="text-indigo-500 font-bold text-2xl mt-2">Welcome!</span>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create your account</h2>
              <p className="text-gray-600 text-base">
                Join thousands of companies using RMS to streamline their hiring process.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirm ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirm ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* Recruiter-only fields */}
              {formData.role === 'Recruiter' && (
                <>
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      placeholder="Your company name"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="companyLocation" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Location
                    </label>
                    <input
                      type="text"
                      id="companyLocation"
                      name="companyLocation"
                      placeholder="City, Country"
                      value={formData.companyLocation}
                      onChange={handleChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Size
                    </label>
                    <input
                      type="number"
                      id="companySize"
                      name="companySize"
                      placeholder="Number of employees"
                      value={formData.companySize}
                      onChange={handleChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      min="1"
                      required
                    />
                  </div>
                </>
              )}

              <RolePicker value={formData.role} onChange={role => setFormData(prev => ({ ...prev, role }))} />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-lg font-bold text-lg flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-2xl transition-all duration-300 ${
                  isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                    Creating account...
                  </>
                ) : (
                  <>
                    <User className="h-5 w-5 mr-2" />Create account
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-[#181ed4] hover:text-[#6a82fb] transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {!isModal && (
            <div className="hidden md:flex items-center justify-center flex-1 bg-gradient-to-br from-[#181ed4]/10 to-[#6a82fb]/10 p-0 relative min-h-[540px]">
            <div className="absolute inset-0 z-0">
              <img
                src={formData.role === 'Candidate'
                  ? 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80'
                  : 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80'}
                alt={formData.role === 'Candidate' ? 'Candidate illustration' : 'Teamwork illustration'}
                className="w-full h-full object-cover rounded-tr-2xl rounded-br-2xl opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181ed4]/80 to-transparent rounded-tr-2xl rounded-br-2xl" />
            </div>
            <div className="relative z-10 w-full flex flex-col items-center justify-center h-full">
              <div className="w-full max-w-xs mx-auto">
                <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-lg text-center">
                  {formData.role === 'Candidate'
                    ? 'Land Your Dream Job Faster'
                    : 'Streamline Your Hiring Process'}
                </h3>
                <p className="text-white/90 mb-6 text-base text-center drop-shadow">
                  {formData.role === 'Candidate'
                    ? 'RMS helps candidates organize, track, and apply to jobs with ease. Get noticed by top employers.'
                    : 'Join thousands of companies using RMS to find the best talent faster and more efficiently.'}
                </p>
                <div className="bg-white/95 rounded-xl shadow-xl p-5 flex flex-col items-center mx-auto" style={{ minWidth: '220px' }}>
                  <img
                    src={formData.role === 'Candidate'
                      ? 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=96&h=96&facepad=2&q=80'
                      : 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=96&h=96&facepad=2&q=80'}
                    alt={formData.role === 'Candidate' ? 'Testimonial candidate' : 'Testimonial HR'}
                    className="w-16 h-16 rounded-full mb-2 object-cover border-2 border-[#181ed4]"
                  />
                  <p className="text-gray-700 text-center mb-1 text-base">
                    {formData.role === 'Candidate'
                      ? '“RMS made my job search so much easier and more organized. I landed my dream job in weeks!”'
                      : '“RMS made our hiring process so much faster and easier. The interface is beautiful and intuitive!”'}
                  </p>
                  <div className="font-semibold text-[#181ed4] text-base">
                    {formData.role === 'Candidate' ? 'Priya Patel' : 'Jane Doe'}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {formData.role === 'Candidate' ? 'Software Engineer' : 'HR Manager'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Register;