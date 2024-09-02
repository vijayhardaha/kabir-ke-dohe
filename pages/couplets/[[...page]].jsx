import PropTypes from "prop-types";

import CoupletsList from "@/src/components/couplets/CoupletsList";
import PageTemplate from "@/src/components/layout/PageTemplate";
import SectionBody from "@/src/components/layout/SectionBody";
import SectionHeader from "@/src/components/layout/SectionHeader";
import SEO from "@/src/components/seo/SEO";
import { PAGES_SEO_CONFIG } from "@/src/constants/seo";
import { getPermalinkWithBase } from "@/src/utils/seo";

/**
 * Page component for displaying popular couplets.
 *
 * This component renders a page template with a header and a list of popular couplets.
 *
 * @param {Object} props - Component properties.
 * @param {boolean} props.isValidPage - Flag indicating if the page number is valid.
 * @returns {JSX.Element} The rendered Couplets page component.
 */
const Couplets = ({ isValidPage }) => {
	const { title, description, keywords } = PAGES_SEO_CONFIG.popular;

	return (
		<PageTemplate>
			<SEO title={title} description={description} keywords={keywords} url={getPermalinkWithBase("popular")} />

			<SectionHeader title="Kabir Ke Dohe" component="h1" />
			<SectionBody>{isValidPage && <CoupletsList />}</SectionBody>
		</PageTemplate>
	);
};

Couplets.propTypes = {
	isValidPage: PropTypes.bool.isRequired,
};

/**
 * Fetches server-side data for the Couplets page.
 *
 * This function validates the page number and determines if the page is valid.
 *
 * @param {Object} context - The context object containing query parameters.
 * @param {Object} context.query - The query parameters from the URL.
 * @returns {Promise<Object>} The props to be passed to the Couplets component.
 */
export async function getServerSideProps(context) {
	const { page } = context.query;
	let isValidPage = true;

	if (page?.length) {
		const pageNumber = page[0];
		const isNumber = /^\d+$/.test(pageNumber);

		if (!isNumber || parseInt(pageNumber, 10) <= 0) {
			isValidPage = false;
		}
	}

	if (!isValidPage) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			isValidPage,
		},
	};
}

export default Couplets;
