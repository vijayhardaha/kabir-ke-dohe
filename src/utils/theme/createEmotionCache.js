import createCache from "@emotion/cache";

const isBrowser = typeof document !== "undefined";

const createEmotionCache = () => {
	let insertionPoint;

	if (isBrowser) {
		const emotionInsertionPoint = document.querySelector('meta[name="emotion-insertion-point"]');
		insertionPoint = emotionInsertionPoint ?? undefined;
	}

	return createCache({ key: "mui-style", prepend: true, insertionPoint });
};

export default createEmotionCache;
