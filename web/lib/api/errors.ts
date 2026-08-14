export interface ValidationErrorItem {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  result?: unknown;
  error: {
    code: string;
    message: string;
    validations?: ValidationErrorItem[] | Record<string, string> | null;
  };
}

export class ApiError extends Error {
  public status: number;
  public data: ApiErrorResponse;

  constructor(status: number, message: string, data: ApiErrorResponse) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
