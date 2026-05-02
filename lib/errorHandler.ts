/**
 * Safely extract error message from API response
 * Handles both string messages and Pydantic validation error objects
 */
export function getErrorMessage(err: any, fallback: string = 'An error occurred'): string {
  try {
    const detail = err?.response?.data?.detail;

    // If detail is already a string, return it
    if (typeof detail === 'string') {
      return detail;
    }

    // If detail is an array (list of validation errors), get the first error message
    if (Array.isArray(detail) && detail.length > 0) {
      const firstError = detail[0];
      if (typeof firstError === 'string') {
        return firstError;
      }
      if (typeof firstError === 'object' && firstError.msg) {
        return firstError.msg;
      }
    }

    // If detail is an object with msg field
    if (typeof detail === 'object' && detail?.msg) {
      return detail.msg;
    }

    // Fallback to the provided message
    return fallback;
  } catch {
    return fallback;
  }
}
