export type JobStatus = "OPEN" | "PAUSED" | "CLOSED" | "CANCELLED";

export type SeniorityLevel =
  "Junior" | "Pleno" | "Sênior" | "Especialista" | "Tech Lead";

export interface JobTechnology {
  technologyId: number;
  name: string;
  category?: string;
  isMandatory: boolean;
}

export interface TechnologyItem {
  id: number;
  name: string;
  category: string;
}

export interface Job {
  id: string;
  recruiterId: string;
  companyId: string;
  companyName: string;
  companyCnpj?: string;
  title: string;
  description: string;
  seniorityLevel: SeniorityLevel;
  department: string;
  salaryMin?: number;
  salaryMax?: number;
  status: JobStatus;
  technologies: JobTechnology[];
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobInput {
  title: string;
  companyName: string;
  department: string;
  seniorityLevel: SeniorityLevel;
  location: string;
  status: JobStatus;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  technologies: JobTechnology[];
}

export interface UpdateJobInput extends CreateJobInput {
  id: string;
}
