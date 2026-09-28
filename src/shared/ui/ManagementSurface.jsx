import { createContext, useContext } from 'react';

const ManagementSurfaceContext = createContext(false);

// Portals keep this context, so management dialogs share the same visual tokens.
export function ManagementSurfaceProvider({ children }) {
  return <ManagementSurfaceContext.Provider value={true}>{children}</ManagementSurfaceContext.Provider>;
}

export function useManagementSurface() {
  return useContext(ManagementSurfaceContext);
}
