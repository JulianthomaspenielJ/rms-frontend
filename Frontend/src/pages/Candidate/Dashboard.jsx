import React, { useState } from 'react';
import { Search, MapPin, Building2, Clock, DollarSign, Users, Star, Heart, Eye, ChevronRight, Filter, X, Globe, Calendar, Award, Camera } from 'lucide-react';

const Dashboard = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Sample job data
  const jobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechFlow Inc.',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120K - $150K',
      posted: '2 days ago',
      description: 'We are seeking a passionate Senior Frontend Developer to join our dynamic team. You will be responsible for creating exceptional user experiences using modern web technologies including React, TypeScript, and Next.js.',
      requirements: ['5+ years React experience', 'TypeScript proficiency', 'Modern CSS frameworks', 'API integration experience'],
      benefits: ['Health insurance', 'Flexible hours', 'Remote work options', '401k matching'],
      companyProfile: {
        name: 'TechFlow Inc.',
        size: '200-500 employees',
        industry: 'Software Development',
        founded: '2018',
        rating: 4.5,
        logo: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=100&h=100&fit=crop&crop=entropy',
        description: 'Leading software company focused on creating innovative solutions for modern businesses.',
        culture: 'We foster a collaborative environment where creativity and innovation thrive.',
        values: ['Innovation', 'Collaboration', 'Growth', 'Work-Life Balance'],
        mission: 'To revolutionize how businesses operate through cutting-edge technology solutions.',
        vision: 'Creating a world where technology seamlessly enhances human potential.',
        headquarters: 'San Francisco, CA',
        employees: 350,
        website: 'www.techflow.com',
        socialMedia: {
          linkedin: 'techflow-inc',
          twitter: '@techflow',
          instagram: 'techflow_official'
        },
        benefits: [
          'Comprehensive health insurance',
          'Flexible working hours',
          'Remote work options',
          '401(k) with company matching',
          'Professional development budget',
          'Free gym membership',
          'Catered meals',
          'Stock options'
        ],
        perks: [
          'Modern office spaces',
          'Latest tech equipment',
          'Team building events',
          'Conference attendance',
          'Mentorship programs'
        ],
        gallery: [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop'
        ]
      }
    },
    {
      id: 2,
      title: 'UX Designer',
      company: 'Design Studios',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$90K - $110K',
      posted: '1 day ago',
      description: 'Join our creative team as a UX Designer where you will craft intuitive and beautiful user experiences. Work on exciting projects for Fortune 500 clients.',
      requirements: ['3+ years UX design experience', 'Figma proficiency', 'User research skills', 'Portfolio required'],
      benefits: ['Creative workspace', 'Learning budget', 'Flexible PTO', 'Health coverage'],
      companyProfile: {
        name: 'Design Studios',
        size: '50-100 employees',
        industry: 'Design & Creative',
        founded: '2015',
        rating: 4.8,
        logo: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=100&h=100&fit=crop&crop=entropy',
        description: 'Award-winning design studio creating exceptional digital experiences.',
        culture: 'A place where creativity meets strategy and every voice is heard.',
        values: ['Creativity', 'Excellence', 'Diversity', 'Client Success'],
        mission: 'To craft beautiful, meaningful experiences that connect brands with their audiences.',
        vision: 'Leading the future of digital design through innovation and creativity.',
        headquarters: 'New York, NY',
        employees: 75,
        website: 'www.designstudios.com',
        socialMedia: {
          linkedin: 'design-studios',
          twitter: '@designstudios',
          instagram: 'design_studios_ny'
        },
        benefits: [
          'Health and dental insurance',
          'Creative workspace',
          'Learning and development budget',
          'Flexible PTO policy',
          'Work from home options',
          'Design tool subscriptions',
          'Team lunches'
        ],
        perks: [
          'Inspiring office design',
          'Latest design software',
          'Creative workshops',
          'Art gallery visits',
          'Design conference tickets'
        ],
        gallery: [
          'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=300&fit=crop'
        ]
      }
    },
    {
      id: 3,
      title: 'Data Scientist',
      company: 'Analytics Pro',
      location: 'Remote',
      type: 'Full-time',
      salary: '$130K - $160K',
      posted: '3 days ago',
      description: 'Looking for a Data Scientist to drive insights and build predictive models that will shape our product decisions. Work with large datasets and cutting-edge ML technologies.',
      requirements: ['PhD or Masters in relevant field', 'Python/R proficiency', 'Machine learning expertise', 'SQL skills'],
      benefits: ['Remote first', 'Stock options', 'Conference budget', 'Top-tier equipment'],
      companyProfile: {
        name: 'Analytics Pro',
        size: '100-200 employees',
        industry: 'Data & Analytics',
        founded: '2020',
        rating: 4.3,
        logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=100&fit=crop&crop=entropy',
        description: 'Cutting-edge analytics company helping businesses make data-driven decisions.',
        culture: 'Data-driven culture with emphasis on continuous learning and innovation.',
        values: ['Data Excellence', 'Innovation', 'Transparency', 'Growth'],
        mission: 'Empowering businesses with actionable insights through advanced analytics.',
        vision: 'A world where every business decision is backed by intelligent data analysis.',
        headquarters: 'Austin, TX',
        employees: 150,
        website: 'www.analyticspro.com',
        socialMedia: {
          linkedin: 'analytics-pro',
          twitter: '@analyticspro',
          instagram: 'analytics_pro'
        },
        benefits: [
          'Full health coverage',
          'Remote-first policy',
          'Stock options program',
          'Conference and training budget',
          'Top-tier equipment',
          'Flexible working hours',
          'Mental health support'
        ],
        perks: [
          'Data science resources',
          'Research time allocation',
          'Innovation projects',
          'Cross-team collaboration',
          'Industry partnerships'
        ],
        gallery: [
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1553028826-f4804a6dfd3f?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=300&fit=crop'
        ]
      }
    }
  ];

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter(job => 
    locationFilter === '' || job.location.toLowerCase().includes(locationFilter.toLowerCase())
  );

  const toggleSaveJob = (jobId) => {
    const newSavedJobs = new Set(savedJobs);
    if (savedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
    } else {
      newSavedJobs.add(jobId);
    }
    setSavedJobs(newSavedJobs);
  };

  const applyForJob = (jobId) => {
    setAppliedJobs(new Set([...appliedJobs, jobId]));
    // Close the modal after applying
    setTimeout(() => setSelectedJob(null), 1000);
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">JobPortal</h1>
                <p className="text-sm text-gray-600">Find your dream job</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Welcome back, Alex!</p>
                <p className="text-xs text-gray-600">{appliedJobs.size} applications sent</p>
              </div>
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </div>
        </div> */}
      </header>

      {/* Search and Filters */}
      <div className="">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs, companies..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative w-64">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Location"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
            <button 
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors whitespace-nowrap"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Job Listings */}
        <div className="grid gap-6">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      {appliedJobs.has(job.id) && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Applied
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {job.company}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.posted}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-4">{job.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-green-600 font-semibold">
                          <DollarSign className="w-4 h-4" />
                          {job.salary}
                        </div>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                          {job.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button
                    onClick={() => toggleSaveJob(job.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      savedJobs.has(job.id)
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${savedJobs.has(job.id) ? 'fill-current' : ''}`} />
                    {savedJobs.has(job.id) ? 'Saved' : 'Save'}
                  </button>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedCompany(job.companyProfile)}
                      className="flex items-center gap-2 px-4 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Building2 className="w-4 h-4" />
                      Company Profile
                    </button>
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Job Details
                    </button>
                    <button
                      onClick={() => applyForJob(job.id)}
                      disabled={appliedJobs.has(job.id)}
                      className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                        appliedJobs.has(job.id)
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {appliedJobs.has(job.id) ? 'Applied' : 'Quick Apply'}
                      {!appliedJobs.has(job.id) && <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Job Info */}
              <div className="mb-8">
                <div className="flex items-center gap-4 text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {selectedJob.company}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {selectedJob.location}
                  </div>
                  <div className="flex items-center gap-1 text-green-600 font-semibold">
                    <DollarSign className="w-4 h-4" />
                    {selectedJob.salary}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">{selectedJob.description}</p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Requirements</h4>
                    <ul className="space-y-2">
                      {selectedJob.requirements.map((req, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-700">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Benefits</h4>
                    <ul className="space-y-2">
                      {selectedJob.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-700">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Company Profile */}
              <div className="border-t pt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">About {selectedJob.companyProfile.name}</h3>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-medium text-gray-900">{selectedJob.companyProfile.size}</p>
                    <p className="text-sm text-gray-600">Company Size</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <Building2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-medium text-gray-900">{selectedJob.companyProfile.industry}</p>
                    <p className="text-sm text-gray-600">Industry</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="font-medium text-gray-900">{selectedJob.companyProfile.rating}</span>
                    </div>
                    <p className="text-sm text-gray-600">Rating</p>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-6">{selectedJob.companyProfile.description}</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Company Culture</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedJob.companyProfile.culture}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Our Values</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.companyProfile.values.map((value, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Apply Section */}
              <div className="border-t pt-6 mt-8">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Ready to join {selectedJob.companyProfile.name}?</p>
                    <p className="font-medium text-gray-900">Apply now for {selectedJob.title}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => toggleSaveJob(selectedJob.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        savedJobs.has(selectedJob.id)
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${savedJobs.has(selectedJob.id) ? 'fill-current' : ''}`} />
                      {savedJobs.has(selectedJob.id) ? 'Saved' : 'Save Job'}
                    </button>
                    <button
                      onClick={() => applyForJob(selectedJob.id)}
                      disabled={appliedJobs.has(selectedJob.id)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                        appliedJobs.has(selectedJob.id)
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {appliedJobs.has(selectedJob.id) ? 'Application Sent!' : 'Apply Now'}
                      {!appliedJobs.has(selectedJob.id) && <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Company Profile Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header with Company Logo */}
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
              <button
                onClick={() => setSelectedCompany(null)}
                className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                  <img 
                    src={selectedCompany.logo} 
                    alt={`${selectedCompany.name} logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">{selectedCompany.name}</h2>
                  <div className="flex items-center gap-4 text-blue-100">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedCompany.headquarters}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {selectedCompany.employees} employees
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-300 fill-current" />
                      {selectedCompany.rating}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Company Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <Building2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">{selectedCompany.industry}</p>
                  <p className="text-sm text-gray-600">Industry</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Founded {selectedCompany.founded}</p>
                  <p className="text-sm text-gray-600">Established</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">{selectedCompany.size}</p>
                  <p className="text-sm text-gray-600">Team Size</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-xl">
                  <Globe className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Global</p>
                  <p className="text-sm text-gray-600">Presence</p>
                </div>
              </div>

              {/* About Section */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">About Us</h3>
                <p className="text-gray-700 leading-relaxed text-lg">{selectedCompany.description}</p>
              </div>

              {/* Mission & Vision */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">Our Mission</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedCompany.mission}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">Our Vision</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedCompany.vision}</p>
                </div>
              </div>

              {/* Company Culture */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Company Culture</h3>
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl">
                  <p className="text-gray-700 leading-relaxed text-lg">{selectedCompany.culture}</p>
                </div>
              </div>

              {/* Values */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedCompany.values.map((value, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="font-medium text-gray-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits & Perks */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Benefits</h3>
                  <div className="space-y-3">
                    {selectedCompany.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Perks</h3>
                  <div className="space-y-3">
                    {selectedCompany.perks.map((perk, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700">{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Office Gallery */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Office Life</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedCompany.gallery.map((image, index) => (
                    <div key={index} className="relative group overflow-hidden rounded-xl">
                      <img 
                        src={image} 
                        alt={`Office ${index + 1}`}
                        className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                        <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="border-t pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Connect With Us</h3>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href={`https://${selectedCompany.website}`}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    Website
                  </a>
                  <a 
                    href={`https://linkedin.com/company/${selectedCompany.socialMedia.linkedin}`}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    LinkedIn
                  </a>
                  <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
                    {selectedCompany.socialMedia.twitter}
                  </span>
                  <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
                    {selectedCompany.socialMedia.instagram}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;