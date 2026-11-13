export type Role = 'participant' | 'organizer' | 'judge' | 'sponsor';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  created_at?: string;
  metadata_json?: Record<string, any>;
}

export interface Event {
  id: number;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  phase?: string;
  metadata_json?: Record<string, any>;
}

export interface Team {
  id: number;
  name: string;
  event_id?: number;
  leader_id?: number;
  created_at?: string;
  metadata_json?: Record<string, any>;
}

export interface Submission {
  id: number;
  team_id?: number;
  event_id?: number;
  title: string;
  repo_url?: string;
  demo_url?: string;
  description?: string;
  submitted_at?: string;
  metadata_json?: Record<string, any>;
}

export interface Score {
  id: number;
  submission_id: number;
  judge_id: number;
  score: number;
  feedback?: string;
  created_at?: string;
  metadata_json?: Record<string, any>;
}

export interface ApiStatusResponse {
  feature: string;
  status: string;
  description?: string;
  active_user?: User;
}

