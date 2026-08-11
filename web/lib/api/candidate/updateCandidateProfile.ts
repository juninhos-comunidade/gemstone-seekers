import { useUpdateUserMutation } from "./userProfileMutations";

export function useUpdateCandidateMutation() {
  return useUpdateUserMutation();
}
