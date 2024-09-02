import React, { useCallback } from "react";

import { MenuItem, Select, FormControl, InputLabel, Typography, Box } from "@mui/material";
import PropTypes from "prop-types";

import { SORT_OPTIONS } from "@/src/constants/couplet";
import { DROPDOWN_MENU_PROPS } from "@/src/constants/dropdown";

/**
 * Filters component for couplets with sorting and count display.
 *
 * @param {Object} props - Component properties.
 * @param {number} props.totalCount - The total number of couplets available.
 * @param {function} props.onSortChange - Callback function when sort option changes.
 * @param {string} props.selectedSort - The currently selected sort option.
 * @param {boolean} props.paginationEnabled - Indicates if pagination is enabled.
 * @param {number} props.page - The current page number.
 * @param {number} props.perPage - Number of items per page.
 * @returns {JSX.Element} The rendered CoupletFilters component.
 */
const CoupletFilters = ({ selectedSort, onSortChange, page, perPage, paginationEnabled, totalCount }) => {
	const handleSortChange = useCallback(
		(event) => {
			onSortChange(event.target.value);
		},
		[onSortChange]
	);

	const start = (page - 1) * perPage + 1;
	const end = Math.min(page * perPage, totalCount);

	return (
		<Box
			sx={{
				display: { xs: "block", md: "flex" },
				flexDirection: { xs: "column", md: "row" },
				alignItems: { xs: "flex-start", md: "center" },
				justifyContent: {
					xs: "flex-start",
					md: paginationEnabled ? "space-between" : "flex-end",
				},
				mb: 4,
			}}
		>
			{paginationEnabled && (
				<Typography
					variant="body2"
					sx={{
						mb: { xs: 2, md: 0 },
						textAlign: { xs: "left", md: "inherit" },
					}}
				>
					Showing {start}–{end} of {totalCount} results.
				</Typography>
			)}

			<FormControl sx={{ minWidth: 150, width: { xs: "100%", md: "auto" } }}>
				<InputLabel id="sort-select-label">Sort By</InputLabel>
				<Select
					labelId="sort-select-label"
					value={selectedSort}
					onChange={handleSortChange}
					label="Sort By"
					MenuProps={DROPDOWN_MENU_PROPS}
					fullWidth
				>
					{SORT_OPTIONS.map((option) => (
						<MenuItem key={option.value} value={option.value}>
							{option.label}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Box>
	);
};

CoupletFilters.propTypes = {
	totalCount: PropTypes.number.isRequired,
	onSortChange: PropTypes.func.isRequired,
	selectedSort: PropTypes.string.isRequired,
	paginationEnabled: PropTypes.bool.isRequired,
	page: PropTypes.number.isRequired,
	perPage: PropTypes.number.isRequired,
};

export default CoupletFilters;
