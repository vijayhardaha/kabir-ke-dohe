import { Typography } from "@mui/material";
import PropTypes from "prop-types";

import { nl2br } from "@/src/utils/formatting";

/**
 * Component displaying the header of the couplet.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.couplet - The couplet data.
 * @param {string} props.couplet.couplet_hindi - Hindi text of the couplet.
 * @returns {JSX.Element} The rendered CoupletHeader component.
 */
const CoupletHeader = ({ couplet }) => {
  const { couplet_hindi } = couplet;

  return (
    <Typography
      variant="h1"
      sx={{
        mb: 1,
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
