import React, { useState } from 'react';

export default function Navbar({
  activeTab,
  setActiveTab,
  sprint,
  onSwitchEvent,
  broadcasts = [],
  currentUser,
  setCurrentUser,
  userOptions = []
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Helper to extract initials cleanly
  const getInitials = (name) => {
    if (!name) return 'EF';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const navItems = [
    { key: 'ops', label: 'EventOps', icon: 'space_dashboard' },
    { key: 'war-room', label: 'Team War Room', icon: 'developer_board' },
    { key: 'judge', label: 'Judge Console', icon: 'gavel' },
    { key: 'sponsor', label: 'Sponsors & Talent', icon: 'storefront' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E7DFD5]">
      {/* Live Broadcast Ticker Banner if exists */}
      {broadcasts.length > 0 && broadcasts[0] && (
        <div className="bg-[#1C3322] text-white px-4 py-1.5 text-xs border-b border-[#2A4833]">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 truncate min-w-0">
              <span className="flex h-1.5 w-1.5 rounded-full bg-[#82E6A1] animate-pulse shrink-0"></span>
              <span className="font-mono text-[10px] text-[#A3E5B8] uppercase tracking-wider font-semibold shrink-0">
                DISPATCH [{broadcasts[0].timestamp}]
              </span>
              <span className="text-[12px] truncate text-white/90">
                <strong className="text-white font-medium">{broadcasts[0].title}</strong> — {broadcasts[0].message}
              </span>
            </div>
            <span className="font-mono text-[10px] text-white/50 shrink-0 hidden sm:inline uppercase tracking-wider">
              System Broadcast
            </span>
          </div>
        </div>
      )}

      {/* Main Bar: Unified 64px height with proportional boxes and zero overlap */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Section: Brand & Event Context */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Brand Wordmark (No Logo Box) */}
          <button
            onClick={() => setActiveTab('ops')}
            className="flex items-center gap-2 group cursor-pointer text-left"
            title="Go to EventOps"
          >
            <span className="font-sans font-bold text-xl tracking-tight text-[#1F1916] group-hover:text-[#943C1D] transition-colors leading-snug">
              aegis
            </span>
            <span className="text-[10px] font-mono text-[#73645A] leading-none hidden sm:block border-l border-[#DDD2C5] pl-2">
              EventOps
            </span>
          </button>

          <div className="h-5 w-px bg-[#E2D8CC] hidden lg:block"></div>

          {/* Event Picker Box: Redesigned cleanly with fixed bounds to prevent overflow */}
          <div className="hidden lg:flex items-center h-10 px-3 rounded-xl bg-white border border-[#E5DDD2] shadow-sm max-w-[210px] relative group hover:border-[#D5C9BD] transition-colors">
            <span className="material-symbols-outlined text-[16px] text-[#73645A] mr-1.5 shrink-0">
              calendar_today
            </span>
            <select
              value={sprint?.active_event || "Global Sprint 2025 (North America)"}
              onChange={(e) => onSwitchEvent && onSwitchEvent(e.target.value)}
              className="bg-transparent font-sans text-xs text-[#1F1916] focus:outline-none cursor-pointer w-full truncate pr-4 appearance-none"
            >
              {sprint?.event_options?.map((opt) => (
                <option key={opt} value={opt} className="bg-white text-[#1F1916]">
                  {opt}
                </option>
              )) || (
                <option>Autonomous Systems Hackathon 2025</option>
              )}
            </select>
            <span className="material-symbols-outlined text-[14px] text-[#73645A] absolute right-2.5 pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        {/* Center Section: Navigation Segment Box (Redesigned with unified dimensions) */}
        <div className="flex-1 flex justify-center min-w-0 max-w-2xl px-1">
          <nav className="h-10 bg-[#EFE9DF] p-1 rounded-xl border border-[#E0D5C7] flex items-center gap-1 shadow-inner overflow-x-auto no-scrollbar w-auto">
            {navItems.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`h-8 px-3 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#1F1916] font-semibold shadow-sm border border-[#E5DDD2]'
                      : 'text-[#6B5F54] hover:text-[#1F1916] hover:bg-white/50'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[15px] ${isActive ? 'text-[#24422D]' : 'text-[#73645A]'}`}>
                    {item.icon}
                  </span>
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Status Beacon + Notifications + User Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Live Stage Beacon */}
          <div className="hidden xl:inline-flex items-center h-10 px-3 rounded-xl bg-[#EFF5F1] text-[#2F5B3C] border border-[#DEEBE1] text-[11px] font-mono font-medium gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2F5B3C] animate-pulse shrink-0"></span>
            <span>Sprint Active</span>
          </div>

          {/* Notifications Box: Redesigned matching 40px square */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserDropdown(false);
              }}
              className={`h-10 w-10 rounded-xl bg-white border flex items-center justify-center transition-all cursor-pointer relative shadow-sm ${
                showNotifications
                  ? 'border-[#24422D] text-[#1F1916] bg-[#FAF7F2]'
                  : 'border-[#E5DDD2] text-[#6B5F54] hover:text-[#1F1916] hover:bg-[#FAF7F2]'
              }`}
              title="Notifications & Dispatches"
            >
              <span className="material-symbols-outlined text-[18px]">notifications</span>
              {broadcasts.length > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#C2542D] ring-2 ring-white"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#E5DDD2] p-3.5 z-50 animate-fadeIn">
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#F0EAE1]">
                  <span className="font-sans text-xs font-bold text-[#1F1916]">Event Dispatches</span>
                  <span className="font-mono text-[10px] bg-[#EFF5F1] text-[#2F5B3C] px-2 py-0.5 rounded-md font-semibold border border-[#DEEBE1]">
                    {broadcasts.length} Messages
                  </span>
                </div>
                <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
                  {broadcasts.length === 0 ? (
                    <div className="p-4 text-center text-xs text-[#73645A]">No active dispatches.</div>
                  ) : (
                    broadcasts.map((b) => (
                      <div key={b.id || b.timestamp} className="p-3 rounded-xl bg-[#FAF7F2] border border-[#F0EAE1] text-xs">
                        <div className="flex items-center justify-between text-[#73645A] font-mono text-[10px] mb-1">
                          <span>{b.timestamp}</span>
                          <span className="uppercase text-[#2F5B3C] font-semibold">{b.type || 'info'}</span>
                        </div>
                        <p className="font-semibold text-[#1F1916]">{b.title}</p>
                        <p className="text-[#6B5F54] text-[11px] mt-0.5 leading-snug">{b.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Box: Redesigned matching h-10 pill with typography avatar */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserDropdown(!showUserDropdown);
                setShowNotifications(false);
              }}
              className={`h-10 px-2.5 sm:px-3 rounded-xl bg-white border flex items-center gap-2.5 transition-all cursor-pointer shadow-sm ${
                showUserDropdown
                  ? 'border-[#24422D] bg-[#FAF7F2]'
                  : 'border-[#E5DDD2] hover:border-[#D5C9BD] hover:bg-[#FAF7F2]'
              }`}
            >
              {/* Clean Typography Initials Badge (Zero Image Glitches) */}
              <div className="w-6 h-6 rounded-lg bg-[#EFE9DF] text-[#1F1916] flex items-center justify-center text-[10px] font-bold font-mono border border-[#E0D5C7] shrink-0">
                {getInitials(currentUser?.name)}
              </div>

              <div className="hidden sm:flex flex-col text-left">
                <span className="font-sans text-xs font-semibold text-[#1F1916] leading-tight truncate max-w-[110px]">
                  {currentUser?.name || "Dr. Aris Vane"}
                </span>
                <span className="text-[10px] text-[#73645A] leading-none truncate max-w-[110px]">
                  {currentUser?.role || "Organizer"}
                </span>
              </div>

              <span className="material-symbols-outlined text-[15px] text-[#73645A] ml-0.5">
                expand_more
              </span>
            </button>

            {/* Role Switcher Dropdown */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E5DDD2] p-2 z-50 animate-fadeIn">
                <div className="px-3 py-1.5 font-mono text-[10px] text-[#73645A] uppercase tracking-wider">
                  Switch Active Role
                </div>
                <div className="flex flex-col gap-1 mt-1">
                  {userOptions.map((u) => {
                    const isSelected = currentUser?.id === u.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          setCurrentUser(u);
                          setShowUserDropdown(false);
                          if (u.defaultTab) setActiveTab(u.defaultTab);
                        }}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#FAF7F2] font-semibold text-[#1F1916] border border-[#E5DDD2]'
                            : 'hover:bg-[#FAF7F2] text-[#382F2A]'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-lg bg-[#EFE9DF] text-[#1F1916] flex items-center justify-center text-[10px] font-bold font-mono border border-[#E0D5C7] shrink-0">
                          {getInitials(u.name)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs leading-tight truncate font-medium">{u.name}</span>
                          <span className="text-[10px] text-[#73645A] leading-none truncate">{u.role}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
