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
    const finalCheckpoint = isHardwareKit ? `Jetson AGX Kit #${Math.floor(Math.random() * 90 + 10)}` : checkpoint;
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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-dropdown border border-[#E7DFD5] flex flex-col gap-3.5 animate-fadeIn">
        <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE1]">
          <h3 className="font-serif font-bold text-base text-[#1F1916]">Manual QR Check-in</h3>
          <button onClick={onClose} className="material-symbols-outlined text-sm text-[#73645A] hover:text-[#1F1916] cursor-pointer">
            close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          <div>
            <label className="text-[11px] font-semibold text-[#1F1916] block mb-1">
              Participant Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Elena Rostova"
              value={attendee}
              onChange={(e) => setAttendee(e.target.value)}
              className="w-full bg-[#FAF7F2] p-2 rounded-lg border border-[#E7DFD5] text-xs text-[#1F1916] focus:outline-none focus:bg-white focus:border-[#C2542D]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#1F1916] block mb-1">
              University / Team
            </label>
            <input
              type="text"
              placeholder="e.g. Carnegie Mellon (Team V-SLAM)"
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
              className="w-full bg-[#FAF7F2] p-2 rounded-lg border border-[#E7DFD5] text-xs text-[#1F1916] focus:outline-none focus:bg-white focus:border-[#C2542D]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#1F1916] block mb-1">
              Gate Gateway
            </label>
            <select
              value={checkpoint}
              onChange={(e) => setCheckpoint(e.target.value)}
              className="w-full bg-[#FAF7F2] p-2 rounded-lg border border-[#E7DFD5] text-xs text-[#1F1916] cursor-pointer font-sans"
            >
              <option value="Gate A - Main Rotunda">Gate A - Main Rotunda</option>
              <option value="Gate B - Hardware Desk">Gate B - Hardware Desk</option>
              <option value="Gate C - West Concourse">Gate C - West Concourse</option>
              <option value="Gate D - Stata Concourse">Gate D - Stata Concourse</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer mt-0.5">
            <input
              type="checkbox"
              checked={isHardwareKit}
              onChange={(e) => setIsHardwareKit(e.target.checked)}
              className="rounded text-[#2F5B3C] h-3.5 w-3.5 accent-[#2F5B3C]"
            />
            <span className="text-[11px] font-medium text-[#1F1916]">Issue Jetson AGX Developer Kit</span>
          </label>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#F0EAE1]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F3EFEA] text-[#1F1916] font-medium text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-[#2F5B3C] hover:bg-[#254B31] text-white font-semibold text-xs shadow-subtle cursor-pointer"
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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-dropdown border border-[#E7DFD5] flex flex-col gap-3.5 animate-fadeIn">
        <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE1]">
          <h3 className="font-serif font-bold text-base text-[#1F1916]">Event Announcement</h3>
          <button onClick={onClose} className="material-symbols-outlined text-sm text-[#73645A] hover:text-[#1F1916] cursor-pointer">
            close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          <div>
            <label className="text-[11px] font-semibold text-[#1F1916] block mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. NVIDIA ROS2dd Workshop Starting"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#FAF7F2] p-2 rounded-lg border border-[#E7DFD5] text-xs text-[#1F1916] focus:outline-none focus:bg-white focus:border-[#C2542D]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#1F1916] block mb-1">
              Message Body *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Full announcement to all participant consoles and mobile passes..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#FAF7F2] p-2 rounded-lg border border-[#E7DFD5] text-xs text-[#1F1916] focus:outline-none focus:bg-white focus:border-[#C2542D]"
            ></textarea>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#F0EAE1]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F3EFEA] text-[#1F1916] font-medium text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-[#C2542D] hover:bg-[#A8431F] text-white font-semibold text-xs shadow-subtle cursor-pointer"
            >
              Broadcast
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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-dropdown border border-[#F0D5D5] flex flex-col gap-3 animate-fadeIn">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[#B83A3A] text-xl">warning</span>
          <h3 className="font-serif font-bold text-base text-[#B83A3A]">Dispatch Facility Alert</h3>
        </div>

        <p className="text-xs text-[#73645A] leading-relaxed bg-[#FDF2F2] p-3 rounded-lg border border-[#F0D5D5]">
          This will trigger a high-priority banner across all 348 teams, mentor desks, and judge consoles.
        </p>

        <div className="flex justify-end gap-2 pt-2 border-t border-[#F0EAE1]">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-[#FAF7F2] text-xs font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-3 py-1.5 rounded-lg bg-[#B83A3A] hover:bg-[#9E2E2E] text-white text-xs font-semibold cursor-pointer"
          >
            Confirm Alert
          </button>
        </div>
      </div>
    </div>
  );
}

export function TaskModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [project, setProject] = useState('LiDAR Odometry');
  const [priority, setPriority] = useState('Normal');
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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-dropdown border border-[#E7DFD5] flex flex-col gap-3.5 animate-fadeIn">
        <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE1]">
          <h3 className="font-serif font-bold text-base text-[#1F1916]">Add Sprint Task</h3>
          <button onClick={onClose} className="material-symbols-outlined text-sm text-[#73645A] hover:text-[#1F1916] cursor-pointer">
            close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          <div>
            <label className="text-[11px] font-semibold text-[#1F1916] block mb-1">
              Task Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Calibrate EKF timestamp offsets"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#FAF7F2] p-2 rounded-lg border border-[#E7DFD5] text-xs text-[#1F1916] focus:outline-none focus:bg-white focus:border-[#2F5B3C]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-[#1F1916] block mb-1">Project</label>
              <input
                type="text"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full bg-[#FAF7F2] p-2 rounded-lg border border-[#E7DFD5] text-xs text-[#1F1916]"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#1F1916] block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-[#FAF7F2] p-2 rounded-lg border border-[#E7DFD5] text-xs text-[#1F1916] cursor-pointer"
              >
                <option value="NORMAL">Normal</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-[#1F1916] block mb-1">Column</label>
              <select
                value={column}
                onChange={(e) => setColumn(e.target.value)}
                className="w-full bg-[#FAF7F2] p-2 rounded-lg border border-[#E7DFD5] text-xs text-[#1F1916] cursor-pointer"
              >
                <option value="backlog">Backlog</option>
                <option value="in_progress">In Progress</option>
                <option value="under_review">Under Review</option>
                <option value="deployed">Deployed</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#1F1916] block mb-1">Assignee</label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full bg-[#FAF7F2] p-2 rounded-lg border border-[#E7DFD5] text-xs text-[#1F1916] cursor-pointer"
              >
                <option value="M. Chen">M. Chen</option>
                <option value="S. Ramos">S. Ramos</option>
                <option value="D. Kulkarni">D. Kulkarni</option>
                <option value="A. Patel">A. Patel</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#F0EAE1]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F3EFEA] text-[#1F1916] font-medium text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-[#2F5B3C] hover:bg-[#254B31] text-white font-semibold text-xs shadow-subtle cursor-pointer"
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
  const [notes, setNotes] = useState('Flagged for Embedded CUDA & Perception track.');

  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-dropdown border border-[#E7DFD5] flex flex-col gap-3 animate-fadeIn">
        <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE1]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] text-[#1F1916] flex items-center justify-center text-xs font-bold font-mono border border-[#E7DFD5] shrink-0">
              {candidate.name ? candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'CD'}
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-[#1F1916]">
                Interview Invitation
              </h3>
              <p className="text-[11px] text-[#73645A]">{candidate.name} • {candidate.school}</p>
            </div>
          </div>
          <button onClick={onClose} className="material-symbols-outlined text-sm cursor-pointer">
            close
          </button>
        </div>

        <div className="text-xs flex flex-col gap-2">
          <p className="text-[#382F2A]">
            Dispatch recruitment invitation to <strong>{candidate.name}</strong> for <strong>{candidate.project_name}</strong>.
          </p>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-[#FAF7F2] p-2 rounded-lg border border-[#E7DFD5] text-xs text-[#1F1916]"
          ></textarea>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-[#F0EAE1]">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-[#FAF7F2] text-xs font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSubmit(candidate.id, notes);
              onClose();
            }}
            className="px-3 py-1.5 rounded-lg bg-[#2F5B3C] text-white text-xs font-semibold cursor-pointer"
          >
            Dispatch Invitation
          </button>
        </div>
      </div>
    </div>
  );
}

export function Toast({ message, icon = 'check_circle', onClose }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 bg-white text-[#1F1916] px-3.5 py-2.5 rounded-xl shadow-dropdown border border-[#E7DFD5] flex items-center gap-2.5 animate-fadeIn">
      <span className="material-symbols-outlined text-[#2F5B3C] text-base">{icon}</span>
      <span className="text-xs font-semibold">{message}</span>
      <button onClick={onClose} className="material-symbols-outlined text-[#A89C92] hover:text-[#1F1916] text-sm ml-2 cursor-pointer">
        close
      </button>
    </div>
  );
}
