import { Box, Button } from "@mui/material";
import Link from "next/link";
import PropTypes from "prop-types";

import CoupletShareButton from "../common/CoupletShareButton";
import { getCoupletLink } from "@/src/utils/seo";

/**
 * Component displaying action buttons for the couplet.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.couplet - The couplet data.
 * @param {Function} props.onOpenFeedbackForm - Handler to open the feedback form.
 * @returns {JSX.Element} The rendered CoupletActions component.
 */
const CoupletActions = ({ couplet, onOpenFeedbackForm }) => {
	const { unique_slug } = couplet;

	return (
		<Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
			<Button component={Link} href={getCoupletLink(unique_slug)} variant="contained" color="primary" size="medium">
				Read More
			</Button>
			<CoupletShareButton couplet={couplet} variant="outlined" color="dark" size="medium" />
			<Button variant="contained" color="dark" size="medium" onClick={onOpenFeedbackForm}>
				Submit Feedback
			</Button>
		</Box>
	);
};

CoupletActions.propTypes = {
	couplet: PropTypes.shape({
		unique_slug: PropTypes.string.isRequired,
	}).isRequired,
	onOpenFeedbackForm: PropTypes.func.isRequired,
};

export default CoupletActions;
