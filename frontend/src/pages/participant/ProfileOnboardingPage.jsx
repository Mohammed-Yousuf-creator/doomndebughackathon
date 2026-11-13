import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';

export default function ProfileOnboardingPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1); // 1: Basic Info, 2: Professional Details, 3: Skills & Links
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || 'Rohan Vernekar',
    email: user?.email || 'vernekarrohan38@gmail.com',
    profile_type: user?.profile_type || 'College Student',
    gender: user?.gender || 'Male',
    country_code: '+91',
    phone: user?.phone || '98765 43210',
    city: user?.city || 'Bangalore',
    college: user?.college || 'MIT World Peace University',
    degree: user?.degree || 'B.Tech in Computer Science',
    graduation_year: user?.graduation_year || '2026',
    year_of_study: '3rd Year',
    skills: user?.skills && user.skills.length > 0 ? user.skills : ['Python', 'React', 'PyTorch', 'C++'],
    github: user?.github || 'https://github.com/rohanvernekar',
    linkedin: user?.linkedin || 'https://linkedin.com/in/rohanvernekar',
    bio: user?.bio || 'Passionate student developer excited about AI swarms, full-stack apps, and edge systems. Looking for teammates!'
  });

  const availableSkills = [
    'Python', 'JavaScript', 'React', 'C++', 'PyTorch', 'ROS2', 'Node.js',
    'Machine Learning', 'Computer Vision', 'Docker', 'FastAPI', 'Rust', 'Go', 'TailwindCSS', 'UI/UX Design'
  ];

  const toggleSkill = (skill) => {
    setFormData((prev) => {
      const exists = prev.skills.includes(skill);
      if (exists) {
        return { ...prev, skills: prev.skills.filter((s) => s !== skill) };
      } else {
        return { ...prev, skills: [...prev.skills, skill] };
      }
    });
  };

  const handleNext = () => {
    setError('');
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!formData.profile_type || formData.profile_type === 'Select your profile type') {
        setError('Please select your profile type.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!formData.college.trim()) {
        setError('Please enter your college or organization name.');
        return;
      }
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    setError('');
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const fullPhone = `${formData.country_code} ${formData.phone}`.trim();
      const payload = {
        user_id: user?.id || 'u-part-1',
        name: formData.name,
        profile_type: formData.profile_type,
        gender: formData.gender,
        phone: fullPhone,
        city: formData.city,
        college: formData.college,
        degree: formData.degree,
        graduation_year: formData.graduation_year,
        skills: formData.skills,
        github: formData.github,
        linkedin: formData.linkedin,
        bio: formData.bio
      };

      const res = await api.saveOnboardingProfile(payload);
      if (res && res.user) {
        updateUser(res.user);
      }
      navigate('/participant/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#1F1916] flex flex-col justify-between font-sans selection:bg-[#EBDDCF] selection:text-[#943C1D]">
      {/* Top Navbar Header (Aegis Typography & Warm Stone Palette) */}
      <header className="bg-white border-b border-[#E7DFD5] h-16 px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/participant/dashboard')}>
            <span className="font-bold text-2xl tracking-tight text-[#1F1916]">aegis</span>
            <span className="h-2 w-2 rounded-full bg-[#2F5B3C]"></span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#73645A]">
            <span className="hover:text-[#1F1916] cursor-pointer">Challenges</span>
            <span className="hover:text-[#1F1916] cursor-pointer flex items-center gap-1">
              Tracks <span className="material-symbols-outlined text-sm">expand_more</span>
            </span>
            <span className="hover:text-[#1F1916] cursor-pointer flex items-center gap-1">
              Community <span className="material-symbols-outlined text-sm">expand_more</span>
            </span>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#73645A] font-mono hidden sm:inline">Profile Onboarding</span>
          <div className="w-8 h-8 rounded-full bg-[#24422D] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
            {formData.name ? formData.name[0] : 'U'}
          </div>
        </div>
      </header>

      {/* Main Container Card (Structural Stepper, Aegis Theme) */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 my-auto">
        <div className="bg-white rounded-3xl border border-[#E7DFD5] shadow-card overflow-hidden flex flex-col md:flex-row min-h-[520px]">
          {/* Left Column: Stepper Sidebar */}
          <div className="w-full md:w-72 bg-[#FAF7F2] border-b md:border-b-0 md:border-r border-[#E7DFD5] p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h2 className="font-serif font-bold text-xl text-[#1F1916]">Create Your Profile</h2>
                <p className="text-xs text-[#73645A] mt-1">Add a few details to get started</p>
              </div>

              {/* Stepper Steps */}
              <div className="space-y-2">
                {/* Step 1 Pill */}
                <div
                  onClick={() => setCurrentStep(1)}
                  className={`flex items-start gap-3 p-3 rounded-2xl transition-all cursor-pointer ${
                    currentStep === 1
                      ? 'bg-[#24422D] text-white shadow-sm'
                      : 'text-[#73645A] hover:bg-white'
                  }`}
                >
                  <span className={`material-symbols-outlined text-xl mt-0.5 ${currentStep === 1 ? 'text-white' : 'text-[#73645A]'}`}>
                    person
                  </span>
                  <div>
                    <h3 className="text-xs font-bold leading-tight">Basic Info</h3>
                    <p className={`text-[11px] ${currentStep === 1 ? 'text-white/80' : 'text-[#A89C92]'}`}>
                      Getting started
                    </p>
                  </div>
                </div>

                {/* Step 2 Pill */}
                <div
                  onClick={() => formData.name && setCurrentStep(2)}
                  className={`flex items-start gap-3 p-3 rounded-2xl transition-all cursor-pointer ${
                    currentStep === 2
                      ? 'bg-[#24422D] text-white shadow-sm'
                      : 'text-[#73645A] hover:bg-white'
                  }`}
                >
                  <span className={`material-symbols-outlined text-xl mt-0.5 ${currentStep === 2 ? 'text-white' : 'text-[#73645A]'}`}>
                    school
                  </span>
                  <div>
                    <h3 className="text-xs font-bold leading-tight">Professional Details</h3>
                    <p className={`text-[11px] ${currentStep === 2 ? 'text-white/80' : 'text-[#A89C92]'}`}>
                      Your background
                    </p>
                  </div>
                </div>

                {/* Step 3 Pill */}
                <div
                  onClick={() => formData.college && setCurrentStep(3)}
                  className={`flex items-start gap-3 p-3 rounded-2xl transition-all cursor-pointer ${
                    currentStep === 3
                      ? 'bg-[#24422D] text-white shadow-sm'
                      : 'text-[#73645A] hover:bg-white'
                  }`}
                >
                  <span className={`material-symbols-outlined text-xl mt-0.5 ${currentStep === 3 ? 'text-white' : 'text-[#73645A]'}`}>
                    link
                  </span>
                  <div>
                    <h3 className="text-xs font-bold leading-tight">Skills & Links</h3>
                    <p className={`text-[11px] ${currentStep === 3 ? 'text-white/80' : 'text-[#A89C92]'}`}>
                      Final step
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step helper note */}
            <div className="pt-6 text-[11px] font-mono text-[#A89C92] hidden md:block">
              Step {currentStep} of 3 &bull; Takes ~1 minute
            </div>
          </div>

          {/* Right Column: Form Panel */}
          <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {error && (
                <div className="mb-5 p-3 rounded-xl bg-[#FDF2F0] border border-[#F5C7C1] text-xs text-[#943C1D] flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">error</span>
                  <span>{error}</span>
                </div>
              )}

              {/* STEP 1: BASIC INFORMATION */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-fadeIn">
                  <div>
                    <h3 className="font-serif font-bold text-2xl text-[#1F1916]">Basic Information</h3>
                    <p className="text-xs text-[#73645A] mt-0.5">Let's start with the basics to get your profile set up.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                        Full Name <span className="text-[#943C1D]">*</span>
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#73645A] text-base">
                          person
                        </span>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your Full Name"
                          className="w-full pl-9 pr-8 py-2.5 text-xs bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl focus:bg-white focus:outline-none focus:border-[#24422D] text-[#1F1916] shadow-2xs"
                        />
                        {formData.name && (
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, name: '' })}
                            className="absolute right-2.5 top-2.5 text-[#A89C92] hover:text-[#1F1916]"
                          >
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                        Email Address <span className="text-[#943C1D]">*</span>
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#73645A] text-base">
                          mail
                        </span>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@email.com"
                          className="w-full pl-9 pr-3 py-2.5 text-xs bg-gray-50 border border-[#E7DFD5] rounded-xl focus:outline-none text-[#73645A]"
                        />
                      </div>
                    </div>

                    {/* You are (Profile Type) */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                        You are <span className="text-[#943C1D]">*</span>
                      </label>
                      <select
                        value={formData.profile_type}
                        onChange={(e) => setFormData({ ...formData, profile_type: e.target.value })}
                        className="w-full px-3 py-2.5 text-xs bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl focus:bg-white focus:outline-none focus:border-[#24422D] text-[#1F1916] cursor-pointer"
                      >
                        <option>College Student</option>
                        <option>Working Professional</option>
                        <option>High School Student</option>
                        <option>Self-Taught Developer</option>
                        <option>Researcher / Graduate</option>
                      </select>
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                        Gender <span className="text-[#943C1D]">*</span>
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-3 py-2.5 text-xs bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl focus:bg-white focus:outline-none focus:border-[#24422D] text-[#1F1916] cursor-pointer"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Non-Binary</option>
                        <option>Prefer not to say</option>
                      </select>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                        Phone Number <span className="text-[#943C1D]">*</span>
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={formData.country_code}
                          onChange={(e) => setFormData({ ...formData, country_code: e.target.value })}
                          className="w-24 px-2 py-2.5 text-xs bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl focus:bg-white focus:outline-none text-[#1F1916] cursor-pointer"
                        >
                          <option value="+91">🇮🇳 +91</option>
                          <option value="+1">🇺🇸 +1</option>
                          <option value="+44">🇬🇧 +44</option>
                          <option value="+49">🇩🇪 +49</option>
                          <option value="+65">🇸🇬 +65</option>
                        </select>
                        <div className="relative flex-1">
                          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#73645A] text-base">
                            call
                          </span>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="98765 43210"
                            className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl focus:bg-white focus:outline-none focus:border-[#24422D] text-[#1F1916]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Current City */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                        Current City <span className="text-[#943C1D]">*</span>
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#73645A] text-base">
                          location_on
                        </span>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="Search your city (e.g. Bangalore, Boston)"
                          className="w-full pl-9 pr-8 py-2.5 text-xs bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl focus:bg-white focus:outline-none focus:border-[#24422D] text-[#1F1916]"
                        />
                        <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-[#A89C92] text-sm">
                          my_location
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: PROFESSIONAL DETAILS */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-fadeIn">
                  <div>
                    <h3 className="font-serif font-bold text-2xl text-[#1F1916]">Professional Details</h3>
                    <p className="text-xs text-[#73645A] mt-0.5">Tell us about your educational or technical background.</p>
                  </div>

                  <div className="space-y-4">
                    {/* College / Organization */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                        College / University / Company <span className="text-[#943C1D]">*</span>
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#73645A] text-base">
                          school
                        </span>
                        <input
                          type="text"
                          required
                          value={formData.college}
                          onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                          placeholder="e.g. MIT World Peace University or IIT Bombay"
                          className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl focus:bg-white focus:outline-none focus:border-[#24422D] text-[#1F1916]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Degree / Major */}
                      <div>
                        <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                          Degree / Major <span className="text-[#943C1D]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.degree}
                          onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                          placeholder="e.g. B.Tech in Computer Science"
                          className="w-full px-3 py-2.5 text-xs bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl focus:bg-white focus:outline-none focus:border-[#24422D] text-[#1F1916]"
                        />
                      </div>

                      {/* Graduation Year */}
                      <div>
                        <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                          Graduation Year <span className="text-[#943C1D]">*</span>
                        </label>
                        <select
                          value={formData.graduation_year}
                          onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
                          className="w-full px-3 py-2.5 text-xs bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl focus:bg-white focus:outline-none focus:border-[#24422D] text-[#1F1916] cursor-pointer"
                        >
                          <option>2024</option>
                          <option>2025</option>
                          <option>2026</option>
                          <option>2027</option>
                          <option>2028</option>
                          <option>2029</option>
                        </select>
                      </div>
                    </div>

                    {/* Year of Study */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1F1916] mb-1">
                        Current Academic Standing
                      </label>
                      <select
                        value={formData.year_of_study}
                        onChange={(e) => setFormData({ ...formData, year_of_study: e.target.value })}
                        className="w-full px-3 py-2.5 text-xs bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl focus:bg-white focus:outline-none focus:border-[#24422D] text-[#1F1916] cursor-pointer"
                      >
                        <option>1st Year</option>
                        <option>2nd Year</option>
                        <option>3rd Year</option>
                        <option>4th Year / Final Year</option>
                        <option>Master's / Ph.D.</option>
                        <option>Alumni / Working Professional</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: SKILLS & LINKS */}
              {currentStep === 3 && (
                <div className="space-y-5 animate-fadeIn">
                  <div>
                    <h3 className="font-serif font-bold text-2xl text-[#1F1916]">Skills & Links</h3>
                    <p className="text-xs text-[#73645A] mt-0.5">Showcase your tech stack and where organizers can find your work.</p>
                  </div>

                  <div className="space-y-4">
                    {/* Skills Chips */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1F1916] mb-1.5">
                        Primary Tech Skills <span className="text-[#943C1D]">*</span>
                      </label>
                      <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5]">
                        {availableSkills.map((skill) => {
                          const isSelected = formData.skills.includes(skill);
                          return (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => toggleSkill(skill)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#24422D] text-white shadow-xs'
                                  : 'bg-white text-[#1F1916] border border-[#E7DFD5] hover:bg-[#FAF7F2]'
                              }`}
                            >
                              {skill} {isSelected && '✓'}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* GitHub & LinkedIn URLs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#1F1916] mb-1">GitHub Profile URL</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#73645A] text-base">code</span>
                          <input
                            type="url"
                            value={formData.github}
                            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                            placeholder="https://github.com/username"
                            className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl focus:bg-white focus:outline-none focus:border-[#24422D] text-[#1F1916]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1F1916] mb-1">LinkedIn Profile URL</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#73645A] text-base">link</span>
                          <input
                            type="url"
                            value={formData.linkedin}
                            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                            placeholder="https://linkedin.com/in/username"
                            className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl focus:bg-white focus:outline-none focus:border-[#24422D] text-[#1F1916]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1F1916] mb-1">Short Bio / Elevator Pitch</label>
                      <textarea
                        rows={3}
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Tell fellow teammates and hackathon judges about your passion and project ideas..."
                        className="w-full p-3 text-xs bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl focus:bg-white focus:outline-none focus:border-[#24422D] text-[#1F1916] leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="pt-6 mt-6 border-t border-[#F0EAE1] flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentStep === 1
                    ? 'text-[#A89C92] border border-[#E7DFD5] cursor-not-allowed bg-[#FAF7F2]'
                    : 'text-[#1F1916] border border-[#E7DFD5] bg-white hover:bg-[#FAF7F2]'
                }`}
              >
                Back
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-[#24422D] hover:bg-[#1A3322] text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={loading}
                  className="px-7 py-2.5 rounded-xl bg-[#24422D] hover:bg-[#1A3322] text-white text-xs font-semibold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  {loading ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <span>Finish & Launch Dashboard</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 sm:px-12 border-t border-[#E7DFD5] bg-white text-xs text-[#73645A] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <span className="hover:text-[#1F1916] cursor-pointer">Privacy Policy</span>
          <span>&bull;</span>
          <span className="hover:text-[#1F1916] cursor-pointer">Terms & Conditions</span>
        </div>

        <div>
          &copy; 2026 Aegis Innovation Network. All rights reserved.
        </div>

        <div className="flex items-center gap-4 text-[#A89C92]">
          <span className="hover:text-[#1F1916] cursor-pointer">LinkedIn</span>
          <span className="hover:text-[#1F1916] cursor-pointer">GitHub</span>
          <span className="hover:text-[#1F1916] cursor-pointer">Discord</span>
        </div>
      </footer>
    </div>
  );
}
