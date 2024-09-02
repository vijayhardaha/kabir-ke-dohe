import { Box } from "@mui/material";
import PropTypes from "prop-types";

import CoupletMeta from "./common/CoupletMeta";
import CoupletContent from "./single/CoupletContent";
import CoupletFeedback from "./single/CoupletFeedback";
import CoupletHeader from "./single/CoupletHeader";
import CoupletShare from "./single/CoupletShare";

/**
 * Card component displaying a couplet with meta information and actions.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.couplet - The couplet data.
 * @param {string} props.couplet.couplet_hindi - Hindi text of the couplet.
 * @param {Array} props.couplet.tags - List of tags associated with the couplet.
 * @param {string} props.couplet.translation_english - English translation of the couplet.
 * @param {string} props.couplet.translation_hindi - Hindi translation of the couplet.
 * @param {string} props.couplet.explanation_hindi - Explanation of the couplet in Hindi.
 * @param {string} props.couplet.unique_slug - Unique slug for linking to the couplet.
 * @returns {JSX.Element} The rendered CoupletDetails component.
 */
const CoupletDetails = ({ couplet }) => (
	<Box component="article">
		<CoupletHeader couplet={couplet} />
		<CoupletMeta couplet={couplet} />
		<CoupletContent couplet={couplet} />
		<CoupletShare couplet={couplet} />
		<CoupletFeedback couplet={couplet} />
	</Box>
);

CoupletDetails.propTypes = {
	couplet: PropTypes.shape({
		id: PropTypes.number.isRequired,
		couplet_hindi: PropTypes.string.isRequired,
		translation_english: PropTypes.string,
		translation_hindi: PropTypes.string,
		explanation_hindi: PropTypes.string,
		unique_slug: PropTypes.string.isRequired,
		tags: PropTypes.arrayOf(
			PropTypes.shape({
				name: PropTypes.string.isRequired,
				slug: PropTypes.string.isRequired,
			})
		),
	}).isRequired,
};

export default CoupletDetails;
