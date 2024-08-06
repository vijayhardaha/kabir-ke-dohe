import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import axios from "axios";
import matter from "gray-matter";
import ora from "ora";
import * as prettier from "prettier";

// Get the directory name of the current module
const __filename = fileURLToPath( import.meta.url );
const __dirname = path.dirname( __filename );

/**
 * Generates Markdown content with numbered entries.
 *
 * @param {Object[]} entries  - Array of entry objects containing doha text.
 * @param {number}   startNum - The starting number for the entries.
 * @return {string} - The generated Markdown content with numbered entries.
 */
const generateMarkdownContent = ( entries, startNum ) => {
	return entries
		.map( ( entry, index ) => {
			const entryIndex = startNum + index;
			return `${ entry.doha.split( "\n" ).join( "\\\n" ) + `${ entryIndex }।।` }`;
		} )
		.join( "\n\n---\n\n" );
};

/**
 * Reads metadata from an existing Markdown file.
 *
 * @param {string} filePath - Path to the Markdown file.
 * @return {string} - The metadata content in the required format.
 */
const readMetadata = async ( filePath ) => {
	try {
		const content = await fs.readFile( filePath, "utf8" );
		const parsed = matter( content );
		const metadata = parsed.data;

		if ( Object.keys( metadata ).length === 0 ) {
			return "";
		}

		// Format metadata as required
		let metadataContent = "---\n";
		for ( const [ key, value ] of Object.entries( metadata ) ) {
			metadataContent += `${ key }: ${ value }\n`;
		}
		metadataContent += "---\n\n\n\n\n\n";
		return metadataContent;
	} catch ( error ) {
		if ( error.code !== "ENOENT" ) {
			throw error;
		}
	}
	return "";
};

/**
 * Pads a number with leading zeros.
 *
 * @param {number} number - The number to pad.
 * @param {number} width  - The desired width of the number string.
 * @return {string} The padded number as a string.
 */
const padNumber = ( number, width ) => {
	const numberStr = number.toString();
	return numberStr.padStart( width, "0" );
};

/**
 * Creates markdown files from the given filtered data, with each file containing a specified number of entries.
 *
 * @param {Array<Object>} data    - The filtered data to write to markdown files.
 * @param {Object}        spinner - ora spinner object.
 * @return {Promise<void>}
 */
const createMarkdownFiles = async ( data, spinner ) => {
	const docsDir = path.resolve( __dirname, "..", "collections" );
	const entriesPerFile = 50;

	// Ensure the docs directory exists
	await fs.mkdir( docsDir, { recursive: true } );

	for ( let i = 0; i < data.length; i += entriesPerFile ) {
		const entries = data.slice( i, i + entriesPerFile );
		const startNum = i + 1;
		const startNumber = padNumber( i + 1, 2 );
		const endNumber = padNumber( Math.min( i + entriesPerFile, data.length ), 2 );
		const heading = `# **संत कबीर जी के दोहे — ${ startNumber } to ${ endNumber }**`;
		const content = `${ heading }\n\n${ generateMarkdownContent( entries, startNum ) }`;
		const fileName = `collection-${ startNumber }-to-${ endNumber }.md`;
		const filePath = path.join( docsDir, fileName );
		const metadata = await readMetadata( filePath );
		const finalContent = await prettier.format( `${ metadata }${ content }`, { parser: "markdown" } );

		await fs.writeFile( filePath, finalContent, "utf8" );
		spinner.start( `File created: ${ path.basename( filePath ) }` );
	}
};

/**
 * Main function to read data from a JSON file, filter by author, and generate markdown files.
 *
 * @return {Promise<void>}
 */
const main = async () => {
	const spinner = ora( "Fetching data and creating markdown files..." ).start();

	try {
		// URL to fetch Kabir Ke Dohe API data
		const apiUrl = "https://santo-ki-seekh.netlify.app/api/kabir-ke-dohe/";

		// Fetch data from API endpoint
		const response = await axios.get( apiUrl );
		const jsonData = response.data;

		await createMarkdownFiles( jsonData, spinner );
		spinner.succeed( "Markdown files created successfully." );
	} catch ( error ) {
		spinner.fail( "Error reading or processing data:" );
		console.error( error );
	}
};

// Run the main function
main();
