const LOGO_URL = "https://www.apollorigor.com.br/images/logo-apollo-oficial.jpg";

export function BrandLogo({ className = "", alt = "Apollo Rigor" }) {
  return (
    <img
      className={`apollo-brand-logo ${className}`.trim()}
      src={LOGO_URL}
      alt={alt}
      loading="eager"
      decoding="async"
      onError={(event) => { event.currentTarget.hidden = true; }}
    />
  );
}
