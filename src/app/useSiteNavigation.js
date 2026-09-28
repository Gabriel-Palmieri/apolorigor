import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { siteDestination } from "./navigation.js";
export function useSiteNavigation() {
  const navigate = useNavigate();
  return useCallback(
    (destino, extra) => navigate(siteDestination(destino, extra)),
    [navigate],
  );
}
