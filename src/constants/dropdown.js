/**
 * Height of each dropdown menu item.
 * @constant {number}
 */
const ITEM_HEIGHT = 36;

/**
 * Padding at the top of each dropdown menu item.
 * @constant {number}
 */
const ITEM_PADDING_TOP = 10;

/**
 * Properties for the dropdown menu.
 * @constant {Object}
 * @property {Object} PaperProps - Properties for the Paper component.
 * @property {Object} PaperProps.style - Styling for the dropdown menu.
 * @property {number} PaperProps.style.maxHeight - Maximum height of the dropdown menu.
 */
export const DROPDOWN_MENU_PROPS = {
	disableScrollLock: true,
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 8 + ITEM_PADDING_TOP,
		},
	},
};
