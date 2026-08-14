const TOKEN_KEY = "auth_token";
const ROLE_KEY = "user_role";
const REFRESH_TOKEN_KEY = "refresh_token";
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

export type UserRole = "CANDIDATE" | "RECRUITER";

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;

  const localToken = localStorage.getItem(TOKEN_KEY);
  if (localToken) return localToken;

  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${TOKEN_KEY}=`))
    ?.split("=")[1];

  return cookieValue ? decodeURIComponent(cookieValue) : null;
};

export const setAuthToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
    document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${TOKEN_MAX_AGE}; samesite=lax`;
  }
};

export const removeAuthToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; samesite=lax`;
  }
};

export const getUserRole = (): UserRole | null => {
  if (typeof window === "undefined") return null;

  const localRole = localStorage.getItem(ROLE_KEY)?.toUpperCase();
  if (localRole === "CANDIDATE" || localRole === "RECRUITER") {
    return localRole;
  }

  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${ROLE_KEY}=`))
    ?.split("=")[1];

  if (cookieValue) {
    const roleValue = decodeURIComponent(cookieValue).toUpperCase();
    if (roleValue === "CANDIDATE" || roleValue === "RECRUITER") {
      return roleValue;
    }
  }

  return null;
};

export const setUserRole = (role: UserRole): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(ROLE_KEY, role);
    document.cookie = `${ROLE_KEY}=${role}; path=/; max-age=${TOKEN_MAX_AGE}; samesite=lax`;
  }
};

export const removeUserRole = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ROLE_KEY);
    document.cookie = `${ROLE_KEY}=; path=/; max-age=0; samesite=lax`;
  }
};

export const logout = (): void => {
  removeAuthToken();
  removeUserRole();

  if (typeof window !== "undefined") {
    localStorage.removeItem("signup-role");
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    document.cookie = `${REFRESH_TOKEN_KEY}=; path=/; max-age=0; samesite=lax`;
    window.location.href = "/login";
  }
};
