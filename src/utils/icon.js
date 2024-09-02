import { CiHashtag } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import { FaTwitter, FaLinkedin, FaFacebookSquare, FaGithub, FaInstagram, FaYoutube, FaEnvelope, FaReddit, FaCheck, FaLink } from "react-icons/fa";
import { FaWordpress } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa";
import { FiCopy } from "react-icons/fi";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { IoMdGlobe } from "react-icons/io";
import { MdCode, MdShare } from "react-icons/md";
import { RiMenu3Line } from "react-icons/ri";
import { WiDaySunny } from "react-icons/wi";

export default function getIcon({ icon, size = "24px", color }) {
	const iconName = icon.toUpperCase();

	switch (iconName) {
		case "SEARCH":
			return <CiSearch size={size} color={color} aria-label="Search Icon" />;
		case "MENU":
			return <RiMenu3Line size={size} color={color} aria-label="Mobile Menu Open Icon" />;
		case "CHEVRONDOWN":
			return <FiChevronDown size={size} color={color} aria-label="Chevron Down Icon" />;
		case "CHEVRONUP":
			return <FiChevronUp size={size} color={color} aria-label="Chevron UP Icon" />;
		case "LINK":
			return <FaLink size={size} color={color} aria-label="Link Icon" />;
		case "CLOSE":
			return <IoMdClose size={size} color={color} aria-label="Mobile Menu Close Icon" />;
		case "CODE":
			return <MdCode size={size} color={color} aria-label="Code symbols" />;
		case "HASH":
			return <CiHashtag size={size} color={color} aria-label="Tags icon" />;
		case "SUN":
			return <WiDaySunny size={size} color={color} aria-label="Sun icon" />;
		case "SOCIALS":
			return <MdShare size={size} color={color} aria-label="Social media share icon" />;
		case "COPY":
			return <FiCopy size={size} color={color} aria-label="Copy icon" />;
		case "TICK":
			return <FaCheck size={size} color={color} aria-label="Tick icon" />;
		case "TWITTER":
			return <FaTwitter size={size} color={color} aria-label="Twitter logo" />;
		case "LINKEDIN":
			return <FaLinkedin size={size} color={color} aria-label="LinkedIn logo" />;
		case "EMAIL":
			return <FaEnvelope size={size} color={color} aria-label="Envelope icon" />;
		case "FACEBOOK":
			return <FaFacebookSquare size={size} color={color} aria-label="Facebook logo" />;
		case "GITHUB":
			return <FaGithub size={size} color={color} aria-label="GitHub logo" />;
		case "INSTAGRAM":
			return <FaInstagram size={size} color={color} aria-label="Instagram logo" />;
		case "YOUTUBE":
			return <FaYoutube size={size} color={color} aria-label="YouTube logo" />;
		case "REDDIT":
			return <FaReddit size={size} color={color} aria-label="Reddit logo" />;
		case "WORDPRESS":
			return <FaWordpress size={size} color={color} aria-label="WordPress logo" />;
		case "WEBSITE":
			return <IoMdGlobe size={size} color={color} aria-label="Globe logo" />;
		case "DISCORD":
			return <FaDiscord size={size} color={color} aria-label="Discord logo" />;
		default:
			return null;
	}
}
