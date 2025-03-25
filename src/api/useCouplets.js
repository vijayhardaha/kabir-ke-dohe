import { useMemo } from "react";

import useSWR from "swr";

import { fetchApiData } from "./fetchApiData";

/**
 * Custom hook for fetching couplets using SWR.
 *
 * @param {Object} [params={}] - The parameters to include in the POST request body.
 * @returns {Object} - Contains data, error, and loading states.
 */
export const useCouplets = (params = {}) => {
  const { data, error } = useSWR(["/api/couplets", params], fetchApiData);

  // Handle errors to include error code if available
  const resolvedError = useMemo(() => {
    if (data && !data.success) {
      // Data-specific error handling
      return { message: data.message || "Unknown error occurred.", code: data.code || null };
    }
    if (error) {
      // Fetch API-specific error handling
      if (error instanceof Error) {
        return { message: error.message, code: error.code || null };
      }
      // Handle non-Error errors
      return { message: "An unexpected error occurred.", code: null };
    }
    return null;
  }, [data, error]);

  return {
    data: data ? data.data : null,
    error: resolvedError,
    isLoading: !data && !error,
  };
};
