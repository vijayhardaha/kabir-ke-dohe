/**
 * Number of couplets to display per page.
 * @constant {number}
 */
export const COUPLETS_PER_PAGE = 10;

/**
 * Available sorting options for couplets.
 * @constant {Array<{value: string, label: string}>}
 */
export const SORT_OPTIONS = [
	{ value: "default", label: "Default" },
	{ value: "random", label: "Random" },
	{ value: "popular", label: "Popular" },
	{ value: "couplet_asc", label: "Couplet (अ - ज्ञ)" },
	{ value: "couplet_desc", label: "Couplet (ज्ञ - अ)" },
];
