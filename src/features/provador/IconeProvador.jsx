export function IconeProvador({ name = "camera", className }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === "camera" ? (
        <>
          <path d="M8 5 9.5 3h5L16 5h4a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
          <circle cx="12" cy="12.5" r="4" />
        </>
      ) : name === "upload" ? (
        <path d="M12 16V3m-4 4 4-4 4 4M4 15v5h16v-5" />
      ) : (
        <path d="m5 12 4 4L19 6" />
      )}
    </svg>
  );
}
