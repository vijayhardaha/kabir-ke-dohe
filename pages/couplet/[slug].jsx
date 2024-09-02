import fs from "fs";
import path from "path";

import { useRouter } from "next/router";
import PropTypes from "prop-types";

import CoupletDetails from "@/src/components/couplets/CoupletDetails";
import PageTemplate from "@/src/components/layout/PageTemplate";
import SectionBody from "@/src/components/layout/SectionBody";
import SEO from "@/src/components/seo/SEO";
import { getCoupletLink } from "@/src/utils/seo";

/**
 * Component to display single couplet details.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.couplet - The couplet details object.
 * @returns {JSX.Element}
 */
const CoupletSingle = ({ couplet }) => {
	const router = useRouter();

	if (router.isFallback) {
		return <div>Loading...</div>;
	}

	if (!couplet) {
		return <></>;
	}

	// Extract SEO details dynamically from the couplet data
	const title = `${couplet.couplet_hindi}`;
	const description = couplet.translation_hindi || couplet.translation_english || "Detailed view of the couplet.";
	const keywords = ["couplet", "hindi couplet", "dohe", ...couplet.tags.map((tag) => tag.name)].join(", ");

	return (
		<PageTemplate>
			<SEO title={title} description={description} keywords={keywords} url={getCoupletLink(couplet.unique_slug)} />
			<SectionBody>
				<CoupletDetails couplet={couplet} />
			</SectionBody>
		</PageTemplate>
	);
};

CoupletSingle.propTypes = {
	couplet: PropTypes.shape({
		id: PropTypes.number.isRequired,
		couplet_hindi: PropTypes.string.isRequired,
		couplet_english: PropTypes.string.isRequired,
		translation_hindi: PropTypes.string,
		translation_english: PropTypes.string,
		explanation_hindi: PropTypes.string,
		explanation_english: PropTypes.string,
		unique_slug: PropTypes.string.isRequired,
		tags: PropTypes.arrayOf(
			PropTypes.shape({
				slug: PropTypes.string.isRequired,
				name: PropTypes.string.isRequired,
			})
		).isRequired,
	}),
};

export default CoupletSingle;

/**
 * Get all possible couplet paths for static generation.
 *
 * @returns {Object} Object containing paths and fallback setting.
 */
export async function getStaticPaths() {
	const filePath = path.join(process.cwd(), "data/couplets.json");
	const jsonData = fs.readFileSync(filePath, "utf-8");
	const data = JSON.parse(jsonData);

	// Generate paths for each couplet's unique_slug
	const paths = data.map((couplet) => ({
		params: { slug: couplet.unique_slug },
	}));

	return { paths, fallback: true }; // Enable fallback to handle new slugs
}

/**
 * Fetch couplet details for a given unique_slug.
 *
 * @param {Object} context - Context object containing route parameters.
 * @returns {Object} Props containing couplet data.
 */
export async function getStaticProps({ params }) {
	const { slug } = params;
	const filePath = path.join(process.cwd(), "data/couplets.json");
	const jsonData = fs.readFileSync(filePath, "utf-8");
	const data = JSON.parse(jsonData);

	const couplet = data.find((item) => item.unique_slug === slug);

	if (!couplet) {
		return {
			notFound: true, // Return 404 if the couplet is not found
		};
	}

	return {
		props: {
			couplet,
		},
		revalidate: 10, // Revalidate the page every 10 seconds for ISR
	};
}
