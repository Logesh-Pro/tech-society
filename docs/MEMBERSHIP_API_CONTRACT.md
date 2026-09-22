# TECH SOCIETY MEMBERSHIP API CONTRACT

This document describes the expected backend API contract for the Tech Society membership application and admin management system.

## 1. Domain Types

### Application
```typescript
interface Application {
  id: string;
  createdAt: string; // ISO 8601
  status: "PENDING" | "APPROVED" | "REJECTED";
  
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
  experienceLevel: "Beginner" | "Intermediate" | "Advanced";
  previousProjects: string;
  
  // Motivation
  motivation: string;
  
  // Links
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  
  // Availability
  weeklyHours: string;
  preferredActivities: string[];
  additionalMessage: string;
}
```

## 2. Public Endpoints

### Submit Application
- **Method**: `POST`
- **Route**: `/api/applications`
- **Body**: Omit `id`, `createdAt`, `status` from the `Application` type.
- **Success Response**: `201 Created`
```json
{
  "success": true,
  "applicationId": "uuid"
}
```
- **Error Response**: `400 Bad Request` (Validation errors)

## 3. Admin Endpoints (Requires Authentication)

### Get Applications
- **Method**: `GET`
- **Route**: `/api/admin/applications`
- **Query Params**: `status`, `domain`, `search`
- **Success Response**: `200 OK`
```json
{
  "applications": [
    // Array of Application objects
  ],
  "total": 100,
  "pending": 50,
  "approved": 40,
  "rejected": 10
}
```

### Get Application By ID
- **Method**: `GET`
- **Route**: `/api/admin/applications/:id`
- **Success Response**: `200 OK` (Application object)

### Approve Application
- **Method**: `POST`
- **Route**: `/api/admin/applications/:id/approve`
- **Success Response**: `200 OK`
```json
{
  "success": true,
  "status": "APPROVED"
}
```

### Reject Application
- **Method**: `POST`
- **Route**: `/api/admin/applications/:id/reject`
- **Success Response**: `200 OK`
```json
{
  "success": true,
  "status": "REJECTED"
}
```

## 4. Security Note
Real authentication and authorization must be implemented by the backend. The frontend visually protects the `/admin` routes during development, but this is NOT secure. Backend API routes must enforce admin roles/session validation.
