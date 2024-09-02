import { getCoupletLink } from "../seo";

/**
 * Generates a share message for a couplet with links to the couplet and the website.
 *
 * @param {Object} couplet - The couplet data.
 * @param {string} couplet.couplet_hindi - The couplet text in Hindi.
 * @param {string} couplet.unique_slug - The unique slug for the couplet.
 * @returns {string} The formatted share message.
 */
export const generateShareMessage = (couplet) => {
	const { couplet_hindi, unique_slug } = couplet;

	const coupletLink = getCoupletLink(unique_slug, true);

	// Message for the couplet with a link to the specific couplet page
	let message = couplet_hindi;

	message += `\n\n— संत कबीर साहेब`;
	message += `\n\nDiscover this profound couplet at ${coupletLink}`;

	return message;
};
