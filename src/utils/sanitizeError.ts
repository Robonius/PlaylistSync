import axios from 'axios';

type SanitizedAxiosError = Error & {
  isAxiosError: boolean;
  response?: {
    status: number;
    data: unknown;
  };
  status?: number;
  data?: unknown;
  request?: boolean;
};

export const sanitizeError = (error: unknown): unknown | SanitizedAxiosError => {
  if (axios.isAxiosError(error)) {
    const sanitizedError = new Error(error.message) as SanitizedAxiosError;
    sanitizedError.isAxiosError = true;

    // Explicitly copy only safe properties
    if (error.response) {
      sanitizedError.response = {
        status: error.response.status,
        data: error.response.data,
      };
      sanitizedError.status = error.response.status;
      sanitizedError.data = error.response.data;
    }

    if (error.request) {
      // Just indicate a request was made, don't copy the whole request object
      sanitizedError.request = true;
    }

    return sanitizedError;
  }

  return error;
};
