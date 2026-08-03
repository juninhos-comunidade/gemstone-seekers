export type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  result: T;
  error?: string;
};
