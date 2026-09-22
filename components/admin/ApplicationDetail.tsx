"use client";

import { Application } from "@/lib/api/types";
import { updateApplicationStatus } from "@/lib/api/applications";
import { useState } from "react";

export default function ApplicationDetail({ 
  application, 
  onClose,
  onUpdate
}: { 
  application: Application, 
  onClose: () => void,
  onUpdate: (id: string, newStatus: Application["status"]) => void 
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: Application["status"]) => {
    setIsUpdating(true);
    try {
      await updateApplicationStatus(application.id, newStatus);
      onUpdate(application.id, newStatus);
    } catch (e) {
      console.error(e);
      alert("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" 
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative w-full max-w-2xl bg-[#09090b] border-l border-white/10 h-full overflow-y-auto transform transition-transform duration-500 flex flex-col">
        <header className="sticky top-0 bg-[#09090b]/90 backdrop-blur-md border-b border-white/10 p-8 flex justify-between items-start z-10">
          <div>
            <div className="font-mono text-xs text-white/40 tracking-widest uppercase mb-2">Application // {application.id}</div>
            <h2 className="text-3xl font-display font-bold uppercase">{application.fullName}</h2>
            <div className="flex gap-4 mt-4">
              <span className={`px-2 py-1 text-xs font-mono uppercase border ${
                application.status === 'APPROVED' ? 'border-[var(--color-accent)] text-[var(--color-accent)]' :
                application.status === 'REJECTED' ? 'border-red-500 text-red-500' :
                'border-white/20 text-white/60'
              }`}>
                {application.status}
              </span>
              <span className="px-2 py-1 text-xs font-mono uppercase border border-white/10 text-white/60">
                {application.domain}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="p-8 space-y-12 flex-1">
          
          <section>
            <h3 className="font-mono text-sm text-[var(--color-accent)] uppercase mb-6 border-b border-white/10 pb-2">Identity & Academic</h3>
            <div className="grid grid-cols-2 gap-y-6 text-sm font-sans">
              <div>
                <div className="text-white/40 font-mono text-xs mb-1">Email</div>
                <div className="text-white">{application.email}</div>
              </div>
              <div>
                <div className="text-white/40 font-mono text-xs mb-1">Phone</div>
                <div className="text-white">{application.phone || "none"}</div>
              </div>
              <div>
                <div className="text-white/40 font-mono text-xs mb-1">Department</div>
                <div className="text-white">{application.department}</div>
              </div>
              <div>
                <div className="text-white/40 font-mono text-xs mb-1">Year</div>
                <div className="text-white">{application.year}</div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-mono text-sm text-[var(--color-accent)] uppercase mb-6 border-b border-white/10 pb-2">Experience & Skills</h3>
            <div className="space-y-6 text-sm font-sans">
              <div>
                <div className="text-white/40 font-mono text-xs mb-1">Level</div>
                <div className="text-white">{application.experienceLevel}</div>
              </div>
              <div>
                <div className="text-white/40 font-mono text-xs mb-1">Skills</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[...(application.skills || []), ...(application.customSkills || [])].map((s, idx) => (
                    <span key={idx} className="px-2 py-1 border border-white/10 text-xs font-mono">{s}</span>
                  ))}
                  {((application.skills || []).length === 0 && (application.customSkills || []).length === 0) && <span className="text-white/30">None provided</span>}
                </div>
              </div>
              <div>
                <div className="text-white/40 font-mono text-xs mb-1">Previous Projects</div>
                <div className="text-white whitespace-pre-wrap">{application.previousProjects || "none"}</div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-mono text-sm text-[var(--color-accent)] uppercase mb-6 border-b border-white/10 pb-2">Motivation</h3>
            <div className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap font-sans bg-white/5 p-4 border border-white/10 break-words">
              {application.motivation}
            </div>
          </section>

          <section>
            <h3 className="font-mono text-sm text-[var(--color-accent)] uppercase mb-6 border-b border-white/10 pb-2">Links & Availability</h3>
            <div className="grid grid-cols-2 gap-y-6 text-sm font-sans">
              <div>
                <div className="text-white/40 font-mono text-xs mb-1">GitHub</div>
                <div className="text-white">{application.githubUrl ? <a href={application.githubUrl} target="_blank" rel="noreferrer" className="underline hover:text-[var(--color-accent)]">Link</a> : "none"}</div>
              </div>
              <div>
                <div className="text-white/40 font-mono text-xs mb-1">LinkedIn</div>
                <div className="text-white">{application.linkedinUrl ? <a href={application.linkedinUrl} target="_blank" rel="noreferrer" className="underline hover:text-[var(--color-accent)]">Link</a> : "none"}</div>
              </div>
              <div>
                <div className="text-white/40 font-mono text-xs mb-1">Portfolio</div>
                <div className="text-white">{application.portfolioUrl ? <a href={application.portfolioUrl} target="_blank" rel="noreferrer" className="underline hover:text-[var(--color-accent)]">Link</a> : "none"}</div>
              </div>
              <div>
                <div className="text-white/40 font-mono text-xs mb-1">Resume (Drive)</div>
                <div className="text-white">{application.resumeDriveUrl ? <a href={application.resumeDriveUrl} target="_blank" rel="noreferrer" className="underline hover:text-[var(--color-accent)] font-bold">VIEW RESUME &rarr;</a> : "none"}</div>
              </div>
              <div>
                <div className="text-white/40 font-mono text-xs mb-1">Weekly Hours</div>
                <div className="text-white">{application.weeklyHours || "none"}</div>
              </div>
            </div>
          </section>
        </div>

        {application.status === 'APPROVED' && (
          <div className="px-8 py-4 bg-[var(--color-accent)]/10 border-t border-[var(--color-accent)]/20">
            <p className="font-mono text-xs text-[var(--color-accent)] font-bold tracking-widest uppercase mb-1">MEMBER APPROVED</p>
            <p className="font-mono text-[10px] text-white/70 uppercase">EMAIL NOTIFICATION &mdash; READY FOR BACKEND DELIVERY</p>
          </div>
        )}

        {application.status === 'REJECTED' && (
          <div className="px-8 py-4 bg-red-500/10 border-t border-red-500/20">
            <p className="font-mono text-xs text-red-500 font-bold tracking-widest uppercase mb-1">MEMBER REJECTED</p>
            <p className="font-mono text-[10px] text-white/70 uppercase">EMAIL NOTIFICATION &mdash; READY FOR BACKEND DELIVERY</p>
          </div>
        )}

        <footer className="sticky bottom-0 bg-[#09090b]/90 backdrop-blur-md border-t border-white/10 p-8 flex gap-4">
          <button 
            onClick={() => handleStatusChange("APPROVED")}
            disabled={isUpdating || application.status === "APPROVED"}
            className="flex-1 py-3 bg-[var(--color-accent)] text-black font-bold uppercase tracking-widest text-sm hover:brightness-110 disabled:opacity-30 transition-all"
          >
            Approve
          </button>
          <button 
            onClick={() => handleStatusChange("REJECTED")}
            disabled={isUpdating || application.status === "REJECTED"}
            className="flex-1 py-3 border border-red-500 text-red-500 font-bold uppercase tracking-widest text-sm hover:bg-red-500 hover:text-white disabled:opacity-30 transition-colors"
          >
            Reject
          </button>
        </footer>
      </div>
    </div>
  );
}
