export type ProficiencyLevel =
  "BASIC" | "INTERMEDIATE" | "ADVANCED" | "FLUENT" | "NATIVE";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "CANDIDATE" | "RECRUITER";
  documentType: "CPF" | "CNPJ" | "PASSPORT" | string;
  documentNumber: string;
  createdAt: string;
}

export interface Address {
  id: string;
  street: string;
  number: string;
  neighborhood: string;
  complement?: string;
  zipCode: string;
  cityName: string;
  stateName: string;
  stateCode: string;
  countryName: string;
}

export interface CandidateLink {
  id?: string;
  name: string;
  url: string;
}

export interface CandidateLanguage {
  languageId?: number;
  languageName: string;
  proficiency: ProficiencyLevel;
}

export interface Experience {
  id?: string;
  title: string;
  companyName: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  technologyNames?: string[];
}

export interface Education {
  id?: string;
  institution: string;
  fieldOfStudy: string;
  degree?: string;
  startDate?: string;
  completionDate?: string;
}

export interface Certification {
  id?: string;
  name: string;
  issuingOrganization: string;
  issueDate?: string;
  expirationDate?: string;
  credentialUrl?: string;
}

export interface Project {
  id?: string;
  name: string;
  description?: string;
  projectUrl?: string;
  startDate?: string;
  endDate?: string;
  technologyNames?: string[];
}

export interface CandidateProfile {
  id: string;
  userId: string;
  user: User;
  phone?: string;
  summary?: string;
  address?: Address;
  links?: CandidateLink[];
  languages?: CandidateLanguage[];
  experiences?: Experience[];
  educations?: Education[];
  certifications?: Certification[];
  projects?: Project[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateCandidateInput {
  name: string;
  phone: string;
  documentType: string;
  documentNumber: string;
  summary: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    complement?: string;
    zipCode: string;
    cityName: string;
    stateCode: string;
  };
  links?: CandidateLink[];
  languages?: CandidateLanguage[];
  experiences?: Experience[];
  educations?: Education[];
  certifications?: Certification[];
  projects?: Project[];
}
