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

  const availableSkills = ['CUDA', 'TensorRT', 'C++20', 'ROS2', 'PyTorch', 'Triton'];

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
    const matchesSkills = selectedSkills.every(s => c.skills.some(sk => sk.toLowerCase().includes(s.toLowerCase())));
    return matchesSearch && matchesSkills;
  });

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Sponsor Command Bar */}
      <section className="w-full bg-white rounded-xl p-5 mb-5 border border-[#E7DFD5] shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#24422D] text-white shadow-sm shrink-0 border border-[#1A3322] flex items-center justify-center font-mono font-bold text-sm tracking-wider">
              NV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-medium tracking-tight text-[#1F1916]">
                  {data?.partner_name || "NVIDIA Inception & Edge AI Lab"}
                </h1>
                <span className="font-mono text-[10px] text-[#2F5B3C] bg-[#EFF5F1] px-2 py-0.5 rounded font-semibold border border-[#DEEBE1]">
                  Title Partner ROI
                </span>
              </div>
              <p className="text-xs text-[#73645A] mt-0.5">
                Active Campaign: <strong>Autonomous Systems Hackathon 2025</strong> • SF Pier 48 + Virtual Stream
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-auto">
            <button
              onClick={onExportLedger}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#FAF7F2] text-[#1F1916] text-xs font-medium border border-[#E7DFD5] shadow-subtle transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px] text-[#73645A]">download</span>
              <span>Export Deal Ledger</span>
            </button>
            <button
              onClick={() => alert("Campaign settings synchronized.")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2F5B3C] hover:bg-[#254B31] text-white text-xs font-semibold shadow-subtle transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">tune</span>
              <span>Deliverable Settings</span>
            </button>
          </div>
        </div>

        {/* 4 Telemetry Metric Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-[#FAF7F2] p-3.5 rounded-lg border border-[#E7DFD5]">
            <div className="flex justify-between items-center text-xs text-[#73645A]">
              <span>Booth Foot Traffic</span>
              <span className="font-mono text-[10px] text-[#2F5B3C] font-semibold">{metrics.foot_traffic.trend}</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="font-sans font-bold text-xl text-[#1F1916]">{metrics.foot_traffic.count}</span>
              <span className="text-xs text-[#73645A]">/ {metrics.foot_traffic.target} badges</span>
            </div>
            <div className="w-full bg-[#E7DFD5] h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-[#2F5B3C] h-full rounded-full" style={{ width: `${metrics.foot_traffic.percentage}%` }}></div>
            </div>
          </div>

          <div className="bg-[#FAF7F2] p-3.5 rounded-lg border border-[#E7DFD5]">
            <div className="flex justify-between items-center text-xs text-[#73645A]">
              <span>Verified SDK Ingestion</span>
              <span className="font-mono text-[10px] text-[#2F5B3C] font-semibold">68% adoption</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="font-sans font-bold text-xl text-[#1F1916]">{metrics.sdk_ingestion.teams_active}</span>
              <span className="text-xs text-[#73645A]">teams deployed</span>
            </div>
            <div className="w-full bg-[#E7DFD5] h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-[#C47D1C] h-full rounded-full" style={{ width: `${metrics.sdk_ingestion.percentage}%` }}></div>
            </div>
          </div>

          <div className="bg-[#FAF7F2] p-3.5 rounded-lg border border-[#E7DFD5]">
            <div className="flex justify-between items-center text-xs text-[#73645A]">
              <span>Talent Radar Leads</span>
              <span className="font-mono text-[10px] text-[#C2542D] font-semibold">{metrics.talent_pipeline.flagged_rnd} R&D fit</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="font-sans font-bold text-xl text-[#1F1916]">{metrics.talent_pipeline.leads}</span>
              <span className="text-xs text-[#73645A]">verified builders</span>
            </div>
            <div className="w-full bg-[#E7DFD5] h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-[#C2542D] h-full rounded-full" style={{ width: `${metrics.talent_pipeline.percentage}%` }}></div>
            </div>
          </div>

          <div className="bg-[#FAF7F2] p-3.5 rounded-lg border border-[#E7DFD5]">
            <div className="flex justify-between items-center text-xs text-[#73645A]">
              <span>Deliverables Cleared</span>
              <span className="font-mono text-[10px] text-[#2F5B3C] font-semibold">{metrics.deliverables.completed}/{metrics.deliverables.total}</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="font-sans font-bold text-xl text-[#1F1916]">{metrics.deliverables.percentage}%</span>
              <span className="text-xs text-[#73645A]">audit verified</span>
            </div>
            <div className="w-full bg-[#E7DFD5] h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-[#2F5B3C] h-full rounded-full" style={{ width: `${metrics.deliverables.percentage}%` }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Deliverables Tracker Table */}
      <section className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="font-sans font-bold text-sm text-[#1F1916]">
              Contractual Deliverables & Activation Tracker
            </h2>
            <p className="text-[11px] text-[#73645A]">Verified agreement compliance for Tier-1 Title Partnership.</p>
          </div>
          <span className="font-mono text-[11px] text-[#73645A]">Day 2 • 14:26 EST</span>
        </div>

        <div className="bg-white rounded-xl overflow-hidden border border-[#E7DFD5] shadow-card">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-[#73645A] font-mono text-[10px] uppercase border-b border-[#E7DFD5]">
              <tr>
                <th className="py-2.5 px-3.5">Deliverable</th>
                <th className="py-2.5 px-3.5">Channel</th>
                <th className="py-2.5 px-3.5">Audience Reach</th>
                <th className="py-2.5 px-3.5">Status</th>
                <th className="py-2.5 px-3.5 text-right">Audit Token</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EAE1]">
              {deliverablesTable.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-3 px-3.5">
                    <span className="font-semibold text-[#1F1916] block">{row.node}</span>
                    <span className="text-[11px] text-[#73645A]">{row.sub}</span>
                  </td>
                  <td className="py-3 px-3.5 text-[#73645A]">{row.channel}</td>
                  <td className="py-3 px-3.5 font-semibold text-[#1F1916]">{row.reach}</td>
                  <td className="py-3 px-3.5">
                    <span
                      className={`inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded font-semibold ${
                        row.status.includes('Active')
                          ? 'bg-[#FBEFEA] text-[#C2542D]'
                          : row.status.includes('Completed') || row.status.includes('Assigned')
                          ? 'bg-[#EFF5F1] text-[#2F5B3C]'
                          : 'bg-[#FAF7F2] text-[#73645A]'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-right font-mono text-[11px] text-[#2F5B3C] font-semibold">
                    {row.audit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Sponsorship Marketplace Bento Cards */}
      <section className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="font-sans font-bold text-sm text-[#1F1916]">
              Open Sponsorship Opportunities
            </h2>
            <p className="text-[11px] text-[#73645A]">Upcoming university nodes open for corporate title & challenge sponsorship.</p>
          </div>
          <button
            onClick={() => setSelectedPackage(marketplacePackages[0])}
            className="text-xs text-[#C2542D] hover:underline font-semibold cursor-pointer"
          >
            + Submit Custom Brief
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {marketplacePackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-xl p-4 border border-[#E7DFD5] shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FAF7F2] text-[#73645A] border border-[#E7DFD5]">
                    {pkg.status}
                  </span>
                  <span className="font-serif font-bold text-lg text-[#1F1916]">
                    {pkg.price}
                  </span>
                </div>
                <h3 className="font-serif font-medium text-base text-[#1F1916] mb-1">
                  {pkg.title}
                </h3>
                <p className="text-xs text-[#73645A] leading-relaxed mb-3">
                  {pkg.description}
                </p>
                <div className="bg-[#FAF7F2] p-2 rounded-lg border border-[#E7DFD5] text-[11px] font-mono flex flex-col gap-1 mb-3">
                  <div className="flex justify-between">
                    <span className="text-[#73645A]">Audience</span>
                    <span className="font-semibold text-[#1F1916]">{pkg.cohort}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#73645A]">Campus Nodes</span>
                    <span className="font-semibold text-[#1F1916]">{pkg.nodes}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedPackage(pkg)}
                className="w-full py-2 rounded-lg bg-[#FAF7F2] hover:bg-[#2F5B3C] hover:text-white text-[#1F1916] text-xs font-semibold border border-[#E7DFD5] transition-colors cursor-pointer"
              >
                Request Prospectus
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Verified Talent Discovery Pipeline */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <div>
            <h2 className="font-sans font-bold text-sm text-[#1F1916]">
              Verified Candidate Talent Radar
            </h2>
            <p className="text-[11px] text-[#73645A]">Builders ranked by real code contributions and GitHub benchmark execution.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-3 mb-4 border border-[#E7DFD5] flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[#73645A] font-medium mr-1">Filter Stacks:</span>
            {availableSkills.map((s) => {
              const active = selectedSkills.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => toggleSkill(s)}
                  className={`px-2.5 py-0.5 rounded-full text-xs font-mono transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#2F5B3C] text-white'
                      : 'bg-[#FAF7F2] text-[#73645A] border border-[#E7DFD5] hover:bg-white'
                  }`}
                >
                  {active ? `✓ ${s}` : `+ ${s}`}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search builder name, university, stack..."
              value={candidateSearch}
              onChange={(e) => setCandidateSearch(e.target.value)}
              className="bg-[#FAF7F2] rounded-lg px-2.5 py-1 text-xs text-[#1F1916] border border-[#E7DFD5] focus:outline-none w-56"
            />
            <span className="font-mono text-xs text-[#2F5B3C] font-semibold">
              {filteredCandidates.length} Matches
            </span>
          </div>
        </div>

        {/* Candidate Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredCandidates.map((cand) => (
            <div
              key={cand.id}
              className="bg-white rounded-xl p-4 border border-[#E7DFD5] shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#1F1916] flex items-center justify-center text-xs font-bold font-mono border border-[#E7DFD5] shrink-0">
                      {cand.name ? cand.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'CD'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-[#1F1916] leading-snug">{cand.name}</h4>
                      <span className="text-[11px] text-[#73645A]">{cand.school}</span>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-[#2F5B3C] bg-[#EFF5F1] px-1.5 py-0.5 rounded font-semibold">
                    {cand.badge}
                  </span>
                </div>

                <div className="bg-[#FAF7F2] p-2.5 rounded-lg border border-[#E7DFD5] mb-3 text-xs">
                  <span className="font-semibold text-[#1F1916] block">{cand.project_name}</span>
                  <p className="text-[11px] text-[#73645A] line-clamp-2 mt-0.5 leading-snug">
                    {cand.project_summary}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 mb-3 font-mono text-[10px]">
                  {cand.skills.map((s, idx) => (
                    <span key={idx} className="bg-[#F3EFEA] text-[#1F1916] px-1.5 py-0.5 rounded">
                      {s}
                    </span>
                  ))}
                  <span className="bg-[#EFF5F1] text-[#2F5B3C] font-bold px-1.5 py-0.5 rounded">
                    Score: {cand.score}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onRequestInterview && onRequestInterview(cand)}
                className="w-full py-1.5 rounded-lg bg-[#2F5B3C] hover:bg-[#254B31] text-white font-medium text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[14px]">mail</span>
                <span>Request Fast-Track Interview</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Proposal Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-dropdown border border-[#E7DFD5] flex flex-col gap-3">
            <div className="flex justify-between items-center pb-2 border-b border-[#F0EAE1]">
              <h3 className="font-serif font-bold text-base text-[#1F1916]">
                Sponsorship Proposal: {selectedPackage.title}
              </h3>
              <button onClick={() => setSelectedPackage(null)} className="material-symbols-outlined text-sm cursor-pointer">
                close
              </button>
            </div>
            <p className="text-xs text-[#73645A]">
              Lock tier rights for {selectedPackage.title} at {selectedPackage.price}.
            </p>
            <input
              type="text"
              placeholder="Company Name"
              defaultValue="NVIDIA Inception"
              id="prop-comp"
              className="w-full bg-[#FAF7F2] p-2 rounded-lg border border-[#E7DFD5] text-xs text-[#1F1916]"
            />
            <input
              type="email"
              placeholder="Contact Email"
              defaultValue="partnerships@nvidia.com"
              id="prop-em"
              className="w-full bg-[#FAF7F2] p-2 rounded-lg border border-[#E7DFD5] text-xs text-[#1F1916]"
            />
            <div className="flex justify-end gap-2 pt-2 border-t border-[#F0EAE1]">
              <button
                onClick={() => setSelectedPackage(null)}
                className="px-3 py-1.5 rounded-lg bg-[#FAF7F2] text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const c = document.getElementById('prop-comp')?.value || 'NVIDIA';
                  const em = document.getElementById('prop-em')?.value || 'partners@nvidia.com';
                  onSubmitProposal && onSubmitProposal(selectedPackage.id, c, em);
                  setSelectedPackage(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#2F5B3C] text-white text-xs font-semibold cursor-pointer"
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
