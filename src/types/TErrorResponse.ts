import type { TvalidationErrors } from "../pages/TValidationErrors";

export type TErrorResponse={
     status: number;
  error: string |TvalidationErrors;
  message: string;
}