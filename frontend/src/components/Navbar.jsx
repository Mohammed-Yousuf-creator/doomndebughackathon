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

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F8F5F0]/90 backdrop-blur-md border-b border-[#E7DFD5]">
      {/* Live Broadcast Ticker Banner if exists */}
      {broadcasts.length > 0 && broadcasts[0] && (
        <div className="bg-[#24422D] text-white px-4 py-1 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <span className="flex h-1.5 w-1.5 rounded-full bg-[#82E6A1] animate-pulse"></span>
              <span className="font-mono text-[11px] text-[#A3E5B8] uppercase tracking-wider font-semibold">
                ANNOUNCEMENT [{broadcasts[0].timestamp}]
              </span>
              <span className="font-medium text-[12px] truncate">
                {broadcasts[0].title} — {broadcasts[0].message}
              </span>
            </div>
            <span className="font-mono text-[10px] text-white/60 ml-4 shrink-0 hidden sm:inline">
              EventOps Live
            </span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Left: Brand & Event Context */}
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => setActiveTab('ops')}
            className="flex items-center gap-2 group text-left cursor-pointer"
          >
            <div className="w-7 h-7 rounded-md bg-[#24422D] p-1 flex items-center justify-center shadow-subtle group-hover:bg-[#1A3322] transition-colors">
              <img
                src="/assets/asset_19_4a08b610d8.png"
                alt="EventForge Logo"
                className="w-full h-full object-contain invert"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-bold text-sm tracking-tight text-[#1F1916] group-hover:text-[#C2542D] transition-colors">
                EventForge <span className="font-serif italic font-normal text-xs text-[#73645A]">AI</span>
              </span>
            </div>
          </button>

          <div className="h-4 w-px bg-[#DDD2C5] hidden sm:block"></div>

          {/* Event Picker Dropdown */}
          <div className="hidden md:flex items-center gap-1.5 bg-white/70 px-2.5 py-1 rounded-md border border-[#E7DFD5]">
            <span className="material-symbols-outlined text-[15px] text-[#73645A]">event</span>
            <select
              value={sprint?.active_event || "Global Sprint 2025 (North America)"}
              onChange={(e) => onSwitchEvent && onSwitchEvent(e.target.value)}
              className="bg-transparent font-sans text-xs text-[#1F1916] focus:outline-none cursor-pointer pr-1"
            >
              {sprint?.event_options?.map((opt) => (
                <option key={opt} value={opt} className="bg-white text-[#1F1916]">
                  {opt}
                </option>
              )) || (
                <option>Autonomous Systems Hackathon 2025</option>
              )}
            </select>
          </div>

          {/* Live Stage Beacon */}
          <div className="hidden xl:inline-flex items-center gap-1.5 bg-[#EFF5F1] text-[#2F5B3C] px-2.5 py-0.5 rounded-full border border-[#DEEBE1]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2F5B3C] animate-pulse"></span>
            <span className="font-mono text-[11px] font-semibold">
              Day 2 • Hacking Sprint Active
            </span>
          </div>
        </div>

        {/* Center: Module Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-[#EBE3DA]/60 p-0.5 rounded-lg border border-[#DDD2C5]/80">
          <button
            onClick={() => setActiveTab('ops')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs transition-all cursor-pointer ${
              activeTab === 'ops'
                ? 'bg-white text-[#1F1916] font-semibold shadow-subtle'
                : 'text-[#73645A] hover:text-[#1F1916]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">space_dashboard</span>
            <span>EventOps</span>
          </button>

          <button
            onClick={() => setActiveTab('war-room')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs transition-all cursor-pointer ${
              activeTab === 'war-room'
                ? 'bg-white text-[#1F1916] font-semibold shadow-subtle'
                : 'text-[#73645A] hover:text-[#1F1916]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">developer_board</span>
            <span>Team War Room</span>
          </button>

          <button
            onClick={() => setActiveTab('judge')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs transition-all cursor-pointer ${
              activeTab === 'judge'
                ? 'bg-white text-[#1F1916] font-semibold shadow-subtle'
                : 'text-[#73645A] hover:text-[#1F1916]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">gavel</span>
            <span>Judge Console</span>
          </button>

          <button
            onClick={() => setActiveTab('sponsor')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs transition-all cursor-pointer ${
              activeTab === 'sponsor'
                ? 'bg-white text-[#1F1916] font-semibold shadow-subtle'
                : 'text-[#73645A] hover:text-[#1F1916]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">storefront</span>
            <span>Sponsors & Talent</span>
          </button>
        </nav>

        {/* Right: Notifications & Persona Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-8 h-8 rounded-md bg-white hover:bg-[#F3EFEA] border border-[#E7DFD5] flex items-center justify-center text-[#73645A] hover:text-[#1F1916] transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-[18px]">notifications</span>
              {broadcasts.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#C2542D]"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-dropdown border border-[#E7DFD5] p-3 z-50 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F0EAE1]">
                  <span className="font-sans text-xs font-bold text-[#1F1916]">Event Dispatches</span>
                  <span className="font-mono text-[10px] bg-[#EFF5F1] text-[#2F5B3C] px-1.5 py-0.5 rounded font-semibold">
                    {broadcasts.length} Messages
                  </span>
                </div>
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                  {broadcasts.map((b) => (
                    <div key={b.id} className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#F0EAE1] text-xs">
                      <div className="flex items-center justify-between text-[#73645A] font-mono text-[10px]">
                        <span>{b.timestamp}</span>
                        <span className="uppercase text-[#2F5B3C] font-semibold">{b.type}</span>
                      </div>
                      <p className="font-semibold text-[#1F1916] mt-0.5">{b.title}</p>
                      <p className="text-[#73645A] text-[11px] mt-0.5 leading-snug">{b.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Perspective Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 py-1 px-2 rounded-md bg-white hover:bg-[#F3EFEA] border border-[#E7DFD5] transition-colors cursor-pointer"
            >
              <img
                src={currentUser?.avatar || "/assets/asset_16_9592fa2f36.png"}
                alt={currentUser?.name}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-[#DDD2C5]"
              />
              <div className="hidden lg:flex flex-col text-left">
                <span className="font-sans text-xs font-semibold text-[#1F1916] leading-tight">
                  {currentUser?.name || "Dr. Aris Vane"}
                </span>
                <span className="text-[10px] text-[#73645A] leading-none">
                  {currentUser?.role || "Organizer"}
                </span>
              </div>
              <span className="material-symbols-outlined text-sm text-[#73645A]">expand_more</span>
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-dropdown border border-[#E7DFD5] p-1.5 z-50 animate-fadeIn">
                <div className="px-2 py-1 font-mono text-[10px] text-[#73645A] uppercase tracking-wider">
                  Switch Active Role
                </div>
                {userOptions.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setCurrentUser(u);
                      setShowUserDropdown(false);
                      if (u.defaultTab) setActiveTab(u.defaultTab);
                    }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                      currentUser?.id === u.id
                        ? 'bg-[#FAF7F2] font-semibold text-[#1F1916]'
                        : 'hover:bg-[#FAF7F2] text-[#382F2A]'
                    }`}
                  >
                    <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                    <div className="flex flex-col">
                      <span className="text-xs leading-tight">{u.name}</span>
                      <span className="text-[10px] text-[#73645A] leading-none">{u.role}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
