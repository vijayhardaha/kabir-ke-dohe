import { submitGoogleSheetData } from "@/src/api/submitGoogleSheetData";

/**
 * API route handler for submitting feedback form data to Google Sheets.
 *
 * @param {import('next').NextApiRequest} req - The HTTP request object.
 * @param {import('next').NextApiResponse} res - The HTTP response object.
 */
export default async function handler(req, res) {
	if (req.method === "POST") {
		const { name, message, coupletId, couplet } = req.body;

		const result = await submitGoogleSheetData("feedback-submissions", [coupletId, couplet, name, message]);

		if (result.success) {
			res.status(200).json({ message: "Feedback submitted successfully." });
		} else {
			res.status(500).json({ error: result.error || "Failed to submit feedback." });
		}
	} else {
		res.setHeader("Allow", ["POST"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
