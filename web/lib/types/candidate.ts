export type ProficiencyLevel =
  "BASIC" | "INTERMEDIATE" | "ADVANCED" | "FLUENT" | "NATIVE";

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: "CANDIDATE" | "RECRUITER" | string;
  documentType?: string;
  documentNumber?: string;
}

export interface CityResponse {
  id?: number;
  name: string;
  stateId?: number;
}

export interface AddressResponse {
  id: string;
  street: string;
  number: string;
  neighborhood: string;
  complement?: string;
  zipCode: string;
  city?: CityResponse;
}

export interface CandidateLinkResponse {
  id: string;
  name: string;
  url: string;
}

export interface CandidateLanguageResponse {
  languageId?: number;
  languageName: string;
  proficiency: ProficiencyLevel;
}

export interface ExperienceResponse {
  id: string;
  title: string;
  companyName: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}

export interface EducationResponse {
  id: string;
  institution: string;
  fieldOfStudy: string;
  degree?: string;
  startDate?: string;
  completionDate?: string;
}

export interface CertificationResponse {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate?: string;
  expirationDate?: string;
  credentialUrl?: string;
}

export interface ProjectResponse {
  id: string;
  name: string;
  description?: string;
  projectUrl?: string;
  startDate?: string;
  endDate?: string;
}

export interface CandidateResponse {
  id: string;
  user: UserResponse;
  phone?: string;
  summary?: string;
  links?: CandidateLinkResponse[];
  experiences?: ExperienceResponse[];
  educations?: EducationResponse[];
  certifications?: CertificationResponse[];
  projects?: ProjectResponse[];
  languages?: CandidateLanguageResponse[];
}

export interface CandidateProfileResponse {
  candidate: CandidateResponse;
  address?: AddressResponse | null;
}

export type CandidateProfile = CandidateProfileResponse;

// Request DTO Types matching Spring Boot UserProfileController
export interface UserRequest {
  name?: string;
  password?: string;
  documentType?: string;
  documentNumber?: string;
  phone?: string;
  summary?: string;
}

export interface LocationRequest {
  city?: string;
  state?: string;
  country?: string;
}

export interface AddressRequest {
  zipCode?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  complement?: string;
  location?: LocationRequest;
}

export interface LinkItemRequest {
  name: string;
  url: string;
}

export interface ExperienceRequest {
  title: string;
  companyName: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}

export interface EducationRequest {
  institution: string;
  fieldOfStudy: string;
  degree?: string;
  startDate?: string;
  completionDate?: string;
}

export interface CertificationRequest {
  name: string;
  issuingOrganization: string;
  issueDate?: string;
  expirationDate?: string;
  credentialUrl?: string;
}

export interface CandidateLanguageRequest {
  languageName: string;
  proficiency: ProficiencyLevel;
}

export interface ProjectRequest {
  name: string;
  description?: string;
  projectUrl?: string;
  startDate?: string;
  endDate?: string;
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
  links?: CandidateLinkResponse[];
  languages?: CandidateLanguageResponse[];
  experiences?: ExperienceResponse[];
  educations?: EducationResponse[];
  certifications?: CertificationResponse[];
  projects?: ProjectResponse[];
}
