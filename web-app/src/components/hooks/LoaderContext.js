import React, { createContext, useContext, useState } from "react";

import PropTypes from "prop-types";

const LoaderContext = createContext();

/**
 * LoaderProvider component provides loader state to the application.
 *
 * @param {Object} props - The props for the component.
 * @param {React.ReactNode} props.children - The content to be rendered inside the provider.
 * @returns {JSX.Element} The rendered LoaderProvider component.
 */
export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return <LoaderContext.Provider value={{ loading, setLoading }}>{children}</LoaderContext.Provider>;
};

LoaderProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * useLoader hook provides access to the loader context.
 *
 * @returns {Object} The loader context values.
 * @throws {Error} Throws an error if used outside of LoaderProvider.
 */
export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }

  return context;
};
