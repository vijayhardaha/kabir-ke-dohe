import fs from "fs";
import path from "path";

import PropTypes from "prop-types";

import CoupletsList from "@/src/components/couplets/CoupletsList";
import PageTemplate from "@/src/components/layout/PageTemplate";
import SectionBody from "@/src/components/layout/SectionBody";
import SectionHeader from "@/src/components/layout/SectionHeader";
import SEO from "@/src/components/seo/SEO";
import { getTagLink } from "@/src/utils/seo";

/**
 * Page component for displaying couplets by tag.
 *
 * This component renders a page template with a header and a list of couplets filtered by the selected tag.
 *
 * @param {Object} props - Component properties.
 * @param {boolean} props.isValid - Flag indicating if the tag is valid.
 * @param {string} props.tagName - The name of the tag to be displayed on the page.
 * @param {string} props.tagSlug - The slug of the tag used for filtering couplets.
 * @returns {JSX.Element} The rendered TagCouplets page component.
 */
const TagCouplets = ({ isValid, tagName, tagSlug }) => {
	return (
		<PageTemplate>
			<SEO title={`Tag: ${tagName}`} url={getTagLink(tagSlug, true)} />

			<SectionHeader title={`Tag: ${tagName}`} component="h1" />
			<SectionBody>{isValid && <CoupletsList query={{ tags: tagSlug }} />}</SectionBody>
		</PageTemplate>
	);
};

TagCouplets.propTypes = {
	isValid: PropTypes.bool.isRequired,
	tagName: PropTypes.string.isRequired,
	tagSlug: PropTypes.string.isRequired,
};

/**
 * Fetches server-side data for the TagCouplets page.
 *
 * This function validates the tag and determines if the tag is valid.
 *
 * @param {Object} context - The context object containing query parameters.
 * @param {Object} context.query - The query parameters from the URL.
 * @returns {Promise<Object>} The props to be passed to the TagCouplets component.
 */
export async function getServerSideProps(context) {
	const { page, tag } = context.query;

	const filePath = path.join(process.cwd(), "data/tags.json");
	const jsonData = fs.readFileSync(filePath, "utf-8");
	const data = JSON.parse(jsonData);

	let isValidTag = false;
	let tagName = "";
	let tagSlug = "";

	if (tag?.length) {
		const tagObject = data.find((t) => t.slug === tag);

		if (tagObject) {
			isValidTag = true;
			tagName = tagObject.name;
			tagSlug = tagObject.slug;
		}
	}

	let isValidPage = true;

	if (page?.length) {
		const pageNumber = page;

		// Check if pageNumber consists only of digits
		const isNumber = /^\d+$/.test(pageNumber);

		if (!isNumber || parseInt(pageNumber, 10) <= 0) {
			isValidPage = false;
		}
	}

	const isValid = isValidTag && isValidPage;

	if (!isValid) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			isValid,
			tagName,
			tagSlug,
		},
	};
}

export default TagCouplets;
