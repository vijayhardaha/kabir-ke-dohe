/**
 * Fetches data from a given API endpoint.
 *
 * @param {Array} args - An array containing the API endpoint URL and request parameters.
 * @param {string} args[0] - The API endpoint URL.
 * @param {Object} [args[1]={}] - The parameters to include in the POST request body.
 * @returns {Promise<Object>} - A promise that resolves to the response data.
 * @throws {Error} - Throws an Error object with additional properties for error message and error code if the response is not OK or if there is a network error.
 */
export const fetchApiData = async ([url, params = {}]) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "An unknown error occurred";
      const errorCode = response.status;

      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Use the raw text if JSON parsing fails
        errorMessage = errorText;
      }

      // Create a new Error object and attach additional properties
      const error = new Error(errorMessage);
      error.code = errorCode;
      throw error;
    }

    return response.json();
  } catch (error) {
    // Normalize errors that are not instances of Error
    if (!(error instanceof Error)) {
      // Convert non-Error objects to a new Error with a generic message
      const newError = new Error("A network error occurred or unexpected response format");
      newError.code = null;
      throw newError;
    }
    // Rethrow the original error if it's an instance of Error
    throw error;
  }
};
