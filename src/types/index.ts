/**
 * TypeScript type definitions for the application
 */

// ============================================================================
// Database Models
// ============================================================================

export interface Project {
  id: string;
  title_en: string;
  title_ar?: string | null;
  desc_en: string;
  desc_ar?: string | null;
  repoLink: string;
  liveLink: string;
  imageLink: string;
  categories: string[];
  published?: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Certificate {
  id: string;
  title: string;
  desc: string;
  courseLink: string;
  profLink: string;
  imageLink: string;
  createdAt: Date;
  updatedAt?: Date;
}

// ============================================================================
// Server Action Results
// ============================================================================

export type ActionResult<T = void> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; details?: any };

// ============================================================================
// Form State Types
// ============================================================================

export interface ProjectFormData {
  title_en: string;
  title_ar: string;
  desc_en: string;
  desc_ar: string;
  repoLink: string;
  liveLink: string;
  categories: string;
}

export interface CertificateFormData {
  title: string;
  desc: string;
  courseLink: string;
  profLink: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// ============================================================================
// Component Props
// ============================================================================

export interface EditProjectProps {
  EditedObject: Project;
}

export interface EditCertificateProps {
  EditedObject: Certificate;
}
