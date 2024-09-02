import { Box, Paper } from "@mui/material";
import { styled } from "@mui/system";

import Link from "@/src/components/common/Link";

/**
 * Styles for the navigation item container.
 *
 * @type {Object}
 */
export const NavItem = styled(Box)({
	position: "relative",
	display: "inline-block",
	borderRadius: 0,
	"&:hover": {
		backgroundColor: "rgba(0, 0, 0, 0.15)",
		"& > .dropdown": {
			display: "block",
			opacity: "1",
			pointerEvents: "auto",
			visibility: "visible",
			transform: "translateX(0) translateY(-3px) scale(1)",
		},
	},
});

/**
 * Styles for the navigation link.
 *
 * @type {Object}
 */
export const NavLink = styled(Link)({
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	gap: 0.125,
	padding: "0.25rem 1rem",
	borderRadius: 0,
	color: "inherit",
	fontSize: "0.825rem",
	fontWeight: 600,
	textDecoration: "none",
	textTransform: "uppercase",
	minWidth: 0,
	minHeight: 40,
	"&:hover": {
		textDecoration: "none",
		boxShadow: "none",
	},
});

/**
 * Styles for the submenu dropdown container
 *
 * @type {Object}
 */
export const SubmenuDropDown = styled(Box)({
	opacity: 0,
	visibility: "hidden",
	position: "absolute",
	zIndex: "999",
	top: "100%",
	pointerEvents: "none",
	minWidth: 150,
	float: "none",
	padding: "0",
	transition: "all 0.25s ease-in-out",
	right: "0",
	textAlign: "left",
});

/**
 * Styles for the submenu.
 *
 * @type {Object}
 */
export const Submenu = styled((props) => <Paper elevation={2} {...props} />)({
	listStyle: "none",
	margin: 0,
	padding: "0.5rem 0",
	position: "relative",
	zIndex: 1,
	backgroundColor: "#fff",
	borderRadius: 0,
});

/**
 * Styles for the submenu items.
 *
 * @param {Object} theme - The MUI theme object.
 * @returns {Object} The styles for the submenu items.
 */
export const SubmenuItem = styled("li")(({ theme }) => ({
	margin: 0,
	padding: 0,
	"&  a": {
		display: "block",
		padding: "0.375rem 1.25rem",
		color: "#444",
		whiteSpace: "nowrap",
		textDecoration: "none",
		transition: "all .25s ease-in-out",
		fontSize: "0.9em",
		fontWeight: 500,
		"&:hover": {
			color: theme.palette.primary.main,
			textDecoration: "none",
		},
	},
}));

// Debounce function to limit the rate at which a function can fire
export const debounce = (func, wait) => {
	let timeout;
	return (...args) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), wait);
	};
};
