import React, { useState } from 'react';

export function CheckinModal({ isOpen, onClose, onSubmit }) {
  const [attendee, setAttendee] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [checkpoint, setCheckpoint] = useState('Gate A - Main Rotunda');
  const [isHardwareKit, setIsHardwareKit] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!attendee.trim()) return;
    const finalCheckpoint = isHardwareKit ? `Collected Jetson AGX Kit #${Math.floor(Math.random() * 90 + 10)}` : checkpoint;
    onSubmit({
      attendee,
      affiliation: affiliation || 'Independent Builder',
      checkpoint: finalCheckpoint,
      type: isHardwareKit ? 'hardware' : 'gate'
    });
    setAttendee('');
    setAffiliation('');
    setIsHardwareKit(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-container-high flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-surface-container pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">barcode_reader</span>
            <h3 className="font-headline font-bold text-base text-on-surface">Fast Manual Check-in</h3>
          </div>
          <button onClick={onClose} className="material-symbols-outlined text-outline hover:text-on-surface">
            close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          <div>
            <label className="font-mono text-[11px] text-on-surface-variant uppercase font-semibold block mb-1">
              Participant Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Kai Nakamura"
              value={attendee}
              onChange={(e) => setAttendee(e.target.value)}
              className="w-full bg-surface-container-low p-2.5 rounded-xl border border-surface-container-high text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="font-mono text-[11px] text-on-surface-variant uppercase font-semibold block mb-1">
              Affiliation / University / Team
            </label>
            <input
              type="text"
              placeholder="e.g. MIT CSAIL (Team Orbit)"
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
              className="w-full bg-surface-container-low p-2.5 rounded-xl border border-surface-container-high text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="font-mono text-[11px] text-on-surface-variant uppercase font-semibold block mb-1">
              Checkpoint Gateway
            </label>
            <select
              value={checkpoint}
              onChange={(e) => setCheckpoint(e.target.value)}
              className="w-full bg-surface-container-low p-2.5 rounded-xl border border-surface-container-high text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer font-mono"
            >
              <option value="Gate A - Main Rotunda">Gate A - Main Rotunda</option>
              <option value="Gate B - Hardware Desk">Gate B - Hardware Desk</option>
              <option value="Gate C - West Concourse">Gate C - West Concourse</option>
              <option value="Gate D - Stata Concourse">Gate D - Stata Concourse</option>
            </select>
          </div>

          <label className="flex items-center gap-2 mt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={isHardwareKit}
              onChange={(e) => setIsHardwareKit(e.target.checked)}
              className="rounded text-primary focus:ring-primary h-4 w-4 accent-primary"
            />
            <span className="font-medium text-on-surface">Distribute Jetson AGX Kit Loan Badge</span>
          </label>

          <div className="flex justify-end gap-2 pt-3 border-t border-surface-container mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-mono text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-white font-mono text-xs font-bold shadow-sm"
            >
              Confirm Scan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function BroadcastModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    onSubmit({ title, message, type });
    setTitle('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-container-high flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-surface-container pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">campaign</span>
            <h3 className="font-headline font-bold text-base text-on-surface">Broadcast Announcement</h3>
          </div>
          <button onClick={onClose} className="material-symbols-outlined text-outline hover:text-on-surface">
            close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          <div>
            <label className="font-mono text-[11px] text-on-surface-variant uppercase font-semibold block mb-1">
              Announcement Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dinner Served in Central Atrium"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-surface-container-low p-2.5 rounded-xl border border-surface-container-high text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="font-mono text-[11px] text-on-surface-variant uppercase font-semibold block mb-1">
              Broadcast Message *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Full dispatch message to all participant screens and mobile telemetry..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-surface-container-low p-2.5 rounded-xl border border-surface-container-high text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            ></textarea>
          </div>

          <div>
            <label className="font-mono text-[11px] text-on-surface-variant uppercase font-semibold block mb-1">
              Broadcast Priority Level
            </label>
            <div className="flex gap-2">
              {['info', 'urgent', 'alert'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setType(lvl)}
                  className={`flex-1 py-1.5 rounded-lg font-mono text-xs font-semibold capitalize border ${
                    type === lvl
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface-container text-on-surface-variant border-surface-container-high'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-surface-container mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-mono text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-white font-mono text-xs font-bold shadow-sm"
            >
              Send Broadcast
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function EmergencyModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-error/30 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-error/15 text-error flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">warning</span>
          </div>
          <div>
            <h3 className="font-headline font-bold text-base text-error">Emergency Alert Dispatch</h3>
            <p className="text-xs text-on-surface-variant">Protocol Lock & Facility Wide Notification</p>
          </div>
        </div>

        <p className="text-xs text-on-surface leading-relaxed bg-error/5 p-3 rounded-xl border border-error/20">
          This will trigger a high-priority audible and visual warning across all 348 teams, mentor desks, and judge consoles. Use only for hardware safety, facility egress, or critical security alerts.
        </p>

        <div className="flex justify-end gap-2 pt-2 border-t border-surface-container">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-mono text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-error hover:bg-error/90 text-white font-mono text-xs font-bold shadow-sm"
          >
            Dispatch Alert
          </button>
        </div>
      </div>
    </div>
  );
}

export function TaskModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [project, setProject] = useState('Swarm Sim Harness');
  const [priority, setPriority] = useState('P2 Normal');
  const [column, setColumn] = useState('backlog');
  const [assignee, setAssignee] = useState('M. Chen');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title,
      project,
      priority,
      column,
      assignee
    });
    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-container-high flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-surface-container pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">add_task</span>
            <h3 className="font-headline font-bold text-base text-on-surface">New Sprint Task</h3>
          </div>
          <button onClick={onClose} className="material-symbols-outlined text-outline hover:text-on-surface">
            close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          <div>
            <label className="font-mono text-[11px] text-on-surface-variant uppercase font-semibold block mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Integrate PointCloud2 ROS2 filter"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-surface-container-low p-2.5 rounded-xl border border-surface-container-high text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-[11px] text-on-surface-variant uppercase font-semibold block mb-1">
                Subsystem Project
              </label>
              <input
                type="text"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full bg-surface-container-low p-2.5 rounded-xl border border-surface-container-high text-xs text-on-surface"
              />
            </div>
            <div>
              <label className="font-mono text-[11px] text-on-surface-variant uppercase font-semibold block mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-surface-container-low p-2.5 rounded-xl border border-surface-container-high text-xs text-on-surface font-mono cursor-pointer"
              >
                <option value="P1 Urgent">P1 Urgent</option>
                <option value="P2 Normal">P2 Normal</option>
                <option value="P3 Backlog">P3 Backlog</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-[11px] text-on-surface-variant uppercase font-semibold block mb-1">
                Target Column
              </label>
              <select
                value={column}
                onChange={(e) => setColumn(e.target.value)}
                className="w-full bg-surface-container-low p-2.5 rounded-xl border border-surface-container-high text-xs text-on-surface font-mono cursor-pointer"
              >
                <option value="backlog">Backlog</option>
                <option value="in_progress">In Progress</option>
                <option value="under_review">Under Review</option>
                <option value="deployed">Deployed / Done</option>
              </select>
            </div>
            <div>
              <label className="font-mono text-[11px] text-on-surface-variant uppercase font-semibold block mb-1">
                Assignee
              </label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full bg-surface-container-low p-2.5 rounded-xl border border-surface-container-high text-xs text-on-surface font-mono cursor-pointer"
              >
                <option value="M. Chen">Marcus Chen</option>
                <option value="S. Ramos">Sofia Ramos</option>
                <option value="D. Kulkarni">Devansh Kulkarni</option>
                <option value="A. Patel">Ananya Patel</option>
                <option value="Unassigned">Unassigned</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-surface-container mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-mono text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-white font-mono text-xs font-bold shadow-sm"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function InterviewModal({ candidate, isOpen, onClose, onSubmit }) {
  const [notes, setNotes] = useState('Flagged for Deep Learning Perception & Embedded CUDA track.');

  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-container-high flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-surface-container pb-3">
          <div className="flex items-center gap-3">
            <img src={candidate.avatar} alt={candidate.name} className="w-10 h-10 rounded-full object-cover ring-1 ring-primary" />
            <div>
              <h3 className="font-headline font-bold text-base text-on-surface">
                Interview Invitation: {candidate.name}
              </h3>
              <p className="text-xs text-on-surface-variant">{candidate.school}</p>
            </div>
          </div>
          <button onClick={onClose} className="material-symbols-outlined text-outline hover:text-on-surface">
            close
          </button>
        </div>

        <div className="text-xs flex flex-col gap-2">
          <p className="text-on-surface leading-relaxed">
            Send an expedited recruitment interview request to <strong>{candidate.name}</strong> for the <strong>{candidate.project_name}</strong> candidate dossier.
          </p>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-surface-container-low p-2.5 rounded-xl border border-surface-container-high text-xs text-on-surface"
          ></textarea>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-surface-container">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-mono text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSubmit(candidate.id, notes);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-white font-mono text-xs font-bold"
          >
            Send Invitation
          </button>
        </div>
      </div>
    </div>
  );
}

export function Toast({ message, icon = 'check_circle', onClose }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-surface-container-lowest text-on-surface px-4 py-3 rounded-2xl shadow-xl border border-surface-container-high flex items-center gap-3 animate-slideUp">
      <span className="material-symbols-outlined text-primary text-xl">{icon}</span>
      <span className="text-xs font-semibold text-on-surface">{message}</span>
      <button onClick={onClose} className="material-symbols-outlined text-outline hover:text-on-surface text-sm ml-2">
        close
      </button>
    </div>
  );
}

