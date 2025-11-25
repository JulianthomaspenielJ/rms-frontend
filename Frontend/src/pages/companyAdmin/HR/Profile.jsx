import { useState } from 'react';
import { Edit3, Save, X, MapPin, Phone, Mail, Globe, Users, Calendar, Building, Undo2, Camera, Award, Target, Eye, Heart } from 'lucide-react';

export default function CompanyProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: 'TechCorp Solutions',
    logo: 'https://ui-avatars.com/api/?name=TechCorp&background=3B82F6&color=FFFFFF&size=400&font-size=0.5&bold=true',
    coverImage: '',  // Empty string for no image, using gradient instead
    tagline: 'Innovation at its finest',
    description: 'We are a leading technology company specializing in cutting-edge software solutions and digital transformation services. Our team of experts delivers innovative products that help businesses thrive in the digital age.',
    industry: 'Technology & Software',
    founded: '2015',
    employees: '250-500',
    headquarters: 'San Francisco, CA',
    website: 'www.techcorp.com',
    email: 'contact@techcorp.com',
    phone: '+1 (555) 123-4567',
    address: '123 Innovation Drive, San Francisco, CA 94105',
    mission: 'To empower businesses through innovative technology solutions that drive growth and efficiency.',
    vision: 'To be the global leader in digital transformation, creating a more connected and efficient world.',
    values: ['Innovation', 'Integrity', 'Customer Focus', 'Excellence', 'Collaboration'],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/techcorp',
      twitter: 'https://twitter.com/techcorp',
      facebook: 'https://facebook.com/techcorp'
    },
    certifications: ['ISO 9001:2015', 'SOC 2 Type II', 'GDPR Compliant'],
    languages: ['English', 'Spanish', 'French', 'German']
  });

  const [editData, setEditData] = useState({ ...companyData });
  const [history, setHistory] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...companyData });
    setHistory([]);
    setHasUnsavedChanges(false);
  };

  const handleSave = () => {
    setCompanyData({ ...editData });
    setIsEditing(false);
    setHistory([]);
    setHasUnsavedChanges(false);
  };

  const handleCancel = () => {
    setEditData({ ...companyData });
    setIsEditing(false);
    setHistory([]);
    setHasUnsavedChanges(false);
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setEditData(previousState);
      setHistory(prev => prev.slice(0, -1));
      setHasUnsavedChanges(true);
    }
  };

  const handleInputChange = (field, value) => {
    // Save current state to history before changing
    setHistory(prev => [...prev, { ...editData }]);
    setEditData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSocialLinksChange = (platform, value) => {
    setHistory(prev => [...prev, { ...editData }]);
    setEditData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value }
    }));
    setHasUnsavedChanges(true);
  };

  const handleValuesChange = (index, value) => {
    setHistory(prev => [...prev, { ...editData }]);
    const newValues = [...editData.values];
    newValues[index] = value;
    setEditData(prev => ({ ...prev, values: newValues }));
    setHasUnsavedChanges(true);
  };

  const addValue = () => {
    setHistory(prev => [...prev, { ...editData }]);
    setEditData(prev => ({ ...prev, values: [...prev.values, 'New Value'] }));
    setHasUnsavedChanges(true);
  };

  const removeValue = (index) => {
    setHistory(prev => [...prev, { ...editData }]);
    const newValues = editData.values.filter((_, i) => i !== index);
    setEditData(prev => ({ ...prev, values: newValues }));
    setHasUnsavedChanges(true);
  };

  const handleCertificationChange = (index, value) => {
    setHistory(prev => [...prev, { ...editData }]);
    const newCerts = [...editData.certifications];
    newCerts[index] = value;
    setEditData(prev => ({ ...prev, certifications: newCerts }));
    setHasUnsavedChanges(true);
  };

  const addCertification = () => {
    setHistory(prev => [...prev, { ...editData }]);
    setEditData(prev => ({ ...prev, certifications: [...prev.certifications, 'New Certification'] }));
    setHasUnsavedChanges(true);
  };

  const removeCertification = (index) => {
    setHistory(prev => [...prev, { ...editData }]);
    const newCerts = editData.certifications.filter((_, i) => i !== index);
    setEditData(prev => ({ ...prev, certifications: newCerts }));
    setHasUnsavedChanges(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header with Cover Image */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 transform hover:shadow-3xl transition-all duration-300">
          <div className="relative h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
            <img
              src={isEditing ? editData.coverImage : companyData.coverImage}
              alt="Company Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-purple-900/30"></div>
            
            {/* Action Buttons */}
            <div className="absolute top-6 right-6">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Edit3 size={20} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleUndo}
                    disabled={history.length === 0}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-white transition-all duration-300 shadow-lg ${
                      history.length === 0 
                        ? 'bg-gray-500/50 cursor-not-allowed opacity-50' 
                        : 'bg-orange-500/80 backdrop-blur-md hover:bg-orange-600 hover:shadow-xl'
                    }`}
                  >
                    <Undo2 size={18} />
                    Undo
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 bg-green-500/80 backdrop-blur-md rounded-xl text-white hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-3 bg-red-500/80 backdrop-blur-md rounded-xl text-white hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Unsaved Changes Indicator */}
            {isEditing && hasUnsavedChanges && (
              <div className="absolute top-6 left-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 backdrop-blur-md rounded-lg text-white">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Unsaved changes</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Company Logo and Basic Info */}
          <div className="relative px-8 pb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-end gap-8 -mt-20">
              <div className="relative group">
                <img
                  src={isEditing ? editData.logo : companyData.logo}
                  alt="Company Logo"
                  className="w-40 h-40 rounded-3xl border-6 border-white shadow-2xl bg-white object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {isEditing && (
                  <div className="absolute inset-0 rounded-3xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Camera className="text-white" size={24} />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0 space-y-2">
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="text-4xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-600 w-full pb-2"
                      placeholder="Company Name"
                    />
                    <input
                      type="text"
                      value={editData.tagline}
                      onChange={(e) => handleInputChange('tagline', e.target.value)}
                      className="text-xl text-gray-600 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full pb-2"
                      placeholder="Company Tagline"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <input
                        type="url"
                        value={editData.logo}
                        onChange={(e) => handleInputChange('logo', e.target.value)}
                        className="text-sm text-gray-500 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                        placeholder="Logo URL"
                      />
                      <input
                        type="url"
                        value={editData.coverImage}
                        onChange={(e) => handleInputChange('coverImage', e.target.value)}
                        className="text-sm text-gray-500 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                        placeholder="Cover Image URL"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                      {companyData.name}
                    </h1>
                    <p className="text-xl text-gray-600 font-medium">{companyData.tagline}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Building size={16} />
                        {companyData.industry}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={16} />
                        Est. {companyData.founded}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={16} />
                        {companyData.employees} employees
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Column - Main Content */}
          <div className="xl:col-span-3 space-y-8">
            {/* Enhanced About Section */}
            <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Building className="text-white" size={24} />
                </div>
                About Company
              </h2>
              
              {isEditing ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Description</label>
                    <textarea
                      value={editData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={5}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                      placeholder="Tell us about your company..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Industry</label>
                      <input
                        type="text"
                        value={editData.industry}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Your industry"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Founded</label>
                      <input
                        type="text"
                        value={editData.founded}
                        onChange={(e) => handleInputChange('founded', e.target.value)}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Founded year"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <p className="text-gray-700 leading-relaxed text-lg font-medium">{companyData.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="font-semibold text-gray-900">Industry</span>
                      </div>
                      <p className="text-blue-700 font-bold text-lg">{companyData.industry}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="font-semibold text-gray-900">Founded</span>
                      </div>
                      <p className="text-purple-700 font-bold text-lg">{companyData.founded}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-semibold text-gray-900">Team Size</span>
                      </div>
                      <p className="text-green-700 font-bold text-lg">{companyData.employees}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Mission, Vision & Values */}
            <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
              <h2 className="text-3xl font-bold text-gray-900 mb-10">Mission, Vision & Values</h2>
              
              <div className="space-y-10">
                {/* Mission */}
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                      <Target className="text-white" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-blue-600">Our Mission</h3>
                  </div>
                  {isEditing ? (
                    <textarea
                      value={editData.mission}
                      onChange={(e) => handleInputChange('mission', e.target.value)}
                      rows={4}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                      placeholder="Your company's mission..."
                    />
                  ) : (
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6">
                      <p className="text-gray-800 leading-relaxed text-lg font-medium">{companyData.mission}</p>
                    </div>
                  )}
                </div>

                {/* Vision */}
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                      <Eye className="text-white" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-purple-600">Our Vision</h3>
                  </div>
                  {isEditing ? (
                    <textarea
                      value={editData.vision}
                      onChange={(e) => handleInputChange('vision', e.target.value)}
                      rows={4}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-200"
                      placeholder="Your company's vision..."
                    />
                  ) : (
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6">
                      <p className="text-gray-800 leading-relaxed text-lg font-medium">{companyData.vision}</p>
                    </div>
                  )}
                </div>

                {/* Values */}
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                      <Heart className="text-white" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-green-600">Our Values</h3>
                  </div>
                  {isEditing ? (
                    <div className="space-y-4">
                      {editData.values.map((value, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => handleValuesChange(index, e.target.value)}
                            className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            placeholder={`Value ${index + 1}`}
                          />
                          <button
                            onClick={() => removeValue(index)}
                            className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-105"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={addValue}
                        className="px-6 py-3 text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 border-2 border-green-200 hover:border-green-300 font-semibold"
                      >
                        + Add Value
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {companyData.values.map((value, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border-2 border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                          <span className="text-green-800 font-bold text-center block">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* New Certifications Section */}
            <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center">
                  <Award className="text-white" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Certifications & Compliance</h2>
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                  {editData.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={cert}
                        onChange={(e) => handleCertificationChange(index, e.target.value)}
                        className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        placeholder={`Certification ${index + 1}`}
                      />
                      <button
                        onClick={() => removeCertification(index)}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-105"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addCertification}
                    className="px-6 py-3 text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 border-2 border-orange-200 hover:border-orange-300 font-semibold"
                  >
                    + Add Certification
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {companyData.certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-2xl p-6 border-2 border-orange-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <div className="flex items-center gap-3">
                        <Award className="text-orange-600" size={20} />
                        <span className="text-orange-800 font-bold">{cert}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Right Column */}
          <div className="xl:col-span-1 space-y-8">
            {/* Enhanced Contact Information */}
            <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Phone className="text-white" size={16} />
                </div>
                Contact
              </h3>
              
              <div className="space-y-6">
                <div className="group hover:bg-gray-50 rounded-2xl p-4 transition-all duration-200">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <MapPin className="text-blue-600" size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-600 mb-2">Headquarters</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.headquarters}
                          onChange={(e) => handleInputChange('headquarters', e.target.value)}
                          className="w-full text-gray-900 border-b border-gray-300 focus:outline-none focus:border-blue-500 pb-1"
                          placeholder="Headquarters location"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{companyData.headquarters}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="group hover:bg-gray-50 rounded-2xl p-4 transition-all duration-200">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Mail className="text-green-600" size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-600 mb-2">Email</p>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full text-gray-900 border-b border-gray-300 focus:outline-none focus:border-blue-500 pb-1"
                          placeholder="Contact email"
                        />
                      ) : (
                        <p className="text-blue-600 hover:underline cursor-pointer font-medium">{companyData.email}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="group hover:bg-gray-50 rounded-2xl p-4 transition-all duration-200">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <Phone className="text-purple-600" size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-600 mb-2">Phone</p>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full text-gray-900 border-b border-gray-300 focus:outline-none focus:border-blue-500 pb-1"
                          placeholder="Phone number"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{companyData.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="group hover:bg-gray-50 rounded-2xl p-4 transition-all duration-200">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                      <Globe className="text-indigo-600" size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-600 mb-2">Website</p>
                      {isEditing ? (
                        <input
                          type="url"
                          value={editData.website}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          className="w-full text-gray-900 border-b border-gray-300 focus:outline-none focus:border-blue-500 pb-1"
                          placeholder="Website URL"
                        />
                      ) : (
                        <p className="text-blue-600 hover:underline cursor-pointer font-medium">{companyData.website}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Social Media</h3>
              
              <div className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn</label>
                      <input
                        type="url"
                        value={editData.socialLinks.linkedin}
                        onChange={(e) => handleSocialLinksChange('linkedin', e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="LinkedIn URL"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Twitter</label>
                      <input
                        type="url"
                        value={editData.socialLinks.twitter}
                        onChange={(e) => handleSocialLinksChange('twitter', e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Twitter URL"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Facebook</label>
                      <input
                        type="url"
                        value={editData.socialLinks.facebook}
                        onChange={(e) => handleSocialLinksChange('facebook', e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Facebook URL"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <a href={companyData.socialLinks.linkedin} className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-all duration-200 group">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">in</span>
                      </div>
                      <span className="text-gray-700 group-hover:text-blue-600 font-medium">LinkedIn</span>
                    </a>
                    <a href={companyData.socialLinks.twitter} className="flex items-center gap-3 p-3 rounded-xl hover:bg-sky-50 transition-all duration-200 group">
                      <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">𝕏</span>
                      </div>
                      <span className="text-gray-700 group-hover:text-sky-600 font-medium">Twitter</span>
                    </a>
                    <a href={companyData.socialLinks.facebook} className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-all duration-200 group">
                      <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">f</span>
                      </div>
                      <span className="text-gray-700 group-hover:text-blue-700 font-medium">Facebook</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Company Stats */}
            <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Company Stats</h3>
              
              <div className="space-y-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                  <div className="w-12 h-12 bg-blue-500 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                    <Users className="text-white" size={24} />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Team Size</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.employees}
                      onChange={(e) => handleInputChange('employees', e.target.value)}
                      className="text-2xl font-bold text-blue-700 bg-transparent border-b border-blue-300 focus:outline-none focus:border-blue-500 text-center"
                      placeholder="Employee count"
                    />
                  ) : (
                    <p className="text-2xl font-bold text-blue-700">{companyData.employees}</p>
                  )}
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                  <div className="w-12 h-12 bg-green-500 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                    <Calendar className="text-white" size={24} />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Established</p>
                  <p className="text-2xl font-bold text-green-700">{isEditing ? editData.founded : companyData.founded}</p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
                  <div className="w-12 h-12 bg-purple-500 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                    <Globe className="text-white" size={24} />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Languages</p>
                  <p className="text-lg font-bold text-purple-700">{companyData.languages.length} Languages</p>
                </div>
              </div>
            </div>

            {/* Full Address */}
            <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <MapPin className="text-white" size={16} />
                </div>
                Address
              </h3>
              {isEditing ? (
                <textarea
                  value={editData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={4}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none transition-all duration-200"
                  placeholder="Full company address..."
                />
              ) : (
                <div className="bg-gradient-to-br from-red-50 to-pink-100 rounded-2xl p-4">
                  <p className="text-gray-800 leading-relaxed font-medium">{companyData.address}</p>
                </div>
              )}
            </div>

            {/* Languages Supported */}
            <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {companyData.languages.map((language, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-gradient-to-r from-indigo-50 to-purple-100 text-indigo-800 rounded-xl border-2 border-indigo-200 font-semibold text-sm hover:shadow-md transition-all duration-200"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}