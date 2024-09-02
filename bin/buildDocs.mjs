import fs from "fs/promises";
import path from "path";

import ora from "ora";
import * as prettier from "prettier";

/**
 * Converts a Latin number to a Hindi number.
 *
 * @param {number|string} latinNumber - The Latin number to be converted. Can be a number or a string.
 * @return {string} The Hindi representation of the input number.
 */
const latinToHindiNumber = (latinNumber) => {
	const hindiDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

	return latinNumber
		.toString()
		.split("")
		.map((digit) => {
			const num = parseInt(digit, 10);
			return hindiDigits[num];
		})
		.join("");
};

/**
 * Formats newlines in a string for Markdown compatibility.
 *
 * @param {string} text - The text to format.
 * @return {string} The formatted text with Markdown-compatible line breaks.
 */
const formatMarkdownBreaks = (text) => {
	return text.split("\n").join("\\\n");
};

/**
 * Generates Markdown content with numbered entries, translations, and explanations.
 *
 * @param {Object[]} entries  - Array of entry objects containing doha text, translations, and explanations.
 * @param {number}   startNum - The starting number for the entries.
 * @return {string} - The generated Markdown content with numbered entries, translations, and explanations.
 */
const generateMarkdownContent = (entries, startNum) => {
	return entries
		.map((entry, index) => {
			const entryIndex = startNum + index;
			let content = "";
			content += formatMarkdownBreaks(entry.couplet_hindi);
			content += latinToHindiNumber(entryIndex) + "।।\n\n";
			content += "**अर्थ:** " + formatMarkdownBreaks(entry.translation_hindi) + "\n\n";
			content += "**Meaning:** " + formatMarkdownBreaks(entry.translation_english) + "\n\n";
			content += "**व्याख्या:** " + formatMarkdownBreaks(entry.explanation_hindi);

			return content;
		})
		.join("\n\n---\n\n");
};

/**
 * Pads a number with leading zeros.
 *
 * @param {number} number - The number to pad.
 * @param {number} width  - The desired width of the number string.
 * @return {string} The padded number as a string.
 */
const padNumber = (number, width) => {
	const numberStr = number.toString();
	return numberStr.padStart(width, "0");
};

/**
 * Creates markdown files from the given filtered data, with each file containing a specified number of entries.
 *
 * @param {Array<Object>} data    - The filtered data to write to markdown files.
 * @param {Object}        spinner - ora spinner object.
 * @return {Promise<void>}
 */
const createMarkdownFiles = async (data, spinner) => {
	const docsDir = path.resolve(process.cwd(), "docs");
	const entriesPerFile = 50;

	// Ensure the docs directory exists
	await fs.mkdir(docsDir, { recursive: true });

	for (let i = 0; i < data.length; i += entriesPerFile) {
		const entries = data.slice(i, i + entriesPerFile);
		const startNum = i + 1;
		const startNumber = padNumber(i + 1, 2);
		const endNumber = padNumber(i + entriesPerFile, 2);
		const heading = `# संत कबीर जी के दोहे — ${startNumber} to ${endNumber}`;
		const content = `${heading}\n\n${generateMarkdownContent(entries, startNum)}`;
		const fileName = `collection-${startNumber}-to-${endNumber}.md`;
		const filePath = path.join(docsDir, fileName);
		const finalContent = await prettier.format(`${content}`, { parser: "markdown" });

		await fs.writeFile(filePath, finalContent, "utf8");
		spinner.start(`File created: ${path.basename(filePath)}`);
	}
};

/**
 * Main function to read data from a JSON file, filter by author, and generate markdown files.
 *
 * @return {Promise<void>}
 */
(async () => {
	const spinner = ora("Fetching data and creating markdown files...").start();

	try {
		const filePath = path.join(process.cwd(), "data/couplets.json");
		const jsonData = await fs.readFile(filePath, "utf-8");
		const data = JSON.parse(jsonData);

		await createMarkdownFiles(data, spinner);
		spinner.succeed("Markdown files created successfully.");
	} catch (error) {
		spinner.fail("Error reading or processing data:");
		console.error(error);
	}
})();
