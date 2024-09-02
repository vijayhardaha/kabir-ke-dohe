import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	pageExtensions: ["js", "jsx"],
	async rewrites() {
		return [
			{
				source: "/offline",
				destination: "/offline.js",
			},
		];
	},
};

export default withPWA({
	dest: "public",
	register: true,
	skipWaiting: true,
	disable: process.env.NODE_ENV === "development",
	runtimeCaching: [
		{
			urlPattern: ({ request }) => request.mode === "navigate",
			handler: "NetworkFirst",
			options: {
				cacheName: "pwa-pages",
				expiration: {
					maxEntries: 10,
				},
				networkTimeoutSeconds: 10,
				cacheableResponse: {
					statuses: [0, 200],
				}
			},
		},
		{
			urlPattern: new RegExp("/offline"),
			handler: "StaleWhileRevalidate",
			options: {
				cacheName: "offlinePage",
			},
		},
	],
	buildExcludes: [/middleware-manifest\.json$/],
})(nextConfig);
