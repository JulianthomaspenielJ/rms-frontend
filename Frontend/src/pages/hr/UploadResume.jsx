import { useState, useRef } from 'react';
// import Sidebar from '../../components/hr/Sidebar';

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const validTypes = ['.doc', '.docx', '.pdf', '.odt', '.rtf'];
  const maxSizeKB = 500;

  const handleFile = (selectedFile) => {
    setError('');
    
    // Validate file type
    const fileExt = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
    if (!validTypes.includes(fileExt)) {
      setError('Invalid file type. Only .doc, .docx, .pdf, .odt, .rtf allowed.');
      return;
    }

    // Validate file size (5KB)
    if (selectedFile.size > maxSizeKB * 1024) {
      setError(`File size exceeds ${maxSizeKB}KB limit`);
      return;
    }

    setFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const simulateUpload = () => {
    setIsUploading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsUploading(false);
      alert('File uploaded successfully!');
      setFile(null);
    }, 1500);
  };

  const handleDiscard = () => {
    setFile(null);
    setError('');
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      {/* <Sidebar /> */}

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Upload Your Resume</h1>
            
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
                ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-blue-200'}
                ${error ? 'border-red-300' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleInputChange}
                className="hidden" 
                accept=".doc,.docx,.pdf,.odt,.rtf" 
              />
              
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-10 w-10 text-blue-500" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                    />
                  </svg>
                </div>
                
                <div className="text-center">
                  <p className="text-gray-600">
                    <span className="text-blue-500 font-medium">Upload your resume</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Only .doc, .docx, .pdf, .odt, .rtf (Max 5KB)
                  </p>
                </div>
                
                {error && (
                  <p className="text-red-500 text-sm mt-2">
                    {error}
                  </p>
                )}
              </div>
            </div>

            {/* File Preview & Actions */}
            {file && (
              <div className="mt-6 animate-fadeIn">
                <div className="flex items-center justify-between bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700 truncate max-w-[160px]">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleDiscard}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={handleDiscard}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Discard
                  </button>
                  
                  <button
                    onClick={simulateUpload}
                    disabled={isUploading}
                    className={`flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg transition-colors
                      ${isUploading ? 'opacity-75' : 'hover:bg-blue-600'}`}
                  >
                    {isUploading ? 'Uploading...' : 'Submit'}
                  </button>
                </div>
              </div>
            )}
            
            {/* Upload Animation */}
            {isUploading && (
              <div className="mt-6 space-y-4 animate-pulse">
                <div className="h-4 bg-blue-100 rounded-full w-full"></div>
                <div className="h-4 bg-blue-100 rounded-full w-3/4"></div>
                
                <div className="pt-4">
                  <div className="relative h-2 w-full bg-blue-100 rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-progress"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadResume;
