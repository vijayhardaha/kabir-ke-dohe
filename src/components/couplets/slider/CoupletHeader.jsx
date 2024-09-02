import { Typography } from "@mui/material";
import PropTypes from "prop-types";

import { nl2br } from "@/src/utils/formatting";

/**
 * Component displaying the couplet header with title.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.couplet - The couplet data.
 * @param {string} props.couplet.couplet_hindi - The Hindi text of the couplet.
 * @returns {JSX.Element} The rendered CoupletHeader component.
 */
const CoupletHeader = ({ couplet }) => {
	const { couplet_hindi } = couplet;

	return (
		<Typography
			component="h2"
			variant="h1"
			sx={{
				mb: 2,
				fontSize: { md: "calc(1.5rem + 1.5vw)" },
			}}
		>
			<Typography component="span" variant="dohaTitle">
				{nl2br(couplet_hindi)}
			</Typography>
		</Typography>
	);
};

CoupletHeader.propTypes = {
	couplet: PropTypes.shape({
		couplet_hindi: PropTypes.string.isRequired,
	}).isRequired,
};

export default CoupletHeader;
