import { Box, Link as MuiLink } from "@mui/material";
import NextLink from "next/link";
import PropTypes from "prop-types";
import { LiaExternalLinkAltSolid } from "react-icons/lia";

/**
 * A component that renders a link with specific styling and attributes.
 *
 * This component renders either a Material-UI `Link` or a Next.js `Link` based on the
 * URL provided. It also handles special cases like `#` and `#about`.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content of the link.
 * @param {string} props.href - The URL for the link.
 * @param {boolean} [props.showExternalIcon=false] - Whether to show the external link icon.
 * @param {Object} [props.props] - Additional props to pass to the Link component.
 *
 * @returns {React.Element} The rendered link component.
 */
const Link = ({ children, href, showExternalIcon = false, ...props }) => {
	const isExternal = href && (href.startsWith("http://") || href.startsWith("https://"));
	const isInternal = href && href.startsWith("/");
	const isHash = href === "#";

	const icon = isExternal && showExternalIcon ? <LiaExternalLinkAltSolid size={14} /> : null;

	if (isHash) {
		const handleClick = (event) => {
			event.preventDefault();
		};

		return (
			<MuiLink href={href} onClick={handleClick} {...props}>
				{children}
			</MuiLink>
		);
	}

	if (isInternal) {
		return (
			<MuiLink component={NextLink} href={href} {...props}>
				{children}
			</MuiLink>
		);
	}

	if (!showExternalIcon) {
		return (
			<MuiLink href={href} target="_blank" rel="noopener noreferrer" {...props}>
				{children}
			</MuiLink>
		);
	}

	return (
		<Box component="span" display="inline-flex" alignItems="center" gap={0.25}>
			<MuiLink href={href} target="_blank" rel="noopener noreferrer" {...props}>
				{children}
			</MuiLink>
			{icon}
		</Box>
	);
};

Link.propTypes = {
	children: PropTypes.node.isRequired,
	href: PropTypes.string.isRequired,
	showExternalIcon: PropTypes.bool,
	props: PropTypes.object,
};

export default Link;
