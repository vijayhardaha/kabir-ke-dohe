import React, { useEffect, useMemo } from "react";

import { Alert, Box, Pagination, Typography } from "@mui/material";
import { useRouter } from "next/router";
import PropTypes from "prop-types";

import CoupletCard from "./loop/CoupletCard";
import CoupletFilters from "./loop/CoupletFilters";
import { useCouplets } from "@/src/api/useCouplets";
import { useLoader } from "@/src/components/hooks/LoaderContext";
import { getSortParams } from "@/src/utils/couplets/filter";

/**
 * Renders a grid of couplet cards with pagination and filters.
 *
 * @param {Object} props - Component properties.
 * @param {Object} [props.query={}] - Optional query parameters for fetching couplets.
 * @returns {JSX.Element} The rendered CoupletsList component.
 */
const CoupletsList = ({ query = {} }) => {
	const router = useRouter();
	const { loading, setLoading } = useLoader();

	const { search = "", tags = "", popular = false, orderBy, order, perPage = 10, pagination = true, filter = true } = query;

	const sort = filter ? router.query.sort || "default" : "default";
	const page = pagination
		? Array.isArray(router.query.page)
			? parseInt(router.query.page[router.query.page.length - 1], 10) || 1
			: parseInt(router.query.page, 10) || 1
		: 1;

	const params = useMemo(
		() => ({
			search,
			tags,
			popular,
			page,
			perPage,
			orderBy: orderBy || getSortParams(sort).orderBy,
			order: order || getSortParams(sort).order,
			pagination,
		}),
		[search, tags, popular, page, perPage, orderBy, order, pagination, sort]
	);

	const { data, error, isLoading } = useCouplets(params);

	useEffect(() => {
		setLoading(isLoading);
	}, [isLoading, setLoading]);

	const couplets = data ? data.couplets : [];
	const total = data ? data.total : 0;
	const totalPages = data ? data.totalPages : 0;

	// Handle redirection for 404 error
	useEffect(() => {
		if (error && error.code === 404) {
			router.push("/404");
		}
	}, [error, router]);

	/**
	 * Updates the query parameters in the URL based on the provided parameters.
	 * Handles `sort` and `page` as arrays or objects to avoid duplication.
	 * Converts parameters to key-value pairs and merges them into the query string.
	 *
	 * @param {Object} params - The parameters to include in the query string.
	 * @param {number | number[]} params.page - The page number(s) to include in the query string.
	 * @param {string | string[]} params.selectedSort - The selected sort option(s) to include in the query string.
	 */
	const updateQueryParams = (params) => {
		const { page: paramPage, selectedSort } = params; // Destructure the page and selectedSort from params.
		const queryParams = new URLSearchParams(); // Initialize URLSearchParams to handle query parameters.
		const { q: searchQuery, ...existingQueries } = router.query; // Extract existing query parameters and searchQuery.

		// Add existing query parameters to URLSearchParams.
		Object.entries(existingQueries).forEach(([key, value]) => {
			if (value) {
				if (Array.isArray(value)) {
					value.forEach((val) => queryParams.append(key, val));
				} else {
					queryParams.append(key, value);
				}
			}
		});

		// Add the search query parameter if it exists and is not empty.
		if (searchQuery && searchQuery.trim() !== "") {
			queryParams.set("q", encodeURIComponent(searchQuery.trim()));
		}

		if (paramPage > 1) {
			queryParams.set("page", paramPage); // Set the page parameter if page > 1
		} else {
			queryParams.delete("page"); // Remove the page parameter if page is 1 or less
		}

		// Set or remove the `sort` parameter based on its value
		if (selectedSort && selectedSort !== "default") {
			queryParams.set("sort", sort); // Set the sort parameter if it is valid
		} else {
			queryParams.delete("sort"); // Remove the sort parameter if it is "default" or invalid
		}

		// Construct the query string from URLSearchParams.
		const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

		// Update the router with the new query string.
		router.push(queryString);
	};

	const handlePageChange = (_, newPage) => {
		updateQueryParams({ page: newPage, selectedSort: sort });
	};

	const handleSortChange = (newSort) => {
		updateQueryParams({ page, selectedSort: newSort });
	};

	if (loading) {
		return null;
	}

	if (error && error.code !== 404) {
		return (
			<Box>
				<Alert variant="filled" severity="error" sx={{ mb: 2 }}>
					{error.message}
				</Alert>
			</Box>
		);
	}

	if (couplets.length === 0) {
		return (
			<Typography paragraph>
				No couplets match the criteria specified in the request. Please adjust your search or filter parameters and try again.
			</Typography>
		);
	}

	return (
		<>
			{couplets.length > 0 && (
				<>
					{filter && (
						<CoupletFilters
							selectedSort={sort}
							onSortChange={handleSortChange}
							page={page}
							perPage={perPage}
							paginationEnabled={pagination}
							totalCount={total}
						/>
					)}

					<Box component="div" sx={{ display: "flex", flexWrap: "wrap" }}>
						{couplets.map((couplet) => (
							<CoupletCard key={couplet.unique_slug} couplet={couplet} />
						))}
					</Box>

					{pagination && totalPages > 1 && (
						<Pagination page={page} count={totalPages} onChange={handlePageChange} variant="outlined" shape="rounded" siblingCount={0} />
					)}
				</>
			)}
		</>
	);
};

CoupletsList.propTypes = {
	query: PropTypes.shape({
		search: PropTypes.string,
		tags: PropTypes.string,
		popular: PropTypes.bool,
		orderBy: PropTypes.string,
		order: PropTypes.string,
		page: PropTypes.number,
		perPage: PropTypes.number,
		pagination: PropTypes.bool,
		filter: PropTypes.bool,
	}),
};

export default CoupletsList;
