import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, User } from './types';

interface AuthContextType {
  role: Role;
  user: User;
  setRole: (role: Role) => void;
  setUser: (user: User) => void;
}

const SEEDED_USERS: Record<Role, User> = {
  participant: {
    id: 1,
    name: 'Alex Rivera',
    email: 'alex@participant.hackos',
    role: 'participant',
    metadata_json: { skills: ['React', 'TypeScript', 'FastAPI'], team_id: null },
  },
  organizer: {
    id: 2,
    name: 'Jordan Lee',
    email: 'jordan@organizer.hackos',
    role: 'organizer',
    metadata_json: { permissions: ['admin', 'events', 'judging'] },
  },
  judge: {
    id: 3,
    name: 'Dr. Sarah Chen',
    email: 'sarah@judge.hackos',
    role: 'judge',
    metadata_json: { track: 'AI & Systems' },
  },
  sponsor: {
    id: 4,
    name: 'Marcus Vance',
    email: 'marcus@sponsor.hackos',
    role: 'sponsor',
    metadata_json: { company: 'VentureAI Labs' },
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>(() => {
    const saved = localStorage.getItem('hackos_demo_role') as Role | null;
    if (saved && ['participant', 'organizer', 'judge', 'sponsor'].includes(saved)) {
      return saved;
    }
    return 'participant';
  });

  const [user, setUser] = useState<User>(() => SEEDED_USERS[role]);

  useEffect(() => {
    localStorage.setItem('hackos_demo_role', role);
    setUser(SEEDED_USERS[role]);
  }, [role]);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
  };

  return (
    <AuthContext.Provider value={{ role, user, setRole, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useUser must be used within an AuthProvider');
  }
  return context;
};

