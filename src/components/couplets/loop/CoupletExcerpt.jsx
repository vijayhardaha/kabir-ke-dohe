import { Box } from "@mui/material";
import PropTypes from "prop-types";

import { autop } from "@/src/utils/formatting";

/**
 * Component to display excerpt of a couplet including translations.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.couplet - The couplet data.
 * @param {string} props.couplet.translation_hindi - Hindi translation of the couplet.
 * @param {string} props.couplet.translation_english - English translation of the couplet.
 * @returns {JSX.Element} The rendered CoupletExcerpt component.
 */
const CoupletExcerpt = ({ couplet }) => {
	const { translation_hindi, translation_english } = couplet;

	return (
		<Box
			component="div"
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: 0.5,
			}}
		>
			{translation_hindi && autop(`<strong>अर्थ:</strong> ${translation_hindi}`, { paragraph: false })}
			{translation_english && autop(`<strong>Meaning:</strong> ${translation_english}`, { paragraph: false })}
		</Box>
	);
};

CoupletExcerpt.propTypes = {
	couplet: PropTypes.shape({
		translation_hindi: PropTypes.string,
		translation_english: PropTypes.string,
	}).isRequired,
};

export default CoupletExcerpt;
