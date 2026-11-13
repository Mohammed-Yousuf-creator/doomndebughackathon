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
    <header className="sticky top-0 z-50 w-full bg-surface/90 backdrop-blur-xl border-b border-surface-container-high shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Optional Broadcast Ticker Bar */}
      {broadcasts.length > 0 && broadcasts[0] && (
        <div className="bg-primary-container text-on-primary-container px-4 py-1.5 text-xs flex items-center justify-between border-b border-primary/20">
          <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-fixed opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-fixed"></span>
            </span>
            <span className="font-mono font-bold uppercase tracking-wider text-primary-fixed">
              [LIVE BROADCAST {broadcasts[0].timestamp}]
            </span>
            <span className="font-medium text-white truncate">
              {broadcasts[0].title}: {broadcasts[0].message}
            </span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand & Event Context */}
        <div className="flex items-center gap-4">
          <div
            onClick={() => setActiveTab('ops')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-surface-container-lowest p-1 shadow-sm flex items-center justify-center border border-surface-container-high group-hover:border-primary transition-all">
              <img
                src="/assets/asset_19_4a08b610d8.png"
                alt="AEGIS Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-bold text-lg tracking-tight text-primary leading-none group-hover:text-primary-container transition-colors">
                AEGIS
              </span>
              <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest leading-none mt-0.5">
                OS // v3.4
              </span>
            </div>
          </div>

          <div className="h-5 w-px bg-outline-variant hidden sm:block"></div>

          {/* Event Picker Dropdown */}
          <div className="hidden sm:flex items-center gap-1.5 bg-surface-container px-2.5 py-1 rounded-lg border border-surface-container-high">
            <span className="material-symbols-outlined text-sm text-primary">flag</span>
            <select
              value={sprint?.active_event || "Global Sprint 2025 (North America)"}
              onChange={(e) => onSwitchEvent && onSwitchEvent(e.target.value)}
              className="bg-transparent font-mono text-xs text-on-surface focus:outline-none cursor-pointer pr-1"
            >
              {sprint?.event_options?.map((opt) => (
                <option key={opt} value={opt} className="bg-surface text-on-surface">
                  {opt}
                </option>
              )) || (
                <option>Global Sprint 2025 (North America)</option>
              )}
            </select>
          </div>

          {/* Real-time Status Beacon */}
          <div className="hidden lg:inline-flex items-center gap-2 bg-surface-container-low px-3 py-1 rounded-full border border-surface-container-high">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            <span className="font-mono text-xs text-primary font-semibold tracking-wide">
              {sprint?.phase || "Mid-Sprint Checkpoint"}
            </span>
          </div>
        </div>

        {/* Center: Major Portals Navigation */}
        <nav className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-surface-container-high">
          <button
            onClick={() => setActiveTab('ops')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'ops'
                ? 'bg-primary text-white shadow-sm font-semibold'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-base">terminal</span>
            <span className="hidden md:inline">Ops Console</span>
          </button>

          <button
            onClick={() => setActiveTab('war-room')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'war-room'
                ? 'bg-primary text-white shadow-sm font-semibold'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-base">view_kanban</span>
            <span className="hidden md:inline">Team War Room</span>
          </button>

          <button
            onClick={() => setActiveTab('judge')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'judge'
                ? 'bg-primary text-white shadow-sm font-semibold'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-base">gavel</span>
            <span className="hidden md:inline">Judge Console</span>
          </button>

          <button
            onClick={() => setActiveTab('sponsor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'sponsor'
                ? 'bg-primary text-white shadow-sm font-semibold'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-base">storefront</span>
            <span className="hidden md:inline">Sponsor Portal</span>
          </button>
        </nav>

        {/* Right: Notifications & Profile Selector */}
        <div className="flex items-center gap-3">
          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-9 h-9 rounded-lg bg-surface-container hover:bg-surface-container-high border border-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors relative"
              title="Notifications & Broadcasts"
            >
              <span className="material-symbols-outlined text-lg">notifications</span>
              {broadcasts.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest rounded-xl shadow-xl border border-surface-container-high p-3 z-50">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-surface-container">
                  <span className="font-mono text-xs font-bold uppercase text-on-surface">
                    Operations Dispatch Stream
                  </span>
                  <span className="text-[10px] bg-primary-fixed text-primary px-1.5 py-0.5 rounded font-bold">
                    {broadcasts.length} Messages
                  </span>
                </div>
                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                  {broadcasts.map((b) => (
                    <div key={b.id} className="p-2 rounded-lg bg-surface-container-low text-xs">
                      <div className="flex items-center justify-between text-on-surface-variant font-mono text-[10px]">
                        <span>{b.timestamp}</span>
                        <span className="uppercase text-primary font-bold">{b.type}</span>
                      </div>
                      <p className="font-semibold text-on-surface mt-1">{b.title}</p>
                      <p className="text-on-surface-variant text-[11px] mt-0.5">{b.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-surface-container-high transition-colors"
            >
              <img
                src={currentUser?.avatar || "/assets/asset_16_9592fa2f36.png"}
                alt="Profile"
                className="w-7 h-7 rounded-full object-cover ring-1 ring-primary/30"
              />
              <div className="hidden md:flex flex-col text-left">
                <span className="font-mono text-xs font-semibold text-on-surface leading-tight">
                  {currentUser?.name || "Dr. Aris Vane"}
                </span>
                <span className="text-[10px] text-on-surface-variant uppercase tracking-wider leading-none">
                  {currentUser?.role || "Organizer Lead"}
                </span>
              </div>
              <span className="material-symbols-outlined text-sm text-outline">arrow_drop_down</span>
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-surface-container-lowest rounded-xl shadow-xl border border-surface-container-high p-2 z-50">
                <div className="px-2 py-1.5 text-[10px] font-mono text-outline uppercase tracking-wider">
                  Switch Active Perspective
                </div>
                {userOptions.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setCurrentUser(u);
                      setShowUserDropdown(false);
                      if (u.defaultTab) setActiveTab(u.defaultTab);
                    }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${
                      currentUser?.id === u.id
                        ? 'bg-primary-container text-white'
                        : 'hover:bg-surface-container-high text-on-surface'
                    }`}
                  >
                    <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold leading-tight">{u.name}</span>
                      <span className="text-[10px] opacity-80 leading-none">{u.role}</span>
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

