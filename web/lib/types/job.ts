export type JobStatus = "OPEN" | "CLOSED" | "CANCELLED";

export type SeniorityLevel =
  "Junior" | "Pleno" | "Sênior" | "Mid" | "Especialista" | "Tech Lead";

export interface Job {
  id: string;
  recruiterId: string;
  companyId: string;
  title: string;
  description: string;
  seniorityLevel: SeniorityLevel;
  department: string;
  salaryMin?: number;
  salaryMax?: number;
  status: JobStatus;
  technologies?: JobTechnology[];
}

export interface CreateJobInput {
  title: string;
  description: string;
  seniorityLevel?: SeniorityLevel;
  department?: string;
  salaryMin?: number;
  salaryMax?: number;
  recruiterId: string;
  companyId: string;
}

export interface UpdateJobInput {
  title: string;
  description: string;
  seniorityLevel?: SeniorityLevel;
  department?: string;
  salaryMin?: number;
  salaryMax?: number;
  recruiterId: string;
  companyId: string;
}

export interface JobTechnology {
  technologyId: number;
  category: string;
  technologyName: string;
  isMandatory: boolean;
}

export interface JobTechnologyApiResponse {
  technologyId: number;
  technologyName?: string;
  category: string;
  isMandatory: boolean;
}

export interface AddJobTechnologyInput {
  technologyId: number;
  isMandatory: boolean;
}
