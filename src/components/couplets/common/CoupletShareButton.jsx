import React, { useState } from "react";

import { Button, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { GiShare } from "react-icons/gi";
import { RiWhatsappFill, RiFileCopyFill, RiTwitterFill } from "react-icons/ri";

import { generateShareMessage } from "@/src/utils/couplets/shareMessage";

/**
 * CoupletShareButton component to share the couplet text on social media.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.couplet - The couplet data.
 * @param {string} props.couplet.couplet_hindi - The couplet text in Hindi.
 * @param {string} props.couplet.unique_slug - The unique slug for the couplet.
 * @param {Object} [props] - Additional props to be passed to the Button component.
 * @returns {JSX.Element} The rendered CoupletShareButton component.
 */
const CoupletShareButton = ({ couplet, ...props }) => {
	const [anchorEl, setAnchorEl] = useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleShare = (platform) => {
		let url = "";

		const shareMessage = generateShareMessage(couplet);
		const twitterShareMessage = generateShareMessage(couplet, false);

		if (platform === "whatsapp") {
			url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
		} else if (platform === "twitter") {
			url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterShareMessage)}`;
		} else if (platform === "copy") {
			toast.success("Copied to clipboard!");
			navigator.clipboard.writeText(shareMessage);
		} else {
			return;
		}

		if (platform !== "copy") {
			window.open(url, "_blank");
		}

		handleClose();
	};

	return (
		<>
			<Button startIcon={<GiShare />} onClick={handleClick} {...props}>
				Share
			</Button>
			<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} disableScrollLock={true}>
				<MenuItem onClick={() => handleShare("whatsapp")}>
					<ListItemIcon>
						<RiWhatsappFill size={20} color="#25d366" />
					</ListItemIcon>
					<ListItemText primary="Share on WhatsApp" />
				</MenuItem>
				<MenuItem onClick={() => handleShare("twitter")}>
					<ListItemIcon>
						<RiTwitterFill size={20} color="#1DA1F2" />
					</ListItemIcon>
					<ListItemText primary="Share on Twitter" />
				</MenuItem>
				<MenuItem onClick={() => handleShare("copy")}>
					<ListItemIcon>
						<RiFileCopyFill size={20} color="#14171A" />
					</ListItemIcon>
					<ListItemText primary="Copy to Clipboard" />
				</MenuItem>
			</Menu>
		</>
	);
};

CoupletShareButton.propTypes = {
	couplet: PropTypes.shape({
		couplet_hindi: PropTypes.string.isRequired,
		unique_slug: PropTypes.string.isRequired,
	}).isRequired,
	props: PropTypes.object,
};

export default CoupletShareButton;
