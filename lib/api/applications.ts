import { Application, ApplicationStatus, ApplicationSubmission, AdminStats } from "./types";

const STORAGE_KEY = "tech_society_applications";

// Helper to interact with localStorage
const getStoredApplications = (): Application[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const setStoredApplications = (apps: Application[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  } catch (e) {
    console.error("Failed to save to localStorage", e);
  }
};

// Simulate network delay to maintain smooth transition experience
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function submitApplication(submission: ApplicationSubmission): Promise<{ success: boolean; applicationId: string }> {
  await delay(800);
  
  const idStr = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  const newApp: Application = {
    id: `TS-2026-${idStr}`,
    createdAt: new Date().toISOString(),
    status: "PENDING",
    ...submission
  };
  
  const current = getStoredApplications();
  setStoredApplications([newApp, ...current]);
  
  return { success: true, applicationId: newApp.id };
}

export async function getApplications(): Promise<{ applications: Application[]; stats: AdminStats }> {
  await delay(500);
  
  const current = getStoredApplications();
  const stats: AdminStats = {
    total: current.length,
    pending: current.filter(a => a.status === "PENDING").length,
    approved: current.filter(a => a.status === "APPROVED").length,
    rejected: current.filter(a => a.status === "REJECTED").length,
  };
  
  return { applications: current, stats };
}

export async function getApplication(id: string): Promise<Application | null> {
  await delay(300);
  const current = getStoredApplications();
  const app = current.find(a => a.id === id);
  return app ? { ...app } : null;
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus): Promise<{ success: boolean; status: ApplicationStatus }> {
  await delay(600);
  
  const current = getStoredApplications();
  const index = current.findIndex(a => a.id === id);
  
  if (index === -1) {
    throw new Error("Application not found");
  }
  
  current[index] = { ...current[index], status };
  setStoredApplications(current);
  
  return { success: true, status };
}

