"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { submitApplication } from "@/lib/api/applications";
import type { ApplicationSubmission } from "@/lib/api/types";

/* == Static data == */
const DOMAINS = [
  { id: "ml",   label: "Machine Learning" },
  { id: "ai",   label: "Intelligent Systems" },
  { id: "web",  label: "Web Development" },
  { id: "game", label: "Game & App Development" },
  { id: "sec",  label: "Cyber Security" },
];

const SKILLS = [
  "Python", "TypeScript", "JavaScript", "React", "Next.js", "Node.js",
  "C++", "C#", "Java", "Go", "Rust",
  "TensorFlow", "PyTorch", "SQL", "NoSQL",
  "AWS", "Docker", "Linux", "Figma / UI-UX",
];

const DEPARTMENTS = [
  "Computer Science Engineering", 
  "Computer Science Engineering (IoT)", 
  "Computer Science Engineering (Cyber)",
  "Artificial Intelligence and Data Science", 
  "Artificial Intelligence and Machine Learning", 
  "Information Technology"
];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const EXP_LEVELS    = ["Beginner", "Intermediate", "Advanced"] as const;
const ACTIVITIES    = [
  "Project Development", "Research", "Hackathons",
  "Workshops", "Mentoring", "Event Organization",
];
const WEEKLY_HOURS  = ["< 5 hours", "5-10 hours", "10-15 hours", "15+ hours"];


const EMPTY_FORM: ApplicationSubmission = {
  fullName: "", email: "", phone: "",
  department: "", year: "",
  domain: "",
  skills: [], customSkills: [], experienceLevel: "", previousProjects: "",
  motivation: "",
  githubUrl: "", linkedinUrl: "", portfolioUrl: "", resumeDriveUrl: "",
  weeklyHours: "", preferredActivities: [], additionalMessage: "",
};

type Errors = Partial<Record<keyof ApplicationSubmission, string>>;

/* ==============================================================
   Main component
=============================================================== */
import { useRouter } from "next/navigation";

export default function ApplicationForm() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const formStartRef  = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<ApplicationSubmission>(EMPTY_FORM);
  const [errors,   setErrors]   = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess,    setIsSuccess]    = useState(false);
  const [showReview,   setShowReview]   = useState(false);
  const [applicationId, setApplicationId] = useState("");
  
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [driveCheckStatus, setDriveCheckStatus] = useState<"idle" | "checking" | "verified" | "unverified" | "invalid">("idle");

  // Mount guard - keeps SSR clean
  useEffect(() => {
    const t = setTimeout(() => setIsClient(true), 0);
    return () => clearTimeout(t);
  }, []);

  /* == Expose target ref for DISCOVER button == */
  useEffect(() => {
    if (!isClient || !formStartRef.current) return;
    formStartRef.current.id = "application-start";
  }, [isClient]);

  /* == Helpers == */
  const set = useCallback((field: keyof ApplicationSubmission, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }, []);

  const toggle = useCallback((field: "skills" | "preferredActivities", item: string) => {
    setFormData(prev => {
      const arr = prev[field] as string[];
      return {
        ...prev,
        [field]: arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item],
      };
    });
  }, []);

  const addCustomSkill = () => {
    const val = customSkillInput.trim();
    if (val && !(formData.customSkills || []).includes(val)) {
      setFormData(prev => ({ ...prev, customSkills: [...(prev.customSkills || []), val] }));
      setCustomSkillInput("");
    }
  };

  const removeCustomSkill = (sk: string) => {
    setFormData(prev => ({ ...prev, customSkills: (prev.customSkills || []).filter(s => s !== sk) }));
  };

  const checkDriveLink = () => {
    const url = formData.resumeDriveUrl || "";
    if (!url) {
      setDriveCheckStatus("idle");
      return;
    }
    if (!url.match(/^https?:\/\/(drive|docs)\.google\.com\//)) {
      setDriveCheckStatus("invalid");
      return;
    }
    setDriveCheckStatus("checking");
    setTimeout(() => {
      // Simulate frontend check
      setDriveCheckStatus("unverified");
    }, 1000);
  };

  /* == Progress == */
  const progress = useMemo(() => {
    let done = 0;
    if (formData.fullName.trim()) done++;
    if (formData.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) done++;
    if (formData.department) done++;
    if (formData.year) done++;
    if (formData.domain) done++;
    if (formData.skills.length > 0 || (formData.customSkills && formData.customSkills.length > 0)) done++;
    if (formData.experienceLevel) done++;
    if (formData.motivation.trim() && formData.motivation.length >= 50) done++;

    return Math.round((done / 8) * 100);
  }, [formData]);

  /* == Validation == */
  const validate = (): boolean => {
    const e: Errors = {};
    if (!formData.fullName.trim()) e.fullName = "Required";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = "Valid email required";
    if (!formData.department) e.department = "Required";
    if (!formData.year)       e.year       = "Required";
    if (!formData.domain)     e.domain     = "Select a domain";
    if (formData.skills.length === 0 && (!formData.customSkills || formData.customSkills.length === 0)) {
      e.skills = "At least one skill required";
    }
    if (!formData.experienceLevel) e.experienceLevel = "Required";
    if (!formData.motivation.trim() || formData.motivation.length < 50)
      e.motivation = "Minimum 50 characters required";
    if (formData.githubUrl   && !/^https?:\/\/.+/.test(formData.githubUrl))
      e.githubUrl = "Must be a valid URL (https://...)";
    if (formData.linkedinUrl && !/^https?:\/\/.+/.test(formData.linkedinUrl))
      e.linkedinUrl = "Must be a valid URL (https://...)";
    if (formData.portfolioUrl && !/^https?:\/\/.+/.test(formData.portfolioUrl))
      e.portfolioUrl = "Must be a valid URL (https://...)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleReviewClick = () => {
    if (!validate()) {
      // Focus the first field with an error
      const firstError = document.querySelector("[data-haserror='true']");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        (firstError.querySelector("input, textarea, select") as HTMLElement)?.focus();
      }
      return;
    }
    setShowReview(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const res = await submitApplication(formData);
      if (res.success) {
        setApplicationId(res.applicationId);
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* == Entrance animation == */
  useGSAP(() => {
    if (!isClient) return;
    const targets = containerRef.current?.querySelectorAll(".fs");
    if (!targets?.length) return;
    gsap.fromTo(targets,
      { opacity: 0, y: 36 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" }
    );
  }, { scope: containerRef, dependencies: [isClient, showReview, isSuccess] });

  if (!isClient) return null;

  /* == SUCCESS == */
  if (isSuccess) return (
    <div className="fs flex flex-col items-start min-h-[60vh] justify-center" aria-live="polite">
      <div className="w-12 h-12 border border-[var(--color-accent)] flex items-center justify-center mb-8 bg-[var(--color-accent)]/10">
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-[var(--color-accent)]" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      
      <p className="font-mono text-[10px] text-[var(--color-accent)] tracking-[0.3em] uppercase mb-4">
        Status // Pending Review
      </p>
      
      <h1 className="font-display font-bold uppercase tracking-tighter text-4xl md:text-6xl text-white leading-[0.9] mb-8">
        Application<br />Received.
      </h1>
      
      <div className="border-l-2 border-white/20 pl-6 mb-10 space-y-4">
        <div>
          <p className="font-mono text-[10px] uppercase text-white/40 tracking-widest mb-1">Request ID</p>
          <p className="font-mono text-sm text-white tracking-widest">{applicationId}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase text-white/40 tracking-widest mb-1">Queue Status</p>
          <p className="font-mono text-sm text-[var(--color-accent)] tracking-widest uppercase animate-pulse">Pending Review</p>
        </div>
      </div>
      
      <p className="text-white/50 font-sans text-sm leading-relaxed max-w-md mb-12">
        Your access request has been submitted to the Tech Society directory.
        You will be contacted via email once your application is reviewed.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <button 
          onClick={() => {
            router.push("/");
          }}
          className="px-8 py-3 bg-white text-black font-mono font-bold uppercase tracking-widest text-xs hover:bg-white/90 transition-colors"
        >
          [ BACK TO TECH SOCIETY ]
        </button>
      </div>
    </div>
  );

  /* == REVIEW == */
  if (showReview) return (
    <div ref={containerRef} className="max-w-2xl">
      {/* Header */}
      <div className="fs mb-12">
        <p className="font-mono text-xs text-[var(--color-accent)] tracking-[0.3em] uppercase mb-3">09 // Review</p>
        <h2 className="font-display font-bold uppercase tracking-tighter text-4xl md:text-5xl text-white">
          Final Check
        </h2>
      </div>

      {/* Review data */}
      <div className="fs space-y-8 mb-12">
        <ReviewGroup title="Identity">
          <ReviewRow label="Full Name"   value={formData.fullName} />
          <ReviewRow label="Email"       value={formData.email} />
          <ReviewRow label="Phone"       value={formData.phone} />
        </ReviewGroup>
        <ReviewGroup title="Academic">
          <ReviewRow label="Department"  value={formData.department} />
          <ReviewRow label="Year"        value={formData.year} />
        </ReviewGroup>
        <ReviewGroup title="Domain">
          <ReviewRow label="Primary"     value={formData.domain} accent />
        </ReviewGroup>
        <ReviewGroup title="Experience">
          <ReviewRow label="Level"       value={formData.experienceLevel} />
          <ReviewRow label="Skills"      value={formData.skills.join(", ") || "None"} />
          <ReviewRow label="Other Skills" value={(formData.customSkills || []).join(", ") || "None"} />
        </ReviewGroup>
        <ReviewGroup title="Motivation">
          <div className="col-span-2 text-white/80 font-sans text-sm leading-relaxed whitespace-pre-wrap border-l-2 border-white/10 pl-4">
            {formData.motivation}
          </div>
        </ReviewGroup>
        <ReviewGroup title="Links">
          <ReviewRow label="GitHub"    value={formData.githubUrl    || "-"} />
          <ReviewRow label="LinkedIn"  value={formData.linkedinUrl  || "-"} />
          <ReviewRow label="Portfolio" value={formData.portfolioUrl || "-"} />
          {formData.resumeDriveUrl && (
            <ReviewRow 
              label="Resume"    
              value={
                <a href={formData.resumeDriveUrl} target="_blank" rel="noreferrer" className="text-[var(--color-accent)] hover:underline truncate inline-block max-w-[200px] sm:max-w-xs align-bottom">
                  Google Drive Document ↗
                </a>
              } 
            />
          )}
        </ReviewGroup>
        <ReviewGroup title="Availability">
          <ReviewRow label="Weekly hrs"  value={formData.weeklyHours || "-"} />
          <ReviewRow label="Activities"  value={formData.preferredActivities.join(", ") || "None"} />
        </ReviewGroup>
      </div>

      {/* Actions */}
      <div className="fs flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-8 border-t border-white/10">
        <button
          onClick={() => setShowReview(false)}
          className="font-mono text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors"
        >
          &larr; Edit Application
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className={`ml-auto px-10 py-4 bg-[var(--color-accent)] text-black font-mono font-bold uppercase tracking-widest text-xs transition-all ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:brightness-110"}`}
        >
          {isSubmitting ? "Requesting Access..." : "Request Access"}
        </button>
      </div>
    </div>
  );

  /* == MAIN FORM == */
  return (
    <div ref={containerRef} className="max-w-2xl">

      {/* Sticky progress bar */}
      <div className="fixed top-[96px] left-0 right-0 z-40 h-[2px] bg-white/[0.05]" aria-hidden>
        <div
          className="h-full bg-[var(--color-accent)] transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute right-4 top-3 font-mono text-[10px] text-white/30 uppercase tracking-widest"
          aria-label={`Application ${progress}% complete`}
        >
          {progress}% complete
        </div>
      </div>

      {/* Page header */}
      <div className="fs mb-20" ref={formStartRef}>
        <p className="font-mono text-[10px] text-white/40 tracking-[0.3em] uppercase mb-4">
          Tech Society // Access Request
        </p>
        <h1 className="font-display font-bold uppercase tracking-tighter text-5xl md:text-7xl text-white leading-[0.9] mb-6">
          Membership<br />Application
        </h1>
        <p className="font-sans text-sm text-white/50 max-w-sm leading-relaxed">
          Fill out the form below. Fields marked with <span className="text-[var(--color-accent)]">*</span> are required.
        </p>
      </div>

      <div className="space-y-20">
        {/* == 01 IDENTITY == */}
        <Section num="01" title="Identity" zIndex={50}>
          <div className="space-y-10">
            <FField label="Full Name" id="fullName" req value={formData.fullName} onChange={v => set("fullName", v)} error={errors.fullName} />
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-10">
              <FField label="Email Address" id="email" type="email" req value={formData.email} onChange={v => set("email", v)} error={errors.email} />
              <FField label="Phone Number" id="phone" value={formData.phone} onChange={v => set("phone", v)} error={errors.phone} />
            </div>
          </div>
        </Section>

        {/* == 02 ACADEMIC == */}
        <Section num="02" title="Academic" zIndex={40}>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-10">
            <FSelect label="Department" req options={DEPARTMENTS} value={formData.department} onChange={v => set("department", v)} error={errors.department} />
            <FSelect label="Year of Study" req options={YEARS} value={formData.year} onChange={v => set("year", v)} error={errors.year} />
          </div>
        </Section>

        {/* == 03 DOMAIN == */}
        <Section num="03" title="Primary Domain" hasError={!!errors.domain} errorMsg={errors.domain} zIndex={30}>
          <p className="text-white/40 font-mono text-xs uppercase mb-6">Select one domain - required <span className="text-[var(--color-accent)]">*</span></p>
          <div className="space-y-2" role="radiogroup" aria-label="Primary Domain">
            {DOMAINS.map(d => {
              const selected = formData.domain === d.label;
              return (
                <button
                  key={d.id}
                  role="radio"
                  aria-checked={selected}
                  onClick={() => { set("domain", d.label); setErrors(p => ({ ...p, domain: undefined })); }}
                  className={`w-full text-left px-5 py-4 border transition-all duration-200 group ${
                    selected
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]/[0.06]"
                      : "border-white/10 hover:border-white/25 hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-sans text-sm uppercase tracking-wide transition-colors ${selected ? "text-white" : "text-white/50 group-hover:text-white/80"}`}>
                      {d.label}
                    </span>
                    <span className={`w-2 h-2 rounded-full transition-all duration-200 ${selected ? "bg-[var(--color-accent)] scale-100" : "bg-white/15 scale-75"}`} aria-hidden />
                  </div>
                </button>
              );
            })}
          </div>
        </Section>

        {/* == 04 SKILLS == */}
        <Section num="04" title="Skills" hasError={!!errors.skills} errorMsg={errors.skills as string} zIndex={25}>
          <p className="text-white/40 font-mono text-xs uppercase mb-6">Select all that apply - required <span className="text-[var(--color-accent)]">*</span></p>
          <div className="flex flex-wrap gap-3 mb-8">
            {SKILLS.map((sk: string) => {
              const selected = formData.skills.includes(sk);
              return (
                <button
                  key={sk}
                  onClick={() => toggle("skills", sk)}
                  className={`px-4 py-2 font-mono text-xs uppercase tracking-wider border transition-all duration-200 ${
                    selected 
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]/[0.1] text-white" 
                      : "border-white/10 text-white/50 hover:border-white/30 hover:text-white/80"
                  }`}
                >
                  {sk}
                </button>
              );
            })}
          </div>
          
          <div className="space-y-4 max-w-sm">
            <p className="text-white/40 font-mono text-xs uppercase">Other Skill</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={customSkillInput}
                onChange={e => setCustomSkillInput(e.target.value)}
                onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); addCustomSkill(); } }}
                placeholder="Enter another skill..."
                className="flex-1 bg-transparent border-b border-white/20 px-0 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors placeholder:text-white/20"
              />
              <button
                type="button"
                onClick={addCustomSkill}
                disabled={!customSkillInput.trim()}
                className="text-[var(--color-accent)] font-mono text-xs tracking-widest uppercase hover:text-white transition-colors disabled:opacity-30"
              >
                [ Add ]
              </button>
            </div>
            
            {(formData.customSkills && formData.customSkills.length > 0) && (
              <div className="flex flex-wrap gap-2 mt-4">
                {formData.customSkills.map(sk => (
                  <div key={sk} className="group flex items-center gap-2 px-3 py-1.5 border border-white/10 bg-white/5 rounded-sm hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-colors">
                    <span className="font-mono text-[10px] uppercase text-white/70 group-hover:text-white">{sk}</span>
                    <button type="button" onClick={() => removeCustomSkill(sk)} className="text-white/40 hover:text-[var(--color-accent)] font-bold">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Section>

        {/* == 05 EXPERIENCE == */}
        <Section num="05" title="Experience" hasError={!!errors.experienceLevel} errorMsg={errors.experienceLevel} zIndex={20}>
          <div className="space-y-10">
            <div>
              <p className="text-white/40 font-mono text-xs uppercase mb-6">Experience Level - required <span className="text-[var(--color-accent)]">*</span></p>
              <div className="grid sm:grid-cols-2 gap-4" role="radiogroup" aria-label="Experience Level">
                {EXP_LEVELS.map(lv => {
                  const selected = formData.experienceLevel === lv;
                  return (
                    <button
                      key={lv}
                      role="radio"
                      aria-checked={selected}
                      onClick={() => { set("experienceLevel", lv); }}
                      className={`text-left px-5 py-4 border transition-all duration-200 ${
                        selected 
                          ? "border-[var(--color-accent)] bg-[var(--color-accent)]/[0.06] text-white" 
                          : "border-white/10 text-white/50 hover:border-white/30 hover:text-white/80"
                      }`}
                    >
                      <span className="font-sans text-sm uppercase tracking-wide">{lv}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Section>

        {/* == 06 MOTIVATION == */}
        <Section num="06" title="Motivation" hasError={!!errors.motivation} errorMsg={errors.motivation} zIndex={15}>
          <FTextarea 
            label="Why do you want to join Tech Society?" 
            id="motivation" 
            req 
            value={formData.motivation} 
            onChange={v => set("motivation", v)} 
            error={errors.motivation}
            showCount
            maxLength={1000}
          />
        </Section>

        {/* == 07 LINKS == */}
        <Section num="07" title="Links" zIndex={10}>
          <div className="space-y-10">
            <FField label="GitHub Profile" id="githubUrl" type="url" value={formData.githubUrl || ""} onChange={v => set("githubUrl", v)} error={errors.githubUrl} />
            <FField label="LinkedIn Profile" id="linkedinUrl" type="url" value={formData.linkedinUrl || ""} onChange={v => set("linkedinUrl", v)} error={errors.linkedinUrl} />
            <FField label="Portfolio / Personal Site" id="portfolioUrl" type="url" value={formData.portfolioUrl || ""} onChange={v => set("portfolioUrl", v)} error={errors.portfolioUrl} />
            
            <div className="pt-6 border-t border-white/10">
              <div className="flex flex-col sm:flex-row items-end gap-4">
                <div className="flex-1 w-full">
                  <FField 
                    label="RESUME — GOOGLE DRIVE" 
                    id="resumeDriveUrl" 
                    type="url" 
                    value={formData.resumeDriveUrl || ""} 
                    onChange={v => { set("resumeDriveUrl", v); setDriveCheckStatus("idle"); }} 
                    error={errors.resumeDriveUrl}
                    hint="Optional. Set your file to Anyone with the link -> Viewer before submitting."
                  />
                </div>
                <div className="pb-8 w-full sm:w-auto">
                  <button 
                    type="button" 
                    onClick={checkDriveLink}
                    disabled={!formData.resumeDriveUrl || driveCheckStatus === "checking"}
                    className="w-full sm:w-auto px-6 py-2 border border-white/20 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] font-mono text-xs uppercase tracking-widest text-white/70 transition-colors disabled:opacity-50"
                  >
                    Check Link
                  </button>
                </div>
              </div>
              
              {driveCheckStatus === "invalid" && <p className="text-red-400 font-mono text-[10px] uppercase mt-2">Invalid Google Drive link format.</p>}
              {driveCheckStatus === "checking" && <p className="text-[var(--color-accent)] font-mono text-[10px] uppercase mt-2 animate-pulse">Checking access...</p>}
              {driveCheckStatus === "unverified" && <p className="text-yellow-500 font-mono text-[10px] uppercase mt-2">Valid Drive link — sharing permission could not be verified by browser.</p>}
            </div>
          </div>
        </Section>

        {/* == 08 AVAILABILITY == */}
        <Section num="08" title="Availability" zIndex={5}>
          <div className="space-y-10">
            <FSelect
              label="Expected Weekly Contribution"
              options={WEEKLY_HOURS}
              value={formData.weeklyHours}
              onChange={v => set("weeklyHours", v)}
            />
            <div>
              <p className="text-white/40 font-mono text-xs uppercase mb-4">Preferred Activities</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Preferred activities">
                {ACTIVITIES.map(act => {
                  const active = formData.preferredActivities.includes(act);
                  return (
                    <button
                      key={act}
                      onClick={() => toggle("preferredActivities", act)}
                      aria-pressed={active}
                      className={`px-3 py-1.5 border text-[11px] font-mono uppercase tracking-wide transition-all duration-200 ${
                        active
                          ? "border-white text-black bg-white"
                          : "border-white/10 text-white/40 hover:border-white/25 hover:text-white/70"
                      }`}
                    >
                      {act}
                    </button>
                  );
                })}
              </div>
            </div>
            <FTextarea
              label="Additional Message"
              value={formData.additionalMessage}
              onChange={v => set("additionalMessage", v)}
              placeholder="Anything else you'd like us to know..."
              minHeight={80}
            />
          </div>
        </Section>

        {/* == Submit row == */}
        <div className="fs pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="font-mono text-xs text-white/30 uppercase">
            Completion&nbsp;&nbsp;
            <span className={progress === 100 ? "text-[var(--color-accent)]" : "text-white/50"}>{progress}%</span>
          </p>
          <button
            onClick={handleReviewClick}
            className="group relative px-10 py-4 bg-white text-black font-mono font-bold uppercase tracking-widest text-xs overflow-hidden"
          >
            <span className="relative z-10 group-hover:text-black transition-colors">Review Application</span>
            <span className="absolute inset-0 bg-[var(--color-accent)] scale-y-0 origin-bottom transition-transform duration-300 group-hover:scale-y-100" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==============================================================
   Local sub-components
=============================================================== */

function Section({
  num, title, children, hasError, errorMsg, zIndex = 1
}: {
  num: string; title: string; children: React.ReactNode;
  hasError?: boolean; errorMsg?: string; zIndex?: number;
}) {
  return (
    <section className="fs relative" style={{ zIndex }} data-haserror={hasError ? "true" : "false"}>
      <header className="flex items-baseline justify-between mb-8">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[10px] text-[var(--color-accent)] tracking-widest">{num}</span>
          <div className="w-8 h-[1px] bg-white/10 mb-0.5" aria-hidden />
          <h2 className="font-mono text-xs uppercase tracking-widest text-white/60">{title}</h2>
        </div>
        {hasError && errorMsg && (
          <span className="font-mono text-[10px] text-red-400 uppercase tracking-wide" role="alert">{errorMsg}</span>
        )}
      </header>
      {children}
    </section>
  );
}

function ReviewGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-l border-white/10 pl-6">
      <p className="font-mono text-[10px] text-[var(--color-accent)] uppercase tracking-widest mb-4">{title}</p>
      <div className="grid sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value, accent }: { label: string; value: React.ReactNode; accent?: boolean }) {
  return (
    <div>
      <span className="block font-mono text-[10px] text-white/30 uppercase tracking-widest mb-1">{label}</span>
      <span className={`font-sans text-sm ${accent ? "text-[var(--color-accent)]" : "text-white/80"}`}>{value || "-"}</span>
    </div>
  );
}

function FField({
  label, req, value, onChange, type = "text", error, hint, id: propId
}: {
  label: string; req?: boolean; value: string; onChange: (v: string) => void;
  type?: string; error?: string; hint?: string; id?: string;
}) {
  const id = propId || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="relative" data-haserror={!!error ? "true" : "false"}>
      <label htmlFor={id} className="block font-mono text-[10px] uppercase tracking-widest text-white/40 mb-3">
        {label}{req && <span className="text-[var(--color-accent)] ml-1">*</span>}
        {hint && <span className="ml-2 text-white/20 normal-case">{hint}</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full bg-transparent border-b pb-3 text-white font-sans text-sm focus:outline-none transition-colors placeholder:text-white/20 ${
          error ? "border-red-500/50" : "border-white/15 focus:border-[var(--color-accent)]"
        }`}
      />
      <div className="h-6 mt-2 relative">
        <span className={`absolute left-0 top-0 font-mono text-[10px] uppercase text-red-400 transition-all duration-300 ${error ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          {error}
        </span>
      </div>
    </div>
  );
}

function FTextarea({
  label, req, value, onChange, error, maxLength, showCount, placeholder, minHeight = 120, id: propId
}: {
  label: string; req?: boolean; value: string; onChange: (v: string) => void;
  error?: string; maxLength?: number; showCount?: boolean; placeholder?: string; minHeight?: number; id?: string;
}) {
  const id = propId || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="relative" data-haserror={!!error ? "true" : "false"}>
      <label htmlFor={id} className="block font-mono text-[10px] uppercase tracking-widest text-white/40 mb-3">
        {label}{req && <span className="text-[var(--color-accent)] ml-1">*</span>}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        style={{ minHeight }}
        aria-required={req}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full bg-white/[0.03] border px-4 py-3 text-white font-sans text-sm focus:outline-none transition-colors resize-y placeholder:text-white/20 leading-relaxed ${
          error ? "border-red-500/50" : "border-white/10 focus:border-[var(--color-accent)]"
        }`}
      />
      <div className="flex justify-between mt-2 h-6">
        <div>
          {error && (
            <p id={`${id}-error`} className="font-mono text-[10px] text-red-400/90 uppercase tracking-wide" role="alert">{error}</p>
          )}
        </div>
        {showCount && (
          <span className={`font-mono text-[10px] tabular-nums ${value.length < 50 ? "text-red-400/50" : "text-white/25"}`}>
            {value.length}{maxLength ? ` / ${maxLength}` : ""}
          </span>
        )}
      </div>
    </div>
  );
}

function FSelect({
  label, req, options, value, onChange, error,
}: {
  label: string; req?: boolean; options: string[]; value: string;
  onChange: (v: string) => void; error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [upward, setUpward] = useState(false);
  const id = label.toLowerCase().replace(/\s+/g, "-");

  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && wrapRef.current) {
      const rect = wrapRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setUpward(spaceBelow < 250);
    }
  }, [open]);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={`relative ${open ? "z-50" : "z-10"}`} ref={wrapRef} data-haserror={!!error ? "true" : "false"}>
      <label htmlFor={id} className="block font-mono text-[10px] uppercase tracking-widest text-white/40 mb-3">
        {label}{req && <span className="text-[var(--color-accent)] ml-1">*</span>}
      </label>
      <button
        id={id}
        type="button"
        data-cursor="select"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`w-full flex items-center justify-between border-b pb-3 text-left transition-colors focus:outline-none ${
          error ? "border-red-500/50" : open || value ? "border-[var(--color-accent)]" : "border-white/15 hover:border-white/30"
        }`}
      >
        <span className={`font-sans text-sm ${value ? "text-white" : "text-white/25"}`}>{value || "Select..."}</span>
        <svg className={`w-3.5 h-3.5 text-white/30 transition-transform duration-200 ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className="h-6 mt-2">
        {error && (
          <p className="font-mono text-[10px] text-red-400/90 uppercase tracking-wide" role="alert">{error}</p>
        )}
      </div>
      {open && (
        <ul
          role="listbox"
          className={`absolute left-0 w-full bg-[#111113] border border-white/10 z-30 max-h-52 overflow-y-auto overscroll-contain shadow-2xl ${
            upward ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          {options.map(opt => (
            <li
              key={opt}
              role="option"
              aria-selected={value === opt}
              className={`px-4 py-3 font-sans text-sm cursor-pointer transition-colors ${
                value === opt
                  ? "text-[var(--color-accent)] bg-[var(--color-accent)]/[0.06]"
                  : "text-white/60 hover:text-white hover:bg-white/[0.04]"
              }`}
              onClick={() => { onChange(opt); setOpen(false); }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
