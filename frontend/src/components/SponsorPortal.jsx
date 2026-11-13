import React, { useState } from 'react';

export default function SponsorPortal({
  data,
  onRequestInterview,
  onSubmitProposal,
  onExportLedger
}) {
  const [selectedSkills, setSelectedSkills] = useState(['CUDA', 'TensorRT']);
  const [candidateSearch, setCandidateSearch] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(null);

  const availableSkills = ['CUDA', 'TensorRT', 'C++20', 'ROS2', 'PyTorch', 'Triton Inference'];

  const metrics = data?.metrics || {
    foot_traffic: { count: 840, target: 1000, trend: '+18% vs Target', percentage: 84 },
    sdk_ingestion: { teams_active: 312, percentage: 68, description: 'JetPack 6.0 & TensorRT deployed' },
    talent_pipeline: { leads: 142, flagged_rnd: 62, percentage: 71 },
    deliverables: { completed: 8, total: 10, percentage: 80, note: '2 milestones awaiting Day 3 final' }
  };

  const deliverablesTable = data?.deliverables_table || [];
  const marketplacePackages = data?.marketplace_packages || [];
  const candidates = data?.candidates || [];

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const filteredCandidates = candidates.filter((c) => {
    const q = candidateSearch.toLowerCase();
    const matchesSearch = c.name.toLowerCase().includes(q) ||
      c.school.toLowerCase().includes(q) ||
      c.project_name.toLowerCase().includes(q) ||
      c.skills.some(s => s.toLowerCase().includes(q));

    if (selectedSkills.length === 0) return matchesSearch;
    const matchesSkills = selectedSkills.every(s => c.skills.includes(s));
    return matchesSearch && matchesSkills;
  });

  return (
    <div className="flex flex-col w-full pb-16 animate-fadeIn">
      {/* Top Banner / Sponsor Command Bar */}
      <section className="w-full bg-surface-container-low rounded-2xl p-6 mb-6 border border-surface-container-high shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-surface-container-lowest flex items-center justify-center p-2 shadow-sm shrink-0 border border-surface-container-high">
              <img
                src={data?.logo || "/assets/asset_09_5517e51afc.png"}
                alt="Partner Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-headline font-extrabold text-xl lg:text-2xl text-on-surface tracking-tight">
                  {data?.partner_name || "NVIDIA Inception & Edge AI Lab"}
                </h1>
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-primary-container text-white">
                  {data?.tier || "Tier-1 Title Partner"}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-1 font-medium">
                <span className="material-symbols-outlined text-sm text-primary">event_available</span>
                <span>Active Campaign: <strong>{data?.campaign || "Autonomous Systems Hackathon 2025"}</strong> • Node: {data?.node || "SF Pier 48 + Virtual Stream"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start lg:self-auto">
            <button
              onClick={onExportLedger}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface font-mono text-xs font-semibold transition-all shadow-sm border border-surface-container-high cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>Export Ledger</span>
            </button>
            <button
              onClick={() => alert("Campaign settings synchronized with AEGIS Partner Escrow.")}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white font-mono text-xs font-semibold transition-all shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">tune</span>
              <span>Campaign Settings</span>
            </button>
          </div>
        </div>

        {/* Telemetry Snapshot Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high shadow-sm">
            <div className="flex items-center justify-between text-on-surface-variant font-mono text-[10px] uppercase font-semibold tracking-wider mb-2">
              <span>Booth Foot Traffic</span>
              <span className="material-symbols-outlined text-primary text-base">sensors</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline font-extrabold text-2xl text-on-surface">
                {metrics.foot_traffic.count}
              </span>
              <span className="font-mono text-xs text-primary font-bold">
                {metrics.foot_traffic.trend}
              </span>
            </div>
            <div className="w-full bg-surface-container-high rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-700"
                style={{ width: `${metrics.foot_traffic.percentage}%` }}
              ></div>
            </div>
            <span className="font-mono text-[10px] text-on-surface-variant mt-2 block">
              Target: {metrics.foot_traffic.target} on-site badges
            </span>
          </div>

          {/* Card 2 */}
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high shadow-sm">
            <div className="flex items-center justify-between text-on-surface-variant font-mono text-[10px] uppercase font-semibold tracking-wider mb-2">
              <span>SDK & API Ingestion</span>
              <span className="material-symbols-outlined text-secondary text-base">developer_board</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline font-extrabold text-2xl text-on-surface">
                {metrics.sdk_ingestion.teams_active}
              </span>
              <span className="font-mono text-xs text-secondary font-bold">
                Teams Active
              </span>
            </div>
            <div className="w-full bg-surface-container-high rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                className="bg-secondary h-full rounded-full transition-all duration-700"
                style={{ width: `${metrics.sdk_ingestion.percentage}%` }}
              ></div>
            </div>
            <span className="font-mono text-[10px] text-on-surface-variant mt-2 block">
              {metrics.sdk_ingestion.description}
            </span>
          </div>

          {/* Card 3 */}
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high shadow-sm">
            <div className="flex items-center justify-between text-on-surface-variant font-mono text-[10px] uppercase font-semibold tracking-wider mb-2">
              <span>Talent Pipeline</span>
              <span className="material-symbols-outlined text-primary text-base">person_search</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline font-extrabold text-2xl text-on-surface">
                {metrics.talent_pipeline.leads}
              </span>
              <span className="font-mono text-xs text-primary font-bold">
                Verified Leads
              </span>
            </div>
            <div className="w-full bg-surface-container-high rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-700"
                style={{ width: `${metrics.talent_pipeline.percentage}%` }}
              ></div>
            </div>
            <span className="font-mono text-[10px] text-on-surface-variant mt-2 block">
              {metrics.talent_pipeline.flagged_rnd} flagged for Deep Learning R&D
            </span>
          </div>

          {/* Card 4 */}
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high shadow-sm">
            <div className="flex items-center justify-between text-on-surface-variant font-mono text-[10px] uppercase font-semibold tracking-wider mb-2">
              <span>Deliverable Fulfillment</span>
              <span className="material-symbols-outlined text-primary text-base">verified</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline font-extrabold text-2xl text-on-surface">
                {metrics.deliverables.percentage}%
              </span>
              <span className="font-mono text-xs text-on-surface-variant font-medium">
                ({metrics.deliverables.completed} of {metrics.deliverables.total} Cleared)
              </span>
            </div>
            <div className="w-full bg-surface-container-high rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                className="bg-primary-container h-full rounded-full transition-all duration-700"
                style={{ width: `${metrics.deliverables.percentage}%` }}
              ></div>
            </div>
            <span className="font-mono text-[10px] text-on-surface-variant mt-2 block">
              {metrics.deliverables.note}
            </span>
          </div>
        </div>
      </section>

      {/* Section A: Deliverables & Activation Tracker */}
      <section className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4">
          <div>
            <span className="font-mono text-[10px] text-primary uppercase font-bold tracking-widest block mb-1">
              Contract Compliance // Protocol 408
            </span>
            <h2 className="font-headline font-bold text-xl text-on-surface">
              Deliverables & Activation Tracker
            </h2>
          </div>
          <span className="font-mono text-xs text-on-surface-variant mt-2 sm:mt-0">
            Sprint Stage: Day 2 • 14:26:09 UTC
          </span>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-surface-container-high">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-low text-on-surface-variant font-mono text-[11px] uppercase border-b border-surface-container-high">
                <tr>
                  <th className="py-3 px-4">Deliverable Node</th>
                  <th className="py-3 px-4">Format & Channel</th>
                  <th className="py-3 px-4">Audience Reached</th>
                  <th className="py-3 px-4">Operational Status</th>
                  <th className="py-3 px-4 text-right">Audit Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high">
                {deliverablesTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-primary-fixed/40 text-primary flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-sm">{row.icon}</span>
                        </span>
                        <div>
                          <span className="font-semibold text-on-surface block leading-tight">
                            {row.node}
                          </span>
                          <span className="text-[11px] text-on-surface-variant">
                            {row.sub}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-on-surface-variant">
                      {row.channel}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold">
                      {row.reach}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                          row.status.includes('Active')
                            ? 'bg-secondary-fixed text-on-secondary-fixed animate-pulse'
                            : row.status.includes('Completed') || row.status.includes('Assigned')
                            ? 'bg-primary-fixed text-primary'
                            : 'bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        <span className="material-symbols-outlined text-xs">
                          {row.status.includes('Active') ? 'sensors' : 'check'}
                        </span>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-xs text-primary font-bold">
                      {row.audit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section B: Sponsorship Package Marketplace */}
      <section className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4">
          <div>
            <span className="font-mono text-[10px] text-secondary uppercase font-bold tracking-widest block mb-1">
              Global Pipeline // Tier Openings
            </span>
            <h2 className="font-headline font-bold text-xl text-on-surface">
              AEGIS Sponsorship Marketplace
            </h2>
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <button
              onClick={() => alert("Tier comparison matrix exported.")}
              className="px-3.5 py-2 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface font-mono text-xs font-semibold border border-surface-container-high shadow-sm cursor-pointer"
            >
              Compare Tier Matrices
            </button>
            <button
              onClick={() => setSelectedPackage(marketplacePackages[0])}
              className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-container text-white font-mono text-xs font-semibold shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">post_add</span>
              <span>Submit Custom Proposal</span>
            </button>
          </div>
        </div>

        {/* Marketplace Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {marketplacePackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-surface-container-lowest rounded-2xl p-5 flex flex-col justify-between shadow-sm border border-surface-container-high relative overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 ${
                  pkg.color === 'primary' ? 'bg-primary' : pkg.color === 'secondary' ? 'bg-secondary' : 'bg-outline'
                }`}
              ></div>

              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-primary-fixed text-primary font-bold uppercase">
                    {pkg.status}
                  </span>
                  <span className="font-headline font-extrabold text-xl text-primary font-mono">
                    {pkg.price}
                  </span>
                </div>

                <h3 className="font-headline font-bold text-base text-on-surface mb-1">
                  {pkg.title}
                </h3>
                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                  {pkg.description}
                </p>

                <div className="bg-surface-container-low rounded-xl p-3 flex flex-col gap-2 mb-4 border border-surface-container-high font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-on-surface-variant text-[11px]">Cohort</span>
                    <span className="font-bold text-on-surface">{pkg.cohort}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-on-surface-variant text-[11px]">Nodes</span>
                    <span className="font-bold text-on-surface">{pkg.nodes}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-on-surface-variant text-[11px]">Datacenter</span>
                    <span className="font-bold text-on-surface">{pkg.datacenter}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mb-3">
                  <span className="material-symbols-outlined text-base">workspace_premium</span>
                  <span className="text-[11px]">{pkg.perks}</span>
                </div>
                <button
                  onClick={() => setSelectedPackage(pkg)}
                  className="w-full py-2.5 rounded-xl bg-surface-container hover:bg-primary hover:text-white text-on-surface font-mono text-xs font-bold transition-all text-center border border-surface-container-high cursor-pointer shadow-sm active:scale-95"
                >
                  Review Title Rights Package
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section C: Verified Talent Discovery & Candidate Pipeline */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4">
          <div>
            <span className="font-mono text-[10px] text-primary uppercase font-bold tracking-widest block mb-1">
              Verified Technical Talent // Real-time Ingestion
            </span>
            <h2 className="font-headline font-bold text-xl text-on-surface">
              Sprint Candidate Discovery
            </h2>
          </div>
          <span className="font-mono text-xs text-on-surface-variant mt-2 sm:mt-0">
            Verified via GitHub Commits & AEGIS Build Telemetry
          </span>
        </div>

        {/* Skill Filter Bar */}
        <div className="bg-surface-container-low rounded-2xl p-4 mb-5 flex items-center justify-between flex-wrap gap-3 border border-surface-container-high">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[11px] text-on-surface-variant uppercase font-semibold mr-1">
              Filter Stack:
            </span>
            {availableSkills.map((skill) => {
              const active = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1 rounded-full font-mono text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                    active
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-surface-container-high'
                  }`}
                >
                  <span>{active ? skill : `+ ${skill}`}</span>
                  {active && <span className="material-symbols-outlined text-xs">close</span>}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search verified builders..."
              value={candidateSearch}
              onChange={(e) => setCandidateSearch(e.target.value)}
              className="bg-surface-container-lowest rounded-xl px-3 py-1.5 text-xs text-on-surface border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-56 shadow-sm"
            />
            <span className="font-mono text-xs text-primary font-bold shrink-0">
              {filteredCandidates.length} Matches
            </span>
          </div>
        </div>

        {/* Candidate Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredCandidates.map((cand) => (
            <div
              key={cand.id}
              className="bg-surface-container-lowest rounded-2xl p-5 flex flex-col justify-between shadow-sm border border-surface-container-high hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={cand.avatar}
                      alt={cand.name}
                      className="w-12 h-12 rounded-full object-cover shadow-sm ring-1 ring-primary/20"
                    />
                    <div>
                      <h4 className="font-headline font-bold text-sm text-on-surface">
                        {cand.name}
                      </h4>
                      <span className="text-xs text-on-surface-variant font-medium">
                        {cand.school}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded font-bold bg-primary-fixed text-primary">
                    {cand.badge}
                  </span>
                </div>

                <div className="bg-surface-container-low rounded-xl p-3 mb-3 border border-surface-container-high">
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="font-mono text-[10px] text-on-surface-variant uppercase font-semibold">
                      Sprint Project
                    </span>
                    <span className="font-bold text-primary">{cand.project_name}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                    {cand.project_summary}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {cand.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-semibold"
                    >
                      {s}
                    </span>
                  ))}
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-primary-fixed text-primary font-bold">
                    Score: {cand.score}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-surface-container">
                <button
                  onClick={() => onRequestInterview && onRequestInterview(cand)}
                  className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white font-mono text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">mail</span>
                  <span>Request Interview</span>
                </button>
                <button
                  onClick={() => alert(`Full benchmark dossier for ${cand.name} downloaded.`)}
                  className="p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors border border-surface-container-high cursor-pointer"
                  title="Download Candidate Bench Dossier"
                >
                  <span className="material-symbols-outlined text-base">download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Proposal Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-surface-container-high flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <h3 className="font-headline font-bold text-lg text-primary">
                Sponsorship Proposal: {selectedPackage.title}
              </h3>
              <button
                onClick={() => setSelectedPackage(null)}
                className="material-symbols-outlined text-outline hover:text-on-surface cursor-pointer"
              >
                close
              </button>
            </div>
            <div className="text-xs text-on-surface-variant flex flex-col gap-2">
              <p>Lock rights for {selectedPackage.title} at {selectedPackage.price}.</p>
              <input
                type="text"
                placeholder="Company Name (e.g. NVIDIA AI)"
                id="prop-company"
                defaultValue="NVIDIA Inception"
                className="w-full bg-surface-container-low p-2.5 rounded-xl border border-surface-container-high text-xs text-on-surface"
              />
              <input
                type="email"
                placeholder="Contact Email"
                id="prop-email"
                defaultValue="partnerships@nvidia.com"
                className="w-full bg-surface-container-low p-2.5 rounded-xl border border-surface-container-high text-xs text-on-surface"
              />
              <textarea
                placeholder="Custom terms or API integration requirements..."
                rows={3}
                id="prop-terms"
                defaultValue="Requesting 40 Orin developer kits on-site bench allocation and workshop mainstage slot."
                className="w-full bg-surface-container-low p-2.5 rounded-xl border border-surface-container-high text-xs text-on-surface"
              ></textarea>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-surface-container">
              <button
                onClick={() => setSelectedPackage(null)}
                className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-mono text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const company = document.getElementById('prop-company')?.value || 'NVIDIA';
                  const email = document.getElementById('prop-email')?.value || 'partners@nvidia.com';
                  const terms = document.getElementById('prop-terms')?.value || '';
                  onSubmitProposal && onSubmitProposal(selectedPackage.id, company, email, terms);
                  setSelectedPackage(null);
                }}
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-white font-mono text-xs font-bold"
              >
                Submit Proposal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

