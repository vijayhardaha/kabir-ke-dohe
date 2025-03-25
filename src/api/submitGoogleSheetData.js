import { GoogleSpreadsheet } from "google-spreadsheet";

import { createJwtClient } from "./createJwtClient";

/**
 * Formats an array of values by converting objects to their JSON string representation.
 * Nested arrays are also processed recursively.
 *
 * @param {Array} values - The array of values to format.
 * @returns {Array} The formatted array where objects and nested arrays are converted appropriately.
 */
export function formatValues(values) {
  return values.map((value) => {
    if (Array.isArray(value)) {
      // Recursively format nested arrays.
      return formatValues(value);
    } else if (typeof value === "object" && value !== null) {
      // Convert objects to JSON string.
      return JSON.stringify(value);
    }

    return value;
  });
}

/**
 * Submits data to a specified Google Sheets spreadsheet.
 *
 * @param {string} sheetName - The name of the sheet to append data to.
 * @param {Array} values - The array of values to be submitted to the sheet.
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>} A promise that resolves to an object indicating success or failure.
 */
export async function submitGoogleSheetData(sheetName, values) {
  const SPREADSHEET_ID = process.env.NEXT_PUBLIC_SPREADSHEET_ID;

  if (!SPREADSHEET_ID) {
    throw new Error("Spreadsheet ID is not defined in environment variables.");
  }

  const jwtClient = createJwtClient();
  const doc = new GoogleSpreadsheet(SPREADSHEET_ID, jwtClient);

  try {
    // Load spreadsheet info
    await doc.loadInfo();

    // Get the sheet by title
    const sheet = doc.sheetsByTitle[sheetName];
    if (!sheet) {
      throw new Error(`Sheet titled "${sheetName}" not found`);
    }

    // Add a timestamp as the first entry
    const timestamp = new Date().toISOString();
    const dataWithTimestamp = [timestamp, ...formatValues(values)];

    // Append data
    await sheet.addRow(dataWithTimestamp);

    return { success: true };
  } catch (error) {
    console.error("Error submitting data to Google Sheets:", error.message);
    return { success: false, error: error.message };
  }
}
