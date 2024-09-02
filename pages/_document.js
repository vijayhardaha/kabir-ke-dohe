import React from "react";

import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import Document, { Html, Head, Main, NextScript } from "next/document";

import createEmotionCache from "@/src/utils/theme/createEmotionCache";

/**
 * Custom Document component for server-side rendering with Material-UI.
 * Handles the document structure and includes server-side styles.
 */
class MyDocument extends Document {
	/**
	 * Collects the server-side rendered styles from Material-UI and applies them to the page.
	 *
	 * @param {Object} ctx - Context of the document, including initial props and request data.
	 * @returns {Object} The props for the document including the collected styles.
	 */
	static async getInitialProps(ctx) {
		const originalRenderPage = ctx.renderPage;

		// Create a new Emotion cache for every server-side request.
		const cache = createEmotionCache();
		const { extractCriticalToChunks } = createEmotionServer(cache);

		ctx.renderPage = () =>
			originalRenderPage({
				enhanceApp: (App) => (props) => (
					<CacheProvider value={cache}>
						<App {...props} />
					</CacheProvider>
				),
			});

		const initialProps = await Document.getInitialProps(ctx);

		// Extract critical CSS.
		const emotionStyles = extractCriticalToChunks(initialProps.html);
		const emotionStyleTags = emotionStyles.styles.map((style) => (
			<style key={style.key} data-emotion={`${style.key} ${style.ids.join(" ")}`} dangerouslySetInnerHTML={{ __html: style.css }} />
		));

		return {
			...initialProps,
			styles: [...React.Children.toArray(initialProps.styles), ...emotionStyleTags],
		};
	}

	render() {
		return (
			<Html lang="en">
				<Head>
					{/* Favicon and Apple touch icon links */}
					<link rel="icon" href="/favicon.ico" />
					<link rel="apple-touch-icon" href="/android-chrome-192x192.png" />
					<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
					<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
					<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

					{/* Theme color for mobile browsers */}
					<meta name="theme-color" content="#ffffff" />

					<link rel="manifest" href="/manifest.json" />

					{/* Indicator for Emotion cache */}
					<meta name="emotion-cache" content="true" />

					{/* Font preconnect and stylesheet links */}
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
					<link
						href="https://fonts.googleapis.com/css2?family=Domine:wght@400..700&family=Hind:wght@300;400;500;600;700&family=Jost:ital,wght@0,100..900;1,100..900&display=swap"
						rel="stylesheet"
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
