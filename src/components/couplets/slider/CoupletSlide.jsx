import { Box } from "@mui/material";
import PropTypes from "prop-types";

import CoupletActions from "./CoupletActions";
import CoupletHeader from "./CoupletHeader";
import CoupletMeta from "../common/CoupletMeta";

/**
 * Displays a couplet with its meta information and actions.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.couplet - The couplet data.
 * @param {string} props.couplet.couplet_hindi - The Hindi text of the couplet.
 * @param {Array} props.couplet.tags - List of tags associated with the couplet.
 * @param {string} props.couplet.translation_english - The English translation of the couplet.
 * @param {string} props.couplet.translation_hindi - The Hindi translation of the couplet.
 * @param {string} props.couplet.unique_slug - Unique slug for linking to the couplet.
 * @returns {JSX.Element} The rendered CoupletSlide component.
 */
const CoupletSlide = ({ couplet }) => {
	return (
		<Box
			component="article"
			sx={{
				position: "relative",
				width: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			<CoupletHeader couplet={couplet} />
			<CoupletMeta couplet={couplet} />
			<CoupletActions couplet={couplet} />
		</Box>
	);
};

CoupletSlide.propTypes = {
	couplet: PropTypes.shape({
		couplet_hindi: PropTypes.string.isRequired,
		unique_slug: PropTypes.string.isRequired,
		tags: PropTypes.arrayOf(
			PropTypes.shape({
				name: PropTypes.string.isRequired,
				slug: PropTypes.string.isRequired,
			})
		),
	}).isRequired,
};

export default CoupletSlide;
