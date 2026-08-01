export type JobStatus = "OPEN" | "CLOSED" | "CANCELLED";

export interface JobTechnology {
  technologyId: number;
  name: string;
  category?: string;
  isMandatory: boolean;
}

export interface Job {
  id: string;
  recruiterId: string;
  companyId: string;
  companyName: string;
  companyCnpj?: string;
  title: string;
  description: string;
  seniorityLevel: "Junior" | "Pleno" | "Sênior" | "Especialista" | "Tech Lead";
  department: string;
  salaryMin?: number;
  salaryMax?: number;
  status: JobStatus;
  technologies: JobTechnology[];
  location: string;
  createdAt: string;
  updatedAt: string;
}
