import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useUser } from '../lib/auth';
import { Role } from '../lib/types';
import {
  Users,
  LayoutGrid,
  ShieldCheck,
  Briefcase,
  ChevronDown,
  Terminal,
  User as UserIcon,
} from 'lucide-react';

const ROLES: { id: Role; label: string; badge: string; color: string }[] = [
  { id: 'participant', label: 'Participant', badge: 'Person 1 & 2', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { id: 'organizer', label: 'Organizer', badge: 'Person 3', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 'judge', label: 'Judge', badge: 'Person 3', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { id: 'sponsor', label: 'Sponsor', badge: 'Person 4', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
];

export const Navbar: React.FC = () => {
  const { role, user, setRole } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { to: '/participant/teams', label: 'Team Matchmaking', icon: Users },
    { to: '/participant/hub', label: 'Participant Hub', icon: LayoutGrid },
    { to: '/organizer', label: 'Organizer & Judging', icon: ShieldCheck },
    { to: '/sponsor', label: 'Sponsor Portal', icon: Briefcase },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 group-hover:border-emerald-400 transition-all">
                <Terminal className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  Hack<span className="text-emerald-400">OS</span>
                </span>
                <span className="text-[10px] tracking-wider text-slate-400 uppercase -mt-1 font-mono">
                  PS 27 Core
                </span>
              </div>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Right Role Switcher */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-400 border-r border-slate-800 pr-3">
              <UserIcon className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-300 font-medium">{user.name}</span>
            </div>

            {/* Role Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              >
                <span className="text-slate-400 text-xs uppercase font-mono">Role:</span>
                <span className="capitalize text-white font-semibold">{role}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1 z-50">
                  <div className="px-3 py-2 border-b border-slate-800/80">
                    <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Demo Role Switcher</p>
                    <p className="text-xs text-slate-500">Injects X-Demo-Role in all API calls</p>
                  </div>
                  {ROLES.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setRole(r.id);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800/80 transition-colors ${
                        role === r.id ? 'bg-slate-800/50 text-white font-semibold' : 'text-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${role === r.id ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                        <span className="capitalize text-sm">{r.label}</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${r.color}`}>
                        {r.badge}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

