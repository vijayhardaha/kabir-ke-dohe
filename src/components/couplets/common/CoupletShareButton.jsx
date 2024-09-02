import React, { useState } from "react";

import { Button, Menu, MenuItem } from "@mui/material";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { GiShare } from "react-icons/gi";
import { RiWhatsappFill, RiFileCopyFill, RiTwitterFill } from "react-icons/ri";

import { generateShareMessage } from "@/src/utils/couplets/shareMessage";

const iconMap = {
	whatsapp: <RiWhatsappFill size={20} />,
	twitter: <RiTwitterFill size={20} />,
	copy: <RiFileCopyFill size={20} />,
};

const shareOptions = [
	{
		platform: "whatsapp",
		label: "Share on WhatsApp",
		iconName: "whatsapp",
		color: "#25d366",
	},
	{
		platform: "twitter",
		label: "Share on Twitter",
		iconName: "twitter",
		color: "#1DA1F2",
	},
	{
		platform: "copy",
		label: "Copy to Clipboard",
		iconName: "copy",
		color: "#14171A",
	},
];

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
				{shareOptions.map(({ platform, label, iconName, color }) => (
					<MenuItem key={platform} onClick={() => handleShare(platform)}>
						{React.cloneElement(iconMap[iconName], { color, style: { marginRight: "6px" } })}
						{label}
					</MenuItem>
				))}
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
