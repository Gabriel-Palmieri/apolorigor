import { useState } from "react";
const LOGO_URL =
  "https://www.apollorigor.com.br/images/logo-apollo-oficial.jpg";

export function BrandLogo({ className = "", alt = "Apollo Rigor" }) {
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <div
        role="img"
        aria-label={alt}
        className={`${className} font-display text-text flex items-center justify-center whitespace-nowrap`}
      >
        Apollo Rigor
      </div>
    );
  return (
    <img
      className={`apollo-brand-logo ${className}`.trim()}
      src={LOGO_URL}
      alt={alt}
      loading="eager"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
