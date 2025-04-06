import { Box, Typography, Button, Divider } from "@mui/material";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { RiTwitterFill, RiWhatsappFill, RiFileCopyFill } from "react-icons/ri";
import tinycolor from "tinycolor2";

import { generateShareMessage } from "@/src/utils/couplets/shareMessage";

/**
 * ShareButton component for sharing links on social media.
 *
 * @param {Object} props - Component props.
 * @param {string} props.href - URL to share.
 * @param {string} props.ariaLabel - Accessibility label for the button.
 * @param {string} props.backgroundColor - Background color for the button.
 * @param {React.ReactNode} props.icon - Icon to display inside the button.
 * @param {Function} [props.onClick] - Optional click handler for the button.
 * @returns {JSX.Element} The rendered ShareButton component.
 */
const ShareButton = ({ href, ariaLabel, backgroundColor, icon, onClick }) => {
  const getHoverColor = (color, isDark) => {
    const baseColor = tinycolor(color);
    return isDark ? baseColor.darken(10).toString() : baseColor.lighten(10).toString();
  };

  const hoverColor = getHoverColor(backgroundColor, true);

  return (
    <Button
      variant="outlined"
      color="primary"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      sx={{
        flex: 1,
        borderColor: backgroundColor,
        backgroundColor: backgroundColor,
        color: "#ffffff",
        "&:hover": {
          borderColor: hoverColor,
          backgroundColor: hoverColor,
        },
        px: 2,
        py: 1,
      }}
      onClick={onClick}
    >
      {icon}
    </Button>
  );
};

/**
 * Component for sharing a couplet via Twitter, WhatsApp, or copying to clipboard.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.couplet - The couplet data.
 * @param {string} props.couplet_hindi - The couplet text in Hindi.
 * @returns {JSX.Element} The rendered component.
 */
const CoupletShare = ({ couplet }) => {
  const shareMessage = generateShareMessage(couplet);

  return (
    <Box
      component="div"
      sx={{
        mt: 4,
        mb: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 1,
        }}
      >
        Share this inspiring couplet with your friends:
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <ShareButton
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`}
          ariaLabel="Share on Twitter"
          backgroundColor="#1DA1F2"
          icon={<RiTwitterFill size={20} color="#ffffff" />}
        />
        <ShareButton
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`}
          ariaLabel="Share on WhatsApp"
          backgroundColor="#25d366"
          icon={<RiWhatsappFill size={20} color="#ffffff" />}
        />
        <ShareButton
          ariaLabel="Copy to clipboard"
          backgroundColor="#505050"
          icon={<RiFileCopyFill size={20} color="#ffffff" />}
          onClick={() => {
            toast.success("Copied to clipboard!");
            navigator.clipboard.writeText(shareMessage);
          }}
        />
      </Box>
      <Divider sx={{ my: 3 }} />
    </Box>
  );
};

ShareButton.propTypes = {
  href: PropTypes.string,
  ariaLabel: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

CoupletShare.propTypes = {
  couplet: PropTypes.shape({
    couplet_hindi: PropTypes.string.isRequired,
    unique_slug: PropTypes.string.isRequired,
  }).isRequired,
};

export default CoupletShare;
