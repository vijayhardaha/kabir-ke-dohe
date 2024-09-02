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
 * @param {string} props.couplet.unique_slug - Unique slug for linking to the couplet.
 * @param {string} props.couplet.couplet_hindi - The Hindi text of the couplet.
 * @returns {JSX.Element} The rendered CoupletActions component.
 */
const CoupletActions = ({ couplet }) => {
	const { unique_slug } = couplet;

	return (
		<Box sx={{ display: "flex", gap: 2, mt: 3, flexDirection: { xs: "column", sm: "row" } }}>
			<Button
				component={Link}
				href={getCoupletLink(unique_slug)}
				variant="contained"
				color="white"
				size="large"
				sx={{ fontWeight: 600, minWidth: 180, minHeight: { sm: 46 } }}
			>
				Read More
			</Button>
			<CoupletShareButton
				couplet={couplet}
				variant="outlined"
				color="white"
				size="large"
				sx={{ fontWeight: 600, minWidth: 180, minHeight: { sm: 46 } }}
			/>
		</Box>
	);
};

CoupletActions.propTypes = {
	couplet: PropTypes.shape({
		unique_slug: PropTypes.string.isRequired,
	}).isRequired,
};

export default CoupletActions;
