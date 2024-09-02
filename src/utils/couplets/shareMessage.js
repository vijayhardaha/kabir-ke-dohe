import { getCoupletLink, getPermalinkWithBase } from "../seo";

/**
 * Generates a share message for a couplet with links to the couplet and the website.
 *
 * @param {Object} couplet - The couplet data.
 * @param {string} couplet.couplet_hindi - The couplet text in Hindi.
 * @param {string} couplet.unique_slug - The unique slug for the couplet.
 * @param {boolean} [long=true] - Determines if the message should include a link to the website.
 * @returns {string} The formatted share message.
 */
export const generateShareMessage = (couplet, long = true) => {
	const { couplet_hindi, unique_slug } = couplet;

	const coupletLink = getCoupletLink(unique_slug, true);
	const websiteLink = getPermalinkWithBase();

	// Message for the couplet with a link to the specific couplet page
	let message = `${couplet_hindi}\n\n— संत कबीर साहेब जी 🔥 🙏`;

	// Append website link if long message is required
	if (long) {
		message += `\n\nDiscover this profound couplet and explore more at ${coupletLink}.\n\nFor even more inspiring couplets and teachings, visit our website: ${websiteLink} 🌟`;
	} else {
		message += `\n\nDiscover this profound couplet at ${coupletLink}.`;
	}

	return message;
};
