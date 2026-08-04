const TOKEN_KEY = "auth_token";
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;

  const localToken = localStorage.getItem(TOKEN_KEY);
  if (localToken) return localToken;

  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${TOKEN_KEY}=`))
    ?.split("=")[1];

  return cookieValue ?? null;
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
