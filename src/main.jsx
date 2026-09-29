import "@fontsource/bodoni-moda/latin-400.css";
import "@fontsource/bodoni-moda/latin-500.css";
import "@fontsource/ibm-plex-sans/latin-400.css";
import "@fontsource/ibm-plex-sans/latin-500.css";
import "@fontsource/ibm-plex-sans/latin-600.css";
import "@fontsource/ibm-plex-sans/latin-700.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import "@fontsource/ibm-plex-mono/latin-600.css";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-500.css";
import "@fontsource/manrope/latin-600.css";
import "@fontsource/manrope/latin-700.css";
import ReactDOM from "react-dom/client";
import AppRouter from "./app/Router.jsx";
import { ThemeProvider } from "./shared/ui/tema/ThemeProvider.jsx";
import { migrateLegacyUrl } from "./app/navigation.js";

// Preserve existing links while moving page navigation from hashes to paths.
const legacyUrl = migrateLegacyUrl(window.location);
if (legacyUrl) window.history.replaceState(null, "", legacyUrl);
ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <AppRouter />
  </ThemeProvider>,
);
