"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getApplications } from "@/lib/api/applications";
import { Application, AdminStats } from "@/lib/api/types";
import ApplicationDetail from "./ApplicationDetail";

export default function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats,        setStats]        = useState<AdminStats | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [domainFilter, setDomainFilter] = useState("ALL");
  const [selectedApp,  setSelectedApp]  = useState<Application | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Temporary frontend authentication check
    // Replace with server-side authentication when backend is integrated.
    const auth = sessionStorage.getItem("ts_admin_auth");
    if (auth !== "true") {
      window.location.replace("/admin/login");
    } else {
      const t = setTimeout(() => setIsAuthenticated(true), 0);
      return () => clearTimeout(t);
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getApplications();
      setApplications(res.applications);
      setStats(res.stats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => fetchData(), 0);
    return () => clearTimeout(t);
  }, []);

  const handleUpdate = (id: string, newStatus: Application["status"]) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    if (selectedApp?.id === id) setSelectedApp(prev => prev ? { ...prev, status: newStatus } : prev);
    // Recalculate stats client-side (optimistic)
    setStats(prev => {
      if (!prev) return prev;
      const app = applications.find(a => a.id === id);
      if (!app) return prev;
      const oldStatus = app.status;
      return {
        ...prev,
        [oldStatus.toLowerCase()]:  Math.max(0, prev[oldStatus.toLowerCase() as keyof AdminStats] as number - 1),
        [newStatus.toLowerCase()]: (prev[newStatus.toLowerCase() as keyof AdminStats] as number) + 1,
      };
    });
  };

  const filteredApps = applications.filter(app => {
    if (statusFilter !== "ALL" && app.status !== statusFilter) return false;
    if (domainFilter !== "ALL" && app.domain !== domainFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!app.fullName.toLowerCase().includes(q) && !app.email.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const handleLogout = () => {
    sessionStorage.removeItem("ts_admin_auth");
    window.location.replace("/admin/login");
  };

  const uniqueDomains = Array.from(new Set(applications.map(a => a.domain)));

  if (!isAuthenticated) return null;

  return (
    <div className="relative">
      {/* Back nav */}
      <div className="mb-12 flex items-center justify-between">
        <Link href="/" className="font-mono text-[10px] uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors">
          ← Tech Society
        </Link>
        <button 
          onClick={handleLogout}
          className="font-mono text-[10px] uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors"
        >
          [ EXIT CONTROL ROOM ]
        </button>
      </div>

      {/* Header */}
      <header className="mb-16">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-red-400/70 mb-4">
          ⚠ Frontend Placeholder — No backend auth
        </p>
        <h1 className="font-display font-bold uppercase tracking-tighter text-5xl md:text-7xl text-white mb-4">
          Membership Control
        </h1>
        <p className="font-mono text-[10px] text-white/30 uppercase max-w-xl leading-relaxed">
          Mock frontend only. Real authentication and backend storage must be implemented separately by the backend developer.
        </p>
      </header>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-14">
          <StatBox label="Total"    value={stats.total}    />
          <StatBox label="Pending"  value={stats.pending}  accent />
          <StatBox label="Approved" value={stats.approved} />
          <StatBox label="Rejected" value={stats.rejected} dim />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <input
            type="search"
            placeholder="Search name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-transparent border border-white/10 px-4 py-3 font-mono text-xs text-white placeholder:text-white/25 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-[#0c0c0e] border border-white/10 px-4 py-3 font-mono text-xs text-white/70 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <select
          value={domainFilter}
          onChange={e => setDomainFilter(e.target.value)}
          className="bg-[#0c0c0e] border border-white/10 px-4 py-3 font-mono text-xs text-white/70 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
        >
          <option value="ALL">All Domains</option>
          {uniqueDomains.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Count */}
      {!loading && (
        <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-4">
          {filteredApps.length} record{filteredApps.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Table */}
      <div className="border border-white/10">
        {/* Header row */}
        <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_80px_90px] gap-4 px-6 py-3 border-b border-white/10 bg-white/[0.01]">
          {["Applicant", "Domain / Dept", "Year", "Submitted", "Status"].map(h => (
            <span key={h} className="font-mono text-[9px] uppercase tracking-widest text-white/25">{h}</span>
          ))}
        </div>

        {loading && (
          <div className="px-6 py-12 text-center font-mono text-xs text-white/30 uppercase tracking-widest">
            Loading…
          </div>
        )}

        {!loading && applications.length === 0 && (
          <div className="px-6 py-24 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 border border-white/10 flex items-center justify-center mb-6 text-white/20">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
            </div>
            <h3 className="font-display font-bold text-lg uppercase tracking-wider text-white mb-2">NO APPLICATIONS YET</h3>
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest max-w-sm leading-relaxed">
              Membership requests will appear here when students submit the Tech Society application.
            </p>
          </div>
        )}

        {!loading && applications.length > 0 && filteredApps.length === 0 && (
          <div className="px-6 py-12 text-center font-mono text-xs text-white/30 uppercase tracking-widest">
            No records match the current filters.
          </div>
        )}

        {!loading && filteredApps.map((app, i) => (
          <button
            key={app.id}
            onClick={() => setSelectedApp(app)}
            className={`w-full text-left grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_80px_90px] gap-2 md:gap-4 px-6 py-5 transition-colors hover:bg-white/[0.025] focus:outline-none focus:bg-white/[0.025] ${i > 0 ? "border-t border-white/[0.06]" : ""}`}
            aria-label={`Open application from ${app.fullName}`}
          >
            <div>
              <div className="font-display font-bold text-base uppercase tracking-wide text-white">{app.fullName}</div>
              <div className="font-mono text-[10px] text-white/35 mt-0.5">{app.email}</div>
            </div>
            <div className="font-mono text-xs text-white/50 self-center">
              {app.domain}
              <span className="text-white/20 mx-1">/</span>
              <span className="text-white/30">{app.department}</span>
            </div>
            <div className="font-mono text-xs text-white/40 self-center">{app.year}</div>
            <div className="font-mono text-[10px] text-white/30 self-center">{new Date(app.createdAt).toLocaleDateString()}</div>
            <div className="self-center">
              <StatusBadge status={app.status} />
            </div>
          </button>
        ))}
      </div>

      {selectedApp && (
        <ApplicationDetail
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

function StatBox({ label, value, accent, dim }: { label: string; value: number; accent?: boolean; dim?: boolean }) {
  return (
    <div className="border border-white/10 p-5 flex flex-col gap-2 bg-white/[0.01]">
      <span className="font-mono text-[9px] uppercase tracking-widest text-white/30">{label}</span>
      <span className={`font-display font-bold text-3xl tabular-nums ${accent ? "text-[var(--color-accent)]" : dim ? "text-red-400/60" : "text-white"}`}>
        {value}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: Application["status"] }) {
  const map = {
    PENDING:  "border-white/20 text-white/50",
    APPROVED: "border-[var(--color-accent)]/40 text-[var(--color-accent)]",
    REJECTED: "border-red-500/40 text-red-400/80",
  };
  return (
    <span className={`inline-block border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${map[status]}`}>
      {status}
    </span>
  );
}
