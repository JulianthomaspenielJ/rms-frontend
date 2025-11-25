import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import '../../index.css';
import BASE_URL from '../../utils/url';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    let tempErrors = { email: '', password: '' };

    if (!form.email) {
      tempErrors.email = 'Email is required';
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      tempErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!form.password) {
      tempErrors.password = 'Password is required';
      valid = false;
    }

    setErrors(tempErrors);

    if (!valid) return;

    setIsLoading(true);

    try {
      
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: form.email,
          password: form.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Check if password change is required (temporary password detected)
      if (data.requires_password_change) {
        // Store user details for password change screen
        localStorage.setItem('tempUserEmail', data.user_details.email);
        localStorage.setItem('tempPassword', data.user_details.temp_password);
        localStorage.setItem('tempUserId', data.user_details.user_id);
        localStorage.setItem('tempUserRole', data.user_details.user_role);
        
        // Navigate to change password screen
        navigate('/change-password');
        return;
      }

      // Store the token and user details in localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userRole', data.user_details.user_role);
      localStorage.setItem('userId', data.user_details.user_id);
      localStorage.setItem('userEmail', data.user_details.email); // Store the email used to login

      // Redirect based on user role
      const userRole = data.user_details.user_role.toLowerCase();
      switch(userRole) {
        case 'superadmin':
          navigate('/super-admin');
          break;
        case 'hr':
          navigate('/hr/dashboard');
          break;
        case 'candidate':
          navigate('/candidate/applications');
          break;
        case 'company_admin':
          navigate('/company/dashboard'); // Assuming company admins go to the same place as HR
          break;
        case 'sub_admin':
          navigate('/super-admin'); // Assuming company admins go to the same place as HR
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        email: 'Invalid credentials',
        password: 'Invalid credentials'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative">
      <div className="absolute bottom-0 w-full h-[60%] bg-[#181ed4] rounded-t-[20%] z-0"></div>

      <form className="z-10 w-full max-w-md bg-white shadow-2xl rounded-2xl p-8" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center text-[#181ed4] mb-6">Login</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1 text-left ml-1">Email</label>
          <div className="flex items-start justify-start border border-gray-300 rounded-lg px-3">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="Enter your email"
              className="w-full py-2 pr-8 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.email && <span className="text-red-500 text-sm ml-1">{errors.email}</span>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1 text-left ml-1">Password</label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              autoComplete="current-password"
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
              className="w-full py-2 outline-none pr-3" // Adjusted padding-right for consistency
            />
          </div>
          {errors.password && <span className="text-red-500 text-sm ml-1">{errors.password}</span>}
        </div>

        <div className="flex justify-between items-center text-sm mb-6">
          <label className="flex items-center text-gray-600">
            <input type="checkbox" className="mr-2" /> Remember me
          </label>
          <Link to="/forgot" className="text-[#181ed4] hover:underline">Forgot password?</Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-[#181ed4] text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center ${isLoading ? 'opacity-75' : ''}`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </>
          ) : 'Login'}
        </button>

        <div className="mt-6 text-center">
          <span className="text-gray-600">Don't have an account?</span>{' '}
          <Link to="/candidate-register" className="text-[#181ed4] font-medium hover:underline">
            Create one
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;