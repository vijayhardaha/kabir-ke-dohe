/**
 * Converts a sort option value to API parameters.
 *
 * @param {string} sortOption - The selected sort option value.
 * @returns {Object} - An object containing `orderBy` and `order` parameters.
 */
export const getSortParams = (sortOption) => {
	switch (sortOption) {
		case "random":
			return { orderBy: "random", order: "ASC" };
		case "popular":
			return { orderBy: "popular", order: "ASC" };
		case "couplet_asc":
			return { orderBy: "couplet_hindi", order: "ASC" };
		case "couplet_desc":
			return { orderBy: "couplet_hindi", order: "DESC" };
		case "default":
		default:
			return { orderBy: "default", order: "ASC" };
	}
};
