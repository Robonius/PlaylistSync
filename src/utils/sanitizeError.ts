import axios from 'axios';

export const sanitizeError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const sanitizedError: any = new Error(error.message);
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
