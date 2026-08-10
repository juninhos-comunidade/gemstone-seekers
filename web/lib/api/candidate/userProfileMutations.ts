import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { httpClient } from "@/lib/api/client";
import {
  CandidateProfileResponse,
  UserRequest,
  AddressRequest,
  LinkItemRequest,
  ExperienceRequest,
  EducationRequest,
  CertificationRequest,
  CandidateLanguageRequest,
  ProjectRequest,
} from "@/lib/types/candidate";
import { ApiResponse } from "@/lib/types/api/response";

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UserRequest) => {
      const response = await httpClient.patch<
        ApiResponse<CandidateProfileResponse>
      >("/profile/user", input);
      return response.result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
      toast.success("Informações pessoais atualizadas com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Erro ao atualizar informações pessoais.");
    },
  });
}

export function useUpdateAddressMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddressRequest) => {
      const response = await httpClient.patch<
        ApiResponse<CandidateProfileResponse>
      >("/profile/address", input);
      return response.result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
      toast.success("Endereço atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Erro ao atualizar endereço.");
    },
  });
}

export function useAddLinkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: LinkItemRequest) => {
      const response = await httpClient.post<
        ApiResponse<CandidateProfileResponse>
      >("/profile/links", input);
      return response.result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
      toast.success("Link adicionado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Erro ao adicionar link.");
    },
  });
}

export function useDeleteLinkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (linkId: string) => {
      const response = await httpClient.delete<
        ApiResponse<CandidateProfileResponse>
      >(`/profile/links/${linkId}`);
      return response.result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
      toast.success("Link removido com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Erro ao remover link.");
    },
  });
}

export function useAddExperienceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ExperienceRequest) => {
      const response = await httpClient.post<
        ApiResponse<CandidateProfileResponse>
      >("/profile/experiences", input);
      return response.result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
      toast.success("Experiência adicionada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Erro ao adicionar experiência.");
    },
  });
}

export function useDeleteExperienceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (experienceId: string) => {
      const response = await httpClient.delete<
        ApiResponse<CandidateProfileResponse>
      >(`/profile/experiences/${experienceId}`);
      return response.result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
      toast.success("Experiência removida com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Erro ao remover experiência.");
    },
  });
}

export function useAddEducationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: EducationRequest) => {
      const response = await httpClient.post<
        ApiResponse<CandidateProfileResponse>
      >("/profile/educations", input);
      return response.result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
      toast.success("Formação acadêmica adicionada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Erro ao adicionar formação acadêmica.");
    },
  });
}

export function useDeleteEducationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (educationId: string) => {
      const response = await httpClient.delete<
        ApiResponse<CandidateProfileResponse>
      >(`/profile/educations/${educationId}`);
      return response.result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
      toast.success("Formação acadêmica removida com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Erro ao remover formação acadêmica.");
    },
  });
}

export function useAddCertificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CertificationRequest) => {
      const response = await httpClient.post<
        ApiResponse<CandidateProfileResponse>
      >("/profile/certifications", input);
      return response.result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
      toast.success("Certificação adicionada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Erro ao adicionar certificação.");
    },
  });
}

export function useDeleteCertificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (certificationId: string) => {
      const response = await httpClient.delete<
        ApiResponse<CandidateProfileResponse>
      >(`/profile/certifications/${certificationId}`);
      return response.result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
      toast.success("Certificação removida com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Erro ao remover certificação.");
    },
  });
}

export function useAddLanguageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CandidateLanguageRequest) => {
      const response = await httpClient.post<
        ApiResponse<CandidateProfileResponse>
      >("/profile/languages", input);
      return response.result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
      toast.success("Idioma adicionado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Erro ao adicionar idioma.");
    },
  });
}

export function useDeleteLanguageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (languageId: number) => {
      const response = await httpClient.delete<
        ApiResponse<CandidateProfileResponse>
      >(`/profile/languages/${languageId}`);
      return response.result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
      toast.success("Idioma removido com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Erro ao remover idioma.");
    },
  });
}

export function useAddProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ProjectRequest) => {
      const response = await httpClient.post<
        ApiResponse<CandidateProfileResponse>
      >("/profile/projects", input);
      return response.result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
      toast.success("Projeto adicionado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Erro ao adicionar projeto.");
    },
  });
}

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const response = await httpClient.delete<
        ApiResponse<CandidateProfileResponse>
      >(`/profile/projects/${projectId}`);
      return response.result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
      toast.success("Projeto removido com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Erro ao remover projeto.");
    },
  });
}
