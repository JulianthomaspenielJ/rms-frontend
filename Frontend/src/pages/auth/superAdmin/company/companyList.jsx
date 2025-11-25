import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Building, Users, MapPin, Mail, Phone, Calendar, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../../../utils/url';

const CompanyManagementDashboard = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    employees: '',
    industry: '',
    company_name: '',
    company_location: '',
    company_size: ''
  });

  // Filter companies based on search term
  const filteredCompanies = companies.filter(company => 
    (company.name && company.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (company.email && company.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (company.industry && company.industry.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (company.phone && company.phone.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Fetch companies from API
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`${BASE_URL}/superadmin/company-list`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch companies');
        }

        const data = await response.json();
        if (data.ok && data.data) {
          // Map API response to match the expected format
          const formattedCompanies = data.data.map(company => ({
            id: company.id || 'N/A',
            name: company.company_name || company.name || 'N/A',
            email: company.email || 'N/A',
            phone: company.phone || 'N/A',
            address: company.company_location || company.address || 'N/A',
            employees: company.employees || company.company_size || 'N/A',
            registeredDate: company.registeredDate || 'N/A',
            status: company.active_status || 'Inactive', // Ensure status is set from active_status
            industry: company.industry || 'N/A',
            created_at: company.created_at || 'N/A',
            updated_at: company.updated_at || 'N/A',
            created_by: company.created_by || 'N/A',
            updated_by: company.updated_by || 'N/A'
          }));
          setCompanies(formattedCompanies);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
        setError('Failed to load companies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [navigate]);

  // Update company status (Active/Block/Delete)
  const updateCompanyStatus = async (companyId, action) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const company = companies.find(c => c.id === companyId);
      if (!company) {
        alert('Company not found');
        return;
      }

      // Map action to the correct status format expected by the API
      const statusMap = {
        'block': 'Block',
        'active': 'Active', // Changed from 'unblock' to 'active' to match button action
        'delete': 'Delete'
      };

      const requestBody = {
        company_id: companyId,
        active_status: statusMap[action] || 'Active',
        email_address: company.email
      };

      console.log('Sending request to update company status:', requestBody);

      const response = await fetch(`${BASE_URL}/superadmin/company/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Request URL:', `${BASE_URL}/superadmin/company/status`);
      console.log('Request Headers:', {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
      console.log('Request Body:', JSON.stringify(requestBody, null, 2));

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || `Failed to ${action} company`);
      }

      // Update local state based on API response
      const updatedStatus = responseData.data?.active_status || 
                          (action === 'delete' ? 'Delete' : 
                           action === 'block' ? 'Block' : 'Active');
      
      setCompanies(prevCompanies => 
        action === 'delete'
          ? prevCompanies.filter(c => c.id !== companyId)
          : prevCompanies.map(c => 
              c.id === companyId 
                ? { ...c, status: updatedStatus, active_status: updatedStatus } // Update both status and active_status
                : c
            )
      );

      alert(`Company ${action}ed successfully`);
    } catch (error) {
      console.error(`Error ${action}ing company:`, error);
      alert(`Failed to ${action} company: ${error.message}`);
    }
  };

  const handleSubmit = () => {
    if (modalMode === 'add') {
      const newCompany = {
        id: Math.max(...companies.map(c => c.id)) + 1,
        ...formData,
        employees: parseInt(formData.employees),
        registeredDate: new Date().toISOString().split('T')[0],
        status: 'Active', // Set default status for new company
        active_status: 'Active' // Ensure active_status is set
      };
      setCompanies([...companies, newCompany]);
    } else {
      setCompanies(companies.map(company =>
        company.id === selectedCompany.id
          ? { ...company, ...formData, employees: parseInt(formData.employees), status: formData.status, active_status: formData.status }
          : company
      ));
    }
    
    setShowModal(false);
    setSelectedCompany(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow h-16 flex-shrink-0 flex items-center px-6">
        <h1 className="text-xl font-semibold text-gray-800">Company Management</h1>
      </div>

      <div className="flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="w-full bg-gray-50 p-6">
            {/* Search and Add Section */}
            <div className="bg-white rounded-2xl shadow-lg border p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search companies..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => navigate('/superadmin/company/create')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Company</span>
                </button>
              </div>
            </div>

            {/* Companies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((company) => (
                <div key={company.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <Building className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{company.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center space-x-1 ${
                          company.status === 'Active' 
                            ? 'bg-green-50 text-green-800 border border-green-200' 
                            : company.status === 'Block'
                            ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                          {company.status === 'Active' && (
                            <>
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                              <span>Active</span>
                            </>
                          )}
                          {company.status === 'Block' && (
                            <>
                              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                              <span>Blocked</span>
                            </>
                          )}
                          {company.status === 'Delete' && (
                            <>
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                              <span>Deleted</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {company.status === 'Active' && (
                        <>
                          <button
                            onClick={() => updateCompanyStatus(company.id, 'block')}
                            className="p-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-lg transition-all duration-300 border border-yellow-200"
                            title="Block Company"
                          >
                            🚫 
                          </button>
                          <button
                            onClick={() => updateCompanyStatus(company.id, 'delete')}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all duration-300 border border-red-200"
                            title="Delete Company"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {company.status === 'Block' && (
                        <>
                          <button
                            onClick={() => updateCompanyStatus(company.id, 'active')}
                            className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-all duration-300 border border-green-200"
                            title="Activate Company"
                          >
                            ✅ 
                          </button>
                          <button
                            onClick={() => updateCompanyStatus(company.id, 'delete')}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all duration-300 border border-red-200"
                            title="Delete Company"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {company.status === 'Delete' && (
                        <button
                          onClick={() => updateCompanyStatus(company.id, 'active')}
                          className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-all duration-300 border border-green-200"
                          title="Activate Company"
                        >
                          ✅ 
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{company.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{company.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{company.address}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">{company.employees} employees</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">{company.registeredDate}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <span className="text-xs text-indigo-700 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-200">
                        {company.industry}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredCompanies.length === 0 && (
              <div className="text-center py-12">
                <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No companies found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or add a new company.</p>
              </div>
            )}

            {/* Modal */}
            {showModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    {modalMode === 'add' ? 'Add New Company' : 'Edit Company'}
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Company Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Phone</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Address</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        rows="2"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Employees</label>
                        <input
                          type="number"
                          name="employees"
                          value={formData.employees}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Status</label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="Active" className="bg-white">Active</option>
                          <option value="Block" className="bg-white">Blocked</option>
                          <option value="Delete" className="bg-white">Deleted</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Industry</label>
                      <input
                        type="text"
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-300 border border-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-300 shadow-lg"
                      >
                        {modalMode === 'add' ? 'Add Company' : 'Update Company'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyManagementDashboard;