import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Edit2, Save, Undo, X, Plus, Trash2, Upload, FileText } from 'lucide-react';

const CandidateProfile = () => {
  const [isVisible, setIsVisible] = useState({});
  const [typedName, setTypedName] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [uploadedResume, setUploadedResume] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const observerRef = useRef();
  const fileInputRef = useRef();
  const profileImageRef = useRef();

  const initialData = {
    name: "Sanrah Chen",
    title: "Senior Frontend Developer & UI Architect",
    status: "Available for New Opportunities",
    personalInfo: [
      { label: 'Email Address', value: 'sarah.chen@email.com' },
      { label: 'Phone Number', value: '+1 (555) 123-4567' },
      { label: 'Location', value: 'San Francisco, CA' },
      { label: 'Experience Level', value: '5+ Years Professional' },
      { label: 'Languages', value: 'English, Mandarin, Spanish' },
      { label: 'Availability', value: 'Immediate Start' }
    ],
    skills: [
      'React', 'TypeScript', 'Next.js', 'Vue.js', 'Node.js', 'GraphQL',
      'AWS', 'Docker', 'Figma', 'MongoDB', 'Redis', 'Jest'
    ],
    experiences: [
      {
        title: 'Senior Frontend Developer',
        company: 'TechCorp Solutions',
        duration: 'Jan 2021 - Present',
        description: 'Leading a team of 6 developers in building scalable web applications using React and TypeScript. Architected micro-frontend solutions that improved development velocity by 40%. Spearheaded the adoption of modern development practices including automated testing, CI/CD pipelines, and performance monitoring.'
      },
      {
        title: 'Frontend Developer',
        company: 'Digital Innovations Inc',
        duration: 'Mar 2019 - Dec 2020',
        description: 'Developed responsive web applications serving 100K+ daily active users. Implemented advanced UI components and animations that increased user engagement by 35%. Collaborated closely with UX designers to create pixel-perfect interfaces and optimized application performance achieving 90+ Lighthouse scores.'
      },
      {
        title: 'Junior Web Developer',
        company: 'StartUp Labs',
        duration: 'Jun 2018 - Feb 2019',
        description: 'Built interactive user interfaces and integrated REST APIs for various client projects. Gained hands-on experience with modern JavaScript frameworks and responsive design principles. Contributed to code reviews and helped establish development best practices within the team.'
      }
    ]
  };

  const [currentData, setCurrentData] = useState(initialData);
  const [savedData, setSavedData] = useState(initialData);

  // Typing animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      let i = 0;
      const typeWriter = () => {
        if (i < currentData.name.length) {
          setTypedName(currentData.name.slice(0, i + 1));
          i++;
          setTimeout(typeWriter, 100);
        }
      };
      typeWriter();
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentData.name]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(prev => ({
                ...prev,
                [entry.target.dataset.id]: true
              }));
            }, index * 100);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Register elements for animation
  const registerElement = (el) => {
    if (el && observerRef.current) {
      observerRef.current.observe(el);
    }
  };

  // Edit functions
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (isEditMode && hasChanges) {
      // Auto-save when exiting edit mode if there are changes
      handleSave();
    }
  };

  const handleSave = () => {
    setSavedData(currentData);
    setHasChanges(false);
    setIsEditMode(false);
  };

  const handleUndo = () => {
    setCurrentData(savedData);
    setHasChanges(false);
  };

  // Stable update function using useCallback with empty dependency array
  const updateData = useCallback((path, value) => {
    setCurrentData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        const nextKey = keys[i + 1];
        
        if (!isNaN(nextKey)) {
          current[key] = [...current[key]];
          current = current[key];
        } else {
          current[key] = { ...current[key] };
          current = current[key];
        }
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
    setHasChanges(true);
  }, []);

  const addSkill = () => {
    setCurrentData(prev => ({
      ...prev,
      skills: [...prev.skills, 'New Skill']
    }));
    setHasChanges(true);
  };

  const removeSkill = (index) => {
    setCurrentData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
    setHasChanges(true);
  };

  const addExperience = () => {
    setCurrentData(prev => ({
      ...prev,
      experiences: [...prev.experiences, {
        title: 'New Position',
        company: 'Company Name',
        duration: 'Duration',
        description: 'Job description...'
      }]
    }));
    setHasChanges(true);
  };

  const removeExperience = (index) => {
    setCurrentData(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index)
    }));
    setHasChanges(true);
  };

  const addPersonalInfo = () => {
    setCurrentData(prev => ({
      ...prev,
      personalInfo: [...prev.personalInfo, {
        label: 'New Field',
        value: 'New Value'
      }]
    }));
    setHasChanges(true);
  };

  const removePersonalInfo = (index) => {
    setCurrentData(prev => ({
      ...prev,
      personalInfo: prev.personalInfo.filter((_, i) => i !== index)
    }));
    setHasChanges(true);
  };

  const handleResumeUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedResume({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2), // Size in MB
        type: file.type
      });
      setHasChanges(true);
    }
  };

  const handleProfileImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    setHasChanges(true);
    if (profileImageRef.current) {
      profileImageRef.current.value = '';
    }
  };

  const removeResume = () => {
    setUploadedResume(null);
    setHasChanges(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full bg-white text-gray-800 overflow-x-hidden font-inter">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"></div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-gradient-to-r from-indigo-100/30 to-purple-100/30 rounded-full animate-pulse"></div>
          <div className="absolute bottom-[20%] right-[15%] w-48 h-48 bg-gradient-to-r from-indigo-100/20 to-blue-100/20 rounded-full animate-bounce"></div>
        </div>
      </div>

      {/* Edit Controls */}
      <div className="fixed top-6 right-6 z-50 flex gap-2">
        {isEditMode ? (
          <>
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
              title="Save Changes"
            >
              <Save size={20} />
            </button>
            <button
              onClick={handleUndo}
              disabled={!hasChanges}
              className={`${hasChanges ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-300'} text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105`}
              title="Undo Changes"
            >
              <Undo size={20} />
            </button>
            <button
              onClick={toggleEditMode}
              className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
              title="Exit Edit Mode"
            >
              <X size={20} />
            </button>
          </>
        ) : (
          <button
            onClick={toggleEditMode}
            className="bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
            title="Edit Profile"
          >
            <Edit2 size={20} />
          </button>
        )}
      </div>

      <div className="w-full p-0">
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 px-10 py-16 text-center overflow-hidden">
            {/* Rotating decoration */}
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] opacity-10">
              <div className="w-full h-full bg-gradient-conic from-transparent via-white/20 to-transparent animate-spin"></div>
            </div>

            {/* Profile Image */}
            <div className="relative inline-block mb-8">
              <div className="absolute -inset-4 border-2 border-white/20 rounded-full animate-ping"></div>
              <div className="absolute -inset-8 border border-white/10 rounded-full animate-pulse"></div>
              <div 
                className={`w-40 h-40 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full flex items-center justify-center text-6xl font-bold relative z-10 transform transition-transform duration-300 hover:scale-105 overflow-hidden ${isEditMode ? 'cursor-pointer group' : ''}`}
                style={{
                  boxShadow: '0 0 0 10px rgba(79, 70, 229, 0.2)'
                }}
                onClick={() => isEditMode && profileImageRef.current?.click()}
              >
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  'SC'
                )}
                {isEditMode && (
                  <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Upload className="text-white" size={24} />
                  </div>
                )}
                {isEditMode && profileImage && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeProfileImage();
                    }}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    title="Remove Image"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <input
                ref={profileImageRef}
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                className="hidden"
              />
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold mb-4 text-white">
              {isEditMode ? (
                <div className="max-w-md mx-auto">
                  <input
                    type="text"
                    value={currentData.name}
                    onChange={(e) => updateData('name', e.target.value)}
                    className="text-5xl lg:text-6xl font-bold text-gray-800 text-center bg-white border-2 border-indigo-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none w-full"
                  />
                </div>
              ) : (
                typedName
              )}
            </h1>
            
            <div className="max-w-lg mx-auto mb-6">
              {isEditMode ? (
                <input
                  type="text"
                  value={currentData.title}
                  onChange={(e) => updateData('title', e.target.value)}
                  className="text-xl block text-center text-gray-800 bg-white border-2 border-indigo-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none w-full"
                />
              ) : (
                <span className="text-xl block text-center text-white/90">{currentData.title}</span>
              )}
            </div>
            
            <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 px-6 py-3 rounded-full backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div className="min-w-0">
                {isEditMode ? (
                  <input
                    type="text"
                    value={currentData.status}
                    onChange={(e) => updateData('status', e.target.value)}
                    className="font-semibold text-gray-800 bg-white border-2 border-indigo-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none w-full"
                  />
                ) : (
                  <span className="font-semibold text-green-400">{currentData.status}</span>
                )}
              </div>
            </div>
          </div>

          <div className="p-10 lg:p-16">
            {/* Resume Upload Section */}
            <div 
              ref={registerElement}
              data-id="resume-upload"
              className={`mb-16 transform transition-all duration-700 ${
                isVisible['resume-upload'] 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                  📄
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Resume</h2>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 backdrop-blur-sm transition-all duration-300 hover:bg-gray-100 hover:shadow-xl">
                {uploadedResume ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <FileText className="text-indigo-600" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{uploadedResume.name}</h3>
                        <p className="text-sm text-gray-500">{uploadedResume.size} MB</p>
                      </div>
                    </div>
                    {isEditMode && (
                      <button
                        onClick={removeResume}
                        className="text-red-500 hover:text-red-700 p-2"
                        title="Remove Resume"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div 
                    className={`border-2 border-dashed border-gray-300 rounded-xl p-8 text-center transition-all duration-300 ${
                      isEditMode ? 'hover:border-indigo-400 cursor-pointer' : ''
                    }`}
                    onClick={() => isEditMode && fileInputRef.current?.click()}
                  >
                    <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      {isEditMode ? 'Upload Resume' : 'No Resume Uploaded'}
                    </h3>
                    {isEditMode && (
                      <p className="text-gray-500">Click to browse or drag and drop your resume</p>
                    )}
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Personal Info Section */}
            <div 
              ref={registerElement}
              data-id="personal-info"
              className={`mb-16 transform transition-all duration-700 ${
                isVisible['personal-info'] 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                    👤
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">Personal Info</h2>
                </div>
                {isEditMode && (
                  <button
                    onClick={addPersonalInfo}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-lg transition-colors"
                    title="Add Field"
                  >
                    <Plus size={18} />
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentData.personalInfo.map((info, index) => (
                  <div 
                    key={`personal-${index}`}
                    className="bg-gray-50 border border-gray-200 rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:bg-gray-100 hover:shadow-xl group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    {isEditMode && (
                      <button
                        onClick={() => removePersonalInfo(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        title="Remove Field"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    <div className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-3">
                      {isEditMode ? (
                        <input
                          type="text"
                          value={info.label}
                          onChange={(e) => updateData(`personalInfo.${index}.label`, e.target.value)}
                          className="text-gray-500 text-sm font-semibold uppercase tracking-wide bg-white border-2 border-indigo-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none w-full"
                        />
                      ) : (
                        <span>{info.label}</span>
                      )}
                    </div>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={info.value}
                        onChange={(e) => updateData(`personalInfo.${index}.value`, e.target.value)}
                        className="text-gray-800 text-lg font-semibold bg-white border-2 border-indigo-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none w-full"
                      />
                    ) : (
                      <span className="text-gray-800 text-lg font-semibold">{info.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Section */}
            <div 
              ref={registerElement}
              data-id="skills"
              className={`mb-16 transform transition-all duration-700 ${
                isVisible['skills'] 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                    ⚡
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">Technical Skills</h2>
                </div>
                {isEditMode && (
                  <button
                    onClick={addSkill}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-lg transition-colors"
                    title="Add Skill"
                  >
                    <Plus size={18} />
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {currentData.skills.map((skill, index) => (
                  <div 
                    key={`skill-${index}`}
                    className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:border-indigo-300 cursor-pointer group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                    <div className="relative z-10 flex items-center justify-between">
                      {isEditMode ? (
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => updateData(`skills.${index}`, e.target.value)}
                          className="text-gray-800 font-semibold text-center bg-white border-2 border-indigo-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none w-full"
                        />
                      ) : (
                        <span className="text-gray-800 font-semibold flex-1 text-center">{skill}</span>
                      )}
                      {isEditMode && (
                        <button
                          onClick={() => removeSkill(index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                          title="Remove Skill"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Section */}
            <div 
              ref={registerElement}
              data-id="experience"
              className={`mb-16 transform transition-all duration-700 ${
                isVisible['experience'] 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                    💼
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">Professional Journey</h2>
                </div>
                {isEditMode && (
                  <button
                    onClick={addExperience}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-lg transition-colors"
                    title="Add Experience"
                  >
                    <Plus size={18} />
                  </button>
                )}
              </div>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 to-purple-500"></div>
                
                {currentData.experiences.map((exp, index) => (
                  <div key={`exp-${index}`} className="relative mb-10 pl-20">
                    {/* Timeline dot */}
                    <div className="absolute left-6 top-8 w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full border-4 border-white"></div>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 backdrop-blur-sm transition-all duration-300 hover:translate-x-4 hover:bg-gray-100 hover:shadow-xl relative">
                      {isEditMode && (
                        <button
                          onClick={() => removeExperience(index)}
                          className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                          title="Remove Experience"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                      <div className="mb-6">
                        <div className="mb-2">
                          {isEditMode ? (
                            <input
                              type="text"
                              value={exp.title}
                              onChange={(e) => updateData(`experiences.${index}.title`, e.target.value)}
                              className="text-xl font-bold text-gray-800 bg-white border-2 border-indigo-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none w-full"
                            />
                          ) : (
                            <span className="text-xl font-bold text-gray-800">{exp.title}</span>
                          )}
                        </div>
                        <div className="mb-1">
                          {isEditMode ? (
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => updateData(`experiences.${index}.company`, e.target.value)}
                              className="text-lg font-semibold text-indigo-500 bg-white border-2 border-indigo-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none w-full"
                            />
                          ) : (
                            <span className="text-lg font-semibold text-indigo-500">{exp.company}</span>
                          )}
                        </div>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={exp.duration}
                            onChange={(e) => updateData(`experiences.${index}.duration`, e.target.value)}
                            className="text-gray-500 text-sm font-medium bg-white border-2 border-indigo-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none w-full"
                          />
                        ) : (
                          <span className="text-gray-500 text-sm font-medium">{exp.duration}</span>
                        )}
                      </div>
                      {isEditMode ? (
                        <textarea
                          value={exp.description}
                          onChange={(e) => updateData(`experiences.${index}.description`, e.target.value)}
                          className="text-gray-700 leading-relaxed bg-white border-2 border-indigo-200 rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none resize-none w-full"
                          rows={4}
                        />
                      ) : (
                        <span className="text-gray-700 leading-relaxed">{exp.description}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-10 py-16 text-center relative overflow-hidden">
            <h2 className="text-4xl font-bold text-white mb-4">Let's Create Something Amazing</h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Ready to bring your ideas to life with cutting-edge technology and exceptional user experiences.
            </p>
            
            <div className="flex flex-wrap justify-center gap-5">
              {['Get In Touch', 'View Portfolio', 'Download Resume', 'LinkedIn'].map((btn, index) => (
                <a
                  key={index}
                  href="#"
                  className="bg-white/10 border-2 border-white/20 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-white/40 backdrop-blur-sm relative overflow-hidden group"
                >
                  <span className="relative z-10">{btn}</span>
                  <div className="absolute inset-0 bg-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;