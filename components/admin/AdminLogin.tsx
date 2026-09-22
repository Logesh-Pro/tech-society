"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminId === "admin" && password === "admin") {
      sessionStorage.setItem("ts_admin_auth", "true");
      router.push("/admin");
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Link href="/" className="inline-block font-mono text-[10px] uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors mb-12">
        ← Tech Society
      </Link>

      <header className="mb-12">
        <h1 className="font-display font-bold uppercase tracking-tighter text-4xl text-white mb-2">
          Control Room
        </h1>
        <p className="font-mono text-xs tracking-widest uppercase text-[var(--color-accent)]">
          Admin Access
        </p>
      </header>

      <form onSubmit={handleLogin} className="space-y-8">
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-white/50 mb-3" htmlFor="adminId">
            Admin ID
          </label>
          <input
            id="adminId"
            type="text"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            className="w-full bg-transparent border-b border-white/20 py-3 text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
            placeholder="Enter ID"
            required
          />
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-white/50 mb-3" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-b border-white/20 py-3 text-white font-mono focus:outline-none focus:border-[var(--color-accent)] transition-colors"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="pt-4 flex items-center justify-between">
          <span className={`font-mono text-[10px] uppercase tracking-widest text-red-500 transition-opacity duration-300 ${error ? "opacity-100" : "opacity-0"}`}>
            ACCESS DENIED
          </span>
          <button
            type="submit"
            data-cursor-style="accent"
            className="px-8 py-3 bg-[var(--color-accent)] text-black font-mono text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all"
          >
            Enter Control Room
          </button>
        </div>
      </form>
    </div>
  );
}
