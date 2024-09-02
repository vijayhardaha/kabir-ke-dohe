import React, { useEffect, useMemo, useCallback } from "react";

import { Box, Container } from "@mui/material";
import Slider from "react-slick";

import CoupletSlide from "./slider/CoupletSlide";
import { useLoader } from "../hooks/LoaderContext";
import { useCouplets } from "@/src/api/useCouplets";

/**
 * Slider settings for react-slick.
 */
const sliderSettings = {
	dots: true,
	infinite: true,
	speed: 500,
	slidesToShow: 1,
	slidesToScroll: 1,
	autoplay: false,
	autoplaySpeed: 3000,
	arrows: false,
};

/**
 * CoupletsSlider Component
 *
 * A slider component to showcase 5 random popular couplets.
 * This component fetches and displays a set of popular couplets in a slider format.
 *
 * @returns {JSX.Element} The rendered CoupletsSlider component.
 */
const CoupletsSlider = () => {
	const { loading, setLoading } = useLoader();
	const { data, isLoading } = useCouplets({ popular: true, perPage: 5, orderBy: "random" });

	// Set loading state based on API call status
	useEffect(() => {
		setLoading(isLoading);
	}, [isLoading, setLoading]);

	// Memoize couplets to avoid unnecessary re-renders
	const couplets = useMemo(() => data?.couplets || [], [data]);

	// Memoize Slider rendering to avoid unnecessary re-renders
	const renderSlides = useCallback(() => {
		return couplets.map((couplet) => (
			<Box key={couplet.unique_slug}>
				<Box
					className="slider-item"
					sx={{
						position: "relative",
						height: "100%",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						padding: { xs: "1px 0", sm: "155px 0 215px" },
					}}
				>
					<Box
						sx={{
							margin: "0 auto",
							position: "relative",
							zIndex: "10",
							minHeight: "445px",
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							height: "auto",
						}}
					>
						<CoupletSlide couplet={couplet} />
					</Box>
				</Box>
			</Box>
		));
	}, [couplets]);

	if (loading) {
		return null;
	}

	return (
		<Box
			sx={{
				position: "fixed",
				height: "100%",
				width: "100%",
			}}
		>
			<Box
				sx={{
					position: "relative",
					height: "100%",
				}}
			>
				<Container>
					<Slider {...sliderSettings}>{renderSlides()}</Slider>
				</Container>
			</Box>
		</Box>
	);
};

export default CoupletsSlider;
