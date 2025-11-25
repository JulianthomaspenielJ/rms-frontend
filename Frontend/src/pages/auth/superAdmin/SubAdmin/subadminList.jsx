import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Trash2, CheckCircle } from 'lucide-react';
import BASE_URL from '../../../../utils/url';

const SubSuperAdminManager = () => {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch sub-admins list
  const fetchSubAdmins = async () => {
    setIsLoading(true);
    try {
      const authToken = localStorage.getItem('authToken') || '';
      const response = await axios.get(`${BASE_URL}/superadmin/subadmin-list`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.ok) {
        setAdmins(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching sub-admins:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch sub-admins');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch sub-admins on component mount
  React.useEffect(() => {
    fetchSubAdmins();
  }, []);

  const handleInputChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const sendInvitationEmail = async (admin) => {
    try {
      const authToken = localStorage.getItem('authToken') || '';
      const response = await axios.post(
        `${BASE_URL}/subadmin/invite`,
        {
          email_address: admin.email,
          full_name: admin.name
        },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        toast.success('Invitation sent successfully!');
      } else {
        throw new Error(response.data.message || 'Failed to send invitation');
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error(error.response?.data?.message || 'Failed to send invitation');
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (form.name && form.email) {
      const tempPassword = generateRandomPassword();
      const newAdmin = {
        id: Date.now(),
        name: form.name,
        email: form.email,
        tempPassword,
        status: 'Invitation Sent',
      };
      
      try {
        await sendInvitationEmail(newAdmin);
        setAdmins([...admins, newAdmin]);
        setForm({ name: '', email: '' });
      } catch (error) {
        console.error('Error in handleAddAdmin:', error);
      }
    }
  };

  const updateSubAdminStatus = async (id, email, status) => {
    if (window.confirm(`Are you sure you want to ${status.toLowerCase()} this sub-admin?`)) {
      try {
        const authToken = localStorage.getItem('authToken') || '';
        await axios.put(
          `${BASE_URL}/superadmin/subadmin/status`,
          {
            subadmin_id: id,
            active_status: status,
            email_address: email
          },
          {
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Refresh the list after status update
        fetchSubAdmins();
        toast.success(`Sub-admin ${status.toLowerCase()} successfully`);
      } catch (error) {
        console.error(`Error ${status.toLowerCase()}ing sub-admin:`, error);
        toast.error(error.response?.data?.message || `Failed to ${status.toLowerCase()} sub-admin`);
      }
    }
  };

  const handleDelete = (id, email) => {
    updateSubAdminStatus(id, email, 'Delete');
  };
  
  const handleBlock = (id, email) => {
    updateSubAdminStatus(id, email, 'Block');
  };
  
  const handleActivate = (id, email) => {
    updateSubAdminStatus(id, email, 'Active');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Sub Super Admin Management</h1>
      
      {/* Invitation Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-indigo-700 mb-4">Invite New Sub Admin</h2>
        <form onSubmit={handleAddAdmin}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              name="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder="Full Name"
              className="px-4 py-2 border rounded-md focus:ring-indigo-500 focus:outline-none"
              required
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleInputChange}
              placeholder="Email Address"
              className="px-4 py-2 border rounded-md focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Send Invitation
          </button>
        </form>
      </div>

      {/* Sub Admins Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-indigo-100 text-indigo-800 font-semibold text-left">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-6 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-6 text-center text-gray-400">
                    No Sub Admins Found
                  </td>
                </tr>
              ) : (
                admins.map((admin) => {
                  const email = admin.email_address || admin.email;
                  const name = admin.full_name || admin.fullName;
                  const status = admin.status || 'Active';
                  
                  return (
                  <tr key={admin.id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-6 py-3">{name}</td>
                    <td className="px-6 py-3">{email}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 font-medium ${
                          status === 'Active' ? 'text-green-700' : 
                          status === 'Block' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          <CheckCircle size={16} className={
                            status === 'Active' ? 'text-green-600' : 
                            status === 'Block' ? 'text-yellow-500' : 'text-red-500'
                          } />
                          {status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        {admin.status === 'Active' ? (
                          <>
                            <button
                              onClick={() => handleBlock(admin.id, email)}
                              className="text-yellow-600 hover:text-yellow-800 p-1 rounded-full hover:bg-yellow-50"
                              title="Block"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(admin.id, email)}
                              className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        ) : admin.status === 'Block' ? (
                          <>
                            <button
                              onClick={() => handleActivate(admin.id, email)}
                              className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-50"
                              title="Activate"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="16"></line>
                                <line x1="8" y1="12" x2="16" y2="12"></line>
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(admin.id, email)}
                              className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        ) : admin.status === 'Delete' ? (
                          <button
                            onClick={() => handleActivate(admin.id, email)}
                            className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-50"
                            title="Activate"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="12" y1="8" x2="12" y2="16"></line>
                              <line x1="8" y1="12" x2="16" y2="12"></line>
                            </svg>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivate(admin.id, email)}
                            className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-50"
                            title="Activate"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="12" y1="8" x2="12" y2="16"></line>
                              <line x1="8" y1="12" x2="16" y2="12"></line>
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubSuperAdminManager;