import React, { createContext, useCallback, useContext, useState } from 'react';

const LoadingContext = createContext({
  loadingCount: 0,
  showLoader: () => {},
  hideLoader: () => {},
});

export const LoadingProvider = ({ children }) => {
  const [loadingCount, setLoadingCount] = useState(0);

  const showLoader = useCallback(() => setLoadingCount((c) => c + 1), []);
  const hideLoader = useCallback(() => setLoadingCount((c) => Math.max(0, c - 1)), []);

  return (
    <LoadingContext.Provider value={{ loadingCount, showLoader, hideLoader }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);

export default LoadingContext;
