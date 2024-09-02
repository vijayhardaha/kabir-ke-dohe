/**
 * Navigation items for the application's main menu.
 *
 * This array contains objects representing each navigation item, including links
 * to different pages and sections of the site. Some items have sub-items for additional
 * navigation options.
 *
 * @type {Array<Object>}
 * @property {string} title - The display name of the navigation item.
 * @property {string} href - The URL or anchor link for the navigation item.
 * @property {Array<Object>} [submenu] - Optional array of sub-items for dropdown menus.
 * @property {string} submenu.title - The display name of the sub-item.
 * @property {string} submenu.href - The URL or anchor link for the sub-item.
 */
export const NAV_ITEMS = [
	{ title: "All Dohe", href: "/couplets" },
	{ title: "Popular Dohe", href: "/popular-couplets" },
	{
		title: "Tags",
		href: "#",
		submenu: [
			{ title: "Awareness", href: "/tag/awareness" },
			{ title: "Bhakti", href: "/tag/bhakti" },
			{ title: "Body", href: "/tag/body" },
			{ title: "Death", href: "/tag/death" },
			{ title: "Desire", href: "/tag/desire" },
			{ title: "Devotion", href: "/tag/devotion" },
			{ title: "Dukh", href: "/tag/dukh" },
			{ title: "Guru", href: "/tag/guru" },
			{ title: "Gyaan", href: "/tag/gyaan" },
			{ title: "Hari", href: "/tag/hari" },
			{ title: "Illusion", href: "/tag/illusion" },
			{ title: "Joy", href: "/tag/joy" },
			{ title: "Knowledge", href: "/tag/knowledge" },
			{ title: "Life", href: "/tag/life" },
			{ title: "Love", href: "/tag/love" },
			{ title: "Maya", href: "/tag/maya" },
			{ title: "Mind", href: "/tag/mind" },
			{ title: "Mukti", href: "/tag/mukti" },
			{ title: "Pain", href: "/tag/pain" },
			{ title: "Prem", href: "/tag/prem" },
			{ title: "Ram", href: "/tag/ram" },
			{ title: "Saadhu", href: "/tag/saadhu" },
			{ title: "Sant", href: "/tag/sant" },
			{ title: "Satguru", href: "/tag/satguru" },
			{ title: "Self", href: "/tag/self" },
			{ title: "Sukh", href: "/tag/sukh" },
			{ title: "Sukha", href: "/tag/sukha" },
			{ title: "Time", href: "/tag/time" },
			{ title: "Truth", href: "/tag/truth" },
			{ title: "Understanding", href: "/tag/understanding" },
			{ title: "Unity", href: "/tag/unity" },
			{ title: "Value", href: "/tag/value" },
			{ title: "Wisdom", href: "/tag/wisdom" },
		],
	},
	{ title: "About Kabir", href: "/about" },
];
