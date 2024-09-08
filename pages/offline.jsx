import React from "react";

import { Box, Button, Typography } from "@mui/material";
import { GoArrowUpLeft } from "react-icons/go";

import PageHeader from "@/src/components/layout/PageHeader";
import PageTemplate from "@/src/components/layout/PageTemplate";
import SectionBody from "@/src/components/layout/SectionBody";

/**
 * Offline page component.
 *
 * This component displays a message indicating that the user is offline
 * and provides a link to navigate back to the home page.
 *
 * @returns {JSX.Element} The rendered Offline page component.
 */
const Offline = () => {
	return (
		<PageTemplate>
			<SectionBody>
				<Box component="article">
					<PageHeader title="Offline" />
					<Typography component="p">
						It looks like you are offline. Please check your internet connection and try again. If the problem persists,
						you can always return to the home page.
					</Typography>
					<Button variant="contained" color="primary" href="/" startIcon={<GoArrowUpLeft />}>
						Go to Home
					</Button>
				</Box>
			</SectionBody>
		</PageTemplate>
	);
};

export default Offline;
