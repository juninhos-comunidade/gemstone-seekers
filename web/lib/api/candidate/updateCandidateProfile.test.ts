import { describe, it, expect, vi } from "vitest";
import {
  useUpdateUserMutation,
  useUpdateAddressMutation,
  useAddExperienceMutation,
  useDeleteExperienceMutation,
} from "./userProfileMutations";

const mockInvalidateQueries = vi.fn();
const mockUseMutation = vi.fn();

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
  }),
  useMutation: (options: unknown) => mockUseMutation(options),
}));

describe("UserProfileMutations API", () => {
  it("useUpdateUserMutation invalidates candidateProfile query on success", () => {
    mockUseMutation.mockImplementation((options) => {
      if (options && typeof options === "object" && "onSuccess" in options) {
        (options.onSuccess as () => void)();
      }
      return options;
    });

    useUpdateUserMutation();
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["candidateProfile"],
    });
  });

  it("useUpdateAddressMutation invalidates candidateProfile query on success", () => {
    mockUseMutation.mockImplementation((options) => {
      if (options && typeof options === "object" && "onSuccess" in options) {
        (options.onSuccess as () => void)();
      }
      return options;
    });

    useUpdateAddressMutation();
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["candidateProfile"],
    });
  });

  it("useAddExperienceMutation invalidates candidateProfile query on success", () => {
    mockUseMutation.mockImplementation((options) => {
      if (options && typeof options === "object" && "onSuccess" in options) {
        (options.onSuccess as () => void)();
      }
      return options;
    });

    useAddExperienceMutation();
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["candidateProfile"],
    });
  });

  it("useDeleteExperienceMutation invalidates candidateProfile query on success", () => {
    mockUseMutation.mockImplementation((options) => {
      if (options && typeof options === "object" && "onSuccess" in options) {
        (options.onSuccess as () => void)();
      }
      return options;
    });

    useDeleteExperienceMutation();
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["candidateProfile"],
    });
  });
});
