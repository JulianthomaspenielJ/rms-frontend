import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Eye, FileText, Users, Upload, X } from 'lucide-react';

const HrManageJDs = () => {
  const [jdList, setJdList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [selectedJdForUpload, setSelectedJdForUpload] = useState(null);
  const [newJD, setNewJD] = useState({ title: '', file: null, status: 'Open' , department: ''});
  const [bulkResumes, setBulkResumes] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setNewJD({ ...newJD, file });
    } else {
      setError('Please upload a valid PDF file');
      e.target.value = ''; // Reset the file input
    }
  };

  const handleBulkResumeChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const invalidFiles = [];

    // Validate each file
    files.forEach(file => {
      if (file.type === 'application/pdf') {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      setError(`Invalid file types detected. Only PDF files are allowed. Invalid files: ${invalidFiles.join(', ')}`);
    } else {
      setError(null);
    }

    // Add new files to existing files instead of replacing them
    if (validFiles.length > 0) {
      setBulkResumes(prev => [...prev, ...validFiles]);
    }
    
    // Reset the input value so the same files can be selected again if needed
    e.target.value = '';
  };

  const handleSubmit = async () => {
    if (!newJD.title || !newJD.file || !newJD.department) {
      setError('Please fill in all required fields');
      return;
    }

    setIsUploading(true);
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const formData = new FormData();
      formData.append('title', newJD.title);
      formData.append('department', newJD.department);
      formData.append('pdfFile', newJD.file);

      const response = await axios.post(
        'http://localhost:4000/api/jd/upload-job-description',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.ok) {
        // Add the new JD to the list
        const newJDEntry = {
          id: response.data.data.id,
          title: response.data.data.title,
          date: new Date(response.data.data.uploaded_at).toISOString().split('T')[0],
          fileName: response.data.data.jd_url.split('/').pop(),
          status: 'Open',
          jd_url: response.data.data.jd_url
        };

        setJdList([newJDEntry, ...jdList]);
        setShowModal(false);
        setNewJD({ title: '', file: null, status: 'Open', department: '' });
      }
    } catch (error) {
      console.error('Error uploading JD:', error);
      setError(error.response?.data?.message || 'Failed to upload job description. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleBulkUpload = async () => {
    if (bulkResumes.length > 0 && selectedJdForUpload) {
      setIsBulkUploading(true);
      setError('');
      
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No authentication token found. Please log in again.');
        }

        const formData = new FormData();
        formData.append('jd_id', selectedJdForUpload.id);
        
        // Append all resume files
        bulkResumes.forEach((file, index) => {
          formData.append('resumes', file);
        });

        const response = await axios.post(
          'http://localhost:4000/api/jd/upload-bulk-resumes',
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        if (response.data.ok) {
          // Update applications count for the selected JD
          setJdList(jdList.map(jd => 
            jd.id === selectedJdForUpload.id 
              ? { ...jd, applications: (jd.applications || 0) + response.data.data.successful_uploads }
              : jd
          ));
          
          setShowBulkUploadModal(false);
          setBulkResumes([]);
          setSelectedJdForUpload(null);
          
          // Show success message with AI analysis results
          const aiAnalysis = response.data.data.ai_analysis;
          let message = `Bulk resume upload completed!\n\nUpload Results:\n- ${response.data.data.successful_uploads} successful\n- ${response.data.data.failed_uploads} failed`;
          
          if (aiAnalysis) {
            message += `\n\nAI Analysis Results:\n- ${aiAnalysis.successful_analysis} successful\n- ${aiAnalysis.failed_analysis} failed`;
          }
          
          alert(message);
        }
      } catch (error) {
        console.error('Error uploading bulk resumes:', error);
        setError(error.response?.data?.error || error.response?.data?.message || 'Failed to upload resumes. Please try again.');
      } finally {
        setIsBulkUploading(false);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      // If changing to Closed, call the close endpoint
      if (newStatus === 'Closed') {
        const response = await axios.put(
          'http://localhost:4000/api/jd/close-job-description',
          { jd_id: id },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.ok) {
          // Update the JD list with the new status from the response
          setJdList(jdList.map(jd => 
            jd.id === id 
              ? { 
                  ...jd, 
                  status: 'Closed',
                  updated_at: response.data.data.updated_at
                } 
              : jd
          ));
        }
      } else {
        // For other status changes (like reopening), update the local state
        // You might want to add an API call here if you have an endpoint for reopening
        setJdList(jdList.map(jd => 
          jd.id === id 
            ? { 
                ...jd, 
                status: newStatus,
                updated_at: new Date().toISOString()
              } 
            : jd
        ));
      }
    } catch (error) {
      console.error('Error updating job status:', error);
      setError(error.response?.data?.message || 'Failed to update job status. Please try again.');
    }
  };

  const openBulkUploadModal = (jd) => {
    setSelectedJdForUpload(jd);
    setShowBulkUploadModal(true);
  };

  const closeBulkUploadModal = () => {
    setShowBulkUploadModal(false);
    setBulkResumes([]);
    setSelectedJdForUpload(null);
    setIsDragOver(false);
    setError(null);
  };

  const removeResumeFile = (index) => {
    setBulkResumes(bulkResumes.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    setBulkResumes([]);
    setError(null);
  };

  // Drag and drop handlers for bulk resume upload
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles = [];
    const invalidFiles = [];

    // Validate each file
    files.forEach(file => {
      if (file.type === 'application/pdf') {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      setError(`Invalid file types detected. Only PDF files are allowed. Invalid files: ${invalidFiles.join(', ')}`);
    } else {
      setError(null);
    }

    // Add to existing files or replace if empty
    if (validFiles.length > 0) {
      setBulkResumes(prev => [...prev, ...validFiles]);
    }
  };

  // Fetch JD list from API
  const fetchJDList = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      const response = await axios.get('http://localhost:4000/api/jd/jd-list', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.ok) {
        // Map API response to match UI structure
        const formattedJDs = response.data.data.job_descriptions.map(jd => ({
          id: jd.id,
          title: jd.title,
          date: new Date(jd.created_at).toISOString().split('T')[0],
          fileName: jd.jd_url.split('/').pop(),
          status: jd.status === 1 ? 'Open' : 'Closed',
          jd_url: jd.jd_url
        }));
        
        setJdList(formattedJDs);
      }
    } catch (err) {
      console.error('Error fetching JD list:', err);
      setError('Failed to fetch job descriptions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch JDs on component mount
  useEffect(() => {
    fetchJDList();
  }, []);

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200 cursor-pointer';
      case 'Closed':
        return 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200 cursor-pointer';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200 cursor-pointer';
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 80 80%22 width=%2280%22 height=%2280%22%3E%3Cpath fill=%22%23e5e7eb%22 d=%22M0 0h80v80H0z%22/%3E%3Cpath fill=%22%23f3f4f6%22 d=%22M40 0h40v40H40zM0 40h40v40H0z%22/%3E%3C/svg%3E')]">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight bg-gradient-to-r from-indigo-600 to-blue-500 text-transparent bg-clip-text">
          Job Description Hub
        </h2>
        <button
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-6 py-3 rounded-full hover:from-indigo-700 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          onClick={() => setShowModal(true)}
        >
          <Plus size={20} /> New JD
        </button>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <span className="sr-only">Close</span>
            <X size={16} />
          </button>
        </div>
      )}

      {/* JD Summary Card */}
      <div className="bg-gradient-to-br from-white to-gray-50 shadow-xl p-6 rounded-2xl w-fit mb-8 transform transition-all hover:shadow-2xl">
        <h3 className="text-sm font-medium text-gray-600">Total Job Descriptions</h3>
        <p className="text-4xl font-bold text-indigo-600">{loading ? '...' : jdList.length}</p>
      </div>

      {/* JD Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-2">
        {jdList.map((jd) => (
          <div
            key={jd.id}
            className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            onClick={() => navigate(`/hr/jdliststatus/${jd.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { 
              if (e.key === 'Enter' || e.key === ' ') { 
                e.preventDefault(); 
                navigate(`/hr/jdliststatus/${jd.id}`); 
              } 
            }}
          >
            <div className="flex flex-col space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-800 leading-tight truncate max-w-[180px]">{jd.title}</h4>
                <select
                  className={`text-xs font-semibold rounded-full px-3 py-1 border ${getStatusStyles(jd.status)} focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-200`}
                  value={jd.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleStatusChange(jd.id, e.target.value)}
                >
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="text-indigo-600 flex-shrink-0 mt-1" size={20} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Uploaded: {jd.date}</p>
                  <a 
                    href={jd.jd_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline truncate block"
                    onClick={(e) => e.stopPropagation()}
                    title={jd.fileName}
                  >
                    {jd.fileName}
                  </a>
                </div>
              </div>
            </div> 
            
            {/* <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="text-indigo-600" size={16} />
                <p className="text-sm font-medium text-gray-600">{jd.applications} Applications</p>
              </div>
              <button className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm font-medium transition-colors duration-200">
                <Eye size={16} /> View
              </button>
            </div> */}

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={(e) => { e.stopPropagation(); openBulkUploadModal(jd); }}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Upload size={16} /> Upload Resumes
              </button>
              
              <button
                onClick={(e) => { 
                  e.stopPropagation(); 
                  navigate('/hr/interviewscore', { state: { jdId: jd.id, jdTitle: jd.title } });
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Eye size={16} /> View Interview Score
              </button>
            </div>

            {/* <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((jd.applications / 50) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Application Progress</p>
            </div> */}
          </div>
        ))}
      </div>

      {/* Upload JD Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl transform transition-all scale-100 animate-in">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Upload New Job Description</h3>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                {error}
                <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">JD Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50"
                  value={newJD.title}
                  onChange={(e) => setNewJD({ ...newJD, title: e.target.value })}
                  placeholder="Enter job description title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Department <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50"
                  value={newJD.department}
                  onChange={(e) => setNewJD({ ...newJD, department: e.target.value })}
                  placeholder="Enter department"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">JD File (PDF) <span className="text-red-500">*</span></label>
                <div className={`mt-1 flex items-center border-2 border-dashed rounded-lg p-4 ${!newJD.file ? 'border-gray-300' : 'border-green-300 bg-green-50'}`}>
                  <div className="flex-1">
                    <svg
                      className={`mx-auto h-12 w-12 ${!newJD.file ? 'text-gray-400' : 'text-green-500'}`}
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="mt-2 flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          className="sr-only" 
                          onChange={handleFileChange} 
                          accept=".pdf" 
                          required
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF up to 10MB</p>
                  </div>
                </div>
                {newJD.file && (
                  <div className="mt-2 flex items-center text-sm text-green-700">
                    <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {newJD.file.name}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setError(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isUploading || !newJD.title || !newJD.department || !newJD.file}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${!newJD.title || !newJD.department || !newJD.file ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isUploading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </span>
                  ) : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Resume Upload Modal */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white p-8 rounded-2xl w-full max-w-2xl shadow-2xl transform transition-all scale-100 animate-in max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Upload Bulk Resumes for: {selectedJdForUpload?.title}
              </h3>
              <button
                onClick={closeBulkUploadModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-5">
              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Multiple Resume Files
                </label>
                
                {/* Drag and Drop Zone */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                    isDragOver 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">
                    Drag and drop PDF files here, or
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,application/pdf"
                    className="hidden"
                    id="bulk-resume-upload"
                    onChange={handleBulkResumeChange}
                  />
                  <label
                    htmlFor="bulk-resume-upload"
                    className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 cursor-pointer transition-colors duration-200"
                  >
                    Browse Multiple Files
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Supported format: PDF only. You can select multiple PDF files at once using either method.
                  </p>
                </div>
              </div>

              {/* Selected Files List */}
              {bulkResumes.length > 0 && (
                <div className="border rounded-lg p-4 bg-gray-50 max-h-60 overflow-y-auto">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium text-gray-700">
                      Selected Files ({bulkResumes.length})
                    </h4>
                    <button
                      onClick={clearAllFiles}
                      className="text-xs text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-2">
                    {bulkResumes.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white p-3 rounded-lg border"
                      >
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-green-600" />
                          <span className="text-sm text-gray-700 truncate max-w-xs">
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          onClick={() => removeResumeFile(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
                  onClick={closeBulkUploadModal}
                  disabled={isBulkUploading}
                >
                  Cancel
                </button>
                <button
                  className={`px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg hover:from-green-700 hover:to-emerald-600 transition-all duration-200 flex items-center gap-2 ${
                    isBulkUploading || bulkResumes.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={handleBulkUpload}
                  disabled={isBulkUploading || bulkResumes.length === 0}
                >
                  {isBulkUploading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Uploading {bulkResumes.length} resumes...
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      Upload {bulkResumes.length} Resume{bulkResumes.length !== 1 ? 's' : ''}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HrManageJDs; 