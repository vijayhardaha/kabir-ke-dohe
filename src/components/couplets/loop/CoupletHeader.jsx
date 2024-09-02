import { Typography } from "@mui/material";
import PropTypes from "prop-types";

import Link from "../../common/Link";
import { nl2br } from "@/src/utils/formatting";
import { getCoupletLink } from "@/src/utils/seo";

/**
 * Component displaying the couplet header with title and link.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.couplet - The couplet data.
 * @param {string} props.couplet.couplet_hindi - Hindi text of the couplet.
 * @param {string} props.couplet.unique_slug - Unique slug for linking to the couplet.
 * @returns {JSX.Element} The rendered CoupletHeader component.
 */
const CoupletHeader = ({ couplet }) => {
	const { couplet_hindi, unique_slug } = couplet;

	return (
		<Typography
			component="h2"
			variant="h1"
			sx={{
				mb: 1,
			}}
		>
			<Typography component={Link} variant="dohaTitle" href={getCoupletLink(unique_slug)}>
				{nl2br(couplet_hindi)}
			</Typography>
		</Typography>
	);
};

CoupletHeader.propTypes = {
	couplet: PropTypes.shape({
		couplet_hindi: PropTypes.string.isRequired,
		unique_slug: PropTypes.string.isRequired,
	}).isRequired,
};

export default CoupletHeader;
