import * as React from "react";

import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { Toaster } from "react-hot-toast";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

import theme from "../src/utils/theme/theme";
import "../styles/globals.scss";
import Loader from "@/src/components/common/Loader";
import { LoaderProvider, useLoader } from "@/src/components/hooks/LoaderContext";
import DefaultSEO from "@/src/components/seo/DefaultSEO";
import createEmotionCache from "@/src/utils/theme/createEmotionCache";

// Create a client-side cache.
const clientSideEmotionCache = createEmotionCache();

/**
 * Displays a loader based on the loading state from context or router fallback status.
 *
 * @returns {JSX.Element|null} The Loader component if loading or fallback is true; otherwise, null.
 */
const GlobalLoader = () => {
  const { loading } = useLoader();
  const { isFallback } = useRouter();

  return loading || isFallback ? <Loader /> : null;
};

/**
 * Main App component that configures theme, CSS baseline, and global context providers.
 *
 * @param {Object} props - Component props.
 * @param {React.ElementType} props.Component - The page component to render.
 * @param {Object} props.pageProps - The props to pass to the page component.
 * @param {Object} [props.emotionCache=clientSideEmotionCache] - The Emotion cache instance.
 * @returns {React.ReactElement} The rendered App component.
 */
function App(props) {
  const { Component, pageProps, emotionCache = clientSideEmotionCache } = props;

  React.useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <DefaultSEO />
        <LoaderProvider>
          <GlobalLoader />
          <Toaster position="top-right" reverseOrder={true} />
          <Component {...pageProps} />
        </LoaderProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
  emotionCache: PropTypes.object,
};

export default App;
