import fs from "fs";
import path from "path";

import dotenv from "dotenv";
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import ora from "ora";

import { mapCsvDataToJson } from "./utils.mjs";
import { cleanString, createSlug, generateShortHash, padIndex, parseAndUniqueList } from "./utils.mjs";

dotenv.config({ path: ".env.local" });

/**
 * Creates and returns a JWT client for Google APIs.
 *
 * @returns {JWT} An instance of JWT configured with the service account credentials.
 * @throws {Error} If the base64 encoded service account or necessary fields are missing.
 */
const createJwtClient = () => {
  const base64ServiceAccount = process.env.NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_BASE64;

  if (!base64ServiceAccount) {
    throw new Error("Base64 encoded service account is not defined in environment variables.");
  }

  const decodedJson = Buffer.from(base64ServiceAccount, "base64").toString("utf8");
  const serviceAccount = JSON.parse(decodedJson);
  const { client_email, private_key } = serviceAccount;

  if (!client_email || !private_key) {
    throw new Error("Service account email or private key is missing.");
  }

  return new JWT({
    email: client_email,
    key: private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
};

/**
 * Fetches data from a specified Google Sheets spreadsheet.
 *
 * @param {string} sheetName - The name of the sheet to fetch data from.
 * @returns {Promise<Array>} A promise that resolves to an array of JSON objects representing the sheet's data.
 * @throws {Error} If the spreadsheet ID is not defined, or the sheet is not found.
 */
const getGoogleSheetData = async (sheetName) => {
  const SPREADSHEET_ID = process.env.NEXT_PUBLIC_SPREADSHEET_ID;

  if (!SPREADSHEET_ID) {
    throw new Error("Spreadsheet ID is not defined in environment variables.");
  }

  const jwtClient = createJwtClient();
  const doc = new GoogleSpreadsheet(SPREADSHEET_ID, jwtClient);

  try {
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle[sheetName];
    if (!sheet) {
      throw new Error(`Sheet titled "${sheetName}" not found`);
    }

    const rows = await sheet.getRows();
    const data = rows.map((row) => row._rawData);
    const mappedData = mapCsvDataToJson({
      values: [sheet.headerValues, ...data],
    });

    return mappedData;
  } catch (error) {
    console.error("Error fetching data from Google Sheets:", error.message);
    return [];
  }
};

/**
 * Fetches data from Google Sheets, processes it, and saves it to JSON files.
 *
 * @returns {Promise<void>} A promise that resolves when the data has been fetched and saved.
 * @throws {Error} If the data format is invalid or an error occurs during processing.
 */
(async () => {
  const spinner = ora("Fetching data...").start();

  try {
    // Fetch data from Google Sheets
    const couplets = await getGoogleSheetData("kabir-ke-dohe");

    // Validate data format
    if (!Array.isArray(couplets)) {
      throw new Error("Invalid data format received from Google Sheets.");
    }

    // Process the fetched data
    let processedData = couplets.map((row) => ({
      index: parseInt(row.index ?? 0, 10), // Ensure integer parsing
      slug: cleanString(createSlug(row.title_english, "-")), // Create slug from title
      popular: row.popular?.toLowerCase() === "yes" || false, // Handle popularity status
      couplet_hindi: cleanString(row.couplet_hindi ?? ""), // Clean Hindi couplet
      translation_hindi: row?.translation_hindi?.trim() ?? "", // Clean Hindi translation
      explanation_hindi: row?.explanation_hindi?.trim() ?? "", // Clean Hindi explanation
      couplet_english: cleanString(row.couplet_english ?? ""), // Clean English couplet
      translation_english: row?.translation_english?.trim() ?? "", // Clean English translation
      explanation_english: row?.explanation_english?.trim() ?? "", // Clean English explanation
      tags: row?.tags?.trim() ?? "", // Clean tags
    }));

    const usedHashes = new Set(); // Set to track used hashes
    const tagCounts = new Map(); // Map to count occurrences of each tag

    // Generate unique slugs and count tags
    processedData = processedData.map((item, index) => {
      const indexPadded = padIndex(index); // Pad index for slug
      const originalText = `${item.slug}-${indexPadded}`; // Create original text
      const cleanSlug = createSlug(originalText); // Generate clean slug
      let shortHash = generateShortHash(cleanSlug); // Generate initial hash

      // Ensure unique hash
      while (usedHashes.has(shortHash)) {
        shortHash = generateShortHash(`${cleanSlug}${Math.random()}`);
      }
      usedHashes.add(shortHash);

      // Process and count tags
      const tags = parseAndUniqueList(item.tags);
      tags.forEach((tag) => {
        const slugifiedTag = createSlug(tag);
        if (tagCounts.has(slugifiedTag)) {
          tagCounts.get(slugifiedTag).count += 1;
        } else {
          tagCounts.set(slugifiedTag, { name: tag, count: 1 });
        }
      });

      return {
        id: index + 1, // Assign unique ID
        slug: createSlug(item.slug), // Generate slug
        unique_slug: createSlug(`${cleanSlug}-${shortHash}`), // Generate unique slug
        couplet_hindi: item.couplet_hindi,
        couplet_english: item.couplet_english,
        translation_hindi: item.translation_hindi,
        translation_english: item.translation_english,
        explanation_hindi: item.explanation_hindi,
        explanation_english: item.explanation_english,
        popular: Boolean(item.popular) || false, // Ensure boolean value
        tags: tags.map((tag) => ({
          slug: createSlug(tag),
          name: tag,
        })),
      };
    });

    // Save tags to file
    const tagsFilePath = path.join(process.cwd(), "data/tags.json");
    const filteredTags = Array.from(tagCounts.entries())
      .map(([slugifiedTag, { name, count }]) => ({
        slug: slugifiedTag,
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    fs.writeFileSync(tagsFilePath, JSON.stringify(filteredTags, null, 2));

    // Save processed data to file
    const coupletsFilePath = path.join(process.cwd(), "data/couplets.json");
    fs.writeFileSync(coupletsFilePath, JSON.stringify(processedData, null, 2));

    spinner.succeed("Data fetched and saved to data/couplets.json, data/tags.json");
  } catch (error) {
    spinner.fail("Error fetching data");
    console.error("Error fetching group data:", error);
  }
})();
