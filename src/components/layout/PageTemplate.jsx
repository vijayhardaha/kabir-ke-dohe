import React, { useEffect, useState } from "react";

import { Box, Container } from "@mui/material";
import PropTypes from "prop-types";

import Footer from "./Footer";
import Header from "./Header";
import { useLoader } from "../hooks/LoaderContext";

/**
 * Renders a full-width cover section with dynamic height and background color.
 *
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} [props.children] - The content to be displayed within the cover section.
 * @returns {JSX.Element} The rendered Cover component.
 */
const Cover = ({ children = null }) => {
	const defaultDesktopHeight = 210;
	const defaultMobileHeight = 70;
	const { loading } = useLoader();
	const [coverHeight, setCoverHeight] = useState(defaultDesktopHeight);

	useEffect(() => {
		if (loading) {
			return;
		}

		const calculateCoverHeight = () => {
			const coverElements = document.querySelectorAll(".main-cover");
			if (coverElements.length === 0) return;

			const hasContent = Array.from(coverElements).some((element) => element.children.length > 0);
			const isMobile = window.innerWidth < 768;
			if (!hasContent) {
				setCoverHeight(isMobile ? defaultMobileHeight : defaultDesktopHeight);
				return;
			}

			const mainHeight = isMobile ? "65vh" : "85vh";
			const sectionElement = document.querySelector(".main-section:first-of-type");
			const sectionTop = Math.abs(parseInt(getComputedStyle(sectionElement)?.top, 10)) || 0;

			const headerElement = document.getElementById("site-header");
			const headerHeight = headerElement?.offsetHeight || 0;

			let itemHeight = `calc(${mainHeight} - ${sectionTop}px)`;

			document.querySelectorAll(".slider-item").forEach((element) => {
				if (element) {
					element.style.height = itemHeight;
					element.style.paddingTop = `${headerHeight}px`;
					element.style.paddingBottom = `${headerHeight}px`;
				}
			});

			const mainCoverElement = document.querySelector(".main-cover");
			if (mainCoverElement) {
				mainCoverElement.style.height = mainHeight;
			}

			setCoverHeight(mainHeight);
		};

		setTimeout(() => {
			calculateCoverHeight();
			window.addEventListener("resize", calculateCoverHeight);
		}, 10);

		return () => {
			window.removeEventListener("resize", calculateCoverHeight);
		};
	}, [loading]);

	return (
		<Box
			className="main-cover"
			sx={(theme) => ({
				overflow: "hidden",
				position: "relative",
				textAlign: "center",
				height: coverHeight,
				minHeight: coverHeight,
				backgroundColor: theme.palette.primary.main,
				color: theme.palette.primary.contrastText,
			})}
		>
			{children}
		</Box>
	);
};

/**
 * MainComponent serves as a container for main content, applying responsive design with MUI's sx prop.
 *
 * @param {Object} props - The props for the component.
 * @param {React.ReactNode} props.children - The content to be displayed within the main component.
 * @returns {JSX.Element} The rendered MainComponent.
 */
const MainComponent = ({ children }) => (
	<Box
		sx={(theme) => ({
			position: "relative",
			zIndex: 100,
			background: theme.palette.background.default,
		})}
	>
		<Container
			sx={{
				pl: { xs: 0, md: 3 },
				pr: { xs: 0, md: 3 },
			}}
		>
			<Box
				component="main"
				className="main-section"
				sx={(theme) => ({
					zIndex: 900,
					position: "relative",
					top: { xs: 0, md: "-100px" },
					boxShadow: { xs: "none", md: "0 30px 50px 0 rgba(1, 1, 1, .15)" },
					margin: "0 auto",
					padding: {
						xs: "4rem 16px",
						sm: "4rem 24px",
						md: "6rem 3rem",
						lg: "6rem 0 8rem",
					},
					background: theme.palette.common.white,
					width: { xs: "100%", md: "auto" },
					marginBottom: { xs: "2rem", md: 0 },
				})}
			>
				{children}
			</Box>
		</Container>
		<Footer />
	</Box>
);

/**
 * PageTemplate Component
 *
 * A layout component that includes a Header, a Cover section, a main content area, and a Footer.
 * It wraps its children with the provided layout structure.
 *
 * @param {Object} props - The props for the component.
 * @param {React.ReactNode} props.children - The content to be displayed within the main content area.
 * @param {React.ReactNode} [props.coverChildren] - The content to be displayed within the Cover section.
 * @returns {JSX.Element} The rendered PageTemplate component.
 */
const PageTemplate = ({ children, coverChildren = null }) => (
	<Box component="div" id="page">
		<Header />
		<Cover>{coverChildren}</Cover>
		<MainComponent>{children}</MainComponent>
	</Box>
);

Cover.propTypes = {
	children: PropTypes.node,
};

MainComponent.propTypes = {
	children: PropTypes.node.isRequired,
};

PageTemplate.propTypes = {
	children: PropTypes.node.isRequired,
	coverChildren: PropTypes.node,
};

export default PageTemplate;
