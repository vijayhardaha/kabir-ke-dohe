import { useState } from "react";

import { Box } from "@mui/material";
import PropTypes from "prop-types";

import CoupletActions from "./CoupletActions";
import CoupletExcerpt from "./CoupletExcerpt";
import CoupletFeedbackDialog from "./CoupletFeedbackDialog";
import CoupletHeader from "./CoupletHeader";
import CoupletMeta from "../common/CoupletMeta";

/**
 * Card component displaying a couplet with meta information and actions.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.couplet - The couplet data.
 * @returns {JSX.Element} The rendered CoupletCard component.
 */
const CoupletCard = ({ couplet }) => {
  const [openFeedbackForm, setOpenFeedbackForm] = useState(false);

  const handleOpenFeedbackForm = () => setOpenFeedbackForm(true);
  const handleCloseFeedbackForm = () => setOpenFeedbackForm(false);

  return (
    <>
      <Box
        component="article"
        sx={{
          position: "relative",
          mb: 5,
          pb: 5,
          width: "100%",
          "&::after": {
            content: '""',
            height: "2px",
            width: "100px",
            position: "absolute",
            bottom: 0,
            left: "50%",
            marginLeft: "-50px",
            background: "rgba(0, 0, 0, 0.18)",
          },
        }}
      >
        <CoupletHeader couplet={couplet} />
        <CoupletMeta couplet={couplet} />
        <CoupletExcerpt couplet={couplet} />
        <CoupletActions couplet={couplet} onOpenFeedbackForm={handleOpenFeedbackForm} />
      </Box>

      <CoupletFeedbackDialog open={openFeedbackForm} onClose={handleCloseFeedbackForm} couplet={couplet} />
    </>
  );
};

CoupletCard.propTypes = {
  couplet: PropTypes.shape({
    id: PropTypes.number.isRequired,
    couplet_hindi: PropTypes.string.isRequired,
    translation_english: PropTypes.string,
    translation_hindi: PropTypes.string,
    unique_slug: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
};

export default CoupletCard;
