import { createTheme } from "@mui/material/styles";
import { Jost, Domine, Hind } from "next/font/google";

import { createResponsiveFontSize } from "@/src/utils/theme/utils";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const domine = Domine({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const hind = Hind({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

const sansSerifFamily = { fontFamily: `${jost.style.fontFamily}, ${hind.style.fontFamily}, sans-serif` };
const serifFamily = { fontFamily: `${domine.style.fontFamily}, ${hind.style.fontFamily}, serif, sans-serif` };
const devnagiriFamily = { fontFamily: `${hind.style.fontFamily}, sans-serif` };

const primaryColor = "#c62641";

const commonHeadingConfig = {
	...sansSerifFamily,
	fontWeight: 700,
	lineHeight: 1.375,
	marginBottom: "2rem",
	marginTop: 0,
};

// Define base font sizes for headings
const headingFonts = {
	h1: "2.25rem",
	h2: "2rem",
	h3: "1.75rem",
	h4: "1.5rem",
	h5: "1.25rem",
	h6: "1rem",
};

const theme = createTheme({
	cssVariables: true,
	breakpoints: {
		values: {
			xs: 0, // Extra small devices (portrait phones, less than 576px)
			sm: 576, // Small devices (landscape phones, 576px and up)
			md: 768, // Medium devices (tablets, 768px and up)
			lg: 992, // Large devices (desktops, 992px and up)
			xl: 1200, // Extra large devices (large desktops, 1200px and up)
			xxl: 1400, // Extra extra large devices (larger desktops, 1400px and up)
		},
	},
	palette: {
		primary: {
			main: "#c62641",
			contrastText: "#ffffff",
		},
		white: {
			main: "#ffffff",
			contrastText: "#333333",
		},
		dark: {
			main: "#333333",
			contrastText: "#ffffff",
		},
		background: {
			default: "#f8f8f8",
		},
		text: {
			primary: "#444444",
			secondary: "#888888",
		},
	},
	typography: {
		...serifFamily,
		fontSize: 16,
		h1: {
			...commonHeadingConfig,
			...createResponsiveFontSize(headingFonts.h1),
		},
		h2: {
			...commonHeadingConfig,
			...createResponsiveFontSize(headingFonts.h2),
		},
		h3: {
			...commonHeadingConfig,
			...createResponsiveFontSize(headingFonts.h3),
		},
		h4: {
			...commonHeadingConfig,
			...createResponsiveFontSize(headingFonts.h4),
		},
		h5: {
			...commonHeadingConfig,
			...createResponsiveFontSize(headingFonts.h5),
		},
		h6: {
			...commonHeadingConfig,
			...createResponsiveFontSize(headingFonts.h6),
		},
		img: {
			height: "auto",
			maxWidth: "100%",
			verticalAlign: "middle",
			borderStyle: "none",
		},
		sans: {
			...sansSerifFamily,
		},
		serif: {
			...serifFamily,
		},
		devnagiri: {
			...devnagiriFamily,
		},
		dohaTitle: {
			...devnagiriFamily,
			"&.MuiLink-root": {
				color: "#333333",
				textDecoration: "none",
				"&:hover": { color: primaryColor, textDecoration: "underline" },
			},
		},
		body1: {
			fontSize: "1rem",
			lineHeight: 1.8,
			letterSpacing: 0,
		},
		body2: {
			fontSize: "0.875rem",
			lineHeight: 1.8,
			letterSpacing: 0,
		},
	},
	components: {
		MuiButtonBase: {
			defaultProps: {
				disableRipple: true,
			},
		},
		MuiButtonGroup: {
			defaultProps: {
				disableRipple: true,
			},
		},
		MuiContainer: {
			defaultProps: {
				maxWidth: "xl",
			},
		},
		MuiButton: {
			styleOverrides: {
				root: ({ ownerState, theme }) => ({
					...sansSerifFamily,
					borderRadius: 0,
					fontSize: "0.825rem",
					fontWeight: 500,
					textTransform: "none",
					...((ownerState.variant === "contained" || ownerState.variant === "outlined") && {
						boxShadow: "none",
					}),
					...(ownerState.variant === "contained" && {
						backgroundColor: theme.palette[ownerState.color]?.main || "inherit",
						color: theme.palette[ownerState.color]?.contrastText || "inherit",
					}),
					...(ownerState.variant === "outlined" && {
						borderColor: theme.palette[ownerState.color]?.main || "inherit",
					}),
					"&:hover": {
						...((ownerState.variant === "contained" || ownerState.variant === "outlined") && {
							boxShadow: "0 5px 15px 0 rgba(1,1,1,0.15)",
						}),
						...(ownerState.variant === "contained" && {
							backgroundColor: theme.palette[ownerState.color]?.main || "inherit",
							color: theme.palette[ownerState.color]?.contrastText || "inherit",
						}),
					},
				}),
			},
		},
		MuiLink: {
			styleOverrides: {
				root: {
					textDecoration: "underline",
					transition: "all 0.15s linear",
					"&:hover": {
						textDecoration: "none",
					},
				},
			},
		},
		MuiSelect: {
			defaultProps: {
				variant: "outlined",
				size: "small",
			},
			styleOverrides: {
				root: {
					...sansSerifFamily,
					borderRadius: 0,
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					...sansSerifFamily,
					"& .MuiSelect-select": {
						fontSize: "0.875rem",
						lineHeight: "1.5875em",
					},
				},
			},
		},
		MuiInputLabel: {
			styleOverrides: {
				root: {
					...sansSerifFamily,
					fontSize: "0.875rem",
					lineHeight: "1.5875em",
				},
			},
		},
		MuiTextField: {
			defaultProps: {
				variant: "outlined",
				size: "small",
			},
			styleOverrides: {
				root: {
					...sansSerifFamily,
					"& .MuiInputBase-root": {
						borderRadius: 0,
					},
				},
			},
		},
		MuiPopover: {
			styleOverrides: {
				root: {
					zIndex: 999999,
				},
			},
		},
		MuiPaginationItem: {
			styleOverrides: {
				root: {
					...sansSerifFamily,
					fontSize: "0.75rem",
					fontWeight: 600,
					height: 40,
					minWidth: 40,
					display: "inline-flex",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "#ffffff",
					color: "#333333",
					borderColor: "#333333",
					borderRadius: 0,
					lineHeight: 1,
					transition: "background-color 0.3s, color 0.3s, border-color 0.3s",
					"&.Mui-selected:hover, &:hover": {
						backgroundColor: "#333333",
						color: "#ffffff",
						borderColor: "#333333",
					},
					"&.Mui-selected": {
						backgroundColor: "#333333",
						color: "#ffffff",
						borderColor: "#333333",
					},
				},
			},
		},
		MuiMenu: {
			styleOverrides: {
				root: {
					"& .MuiPaper-root": {
						borderRadius: 0,
					},
				},
			},
		},
		MuiList: {
			styleOverrides: {
				root: {
					padding: 0,
				},
			},
		},
		MuiMenuItem: {
			styleOverrides: {
				root: {
					paddingTop: "8px",
					paddingBottom: "8px",
					fontSize: "0.85rem",
					fontWeight: 400,
					...sansSerifFamily,
					"&:hover": {
						background: "rgba(0,0,0,0.1)",
					},
					"& .MuiListItemIcon-root": {
						minWidth: 26,
					},
				},
			},
		},
		MuiListItemText: {
			styleOverrides: {
				root: {
					"& .MuiTypography-root": {
						...sansSerifFamily,
						fontSize: "0.85rem",
						fontWeight: 400,
					},
				},
			},
		},
		MuiAlert: {
			defaultProps: {
				variant: "filled",
			},
			styleOverrides: {
				root: {
					borderRadius: 0,
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					borderRadius: 0,
				},
			},
		},
	},
});

export default theme;
