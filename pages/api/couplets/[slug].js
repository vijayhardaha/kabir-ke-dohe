import fs from "fs";
import path from "path";

/**
 * Load couplets data from a JSON file.
 * @returns {Array} Array of couplets.
 */
function loadData() {
	const filePath = path.join(process.cwd(), "data/couplets.json");
	const jsonData = fs.readFileSync(filePath, "utf-8");
	return JSON.parse(jsonData);
}

/**
 * Next.js API handler to get details of a single couplet by its unique slug.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export default function handler(req, res) {
	const { slug } = req.query; // Extracting the unique_slug from the request query.

	if (req.method !== "GET") {
		return res.status(405).json({
			success: false,
			message: "Method Not Allowed: This API endpoint only accepts GET requests.",
		});
	}

	try {
		const data = loadData();
		const couplet = data.find((item) => item.unique_slug === slug);

		if (!couplet) {
			return res.status(404).json({
				success: false,
				message: "Not Found: No couplet found with the specified slug.",
			});
		}

		return res.status(200).json({ success: true, data: couplet });
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal Server Error: An error occurred while processing the request.",
			error: error.message,
		});
	}
}
