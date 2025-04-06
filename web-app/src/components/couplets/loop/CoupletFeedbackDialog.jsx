import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import PropTypes from "prop-types";

import CoupletFeedbackForm from "../common/CoupletFeedbackForm";
import getIcon from "@/src/utils/icon";

/**
 * Component displaying the feedback dialog.
 *
 * @param {Object} props - Component properties.
 * @param {boolean} props.open - Whether the dialog is open.
 * @param {Function} props.onClose - Handler to close the dialog.
 * @param {Object} props.couplet - The couplet data.
 * @param {string} props.couplet.id - The couplet ID.
 * @param {string} props.couplet.couplet_hindi - Hindi text of the couplet.
 * @returns {JSX.Element} The rendered CoupletFeedbackDialog component.
 */
const CoupletFeedbackDialog = ({ open, onClose, couplet }) => {
  const { id, couplet_hindi } = couplet;

  return (
    <Dialog
      role="dialog"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      sx={{ borderRadius: 0 }}
    >
      <DialogTitle
        id="dialog-title"
        sx={{
          borderBottom: "1px solid rgba(0, 0, 0, 0.13)",
          mb: 1,
          position: "relative",
        }}
      >
        Submit Feedback
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          {getIcon({ icon: "close" })}
        </IconButton>
      </DialogTitle>
      <DialogContent id="dialog-description">
        <CoupletFeedbackForm coupletId={id} couplet={couplet_hindi} />
      </DialogContent>
    </Dialog>
  );
};

CoupletFeedbackDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  couplet: PropTypes.shape({
    id: PropTypes.number.isRequired,
    couplet_hindi: PropTypes.string.isRequired,
  }).isRequired,
};

export default CoupletFeedbackDialog;
