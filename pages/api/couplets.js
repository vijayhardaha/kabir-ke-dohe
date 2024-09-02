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
 * Fetch filtered and paginated couplets based on query parameters.
 * @param {Object} options - The filtering and pagination options.
 * @param {string} [options.search=""] - Search term for filtering.
 * @param {string} [options.tags=""] - Comma-separated tags for filtering.
 * @param {boolean} [options.popular=false] - Filter by popularity.
 * @param {string} [options.orderBy="id"] - Field to order by.
 * @param {string} [options.order="ASC"] - Order direction.
 * @param {number} [options.page=1] - Page number for pagination.
 * @param {number} [options.perPage=10] - Number of items per page.
 * @param {boolean} [options.pagination=true] - Enable or disable pagination.
 * @returns {Object} Object containing filtered and paginated couplets.
 */
export function getData({
	search = "",
	tags = "",
	popular = false,
	orderBy = "default",
	order = "ASC",
	page = 1,
	perPage = 10,
	pagination = true,
}) {
	let data = loadData();

	if (search) {
		const searchLower = search.toLowerCase();
		data = data.filter((post) =>
			[
				post.couplet_hindi,
				post.couplet_english,
				post.translation_hindi,
				post.translation_english,
				post.explanation_hindi,
				post.explanation_english,
			].some((field) => field.toLowerCase().includes(searchLower))
		);
	}

	if (tags) {
		const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase());
		data = data.filter((post) => post.tags.some((tag) => tagsArray.includes(tag.slug.toLowerCase())));
	}

	if (popular) {
		data = data.filter((post) => post.popular === popular);
	}

	if (orderBy === "random") {
		data = data.sort(() => Math.random() - 0.5);
	} else {
		data = data.sort((a, b) => {
			if (orderBy === "couplet_english") {
				return order === "ASC" ? a.couplet_english.localeCompare(b.couplet_english) : b.couplet_english.localeCompare(a.couplet_english);
			}
			if (orderBy === "couplet_hindi") {
				return order === "ASC" ? a.couplet_hindi.localeCompare(b.couplet_hindi, "hi") : b.couplet_hindi.localeCompare(a.couplet_hindi, "hi");
			}
			if (orderBy === "popular") {
				if (a.popular === b.popular) {
					return order === "ASC" ? a.couplet_hindi.localeCompare(b.couplet_hindi, "hi") : b.couplet_hindi.localeCompare(a.couplet_hindi, "hi");
				}
				return order === "ASC" ? (a.popular ? -1 : 1) : a.popular ? 1 : -1;
			}
			const valA = a[orderBy];
			const valB = b[orderBy];
			if (valA < valB) return order === "DESC" ? 1 : -1;
			if (valA > valB) return order === "DESC" ? -1 : 1;
			return 0;
		});
	}

	if (perPage === -1) perPage = data.length;
	if (perPage <= 0 || isNaN(perPage)) perPage = 10;

	const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
	const limit = parseInt(perPage, 10);
	const start = (pageNumber - 1) * limit;
	const end = start + limit;
	const total = data.length;
	const totalPages = Math.ceil(total / limit);

	const paginatedData = pageNumber > totalPages ? [] : data.slice(start, end);

	return {
		couplets: paginatedData,
		total: pagination ? total : paginatedData.length,
		totalPages: pagination ? totalPages : 1,
		page: pageNumber,
		perPage: limit,
		pagination,
	};
}

/**
 * Next.js API handler for couplets.
 * Handles POST requests with filtering and pagination options.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export default function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({
			success: false,
			message: "Method Not Allowed: This API endpoint only accepts POST requests. Please ensure you are using the correct HTTP method.",
		});
	}

	try {
		const { search, tags, popular, orderBy = "default", order = "ASC", page = 1, perPage = 10, pagination = true } = req.body;

		if (orderBy && !["default", "random", "popular", "couplet_english", "couplet_hindi"].includes(orderBy)) {
			return res.status(400).json({
				success: false,
				message:
					"Bad Request: The 'orderBy' value provided is invalid. Accepted values are 'default', 'random', 'popular', 'couplet_english', or 'couplet_hindi'.",
			});
		}

		if (order && !["ASC", "DESC"].includes(order)) {
			return res.status(400).json({
				success: false,
				message: "Bad Request: The 'order' value provided is invalid. Accepted values are 'ASC' (ascending) or 'DESC' (descending).",
			});
		}

		const result = getData({
			search,
			tags,
			popular,
			orderBy,
			order,
			page,
			perPage,
			pagination,
		});

		// Check if the requested page number is valid
		if (result.totalPages > 1 && page > result.totalPages) {
			return res.status(404).json({
				success: false,
				message: "Not Found: The requested page number exceeds the total number of available pages. Please adjust the page number and try again.",
			});
		}

		return res.status(200).json({ success: true, data: result });
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal Server Error: An unexpected error occurred while processing the request. Please check the server logs for more details.",
			error: error.message,
		});
	}
}
