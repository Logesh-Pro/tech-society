export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Application {
  id: string;
  createdAt: string;
  status: ApplicationStatus;
  
  // Identity
  fullName: string;
  email: string;
  phone: string;
  
  // Academic
  department: string;
  year: string;
  
  // Domain
  domain: string;
  
  // Skills & Experience
  skills: string[];
  customSkills?: string[]; // Optional user-defined skills
  experienceLevel: "Beginner" | "Intermediate" | "Advanced" | "";
  previousProjects: string;
  
  // Motivation
  motivation: string;
  
  // Links
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  resumeDriveUrl?: string; // Optional Google Drive link
  
  // Availability
  weeklyHours: string;
  preferredActivities: string[];
  additionalMessage: string;
}

export type ApplicationSubmission = Omit<Application, "id" | "createdAt" | "status">;

export interface AdminStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}
